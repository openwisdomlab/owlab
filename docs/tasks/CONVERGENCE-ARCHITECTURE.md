# System-Wide Convergence Architecture

**Mission**: Move from "separate features" to a unified **Cognitive Operating System**.

**Audit Date**: 2026-02-13
**Status**: Architecture Proposal — Awaiting Implementation

---

## Executive Summary: Current State

After a deep audit of the entire codebase, the application has strong foundations:

- **AI Layer**: 7 specialized agents, 3 GenUI tools, Vercel AI SDK v6 streaming with `streamText` + `toUIMessageStreamResponse`
- **Editor Layer**: Rich FloorPlanEditor (807 lines) with `useHistory` undo/redo, measurement tools, alignment guides, and layer management
- **Knowledge Layer**: 13 modules (9 M + 4 L), Fumadocs MDX pipeline, 3 visualization components (`KnowledgeUniverse`, `KnowledgeGraph`, Module Explorers)
- **Design Layer**: Cohesive brand color system, glassmorphism variables, 4 emotion themes, Framer Motion animation library

**Critical gaps preventing convergence**:

1. AI tools are **closed-loop** — they can't invoke each other or trigger editor state changes programmatically
2. Editor state lives in **React useState** (local to `FloorPlanEditor`), disconnected from the Zustand multiverse store
3. Knowledge graph positions are **hardcoded SVG coordinates**, not derived from content metadata
4. Glass/animation patterns are **duplicated** across components instead of being composable primitives

---

## Pillar 1: The "Generative UI" Core

### Current Architecture

```
route.ts (3 tools: showThinkingModel, showDataTrend, modifyLayout)
    ↓ streamText + toUIMessageStreamResponse
AIChatPanel.tsx (detects tool-* parts, renders GenUI components)
    ↓ onLayoutUpdate callback
FloorPlanEditor.tsx (applies layout change)
```

**File**: `src/app/api/ai/chat/route.ts:128-203`

**What works**: The `streamText` → tool → client-side rendering pattern is sound. Tools return minimal data (`{ rendered: true }`), client components own rendering.

**What's missing**:
- No **Tool Registry** — tools are hardcoded inline in the route handler
- No **render_lab_preview** tool — the AI can modify layouts but can't render a preview *inside the chat*
- No **visualize_concept** tool — `ThinkingZone` and `ConceptNetwork` can't be triggered by AI dynamically
- Tools can't **compose** — `modifyLayout` can't trigger `showDataTrend` for the resulting metrics

### Revised TypeScript Interfaces

```typescript
// src/lib/ai/tools/registry.ts

import { tool } from "ai";
import type { z } from "zod/v4";

/**
 * A registered tool with metadata for the chat system.
 * Tools are defined once, referenced by ID in route handlers.
 */
interface ToolDefinition<TInput extends z.ZodType, TOutput> {
  id: string;
  category: "genui" | "mutation" | "query";
  description: string;
  inputSchema: TInput;
  execute: (input: z.infer<TInput>) => Promise<TOutput>;
}

/**
 * The Tool Registry — single source of truth for all chat-available tools.
 * Route handlers import from here instead of defining tools inline.
 */
interface ToolRegistry {
  tools: Record<string, ToolDefinition<any, any>>;
  register: (tool: ToolDefinition<any, any>) => void;
  getByCategory: (category: string) => ToolDefinition<any, any>[];
  toStreamTextTools: () => Record<string, ReturnType<typeof tool>>;
}

// --- New Tool: render_lab_preview ---

interface LabPreviewInput {
  layout: LayoutData;                    // Full or partial layout
  highlightZones?: string[];             // Zone IDs to highlight
  viewMode: "2d" | "3d" | "split";      // Rendering mode
  annotation?: string;                   // AI's annotation overlay
}

interface LabPreviewOutput {
  rendered: true;
  previewId: string;                     // For client-side tracking
}

// --- New Tool: visualize_concept ---

interface VisualizeConceptInput {
  type: "thinking-zone" | "concept-network" | "flow-diagram";
  title: string;
  nodes: Array<{
    id: string;
    label: string;
    category?: string;                   // For color grouping
    description?: string;
  }>;
  edges?: Array<{
    source: string;
    target: string;
    label?: string;
    strength?: number;                   // 0-1, affects line thickness
  }>;
  layout?: "force" | "hierarchical" | "radial";
  interactive?: boolean;                 // Allow user to drag nodes
}

interface VisualizeConceptOutput {
  rendered: true;
  graphId: string;
}
```

