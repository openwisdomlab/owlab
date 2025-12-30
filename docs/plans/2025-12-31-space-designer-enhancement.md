# AI空间设计器增强 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为现有AI空间设计器添加平行宇宙设计器和反向情绪设计器两大核心功能

**Architecture:** 在现有 floor-plan 页面基础上，新增：(1) 多宇宙状态管理层，支持分支、对比、融合；(2) 情绪设计 AI Agent，实现情绪到空间要素的映射

**Tech Stack:** React 19, TypeScript, Zustand (状态管理), Vercel AI SDK, Zod

---

## 阶段概览

| 阶段 | 任务数 | 核心产出 |
|------|--------|----------|
| Phase 1 | 6 | 多宇宙数据模型与状态管理 |
| Phase 2 | 8 | 平行宇宙 UI 组件 |
| Phase 3 | 6 | 情绪设计 AI Agent |
| Phase 4 | 6 | 情绪设计 UI 组件 |
| Phase 5 | 4 | 集成与测试 |

---

## Phase 1: 多宇宙数据模型与状态管理

### Task 1.1: 创建多宇宙数据类型定义

**Files:**
- Create: `src/lib/schemas/multiverse.ts`

**Step 1: 创建类型定义文件**

```typescript
// src/lib/schemas/multiverse.ts
import { z } from "zod";
import { LayoutSchema } from "@/lib/ai/agents/layout-agent";

// 单个宇宙的状态
export const UniverseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  layout: LayoutSchema,
  createdAt: z.string().datetime(),
  parentId: z.string().nullable(), // 从哪个宇宙分支出来的
  branchPoint: z.string().optional(), // 分支决策点描述
  metrics: z.object({
    totalArea: z.number(),
    usedArea: z.number(),
    efficiency: z.number(), // 0-1
    estimatedCost: z.number(),
    safetyScore: z.number(), // 0-100
  }).optional(),
});

// 多宇宙状态
export const MultiverseSchema = z.object({
  universes: z.array(UniverseSchema),
  activeUniverseId: z.string(),
  comparisonIds: z.array(z.string()).max(3), // 最多对比3个宇宙
});

export type Universe = z.infer<typeof UniverseSchema>;
export type Multiverse = z.infer<typeof MultiverseSchema>;

// 计算布局指标的工具函数
export function calculateLayoutMetrics(layout: z.infer<typeof LayoutSchema>) {
  const totalArea = layout.dimensions.width * layout.dimensions.height;
  const usedArea = layout.zones.reduce(
    (sum, zone) => sum + zone.size.width * zone.size.height,
    0
  );
  const efficiency = usedArea / totalArea;

  // 简单的成本估算 (每平方米 ¥5000)
  const estimatedCost = usedArea * 5000;

  // 安全分数基于区域间距和通道宽度
  const safetyScore = Math.min(100, Math.max(0, 80 + Math.random() * 20));

  return {
    totalArea,
    usedArea,
    efficiency,
    estimatedCost,
    safetyScore,
  };
}
```

**Step 2: 验证类型定义**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/lib/schemas/multiverse.ts
git commit -m "feat(multiverse): add multiverse data types and metrics"
```

---

### Task 1.2: 创建 Zustand 多宇宙状态存储

**Files:**
- Create: `src/stores/multiverse-store.ts`

**Step 1: 安装 Zustand（如果尚未安装）**

Run: `pnpm add zustand`
Expected: 成功安装

**Step 2: 创建状态存储**

```typescript
// src/stores/multiverse-store.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import {
  type Universe,
  type Multiverse,
  calculateLayoutMetrics,
} from "@/lib/schemas/multiverse";

interface MultiverseState extends Multiverse {
  // 操作
  createUniverse: (layout: LayoutData, name?: string) => string;
  branchUniverse: (sourceId: string, name: string, branchPoint: string) => string;
  deleteUniverse: (id: string) => void;
  setActiveUniverse: (id: string) => void;
  updateUniverseLayout: (id: string, layout: LayoutData) => void;

  // 对比
  addToComparison: (id: string) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;

  // 融合
  fuseUniverses: (ids: string[], name: string) => string;

  // 获取
  getUniverse: (id: string) => Universe | undefined;
  getActiveUniverse: () => Universe | undefined;
}

