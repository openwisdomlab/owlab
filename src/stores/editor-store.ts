// src/stores/editor-store.ts
import { create } from "zustand";
import type { Template } from "@/lib/schemas/template";
import type { LauncherState } from "@/lib/schemas/launcher";
import type { ZoneData } from "@/lib/ai/agents/layout-agent";
import type { ColorScheme } from "@/lib/utils/canvas";

// Panel names that can be toggled
export type PanelName =
  | "launcher"
  | "aiSidebar"
  | "chat"
  | "export"
  | "equipment"
  | "budget"
  | "templates"
  | "saveTemplate"
  | "safety"
  | "psychologicalSafety"
  | "preview3D"
  | "shortcuts"
  | "measurement"
  | "allenCurve"
  | "parallelUniverse"
  | "emotionDesign"
  | "quickStats"
  | "wizard"
  | "copilot"
  | "procurement"
  | "construction"
  | "acceptance"
  | "milestones"
  | "reportSuite"
  | "gallery";

type PanelState = Record<PanelName, boolean>;

interface EditorState {
  // Panel visibility
  panels: PanelState;

  // Tool / mode selection
  launcherState: LauncherState | null;
  hoveredLinkId: string | null;
  selectedTemplate: Template | null;
  selectedZone: string | null;

  // View / display settings
  zoom: number;
  showGrid: boolean;
  gridSnap: boolean;
  colorScheme: ColorScheme;

  // Clipboard
  clipboard: ZoneData | null;

  // Panel actions
  openPanel: (name: PanelName) => void;
  closePanel: (name: PanelName) => void;
  togglePanel: (name: PanelName) => void;
  closeAllPanels: () => void;

  // Selection actions
  setLauncherState: (state: LauncherState | null) => void;
  setHoveredLinkId: (id: string | null) => void;
  setSelectedTemplate: (template: Template | null) => void;
  setSelectedZone: (id: string | null) => void;

  // View actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setShowGrid: (show: boolean) => void;
  toggleGrid: () => void;
  setGridSnap: (snap: boolean) => void;
  toggleGridSnap: () => void;
  setColorScheme: (scheme: ColorScheme) => void;

  // Clipboard actions
  setClipboard: (zone: ZoneData | null) => void;
}

const DEFAULT_PANELS: PanelState = {
  launcher: true,
  aiSidebar: false,
  chat: false,
  export: false,
  equipment: false,
  budget: false,
  templates: false,
  saveTemplate: false,
  safety: false,
  psychologicalSafety: false,
  preview3D: false,
  shortcuts: false,
  measurement: false,
  allenCurve: false,
  parallelUniverse: false,
  emotionDesign: false,
  quickStats: false,
  wizard: false,
  copilot: false,
  procurement: false,
  construction: false,
  acceptance: false,
  milestones: false,
  reportSuite: false,
  gallery: false,
};

export const useEditorStore = create<EditorState>((set) => ({
  // Initial state
  panels: { ...DEFAULT_PANELS },
  launcherState: null,
  hoveredLinkId: null,
  selectedTemplate: null,
  selectedZone: null,
  zoom: 1,
  showGrid: true,
  gridSnap: true,
  colorScheme: "neon" as ColorScheme,
  clipboard: null,

  // Panel actions
  openPanel: (name) =>
    set((s) => ({ panels: { ...s.panels, [name]: true } })),
  closePanel: (name) =>
    set((s) => ({ panels: { ...s.panels, [name]: false } })),
  togglePanel: (name) =>
    set((s) => ({ panels: { ...s.panels, [name]: !s.panels[name] } })),
  closeAllPanels: () =>
    set({ panels: { ...DEFAULT_PANELS, launcher: false } }),

  // Selection actions
  setLauncherState: (state) => set({ launcherState: state }),
  setHoveredLinkId: (id) => set({ hoveredLinkId: id }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setSelectedZone: (id) => set({ selectedZone: id }),

  // View actions
  setZoom: (zoom) => set({ zoom }),
  zoomIn: () => set((s) => ({ zoom: Math.min(2, s.zoom + 0.1) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(0.5, s.zoom - 0.1) })),
  setShowGrid: (show) => set({ showGrid: show }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  setGridSnap: (snap) => set({ gridSnap: snap }),
  toggleGridSnap: () => set((s) => ({ gridSnap: !s.gridSnap })),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),

  // Clipboard actions
  setClipboard: (zone) => set({ clipboard: zone }),
}));