### Refactoring Steps

**Step 1: Extract Tool Registry** (`src/lib/ai/tools/registry.ts`)

Move the 3 existing tool definitions out of `route.ts` into a registry module. Each tool becomes a standalone file:

```
src/lib/ai/tools/
├── registry.ts              # ToolRegistry class + toStreamTextTools()
├── show-thinking-model.ts   # Extracted from route.ts:133-156
├── show-data-trend.ts       # Extracted from route.ts:157-189
├── modify-layout.ts         # Extracted from route.ts:191-199
├── render-lab-preview.ts    # NEW
└── visualize-concept.ts     # NEW
```

**Step 2: Implement `render_lab_preview`** tool

- Server: Returns `{ rendered: true, previewId }` — minimal, like existing tools
- Client (`AIChatPanel.tsx`): Detects `tool-render_lab_preview`, renders a **miniature `FloorPlanCanvas`** (read-only, no drag/edit) inside the chat message bubble
- The preview shows the AI's proposed layout before the user clicks "Apply"
- Adds an "Apply This Layout" button that calls the existing `onLayoutUpdate` callback

**Step 3: Implement `visualize_concept`** tool

- Server: Returns `{ rendered: true, graphId }`
- Client: Detects `tool-visualize_concept`, renders either:
  - `ThinkingZone` variant (for `type: "thinking-zone"`) — animated concept cards
  - `ConceptNetwork` (for `type: "concept-network"`) — force-directed graph using existing `KnowledgeGraph` patterns
  - `FlowChart` (for `type: "flow-diagram"`) — sequential process visualization
- Nodes and edges are AI-generated based on the user's question context

**Step 4: Update `route.ts`** to use the registry

```typescript
// src/app/api/ai/chat/route.ts (simplified)
import { toolRegistry } from "@/lib/ai/tools/registry";

const result = streamText({
  model,
  system: systemPrompt,
  messages,
  tools: toolRegistry.toStreamTextTools(),
  stopWhen: stepCountIs(3),  // Bump from 2 → 3 for multi-tool chains
  temperature: 0.7,
});
```

---

## Pillar 2: The "Reality Engine"

### Current Architecture

```
FloorPlanEditor.tsx
├── useHistory<LayoutData>          → Local undo/redo (useState-based)
├── 23 × useState hooks             → All local, no persistence
├── useCallback × 20+               → Handler functions
└── useMultiverseStore               → Global, but disconnected from editor
```

**Critical files**:
- `src/features/lab-editor/FloorPlanEditor.tsx:1-807`
- `src/stores/multiverse-store.ts:1-170`
- `src/hooks/useHistory.ts:1-74`

### Audit Findings

#### 1. Temporal Safety (Undo/Redo): Functional but Fragile

The `useHistory` hook (`src/hooks/useHistory.ts`) provides basic undo/redo with a 50-entry cap. **Issues**:

- **Stale closure risk**: `setState` callback captures `history` and `currentIndex` in its dependency array (`useHistory.ts:44`). When rapid state changes occur (e.g., dragging a zone), the closure may reference stale values, causing lost intermediate states.
- **No batching**: Every `setState` call creates a history entry. Dragging a zone for 2 seconds at 60fps generates up to 120 entries, immediately filling the 50-entry buffer and losing earlier meaningful states.
- **Disconnected from multiverse**: Undo/redo operates on `FloorPlanEditor`'s local layout state. The `useMultiverseStore.updateUniverseLayout()` is not called on undo/redo, so the global store drifts out of sync.

#### 2. Performance Isolation: Weak

- **No `useShallow` selectors**: Components that read from `useMultiverseStore` subscribe to the entire store. Any mutation (even to a different universe) triggers re-renders.
- **No `React.memo` wrappers**: `FloorPlanCanvas`, `SimplifiedToolbar`, and all side panels are unwrapped. A `showChat` toggle re-renders the canvas.
- **23 useState hooks in one component**: Any state change to `FloorPlanEditor` re-renders the entire tree including all conditional panels.

#### 3. Persistence: None for Layout Data

- `multiverse-store.ts` has **no `persist` middleware** — all universe data is lost on refresh
- No auto-save mechanism
- No "dirty" indicator showing unsaved changes

### Revised TypeScript Interfaces