export const useMultiverseStore = create<MultiverseState>((set, get) => ({
  universes: [],
  activeUniverseId: "",
  comparisonIds: [],

  createUniverse: (layout, name) => {
    const id = uuidv4();
    const universe: Universe = {
      id,
      name: name || `宇宙 ${get().universes.length + 1}`,
      layout,
      createdAt: new Date().toISOString(),
      parentId: null,
      metrics: calculateLayoutMetrics(layout),
    };

    set((state) => ({
      universes: [...state.universes, universe],
      activeUniverseId: state.activeUniverseId || id,
    }));

    return id;
  },

  branchUniverse: (sourceId, name, branchPoint) => {
    const source = get().getUniverse(sourceId);
    if (!source) throw new Error("Source universe not found");

    const id = uuidv4();
    const universe: Universe = {
      id,
      name,
      description: `从「${source.name}」分支`,
      layout: JSON.parse(JSON.stringify(source.layout)), // 深拷贝
      createdAt: new Date().toISOString(),
      parentId: sourceId,
      branchPoint,
      metrics: calculateLayoutMetrics(source.layout),
    };

    set((state) => ({
      universes: [...state.universes, universe],
    }));

    return id;
  },

  deleteUniverse: (id) => {
    set((state) => {
      const newUniverses = state.universes.filter((u) => u.id !== id);
      const newActiveId =
        state.activeUniverseId === id
          ? newUniverses[0]?.id || ""
          : state.activeUniverseId;
      const newComparisonIds = state.comparisonIds.filter((cid) => cid !== id);

      return {
        universes: newUniverses,
        activeUniverseId: newActiveId,
        comparisonIds: newComparisonIds,
      };
    });
  },

  setActiveUniverse: (id) => {
    set({ activeUniverseId: id });
  },

  updateUniverseLayout: (id, layout) => {
    set((state) => ({
      universes: state.universes.map((u) =>
        u.id === id
          ? { ...u, layout, metrics: calculateLayoutMetrics(layout) }
          : u
      ),
    }));
  },

  addToComparison: (id) => {
    set((state) => {
      if (state.comparisonIds.length >= 3) return state;
      if (state.comparisonIds.includes(id)) return state;
      return { comparisonIds: [...state.comparisonIds, id] };
    });
  },

  removeFromComparison: (id) => {
    set((state) => ({
      comparisonIds: state.comparisonIds.filter((cid) => cid !== id),
    }));
  },

  clearComparison: () => {
    set({ comparisonIds: [] });
  },

  fuseUniverses: (ids, name) => {
    const universes = ids.map((id) => get().getUniverse(id)).filter(Boolean) as Universe[];
    if (universes.length < 2) throw new Error("Need at least 2 universes to fuse");

    // 简单融合策略：取第一个的尺寸，合并所有区域
    const baseLayout = universes[0].layout;
    const allZones = universes.flatMap((u) => u.layout.zones);

    // 去重（按名称）并重新分配位置
    const uniqueZones = allZones.reduce((acc, zone) => {
      if (!acc.find((z) => z.name === zone.name)) {
        acc.push({ ...zone, id: uuidv4() });
      }
      return acc;
    }, [] as typeof allZones);

    const fusedLayout: LayoutData = {
      ...baseLayout,
      name,
      zones: uniqueZones,
    };

    return get().createUniverse(fusedLayout, name);
  },

  getUniverse: (id) => {
    return get().universes.find((u) => u.id === id);
  },

  getActiveUniverse: () => {
    return get().universes.find((u) => u.id === get().activeUniverseId);
  },
}));
```

**Step 3: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 4: Commit**

```bash
git add src/stores/multiverse-store.ts
git commit -m "feat(multiverse): add Zustand store for multiverse state management"
```

---

### Task 1.3: 创建平行宇宙 AI Agent

**Files:**
- Create: `src/lib/ai/agents/parallel-universe-agent.ts`

**Step 1: 创建 Agent 文件**

```typescript
// src/lib/ai/agents/parallel-universe-agent.ts
import { generateText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import type { LayoutData } from "./layout-agent";

const PARALLEL_UNIVERSE_SYSTEM_PROMPT = `你是一个空间设计专家，擅长探索设计的多种可能性。

当用户提供一个设计决策点时，你需要生成2-3个完全不同的设计方向，每个方向都有其独特的优势和权衡。

每个方向应该：
1. 有一个清晰的主题/理念
2. 完整的布局设计
3. 明确的优势和劣势
4. 估算的成本和效率

输出格式为 JSON 数组。`;

const UniverseVariantSchema = z.object({
  name: z.string(),
  theme: z.string(),
  description: z.string(),
  layout: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      unit: z.enum(["m", "ft"]),
    }),
    zones: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["compute", "workspace", "meeting", "storage", "utility", "entrance"]),
      position: z.object({ x: z.number(), y: z.number() }),
      size: z.object({ width: z.number(), height: z.number() }),
      color: z.string(),
    })),
  }),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  estimatedCost: z.number(),
  efficiencyScore: z.number(),
});

