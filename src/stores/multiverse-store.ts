// src/stores/multiverse-store.ts
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import {
  type Universe,
  type Multiverse,
  calculateLayoutMetrics,
} from "@/lib/schemas/multiverse";

const MAX_COMPARISON_COUNT = 3;

interface MultiverseState extends Omit<Multiverse, 'universes' | 'comparisonIds'> {
  // State - override schema constraints for store (allow empty arrays)
  universes: Universe[];
  comparisonIds: string[];

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
      layout: structuredClone(source.layout),
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
    const exists = get().universes.some((u) => u.id === id);
    if (exists) {
      set({ activeUniverseId: id });
    }
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
      if (state.comparisonIds.length >= MAX_COMPARISON_COUNT) return state;
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