```typescript
// src/stores/editor-store.ts — NEW unified editor store

import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";

/**
 * A single undoable action with metadata.
 * Replaces raw state snapshots with structured operations.
 */
interface EditorAction {
  id: string;
  type:
    | "zone:add"
    | "zone:delete"
    | "zone:move"
    | "zone:resize"
    | "zone:update"
    | "zone:paste"
    | "layout:replace"        // AI-generated layout
    | "layout:template"       // Template applied
    | "equipment:add"
    | "equipment:remove";
  timestamp: number;
  label: string;              // Human-readable: "Move Chemistry Lab"
  before: LayoutData;         // Snapshot before action
  after: LayoutData;          // Snapshot after action
}

/**
 * Temporal state — undo/redo with structured history.
 */
interface TemporalState {
  past: EditorAction[];       // Undo stack (max 100)
  future: EditorAction[];     // Redo stack
}

/**
 * Persistence state — auto-save + sync indicator.
 */
interface PersistenceState {
  isDirty: boolean;
  lastSavedAt: number | null;
  autoSaveEnabled: boolean;
  syncStatus: "idle" | "saving" | "saved" | "error";
}

/**
 * UI state — moved out of useState into store for cross-component access.
 */
interface EditorUIState {
  selectedZoneId: string | null;
  zoom: number;
  showGrid: boolean;
  gridSnap: boolean;
  colorScheme: string;
  activePanels: Set<string>;  // Replace 18 boolean useState hooks
}

/**
 * The unified Editor Store.
 * Replaces: useHistory + 23 useState hooks + manual multiverse sync.
 */
interface EditorStore {
  // --- Core State ---
  layout: LayoutData;
  temporal: TemporalState;
  persistence: PersistenceState;
  ui: EditorUIState;

  // --- Layout Mutations (all create undo entries) ---
  addZone: (zone: ZoneData) => void;
  deleteZone: (zoneId: string) => void;
  moveZone: (zoneId: string, position: { x: number; y: number }) => void;
  resizeZone: (zoneId: string, size: { width: number; height: number }) => void;
  updateZone: (zoneId: string, updates: Partial<ZoneData>) => void;
  replaceLayout: (layout: LayoutData, label: string) => void;

  // --- Temporal ---
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // --- Persistence ---
  markDirty: () => void;
  markSaved: () => void;
  setAutoSave: (enabled: boolean) => void;

  // --- UI ---
  selectZone: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  togglePanel: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
}
```

### Refactoring Steps

**Step 1: Create `src/stores/editor-store.ts`**

Consolidate the 23 `useState` hooks + `useHistory` into a single Zustand store with `subscribeWithSelector` middleware.

Key design choices:
- **Action-based history**: Instead of storing raw state snapshots, store `EditorAction` objects with `before`/`after` states and human-readable labels (e.g., "Move Chemistry Lab to (200, 300)")
- **Debounced drag entries**: During drag operations, batch position changes into a single `zone:move` action using `requestAnimationFrame` and only commit the action on `mouseup`
- **Max history**: 100 entries (up from 50), with structured eviction of oldest entries

**Step 2: Add `useShallow` selectors**

Create granular selectors so components only re-render when their specific data changes:

```typescript
// src/stores/editor-selectors.ts

import { useShallow } from "zustand/react/shallow";
import { useEditorStore } from "./editor-store";

/** Canvas only re-renders when layout or selectedZone changes */
export const useCanvasState = () =>
  useEditorStore(
    useShallow((s) => ({
      layout: s.layout,
      selectedZoneId: s.ui.selectedZoneId,
      showGrid: s.ui.showGrid,
      zoom: s.ui.zoom,
    }))
  );

/** Toolbar only re-renders when temporal or UI flags change */
export const useToolbarState = () =>
  useEditorStore(
    useShallow((s) => ({
      canUndo: s.canUndo(),
      canRedo: s.canRedo(),
      zoom: s.ui.zoom,
      showGrid: s.ui.showGrid,
      gridSnap: s.ui.gridSnap,
      colorScheme: s.ui.colorScheme,
    }))
  );

/** Sidebar only re-renders when active panels change */
export const useSidebarState = () =>
  useEditorStore(
    useShallow((s) => ({
      activePanels: s.ui.activePanels,
      togglePanel: s.togglePanel,
    }))
  );
```

**Step 3: Add auto-save persistence**

```typescript
// src/hooks/useAutoSave.ts

/**
 * Auto-saves editor state to localStorage on debounced changes.
 * Shows sync indicator in UI.
 */
interface AutoSaveConfig {
  debounceMs: number;        // Default: 2000ms
  storageKey: string;        // Default: "owl-editor-autosave"
  onSave?: () => void;       // Callback after successful save
  onError?: (error: Error) => void;
}
```