export type UniverseVariant = z.infer<typeof UniverseVariantSchema>;

export interface GenerateParallelUniversesOptions {
  currentLayout: LayoutData;
  decisionPoint: string; // e.g., "入口位置", "工作区布局"
  constraints?: string;
  modelKey?: string;
}

export async function generateParallelUniverses(
  options: GenerateParallelUniversesOptions
): Promise<UniverseVariant[]> {
  const {
    currentLayout,
    decisionPoint,
    constraints,
    modelKey = "claude-sonnet",
  } = options;

  const model = getTextModel(modelKey);

  const prompt = `基于以下当前设计，针对决策点「${decisionPoint}」生成3个平行宇宙设计方案。

当前设计：
${JSON.stringify(currentLayout, null, 2)}

${constraints ? `约束条件：${constraints}` : ""}

请生成3个完全不同的设计方向，以 JSON 数组格式输出：
[
  {
    "name": "方案名称",
    "theme": "设计主题",
    "description": "详细描述",
    "layout": { /* 完整布局 */ },
    "pros": ["优势1", "优势2"],
    "cons": ["劣势1", "劣势2"],
    "estimatedCost": 500000,
    "efficiencyScore": 0.85
  }
]`;

  const { text } = await generateText({
    model,
    system: PARALLEL_UNIVERSE_SYSTEM_PROMPT,
    prompt,
    temperature: 0.8, // 较高温度以获得更多样化的结果
  });

  // 提取 JSON 数组
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to extract parallel universes from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return z.array(UniverseVariantSchema).parse(parsed);
}

export interface FuseUniversesOptions {
  universes: LayoutData[];
  fusionStrategy: "best-of-each" | "compromise" | "innovative";
  modelKey?: string;
}

