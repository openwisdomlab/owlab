/**
 * Shared zone type definitions for the lab editor.
 * Single source of truth — all components import from here.
 */

/**
 * All supported zone types grouped by category.
 */
export const ZONE_TYPE_CATEGORIES = {
  core: ["compute", "workspace", "meeting", "storage", "utility", "entrance"],
  lab: ["lab", "biosafety", "pcr-isolation", "clean-room", "chemical-storage", "waste-handling"],
  maker: ["makerspace", "prototyping", "testing", "observation"],
  support: ["break", "changing-room", "airlock", "simulation"],
} as const;

/**
 * Flat array of all zone types (used for Zod enum).
 */
export const ZONE_TYPES = [
  // Core
  "compute",
  "workspace",
  "meeting",
  "storage",
  "utility",
  "entrance",
  // Lab-specific
  "lab",
  "biosafety",
  "pcr-isolation",
  "clean-room",
  "chemical-storage",
  "waste-handling",
  // Maker-specific
  "makerspace",
  "prototyping",
  "testing",
  "observation",
  // Support
  "break",
  "changing-room",
  "airlock",
  "simulation",
] as const;

export type ZoneType = (typeof ZONE_TYPES)[number];

/**
 * Default colors for every zone type.
 */
export const ZONE_COLORS: Record<ZoneType, string> = {
  // Core
  compute: "#22d3ee",
  workspace: "#8b5cf6",
  meeting: "#10b981",
  storage: "#f59e0b",
  utility: "#6b7280",
  entrance: "#ec4899",
  // Lab-specific
  lab: "#3b82f6",
  biosafety: "#ef4444",
  "pcr-isolation": "#f97316",
  "clean-room": "#06b6d4",
  "chemical-storage": "#dc2626",
  "waste-handling": "#a3a3a3",
  // Maker-specific
  makerspace: "#a855f7",
  prototyping: "#14b8a6",
  testing: "#eab308",
  observation: "#64748b",
  // Support
  break: "#f472b6",
  "changing-room": "#a78bfa",
  airlock: "#94a3b8",
  simulation: "#2dd4bf",
};

/**
 * Human-readable labels (Chinese).
 */
export const ZONE_LABELS: Record<ZoneType, string> = {
  compute: "计算区",
  workspace: "工作区",
  meeting: "会议区",
  storage: "储存区",
  utility: "设备区",
  entrance: "入口",
  lab: "实验区",
  biosafety: "生物安全区",
  "pcr-isolation": "PCR 隔离区",
  "clean-room": "洁净室",
  "chemical-storage": "化学品储存",
  "waste-handling": "废物处理区",
  makerspace: "创客空间",
  prototyping: "原型制作区",
  testing: "测试区",
  observation: "观察区",
  break: "休息区",
  "changing-room": "更衣室",
  airlock: "气闸室",
  simulation: "仿真区",
};

/**
 * Light score config per zone type (for LightingSimulation).
 */
export const ZONE_LIGHT_SCORES: Record<ZoneType, { score: number; warmth: "warm" | "cool" }> = {
  compute: { score: 0.7, warmth: "cool" },
  workspace: { score: 0.85, warmth: "warm" },
  meeting: { score: 0.75, warmth: "warm" },
  storage: { score: 0.3, warmth: "cool" },
  utility: { score: 0.4, warmth: "cool" },
  entrance: { score: 0.6, warmth: "cool" },
  lab: { score: 0.8, warmth: "cool" },
  biosafety: { score: 0.75, warmth: "cool" },
  "pcr-isolation": { score: 0.7, warmth: "cool" },
  "clean-room": { score: 0.85, warmth: "cool" },
  "chemical-storage": { score: 0.4, warmth: "cool" },
  "waste-handling": { score: 0.35, warmth: "cool" },
  makerspace: { score: 0.8, warmth: "warm" },
  prototyping: { score: 0.8, warmth: "warm" },
  testing: { score: 0.75, warmth: "cool" },
  observation: { score: 0.7, warmth: "warm" },
  break: { score: 0.6, warmth: "warm" },
  "changing-room": { score: 0.5, warmth: "warm" },
  airlock: { score: 0.4, warmth: "cool" },
  simulation: { score: 0.7, warmth: "cool" },
};

/**
 * Psychological safety weight adjustments by zone type.
 */
export const ZONE_PSYCH_SAFETY_WEIGHTS: Record<string, Record<string, number>> = {
  workspace: { learner: 0.25, restorative: 0.20 },
  meeting: { contributor: 0.25, challenger: 0.20, privacy: 0.15 },
  compute: { learner: 0.25, privacy: 0.15 },
  entrance: { inclusion: 0.35 },
  storage: { privacy: 0.20 },
  utility: { privacy: 0.15 },
  lab: { learner: 0.25, privacy: 0.15 },
  biosafety: { privacy: 0.20, learner: 0.20 },
  "pcr-isolation": { privacy: 0.25 },
  "clean-room": { privacy: 0.20, learner: 0.20 },
  "chemical-storage": { privacy: 0.25 },
  "waste-handling": { privacy: 0.20 },
  makerspace: { learner: 0.25, contributor: 0.20, restorative: 0.15 },
  prototyping: { learner: 0.25, contributor: 0.20 },
  testing: { learner: 0.20, privacy: 0.15 },
  observation: { learner: 0.25, inclusion: 0.20 },
  break: { restorative: 0.30, inclusion: 0.20 },
  "changing-room": { privacy: 0.30 },
  airlock: { privacy: 0.20 },
  simulation: { learner: 0.25, contributor: 0.15 },
};

/**
 * Zone collaboration matrix for Allen Curve analysis.
 */
export const ZONE_COLLABORATION_MATRIX: Record<string, Record<string, "high" | "medium" | "low">> = {
  compute: {
    compute: "medium", workspace: "high", meeting: "medium",
    storage: "low", break: "low", entrance: "low", lab: "high",
    makerspace: "medium", prototyping: "medium",
  },
  workspace: {
    compute: "high", workspace: "medium", meeting: "high",
    storage: "low", break: "medium", entrance: "medium", lab: "high",
    makerspace: "high", prototyping: "high",
  },
  meeting: {
    compute: "medium", workspace: "high", meeting: "low",
    storage: "low", break: "medium", entrance: "medium", lab: "medium",
    makerspace: "medium", observation: "medium",
  },
  storage: {
    compute: "low", workspace: "low", meeting: "low",
    storage: "low", break: "low", entrance: "low", lab: "low",
    "chemical-storage": "medium", "waste-handling": "low",
  },
  break: {
    compute: "low", workspace: "medium", meeting: "medium",
    storage: "low", break: "low", entrance: "medium",
    makerspace: "medium", observation: "low",
  },
  entrance: {
    compute: "low", workspace: "medium", meeting: "medium",
    storage: "low", break: "medium", entrance: "low",
    "changing-room": "high", airlock: "high",
  },
  lab: {
    compute: "high", workspace: "high", meeting: "medium",
    storage: "medium", break: "low", entrance: "low",
    biosafety: "medium", "pcr-isolation": "medium", "clean-room": "medium",
    "chemical-storage": "medium", "waste-handling": "low",
  },
  biosafety: {
    lab: "medium", "pcr-isolation": "medium", "clean-room": "medium",
    "chemical-storage": "medium", "waste-handling": "medium",
    airlock: "high", "changing-room": "high",
  },
  makerspace: {
    workspace: "high", meeting: "medium", prototyping: "high",
    testing: "high", storage: "medium", break: "medium",
  },
  prototyping: {
    makerspace: "high", workspace: "high", testing: "high",
    storage: "medium", compute: "medium",
  },
};