Implementation:
- Subscribe to `useEditorStore` via `subscribeWithSelector`
- On layout change, start a 2-second debounce timer
- Save to `localStorage` with the key `owl-editor-{universeId}`
- Update `persistence.syncStatus` through the lifecycle: `"saving"` → `"saved"` / `"error"`
- On app load, check for stored data and offer to restore

**Step 4: Bridge editor store ↔ multiverse store**

```typescript
// In editor-store.ts, after every layout mutation:
const syncToMultiverse = (layout: LayoutData) => {
  const multiverseStore = useMultiverseStore.getState();
  const activeId = multiverseStore.activeUniverseId;
  if (activeId) {
    multiverseStore.updateUniverseLayout(activeId, layout);
  }
};
```

This ensures undo/redo in the editor automatically propagates to the multiverse store.

**Step 5: Wrap expensive components with `React.memo`**

Priority targets:
- `FloorPlanCanvas` — receives `layout` as prop, should only re-render when layout/zoom/grid changes
- `SimplifiedToolbar` — depends only on undo/redo/zoom state
- All side panels (`SafetyPanel`, `BudgetDashboard`, etc.) — should only render when their panel is active

---

## Pillar 3: The "Semantic Universe"

### Current Architecture

```
source.config.ts → defineDocs({ dir: "content/docs" })
    ↓ Build time (Fumadocs)
.source/server → page tree with frontmatter metadata
    ↓ Runtime
src/lib/source.ts → getLocalePage(), getLocalePageTree()

src/features/explore-universe/
├── KnowledgeUniverse.tsx        → SVG with hardcoded positions
├── module-connections.ts         → Manual L→M relationships
└── (no build-time graph generation)
```

**Critical files**:
- `source.config.ts:1-7`
- `src/features/explore-universe/module-connections.ts:1-199`
- `src/features/explore-universe/KnowledgeUniverse.tsx` (1137 lines)

### Audit Findings

1. **Hardcoded topology**: `blueprintLayout` in `module-connections.ts:109-150` defines exact SVG coordinates for all 13 modules. Adding a new module requires manual coordinate calculation.
2. **No content-derived relationships**: Module connections (`L01 → [M03, M06]`) are manually defined. MDX frontmatter contains `tags` and `module_id` but these aren't used to compute cross-references.
3. **No build-time graph generation**: The `source.config.ts` is minimal (7 lines). No script extracts frontmatter metadata into a graph structure.
4. **Fixed zoom level**: `KnowledgeUniverse` renders all modules at one scale. No semantic zoom between cluster-level and article-level views.

### Revised TypeScript Interfaces

```typescript
// scripts/generate-graph-data.ts — NEW build-time script

/**
 * A node in the knowledge graph, derived from MDX frontmatter.
 */
interface GraphNode {
  id: string;                          // e.g., "M01", "L02", or slug path
  type: "module" | "living" | "article" | "resource";
  label: {
    zh: string;
    en: string;
  };
  slug: string;                        // URL path: "/docs/core/01-foundations"
  cluster: string;                     // Deck/section: "enlighten", "empower", "engage", "research"
  tags: string[];                      // From frontmatter
  metadata: {
    moduleId?: string;                 // M01-M09 or L01-L04
    docType?: string;                  // "core", "extend", "evidence", "case"
    status?: string;                   // "draft", "completed"
    evidenceLevel?: string;            // "E1", "E2", "E3"
  };
  // Position is computed, not hardcoded
  position?: { x: number; y: number };
}

/**
 * An edge connecting two nodes, derived from:
 * 1. module-connections.ts (L→M relationships)
 * 2. MDX internal links (cross-references)
 * 3. Shared tags (semantic similarity)
 */
interface GraphEdge {
  source: string;                      // Node ID
  target: string;                      // Node ID
  type: "powers" | "references" | "related";
  weight: number;                      // 0-1, affects visual thickness
  label?: {
    zh: string;
    en: string;
  };
}

/**
 * Cluster definition for semantic zoom levels.
 */
interface GraphCluster {
  id: string;                          // "enlighten", "empower", "engage", "research"
  label: { zh: string; en: string };
  color: string;                       // From brandColors
  nodeIds: string[];                   // Nodes belonging to this cluster
  centroid?: { x: number; y: number }; // Computed center
}

/**
 * The complete graph data file, generated at build time.
 */
interface KnowledgeGraphData {
  version: string;
  generatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  clusters: GraphCluster[];
  stats: {
    totalNodes: number;
    totalEdges: number;
    totalArticles: number;
    avgConnectionsPerNode: number;
  };
}
```