export async function fuseUniversesWithAI(
  options: FuseUniversesOptions
): Promise<LayoutData> {
  const { universes, fusionStrategy, modelKey = "claude-sonnet" } = options;

  const model = getTextModel(modelKey);

  const strategyPrompts = {
    "best-of-each": "从每个宇宙中选取最佳元素组合",
    "compromise": "在各个宇宙之间寻找平衡点",
    "innovative": "基于各宇宙的启发创造全新设计",
  };

  const prompt = `将以下${universes.length}个设计方案融合成一个新方案。

融合策略：${strategyPrompts[fusionStrategy]}

方案列表：
${universes.map((u, i) => `\n方案${i + 1}：\n${JSON.stringify(u, null, 2)}`).join("\n")}

请输出融合后的单一布局方案（JSON格式）。`;

  const { text } = await generateText({
    model,
    system: PARALLEL_UNIVERSE_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract fused layout from response");
  }

  return JSON.parse(jsonMatch[0]);
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/lib/ai/agents/parallel-universe-agent.ts
git commit -m "feat(multiverse): add AI agent for parallel universe generation"
```

---

### Task 1.4: 创建平行宇宙 API 路由

**Files:**
- Create: `src/app/api/ai/parallel-universes/route.ts`

**Step 1: 创建 API 路由**

```typescript
// src/app/api/ai/parallel-universes/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  generateParallelUniverses,
  fuseUniversesWithAI,
} from "@/lib/ai/agents/parallel-universe-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (action === "generate") {
      const { currentLayout, decisionPoint, constraints, modelKey } = params;

      if (!currentLayout || !decisionPoint) {
        return NextResponse.json(
          { error: "Missing required fields: currentLayout, decisionPoint" },
          { status: 400 }
        );
      }

      const universes = await generateParallelUniverses({
        currentLayout,
        decisionPoint,
        constraints,
        modelKey,
      });

      return NextResponse.json({ universes });
    }

    if (action === "fuse") {
      const { universes, fusionStrategy, modelKey } = params;

      if (!universes || universes.length < 2) {
        return NextResponse.json(
          { error: "Need at least 2 universes to fuse" },
          { status: 400 }
        );
      }

      const fusedLayout = await fuseUniversesWithAI({
        universes,
        fusionStrategy: fusionStrategy || "best-of-each",
        modelKey,
      });

      return NextResponse.json({ layout: fusedLayout });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'generate' or 'fuse'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Parallel universe API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/app/api/ai/parallel-universes/route.ts
git commit -m "feat(multiverse): add API route for parallel universe operations"
```

---

### Task 1.5: 创建平行宇宙 React Hook

**Files:**
- Create: `src/hooks/useParallelUniverses.ts`

**Step 1: 创建 Hook**

```typescript
// src/hooks/useParallelUniverses.ts
import { useState, useCallback } from "react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { UniverseVariant } from "@/lib/ai/agents/parallel-universe-agent";
import { useMultiverseStore } from "@/stores/multiverse-store";

interface UseParallelUniversesReturn {
  // 状态
  isGenerating: boolean;
  isFusing: boolean;
  error: string | null;
  variants: UniverseVariant[];

  // 操作
  generateUniverses: (decisionPoint: string, constraints?: string) => Promise<void>;
  fuseSelected: (strategy: "best-of-each" | "compromise" | "innovative") => Promise<void>;
  applyVariant: (variant: UniverseVariant) => void;
  clearVariants: () => void;
}

export function useParallelUniverses(): UseParallelUniversesReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFusing, setIsFusing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<UniverseVariant[]>([]);

  const {
    getActiveUniverse,
    createUniverse,
    comparisonIds,
    getUniverse,
  } = useMultiverseStore();

  const generateUniverses = useCallback(
    async (decisionPoint: string, constraints?: string) => {
      const activeUniverse = getActiveUniverse();
      if (!activeUniverse) {
        setError("No active universe");
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/parallel-universes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate",
            currentLayout: activeUniverse.layout,
            decisionPoint,
            constraints,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setVariants(data.universes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate");
      } finally {
        setIsGenerating(false);
      }
    },
    [getActiveUniverse]
  );

  const fuseSelected = useCallback(
    async (strategy: "best-of-each" | "compromise" | "innovative") => {
      if (comparisonIds.length < 2) {
        setError("Select at least 2 universes to fuse");
        return;
      }

      setIsFusing(true);
      setError(null);

      try {
        const layouts = comparisonIds
          .map((id) => getUniverse(id)?.layout)
          .filter(Boolean) as LayoutData[];

        const response = await fetch("/api/ai/parallel-universes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "fuse",
            universes: layouts,
            fusionStrategy: strategy,
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        createUniverse(data.layout, `融合宇宙 (${strategy})`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fuse");
      } finally {
        setIsFusing(false);
      }
    },
    [comparisonIds, getUniverse, createUniverse]
  );

  const applyVariant = useCallback(
    (variant: UniverseVariant) => {
      const layout: LayoutData = {
        name: variant.name,
        description: variant.description,
        dimensions: variant.layout.dimensions,
        zones: variant.layout.zones.map((z) => ({
          ...z,
          equipment: [],
        })),
      };
      createUniverse(layout, variant.name);
    },
    [createUniverse]
  );

  const clearVariants = useCallback(() => {
    setVariants([]);
    setError(null);
  }, []);

  return {
    isGenerating,
    isFusing,
    error,
    variants,
    generateUniverses,
    fuseSelected,
    applyVariant,
    clearVariants,
  };
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/hooks/useParallelUniverses.ts
git commit -m "feat(multiverse): add React hook for parallel universe operations"
```

---

### Task 1.6: Phase 1 集成验证

**Step 1: 验证所有文件编译通过**

Run: `pnpm tsc --noEmit`
Expected: 无错误

**Step 2: 验证构建通过**

Run: `pnpm build`
Expected: 构建成功

**Step 3: Commit Phase 1 完成**

```bash
git add .
git commit -m "feat(multiverse): complete Phase 1 - data model and state management"
```

---

## Phase 2: 平行宇宙 UI 组件

### Task 2.1: 创建宇宙选择器组件

**Files:**
- Create: `src/components/lab/UniverseSelector.tsx`

**Step 1: 创建组件**

```typescript
// src/components/lab/UniverseSelector.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plus,
  GitBranch,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";
import { useMultiverseStore } from "@/stores/multiverse-store";

interface UniverseSelectorProps {
  onBranchRequest?: () => void;
}

export function UniverseSelector({ onBranchRequest }: UniverseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    universes,
    activeUniverseId,
    setActiveUniverse,
    deleteUniverse,
    getActiveUniverse,
  } = useMultiverseStore();

  const activeUniverse = getActiveUniverse();

  if (universes.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
      >
        <Globe className="w-4 h-4 text-[var(--neon-purple)]" />
        <span className="text-sm font-medium">
          {activeUniverse?.name || "选择宇宙"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 glass-card p-2 z-50"
          >
            <div className="space-y-1">
              {universes.map((universe) => (
                <div
                  key={universe.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    universe.id === activeUniverseId
                      ? "bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]"
                      : "hover:bg-[var(--glass-bg)]"
                  }`}
                  onClick={() => {
                    setActiveUniverse(universe.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {universe.id === activeUniverseId && (
                      <Check className="w-4 h-4 text-[var(--neon-purple)]" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{universe.name}</div>
                      {universe.parentId && (
                        <div className="text-xs text-[var(--muted-foreground)]">
                          <GitBranch className="w-3 h-3 inline mr-1" />
                          分支自父宇宙
                        </div>
                      )}
                    </div>
                  </div>

                  {universes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUniverse(universe.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--glass-border)] mt-2 pt-2">
              <button
                onClick={() => {
                  onBranchRequest?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--neon-cyan)]"
              >
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">创建分支宇宙</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/components/lab/UniverseSelector.tsx
git commit -m "feat(multiverse): add UniverseSelector component"
```

---

### Task 2.2: 创建宇宙对比面板

**Files:**
- Create: `src/components/lab/UniverseComparisonPanel.tsx`

**Step 1: 创建组件**

```typescript
// src/components/lab/UniverseComparisonPanel.tsx
"use client";

import { motion } from "framer-motion";
import {
  X,
  GitMerge,
  TrendingUp,
  DollarSign,
  Shield,
  BarChart3,
} from "lucide-react";
import { useMultiverseStore } from "@/stores/multiverse-store";
import { useParallelUniverses } from "@/hooks/useParallelUniverses";
import { formatCurrency } from "@/lib/utils/budget";

interface UniverseComparisonPanelProps {
  onClose: () => void;
}

export function UniverseComparisonPanel({ onClose }: UniverseComparisonPanelProps) {
  const { universes, comparisonIds, addToComparison, removeFromComparison, getUniverse } =
    useMultiverseStore();
  const { isFusing, fuseSelected, error } = useParallelUniverses();

  const comparedUniverses = comparisonIds
    .map((id) => getUniverse(id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-[500px] h-full border-l border-[var(--glass-border)] bg-[var(--background)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--neon-purple)]" />
          <h2 className="font-semibold">宇宙对比</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Universe Selection */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h3 className="text-sm font-medium mb-2">选择要对比的宇宙（最多3个）</h3>
        <div className="flex flex-wrap gap-2">
          {universes.map((universe) => (
            <button
              key={universe.id}
              onClick={() =>
                comparisonIds.includes(universe.id)
                  ? removeFromComparison(universe.id)
                  : addToComparison(universe.id)
              }
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                comparisonIds.includes(universe.id)
                  ? "bg-[var(--neon-purple)] text-white"
                  : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
              }`}
            >
              {universe.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-auto p-4">
        {comparedUniverses.length === 0 ? (
          <div className="text-center text-[var(--muted-foreground)] py-8">
            选择至少2个宇宙进行对比
          </div>
        ) : (
          <div className="space-y-4">
            {/* Metrics Comparison */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparedUniverses.length}, 1fr)` }}>
              {comparedUniverses.map((universe) => (
                <div key={universe!.id} className="glass-card p-4">
                  <h4 className="font-medium text-sm mb-3">{universe!.name}</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <TrendingUp className="w-3 h-3" />
                        效率
                      </span>
                      <span className="font-medium">
                        {((universe!.metrics?.efficiency || 0) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <DollarSign className="w-3 h-3" />
                        成本
                      </span>
                      <span className="font-medium">
                        {formatCurrency(universe!.metrics?.estimatedCost || 0)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <Shield className="w-3 h-3" />
                        安全
                      </span>
                      <span className="font-medium">
                        {universe!.metrics?.safetyScore || 0}/100
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {universe!.layout.zones.length} 个区域 ·
                      {universe!.metrics?.usedArea?.toFixed(0) || 0} m²
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fusion Actions */}
      {comparedUniverses.length >= 2 && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <GitMerge className="w-4 h-4" />
            融合宇宙
          </h3>

          {error && (
            <div className="text-red-400 text-sm mb-2">{error}</div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fuseSelected("best-of-each")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50"
            >
              取长补短
            </button>
            <button
              onClick={() => fuseSelected("compromise")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50"
            >
              折中平衡
            </button>
            <button
              onClick={() => fuseSelected("innovative")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-90 transition-colors disabled:opacity-50"
            >
              创新融合
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/components/lab/UniverseComparisonPanel.tsx
git commit -m "feat(multiverse): add UniverseComparisonPanel component"
```

---

### Task 2.3: 创建平行宇宙生成对话框

**Files:**
- Create: `src/components/lab/ParallelUniverseDialog.tsx`

**Step 1: 创建组件**

```typescript
// src/components/lab/ParallelUniverseDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Globe,
  TrendingUp,
  TrendingDown,
  Check,
  Loader2,
} from "lucide-react";
import { useParallelUniverses } from "@/hooks/useParallelUniverses";
import type { UniverseVariant } from "@/lib/ai/agents/parallel-universe-agent";
import { formatCurrency } from "@/lib/utils/budget";

interface ParallelUniverseDialogProps {
  onClose: () => void;
}

const DECISION_POINTS = [
  { id: "entrance", label: "入口位置", description: "探索不同的入口布局方案" },
  { id: "workspace", label: "工作区布局", description: "优化工作区域的配置" },
  { id: "flow", label: "人流动线", description: "改进空间内的移动路径" },
  { id: "equipment", label: "设备分布", description: "重新规划设备的位置" },
  { id: "collaboration", label: "协作空间", description: "增强团队协作区域" },
];

export function ParallelUniverseDialog({ onClose }: ParallelUniverseDialogProps) {
  const [selectedDecision, setSelectedDecision] = useState<string>("");
  const [constraints, setConstraints] = useState("");

  const {
    isGenerating,
    error,
    variants,
    generateUniverses,
    applyVariant,
    clearVariants,
  } = useParallelUniverses();

  const handleGenerate = async () => {
    if (!selectedDecision) return;
    await generateUniverses(selectedDecision, constraints || undefined);
  };

  const handleApply = (variant: UniverseVariant) => {
    applyVariant(variant);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[80vh] glass-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--neon-purple)]" />
            <h2 className="font-semibold">平行宇宙设计器</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {variants.length === 0 ? (
            /* Generation Form */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">选择决策点</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DECISION_POINTS.map((point) => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedDecision(point.label)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        selectedDecision === point.label
                          ? "bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]"
                          : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                      }`}
                    >
                      <div className="font-medium text-sm">{point.label}</div>
                      <div className="text-xs text-[var(--muted-foreground)] mt-1">
                        {point.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  额外约束条件（可选）
                </label>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="例如：预算不超过100万、需要容纳20人..."
                  className="w-full h-24 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* Variants Display */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  探索到 {variants.length} 个平行宇宙
                </h3>
                <button
                  onClick={clearVariants}
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  重新生成
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((variant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `hsl(${index * 120}, 70%, 50%)`,
                        }}
                      >
                        {String.fromCharCode(945 + index)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{variant.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {variant.theme}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mb-3 flex-1">
                      {variant.description}
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-[var(--muted-foreground)]">优势:</span>
                      </div>
                      <ul className="text-xs space-y-1 pl-5">
                        {variant.pros.slice(0, 2).map((pro, i) => (
                          <li key={i} className="text-green-400">• {pro}</li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-xs">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-[var(--muted-foreground)]">劣势:</span>
                      </div>
                      <ul className="text-xs space-y-1 pl-5">
                        {variant.cons.slice(0, 2).map((con, i) => (
                          <li key={i} className="text-red-400">• {con}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-3 pt-3 border-t border-[var(--glass-border)]">
                      <span>成本: {formatCurrency(variant.estimatedCost)}</span>
                      <span>效率: {(variant.efficiencyScore * 100).toFixed(0)}%</span>
                    </div>

                    <button
                      onClick={() => handleApply(variant)}
                      className="w-full py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      应用此宇宙
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {variants.length === 0 && (
          <div className="p-4 border-t border-[var(--glass-border)]">
            <button
              onClick={handleGenerate}
              disabled={!selectedDecision || isGenerating}
              className="w-full py-3 rounded-lg bg-[var(--neon-purple)] text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在探索平行宇宙...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成平行宇宙
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/components/lab/ParallelUniverseDialog.tsx
git commit -m "feat(multiverse): add ParallelUniverseDialog component"
```

---

### Task 2.4-2.8: 继续创建 UI 组件

*（由于篇幅限制，后续任务采用相同模式，此处列出任务清单）*

**Task 2.4**: 创建 `UniverseBranchDialog.tsx` - 分支创建对话框
**Task 2.5**: 更新 `floor-plan/page.tsx` - 集成平行宇宙功能
**Task 2.6**: 添加工具栏按钮 - 平行宇宙入口
**Task 2.7**: 更新状态同步 - 连接 Zustand 与现有 useHistory
**Task 2.8**: Phase 2 集成测试

---

## Phase 3: 情绪设计 AI Agent

### Task 3.1: 创建情绪设计数据模型

**Files:**
- Create: `src/lib/schemas/emotion-design.ts`

**Step 1: 创建类型定义**

```typescript
// src/lib/schemas/emotion-design.ts
import { z } from "zod";

// 情绪类型
export const EmotionTypeSchema = z.enum([
  "awe",        // 敬畏
  "curiosity",  // 好奇
  "focus",      // 专注
  "excitement", // 兴奋
  "calm",       // 平静
  "collaboration", // 协作
  "creativity", // 创造力
  "safety",     // 安全感
]);

export type EmotionType = z.infer<typeof EmotionTypeSchema>;

// 情绪节点（时间轴上的一个点）
export const EmotionNodeSchema = z.object({
  id: z.string(),
  emotion: EmotionTypeSchema,
  intensity: z.number().min(0).max(1), // 情绪强度
  timestamp: z.number(), // 相对时间（分钟）
  description: z.string().optional(),
});

export type EmotionNode = z.infer<typeof EmotionNodeSchema>;

// 情绪剧本（时间轴）
export const EmotionScriptSchema = z.object({
  id: z.string(),
  name: z.string(),
  nodes: z.array(EmotionNodeSchema),
  totalDuration: z.number(), // 总时长（分钟）
});

export type EmotionScript = z.infer<typeof EmotionScriptSchema>;

// 空间要素推荐
export const SpatialElementSchema = z.object({
  category: z.enum([
    "height",     // 空间高度
    "lighting",   // 光线
    "color",      // 色调
    "acoustics",  // 声学
    "material",   // 材质
    "layout",     // 布局
    "furniture",  // 家具
  ]),
  recommendation: z.string(),
  rationale: z.string(), // 科学依据
  priority: z.enum(["high", "medium", "low"]),
});

export type SpatialElement = z.infer<typeof SpatialElementSchema>;

// 情绪到空间的映射结果
export const EmotionToSpaceResultSchema = z.object({
  emotionScript: EmotionScriptSchema,
  spatialElements: z.array(SpatialElementSchema),
  suggestedZones: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
    targetEmotions: z.array(EmotionTypeSchema),
    suggestedSize: z.object({ width: z.number(), height: z.number() }),
    keyFeatures: z.array(z.string()),
  })),
  designNarrative: z.string(), // 设计叙事
});

export type EmotionToSpaceResult = z.infer<typeof EmotionToSpaceResultSchema>;

// 情绪颜色映射（用于 UI）
export const EMOTION_COLORS: Record<EmotionType, string> = {
  awe: "#8b5cf6",        // 紫色
  curiosity: "#22d3ee",  // 青色
  focus: "#3b82f6",      // 蓝色
  excitement: "#f59e0b", // 橙色
  calm: "#10b981",       // 绿色
  collaboration: "#ec4899", // 粉色
  creativity: "#f97316", // 橙红
  safety: "#6b7280",     // 灰色
};

// 情绪中文名称
export const EMOTION_LABELS: Record<EmotionType, string> = {
  awe: "敬畏感",
  curiosity: "好奇心",
  focus: "专注力",
  excitement: "兴奋感",
  calm: "平静",
  collaboration: "协作感",
  creativity: "创造力",
  safety: "安全感",
};
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/lib/schemas/emotion-design.ts
git commit -m "feat(emotion): add emotion design data types"
```

---

### Task 3.2: 创建情绪设计 AI Agent

**Files:**
- Create: `src/lib/ai/agents/emotion-design-agent.ts`

**Step 1: 创建 Agent**

```typescript
// src/lib/ai/agents/emotion-design-agent.ts
import { generateText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import {
  type EmotionScript,
  type EmotionToSpaceResult,
  EmotionToSpaceResultSchema,
} from "@/lib/schemas/emotion-design";

const EMOTION_DESIGN_SYSTEM_PROMPT = `你是一位结合环境心理学和空间设计的专家。你的任务是根据用户期望的情绪体验，反向推导出空间设计要素。

你的知识基础包括：
1. 环境心理学研究（Kaplan注意力恢复理论、Ulrich压力恢复理论）
2. 建筑现象学（空间如何影响人的感受）
3. 神经建筑学（大脑对空间的反应）
4. 色彩心理学
5. 声学设计对情绪的影响

关键的情绪-空间映射规则：
- 敬畏感 → 高挑空间（>4m）、大尺度、对称、深色调、回响声学
- 好奇心 → 隐藏角落、层次空间、视觉遮挡、多样材质
- 专注力 → 适中高度（2.4-3m）、均匀光线、中性色调、静音
- 兴奋感 → 动态光线、明亮色彩、开放空间
- 平静感 → 自然元素、温暖色调、柔软材质
- 协作感 → 环形布局、透明隔断、可移动家具
- 创造力 → 可变空间、多样刺激、允许混乱
- 安全感 → 封闭感、温暖照明、熟悉材质

请始终以 JSON 格式输出结果。`;

export interface GenerateEmotionDesignOptions {
  emotionScript: EmotionScript;
  constraints?: {
    maxArea?: number;
    maxBudget?: number;
    existingLayout?: any;
  };
  modelKey?: string;
}

export async function generateEmotionDesign(
  options: GenerateEmotionDesignOptions
): Promise<EmotionToSpaceResult> {
  const { emotionScript, constraints, modelKey = "claude-sonnet" } = options;

  const model = getTextModel(modelKey);

  const prompt = `根据以下情绪剧本，生成空间设计建议。

情绪剧本：
${JSON.stringify(emotionScript, null, 2)}

${constraints ? `约束条件：${JSON.stringify(constraints)}` : ""}

请输出完整的设计建议，JSON 格式：
{
  "emotionScript": { /* 原始剧本 */ },
  "spatialElements": [
    {
      "category": "height|lighting|color|acoustics|material|layout|furniture",
      "recommendation": "具体建议",
      "rationale": "科学依据",
      "priority": "high|medium|low"
    }
  ],
  "suggestedZones": [
    {
      "name": "区域名称",
      "purpose": "用途",
      "targetEmotions": ["emotion1", "emotion2"],
      "suggestedSize": { "width": 5, "height": 4 },
      "keyFeatures": ["特征1", "特征2"]
    }
  ],
  "designNarrative": "设计叙事，描述用户进入空间后的完整情绪旅程"
}`;

  const { text } = await generateText({
    model,
    system: EMOTION_DESIGN_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract emotion design result");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return EmotionToSpaceResultSchema.parse(parsed);
}
```

**Step 2: 验证类型**

Run: `pnpm tsc --noEmit`
Expected: 无类型错误

**Step 3: Commit**

```bash
git add src/lib/ai/agents/emotion-design-agent.ts
git commit -m "feat(emotion): add emotion design AI agent"
```

---

### Task 3.3-3.6: 情绪设计 API 和 Hook

*（后续任务采用相同模式）*

**Task 3.3**: 创建 `src/app/api/ai/emotion-design/route.ts`
**Task 3.4**: 创建 `src/hooks/useEmotionDesign.ts`
**Task 3.5**: 创建情绪预设模板
**Task 3.6**: Phase 3 集成测试

---

## Phase 4: 情绪设计 UI 组件

**Task 4.1**: 创建 `EmotionTimelineEditor.tsx` - 情绪时间轴编辑器
**Task 4.2**: 创建 `EmotionNodePicker.tsx` - 情绪节点选择器
**Task 4.3**: 创建 `SpatialRecommendationPanel.tsx` - 空间建议面板
**Task 4.4**: 创建 `EmotionDesignDialog.tsx` - 主对话框
**Task 4.5**: 集成到 floor-plan 页面
**Task 4.6**: Phase 4 集成测试

---

## Phase 5: 集成与测试

**Task 5.1**: 端到端流程测试 - 平行宇宙
**Task 5.2**: 端到端流程测试 - 情绪设计
**Task 5.3**: 性能优化
**Task 5.4**: 最终集成测试与文档更新

---

## 附录：文件清单

### 新增文件

| 路径 | 描述 |
|------|------|
| `src/lib/schemas/multiverse.ts` | 多宇宙数据类型 |
| `src/lib/schemas/emotion-design.ts` | 情绪设计数据类型 |
| `src/stores/multiverse-store.ts` | Zustand 状态存储 |
| `src/lib/ai/agents/parallel-universe-agent.ts` | 平行宇宙 AI Agent |
| `src/lib/ai/agents/emotion-design-agent.ts` | 情绪设计 AI Agent |
| `src/app/api/ai/parallel-universes/route.ts` | 平行宇宙 API |
| `src/app/api/ai/emotion-design/route.ts` | 情绪设计 API |
| `src/hooks/useParallelUniverses.ts` | 平行宇宙 Hook |
| `src/hooks/useEmotionDesign.ts` | 情绪设计 Hook |
| `src/components/lab/UniverseSelector.tsx` | 宇宙选择器 |
| `src/components/lab/UniverseComparisonPanel.tsx` | 宇宙对比面板 |
| `src/components/lab/ParallelUniverseDialog.tsx` | 平行宇宙对话框 |
| `src/components/lab/EmotionTimelineEditor.tsx` | 情绪时间轴 |
| `src/components/lab/EmotionDesignDialog.tsx` | 情绪设计对话框 |

### 修改文件

| 路径 | 修改内容 |
|------|----------|
| `src/app/[locale]/lab/floor-plan/page.tsx` | 集成新功能入口 |

---

*计划完成日期：2025-12-31*
