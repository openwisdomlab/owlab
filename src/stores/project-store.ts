/**
 * Project Store — manages the full lab project lifecycle.
 */
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type {
  ProjectPhase,
  ProcurementItem,
  ConstructionTask,
  AcceptanceCheck,
  Milestone,
  Project,
} from "@/lib/schemas/project-lifecycle";
import { PROJECT_PHASES } from "@/lib/schemas/project-lifecycle";

interface ProjectState {
  // Current project
  project: Project | null;

  // Actions - Project
  createProject: (name: string, description?: string) => void;
  setPhase: (phase: ProjectPhase) => void;
  nextPhase: () => void;
  canAdvancePhase: () => boolean;

  // Procurement
  addProcurementItem: (item: Omit<ProcurementItem, "id" | "status">) => void;
  updateProcurementItem: (id: string, updates: Partial<ProcurementItem>) => void;
  removeProcurementItem: (id: string) => void;
  getProcurementSummary: () => { total: number; ordered: number; received: number; totalCost: number };

  // Construction
  addConstructionTask: (task: Omit<ConstructionTask, "id" | "status">) => void;
  updateConstructionTask: (id: string, updates: Partial<ConstructionTask>) => void;
  removeConstructionTask: (id: string) => void;
  getConstructionProgress: () => { total: number; completed: number; blocked: number; percent: number };

  // Acceptance
  addAcceptanceCheck: (check: Omit<AcceptanceCheck, "id" | "status">) => void;
  updateAcceptanceCheck: (id: string, updates: Partial<AcceptanceCheck>) => void;
  getAcceptanceResult: () => { total: number; passed: number; failed: number; pending: number; passRate: number };

  // Milestones
  addMilestone: (milestone: Omit<Milestone, "id" | "status">) => void;
  updateMilestone: (id: string, updates: Partial<Milestone>) => void;

  // Reset
  reset: () => void;
}

const now = () => new Date().toISOString();

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,

  createProject: (name, description) => set({
    project: {
      id: uuidv4(),
      name,
      description,
      currentPhase: "research",
      createdAt: now(),
      updatedAt: now(),
      milestones: [],
      procurementItems: [],
      constructionTasks: [],
      acceptanceChecks: [],
    },
  }),

  setPhase: (phase) => set((s) => s.project ? {
    project: { ...s.project, currentPhase: phase, updatedAt: now() },
  } : {}),

  nextPhase: () => {
    const { project } = get();
    if (!project) return;
    const idx = PROJECT_PHASES.indexOf(project.currentPhase);
    if (idx === -1 || idx >= PROJECT_PHASES.length - 1) return;
    set({ project: { ...project, currentPhase: PROJECT_PHASES[idx + 1], updatedAt: now() } });
  },

  canAdvancePhase: () => {
    const { project } = get();
    if (!project) return false;
    const idx = PROJECT_PHASES.indexOf(project.currentPhase);
    return idx < PROJECT_PHASES.length - 1;
  },

  // Procurement
  addProcurementItem: (item) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      procurementItems: [...s.project.procurementItems, { ...item, id: uuidv4(), status: "pending" }],
    },
  } : {}),

  updateProcurementItem: (id, updates) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      procurementItems: s.project.procurementItems.map(i => i.id === id ? { ...i, ...updates } : i),
    },
  } : {}),

  removeProcurementItem: (id) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      procurementItems: s.project.procurementItems.filter(i => i.id !== id),
    },
  } : {}),

  getProcurementSummary: () => {
    const items = get().project?.procurementItems || [];
    return {
      total: items.length,
      ordered: items.filter(i => i.status !== "pending").length,
      received: items.filter(i => ["received", "installed"].includes(i.status)).length,
      totalCost: items.reduce((sum, i) => sum + i.totalPrice, 0),
    };
  },

  // Construction
  addConstructionTask: (task) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      constructionTasks: [...s.project.constructionTasks, { ...task, id: uuidv4(), status: "pending" }],
    },
  } : {}),

  updateConstructionTask: (id, updates) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      constructionTasks: s.project.constructionTasks.map(t => t.id === id ? { ...t, ...updates } : t),
    },
  } : {}),

  removeConstructionTask: (id) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      constructionTasks: s.project.constructionTasks.filter(t => t.id !== id),
    },
  } : {}),

  getConstructionProgress: () => {
    const tasks = get().project?.constructionTasks || [];
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const blocked = tasks.filter(t => t.status === "blocked").length;
    return { total, completed, blocked, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  },

  // Acceptance
  addAcceptanceCheck: (check) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      acceptanceChecks: [...s.project.acceptanceChecks, { ...check, id: uuidv4(), status: "pending" }],
    },
  } : {}),

  updateAcceptanceCheck: (id, updates) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      acceptanceChecks: s.project.acceptanceChecks.map(c => c.id === id ? { ...c, ...updates } : c),
    },
  } : {}),

  getAcceptanceResult: () => {
    const checks = get().project?.acceptanceChecks || [];
    const total = checks.length;
    const passed = checks.filter(c => c.status === "pass").length;
    const failed = checks.filter(c => c.status === "fail").length;
    const pending = checks.filter(c => c.status === "pending").length;
    return { total, passed, failed, pending, passRate: total > 0 ? Math.round((passed / total) * 100) : 0 };
  },

  // Milestones
  addMilestone: (milestone) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      milestones: [...s.project.milestones, { ...milestone, id: uuidv4(), status: "pending" }],
    },
  } : {}),

  updateMilestone: (id, updates) => set((s) => s.project ? {
    project: {
      ...s.project,
      updatedAt: now(),
      milestones: s.project.milestones.map(m => m.id === id ? { ...m, ...updates } : m),
    },
  } : {}),

  reset: () => set({ project: null }),
}));