### Refactoring Steps

**Step 1: Create build-time graph generator** (`scripts/generate-graph-data.ts`)

This script runs as part of the build pipeline (add to `package.json` scripts):

```json
{
  "prebuild": "tsx scripts/generate-graph-data.ts && node scripts/lint-mdx.js",
  "graph": "tsx scripts/generate-graph-data.ts"
}
```

The script:
1. Reads all MDX files in `content/docs/zh/` using `glob`
2. Extracts frontmatter with `gray-matter` (title, tags, module_id, doc_type)
3. Scans MDX body for internal links (`/docs/core/...`) to build cross-reference edges
4. Imports existing `moduleConnections` from `module-connections.ts` for L→M edges
5. Computes tag-based similarity edges (shared tags → `type: "related"`)
6. Groups nodes into clusters based on deck membership
7. Writes `src/data/graph-data.json` (imported by components at runtime)

**Step 2: Refactor `KnowledgeUniverse` to use generated data**

Replace hardcoded `blueprintLayout` coordinates with force-directed layout computation:

```typescript
// src/features/explore-universe/KnowledgeUniverse.tsx

import graphData from "@/data/graph-data.json";
import type { KnowledgeGraphData } from "@/lib/schemas/graph";

// Use d3-force (already compatible with React) to compute positions
// from the graph topology, with cluster constraints
```

The component:
1. Loads `graph-data.json` (generated at build time)
2. On mount, runs a force-directed simulation (d3-force) with cluster gravity
3. L modules attract toward corners, M modules form a central grid (preserving the current aesthetic)
4. New articles appear as smaller nodes around their parent module
5. Layout is deterministic (seeded random) so positions are stable across renders

**Step 3: Implement Semantic Zoom**

Three zoom levels with smooth transitions:

| Zoom Level | What's Visible | Interaction |
|-----------|---------------|-------------|
| **Galaxy** (default) | Clusters as nebulae, deck labels | Click cluster to zoom in |
| **System** (zoom 1) | Individual modules within a cluster, L→M connections | Click module to zoom in |
| **Planet** (zoom 2) | Articles within a module, cross-references, evidence levels | Click article to navigate to docs page |

Implementation:
- Use CSS `transform: scale()` with Framer Motion for smooth zoom transitions
- At each level, fade in/out appropriate detail layers
- Maintain the "blueprint" aesthetic at all zoom levels
- Breadcrumb trail shows current zoom path: `Galaxy > Empower Deck > M05 Tools`

---

## Pillar 4: The "Sci-Fi Design System"

### Current Architecture

```
src/app/globals.css           → CSS variables, glass-card class, keyframe animations
src/lib/brand/colors.ts       → brandColors constant + utility functions
src/lib/animations/variants.ts → Framer Motion variant objects
src/components/ui/             → ThemeProvider, EmotionSelector, ErrorBoundary
src/components/genui/          → ThinkingModelCard, DataTrendChart (inline styles)
src/features/lab-editor/       → 37 components with mixed styling approaches
```

### Audit Findings

#### 1. Glassmorphism: Inconsistent Implementation

Three separate patterns coexist:

| Pattern | Used In | Implementation |
|---------|---------|----------------|
| `.glass-card` CSS class | General cards | `globals.css` — `backdrop-blur: 12px`, CSS var borders |
| Inline `style={{ background: "rgba(...)" }}` | GenUI cards | `ThinkingModelCard.tsx`, `DataTrendChart.tsx` — hardcoded rgba |
| Tailwind utility classes | Editor panels | `bg-black/80 backdrop-blur-sm` — inconsistent blur values |

**Problem**: Adding a new panel requires choosing between 3 approaches, and there's no way to enforce consistency.

#### 2. Typography: Partially Enforced

- `JetBrains Mono` is defined as `--font-mono` in CSS but only applied to `pre`/`code` elements
- Data displays (coordinates in the canvas, budget numbers, metrics) use the default sans-serif font
- The "Instrument" aesthetic requires monospace for all numerical/technical data

#### 3. Micro-Interactions: Library Exists, Underutilized

- `src/lib/animations/variants.ts` defines 20+ Framer Motion variants
- But `FloorPlanEditor` and most lab-editor components don't import them
- AI processing states use a simple spinner, not the `pulseSlow`/`pulseMedium` variants designed for this purpose

### Revised TypeScript Interfaces

