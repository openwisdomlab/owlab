import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Dimension = "enlighten" | "empower" | "engage";
export type ModuleId =
  | "M01"
  | "M02"
  | "M03"
  | "M04"
  | "M05"
  | "M06"
  | "M07"
  | "M08"
  | "M09";

// Which modules belong to which 3E deck
export const DECK_MODULES: Record<Dimension, ModuleId[]> = {
  enlighten: ["M01", "M02", "M03"],
  empower: ["M04", "M05", "M06"],
  engage: ["M07", "M08", "M09"],
};

// All module IDs
export const ALL_MODULES: ModuleId[] = [
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
];

// Progress per module per dimension (0-100)
export type ModuleProgress = Record<ModuleId, Record<Dimension, number>>;

function createEmptyProgress(): ModuleProgress {
  const progress = {} as ModuleProgress;
  for (const mod of ALL_MODULES) {
    progress[mod] = { enlighten: 0, empower: 0, engage: 0 };
  }
  return progress;
}

interface LearningProgressState {
  // State
  moduleProgress: ModuleProgress;
  lastUpdated: number;

  // Actions
  markProgress: (moduleId: ModuleId, dimension: Dimension, amount: number) => void;
  setModuleProgress: (
    moduleId: ModuleId,
    dimension: Dimension,
    value: number
  ) => void;
  resetProgress: () => void;
  importChecklistProgress: (checklistId: string, completed: number, total: number) => void;

  // Computed selectors
  getDimensionProgress: (dimension: Dimension) => number;
  getModuleTotalProgress: (moduleId: ModuleId) => number;
  getOverallProgress: () => number;
  getRadarData: () => { enlighten: number; empower: number; engage: number };
}

export const useLearningProgressStore = create<LearningProgressState>()(
  persist(
    (set, get) => ({
      moduleProgress: createEmptyProgress(),
      lastUpdated: Date.now(),

      markProgress: (moduleId, dimension, amount) => {
        set((state) => {
          const current = state.moduleProgress[moduleId][dimension];
          const newValue = Math.min(100, Math.max(0, current + amount));
          return {
            moduleProgress: {
              ...state.moduleProgress,
              [moduleId]: {
                ...state.moduleProgress[moduleId],
                [dimension]: newValue,
              },
            },
            lastUpdated: Date.now(),
          };
        });
      },

      setModuleProgress: (moduleId, dimension, value) => {
        set((state) => ({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              ...state.moduleProgress[moduleId],
              [dimension]: Math.min(100, Math.max(0, value)),
            },
          },
          lastUpdated: Date.now(),
        }));
      },

      resetProgress: () => {
        set({
          moduleProgress: createEmptyProgress(),
          lastUpdated: Date.now(),
        });
      },

      importChecklistProgress: (checklistId, completed, total) => {
        // Map checklist IDs to module+dimension
        // Checklist IDs follow pattern: "m01-core", "m02-extend", etc.
        const match = checklistId.match(/^m(\d{2})/i);
        if (!match) return;
        const moduleId = `M${match[1]}` as ModuleId;
        if (!ALL_MODULES.includes(moduleId)) return;

        // Determine dimension from deck mapping
        let dimension: Dimension = "enlighten";
        for (const [dim, modules] of Object.entries(DECK_MODULES)) {
          if (modules.includes(moduleId)) {
            dimension = dim as Dimension;
            break;
          }
        }

        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        get().setModuleProgress(moduleId, dimension, progress);
      },

      getDimensionProgress: (dimension) => {
        const state = get();
        const modules = DECK_MODULES[dimension];
        if (modules.length === 0) return 0;
        const sum = modules.reduce(
          (acc, mod) => acc + state.moduleProgress[mod][dimension],
          0
        );
        return Math.round(sum / modules.length);
      },

      getModuleTotalProgress: (moduleId) => {
        const state = get();
        const dims = state.moduleProgress[moduleId];
        return Math.round((dims.enlighten + dims.empower + dims.engage) / 3);
      },

      getOverallProgress: () => {
        const state = get();
        let total = 0;
        let count = 0;
        for (const mod of ALL_MODULES) {
          for (const dim of ["enlighten", "empower", "engage"] as Dimension[]) {
            total += state.moduleProgress[mod][dim];
            count++;
          }
        }
        return count > 0 ? Math.round(total / count) : 0;
      },

      getRadarData: () => {
        const state = get();
        return {
          enlighten: state.getDimensionProgress("enlighten"),
          empower: state.getDimensionProgress("empower"),
          engage: state.getDimensionProgress("engage"),
        };
      },
    }),
    {
      name: "owl-learning-progress",
      partialize: (state) => ({
        moduleProgress: state.moduleProgress,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