```typescript
// src/components/ui/GlassPanel.tsx — NEW composable component

interface GlassPanelProps {
  /** Visual intensity preset */
  variant: "subtle" | "standard" | "cyber" | "frosted";
  /** Optional colored border glow */
  glow?: "cyan" | "violet" | "pink" | "emerald" | "none";
  /** Border radius override */
  radius?: "sm" | "md" | "lg" | "xl";
  /** Padding preset */
  padding?: "none" | "sm" | "md" | "lg";
  /** Content */
  children: React.ReactNode;
  className?: string;
}

/**
 * Variant specifications:
 *
 * subtle:   blur 8px,  bg opacity 0.02, border opacity 0.04
 * standard: blur 12px, bg opacity 0.04, border opacity 0.06 (= current glass-card)
 * cyber:    blur 16px, bg opacity 0.06, border opacity 0.10, colored top-border accent
 * frosted:  blur 24px, bg opacity 0.10, border opacity 0.12 (for modals/overlays)
 */

// src/components/ui/DataText.tsx — NEW typography component

interface DataTextProps {
  /** The numeric or technical value to display */
  children: React.ReactNode;
  /** Visual variant */
  variant: "metric" | "coordinate" | "code" | "label";
  /** Size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Optional unit suffix */
  unit?: string;
  /** Color from brand palette */
  color?: "cyan" | "violet" | "pink" | "emerald" | "amber" | "default";
}

/**
 * Renders text in JetBrains Mono with appropriate styling:
 *
 * metric:     Bold, tabular-nums, letter-spacing tight (e.g., "2,450 m²")
 * coordinate: Regular, tabular-nums (e.g., "x: 120, y: 340")
 * code:       With background highlight (e.g., inline code)
 * label:      Uppercase, tracking wide, small (e.g., "EFFICIENCY")
 */

// src/lib/animations/thinking.ts — NEW AI state animations

interface ThinkingAnimationConfig {
  /** Which AI state to visualize */
  state: "idle" | "thinking" | "generating" | "applying" | "error";
  /** Animation intensity */
  intensity?: "subtle" | "normal" | "dramatic";
}

/**
 * Animation states:
 *
 * idle:       Static, slight ambient glow
 * thinking:   Slow pulse (3s cycle), orbiting particles
 * generating: Fast pulse (1s cycle), expanding rings
 * applying:   Directional sweep (left→right), success flash
 * error:      Red flash, shake, settle
 */
```

### Refactoring Steps

**Step 1: Create `<GlassPanel>` component** (`src/components/ui/GlassPanel.tsx`)

A single composable component that replaces all glassmorphism patterns:

```tsx
// Usage examples:
<GlassPanel variant="standard" glow="cyan">
  <SafetyPanel />
</GlassPanel>

<GlassPanel variant="cyber" glow="violet" padding="lg">
  <ThinkingModelCard />
</GlassPanel>

<GlassPanel variant="frosted" radius="xl">
  <Modal />
</GlassPanel>
```

Implementation uses CSS variables internally:
- Each variant maps to specific `backdrop-filter`, `background`, `border`, and `box-shadow` values
- Glow colors reference `brandColors` and apply a 1px top-border + subtle `box-shadow`
- Respects the emotion theme system (calm/energetic/creative override border-radius and opacity)

**Step 2: Create `<DataText>` component** (`src/components/ui/DataText.tsx`)

Enforces `JetBrains Mono` for all technical/numerical displays:

```tsx
// Usage examples:
<DataText variant="metric" size="lg" unit="m²">2,450</DataText>
<DataText variant="coordinate">x: 120, y: 340</DataText>
<DataText variant="label" color="cyan">EFFICIENCY</DataText>
```

Apply across:
- FloorPlanCanvas zone labels (coordinates, dimensions)
- BudgetDashboard numbers (costs, percentages)
- QuickStatsPanel metrics
- SafetyPanel scores
- DataTrendChart axis labels

**Step 3: Create AI thinking state animations** (`src/lib/animations/thinking.ts`)

Define Framer Motion variants for AI processing states:

```typescript
export const thinkingVariants = {
  idle: {
    scale: 1,
    opacity: 0.8,
    boxShadow: "0 0 0px rgba(0, 217, 255, 0)",
  },
  thinking: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    boxShadow: [
      "0 0 0px rgba(0, 217, 255, 0)",
      "0 0 20px rgba(0, 217, 255, 0.3)",
      "0 0 0px rgba(0, 217, 255, 0)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  generating: {
    scale: [1, 1.01, 1],
    opacity: 1,
    boxShadow: [
      "0 0 4px rgba(139, 92, 246, 0.2)",
      "0 0 16px rgba(139, 92, 246, 0.5)",
      "0 0 4px rgba(139, 92, 246, 0.2)",
    ],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
```

Apply in `AIChatPanel.tsx`:
- Wrap the chat input area with `<motion.div animate={aiState}>` where `aiState` tracks `status` from `useChat`
- Add an orbiting particle ring component around the AI avatar during `thinking` state
- Flash the chat panel border with the "generating" glow during `streamText` responses

**Step 4: Audit and replace hardcoded styles**

Priority replacements:

| Component | Current | Replace With |
|-----------|---------|-------------|
| `ThinkingModelCard.tsx` | Inline `background: "linear-gradient(...)"` | `<GlassPanel variant="cyber" glow="cyan">` |
| `DataTrendChart.tsx` | Inline `background: "linear-gradient(...)"` | `<GlassPanel variant="cyber" glow="violet">` |
| `SafetyPanel.tsx` | `bg-black/80 backdrop-blur-sm` | `<GlassPanel variant="standard">` |
| `BudgetDashboard.tsx` | Mixed Tailwind + inline | `<GlassPanel variant="standard" glow="amber">` |
| `AIChatPanel.tsx` | Custom glass CSS | `<GlassPanel variant="frosted">` |
| All editor side panels | Various `bg-*` patterns | `<GlassPanel variant="standard">` |

---

## Cross-Pillar Integration: AI Agent ↔ Editor Store

The key convergence point: **The AI can modify the editor state directly.**

### Current Flow (Indirect)

```
AI (route.ts) → modifyLayout tool → streamText response
    → AIChatPanel detects tool output → calls onLayoutUpdate callback
        → FloorPlanEditor.handleLayoutFromAI → setLayout (useState)
```

This is fragile: the callback chain is long, and the AI has no confirmation that the layout was applied.

### Target Flow (Direct Store Access)

```
AI (route.ts) → modifyLayout tool → streamText response
    → AIChatPanel detects tool output → useEditorStore.replaceLayout(layout)
        → Store updates → all subscribed components re-render
        → Store auto-syncs to multiverse store
        → Auto-save triggers → localStorage + sync indicator
```

### Integration Interface

```typescript
// src/lib/ai/tools/modify-layout.ts

import { useEditorStore } from "@/stores/editor-store";

/**
 * Client-side handler for the modifyLayout tool output.
 * Called from AIChatPanel when tool state becomes "output-available".
 */
export function applyLayoutFromAI(toolOutput: {
  layout: LayoutData;
  toolCallId: string;
}): void {
  const store = useEditorStore.getState();

  // 1. Apply layout with undo label
  store.replaceLayout(toolOutput.layout, "AI: Layout modification");

  // 2. Auto-save is triggered by store subscription
  // 3. Multiverse sync is triggered by store subscription
  // 4. UI components re-render via selectors
}

/**
 * The AI can also query the current editor state.
 * This allows tools to chain: modifyLayout → showDataTrend (with new metrics).
 */
export function getEditorContext(): {
  layout: LayoutData;
  selectedZone: string | null;
  undoCount: number;
} {
  const store = useEditorStore.getState();
  return {
    layout: store.layout,
    selectedZone: store.ui.selectedZoneId,
    undoCount: store.temporal.past.length,
  };
}
```

---

## Implementation Priority

### Phase 1: Foundation (State Architecture)
1. Create `editor-store.ts` with unified state (Pillar 2, Step 1)
2. Add `useShallow` selectors (Pillar 2, Step 2)
3. Migrate `FloorPlanEditor` from 23 `useState` to store
4. Add auto-save persistence (Pillar 2, Step 3)

### Phase 2: Visual Consistency (Design System)
5. Create `<GlassPanel>` component (Pillar 4, Step 1)
6. Create `<DataText>` component (Pillar 4, Step 2)
7. Replace hardcoded styles across components (Pillar 4, Step 4)

### Phase 3: AI Evolution (Generative UI)
8. Extract Tool Registry (Pillar 1, Step 1)
9. Implement `render_lab_preview` tool (Pillar 1, Step 2)
10. Implement `visualize_concept` tool (Pillar 1, Step 3)
11. Bridge AI tools → editor store (Cross-Pillar)

### Phase 4: Knowledge Graph Automation (Semantic Universe)
12. Create build-time graph generator (Pillar 3, Step 1)
13. Refactor `KnowledgeUniverse` to use generated data (Pillar 3, Step 2)
14. Implement semantic zoom (Pillar 3, Step 3)

### Phase 5: Polish
15. AI thinking state animations (Pillar 4, Step 3)
16. `React.memo` wrappers for editor components (Pillar 2, Step 5)
17. End-to-end integration testing

---

## File Inventory: What Changes

### New Files
```
src/stores/editor-store.ts              # Unified editor state (Pillar 2)
src/stores/editor-selectors.ts          # useShallow selectors (Pillar 2)
src/hooks/useAutoSave.ts                # Auto-save hook (Pillar 2)
src/lib/ai/tools/registry.ts            # Tool Registry (Pillar 1)
src/lib/ai/tools/show-thinking-model.ts # Extracted tool (Pillar 1)
src/lib/ai/tools/show-data-trend.ts     # Extracted tool (Pillar 1)
src/lib/ai/tools/modify-layout.ts       # Extracted + enhanced tool (Pillar 1)
src/lib/ai/tools/render-lab-preview.ts  # New tool (Pillar 1)
src/lib/ai/tools/visualize-concept.ts   # New tool (Pillar 1)
src/components/ui/GlassPanel.tsx        # Glass component (Pillar 4)
src/components/ui/DataText.tsx          # Typography component (Pillar 4)
src/lib/animations/thinking.ts          # AI animations (Pillar 4)
src/lib/schemas/graph.ts               # Graph types (Pillar 3)
src/data/graph-data.json               # Generated at build time (Pillar 3)
scripts/generate-graph-data.ts          # Build script (Pillar 3)
```

### Modified Files
```
src/app/api/ai/chat/route.ts           # Use Tool Registry (Pillar 1)
src/features/lab-editor/FloorPlanEditor.tsx   # Use editor-store (Pillar 2)
src/features/lab-editor/FloorPlanCanvas.tsx   # Use selectors + React.memo (Pillar 2)
src/features/lab-editor/AIChatPanel.tsx       # Use editor-store + new tools (P1+P2)
src/features/explore-universe/KnowledgeUniverse.tsx  # Use graph-data.json (Pillar 3)
src/components/genui/ThinkingModelCard.tsx    # Use GlassPanel (Pillar 4)
src/components/genui/DataTrendChart.tsx       # Use GlassPanel (Pillar 4)
source.config.ts                        # Add frontmatter schema (Pillar 3)
package.json                            # Add prebuild script (Pillar 3)
```

### Removed/Deprecated
```
src/hooks/useHistory.ts                 # Replaced by editor-store temporal (Pillar 2)
```

---

## Citation Graph (added 2026-04 by C004)

The 2026-04 文档系统全量研究化迭代 added a **structured-bibliography pipeline** that
naturally feeds the proposed knowledge-graph architecture. Each citation in
`src/data/bibliography.generated.json` carries:

- `module` — the module owner (M01-M09 / L01-L04)
- `tags[]` — topical labels usable as graph edges
- `key_claims[]` — semantic anchors for cross-reference clustering
- `used_in[]` — explicit MDX-page → citation links
- `evidence_tier` — E0-E3, can weight node importance in the visualisation
- `aliases[]` — backwards-compatible IDs for legacy refs

### Graph derivation pseudocode

```text
nodes = {
  ...modules (M01-M09, L01-L04),       # primary nodes
  ...citations,                          # secondary nodes (124 total as of 2026-04)
  ...mdx-pages (used_in references),     # tertiary nodes
}

edges = {
  module --owns--> citation,             # citation.module
  citation --tagged--> tag,              # citation.tags[]
  mdx-page --cites--> citation,          # citation.used_in[]
  module --crosslinks--> module,         # ExtendCards related-module entries
                                         # (e.g., L01↔M03, L02↔M05, L03↔M07, L04↔M05+M06)
}

edge-weight  =  E3:1.0  E2:0.7  E1:0.4  E0:0.2
```

### Implementation hook

When implementing Pillar 3 (Semantic Universe) the build script should:

1. Read `src/data/bibliography.generated.json` (already produced by `scripts/build-bibliography.mjs` in `pnpm prebuild`).
2. Read all `meta.json` and the `frontmatter` of each `index.mdx` for module-level metadata.
3. Combine into a single `src/data/graph-data.json` consumable by `KnowledgeUniverse.tsx`.

This means **the citation graph is already half built** — we now have edge-weighted module-citation-tag-page connections without any extra MDX authoring effort.
