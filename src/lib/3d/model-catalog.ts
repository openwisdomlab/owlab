/**
 * 3D Model Catalog — maps equipment and zone types to procedural 3D model configs.
 * All models are procedurally generated (no external .glb files needed).
 */

export interface ModelConfig {
  type: "box" | "cylinder" | "compound";
  /** Default dimensions in meters */
  width: number;
  depth: number;
  height: number;
  /** Color (hex) */
  color: string;
  /** Optional: child shapes for compound models */
  children?: ModelConfig[];
  /** Offset from parent center */
  offset?: { x: number; y: number; z: number };
  /** Material type */
  material: "metal" | "wood" | "glass" | "plastic" | "fabric";
}

/** Equipment category → default 3D model */
export const EQUIPMENT_MODELS: Record<string, ModelConfig> = {
  // Compute
  "server-rack": { type: "box", width: 0.6, depth: 1.0, height: 2.0, color: "#1a1a2e", material: "metal" },
  "workstation": { type: "box", width: 1.2, depth: 0.6, height: 0.75, color: "#2d2d3d", material: "metal" },
  "monitor": { type: "box", width: 0.6, depth: 0.05, height: 0.35, color: "#0a0a0a", material: "plastic" },

  // Furniture
  "desk": { type: "box", width: 1.4, depth: 0.7, height: 0.75, color: "#8B7355", material: "wood" },
  "lab-bench": { type: "box", width: 1.8, depth: 0.75, height: 0.9, color: "#d4d4d4", material: "metal" },
  "chair": { type: "box", width: 0.5, depth: 0.5, height: 0.45, color: "#333333", material: "fabric" },
  "cabinet": { type: "box", width: 0.8, depth: 0.5, height: 1.8, color: "#9ca3af", material: "metal" },
  "shelving": { type: "box", width: 1.0, depth: 0.4, height: 2.0, color: "#a0a0a0", material: "metal" },

  // Safety
  "fume-hood": { type: "box", width: 1.5, depth: 0.85, height: 2.4, color: "#e5e7eb", material: "metal" },
  "biosafety-cabinet": { type: "box", width: 1.3, depth: 0.78, height: 2.2, color: "#f0f0f0", material: "metal" },
  "fire-extinguisher": { type: "cylinder", width: 0.15, depth: 0.15, height: 0.5, color: "#dc2626", material: "metal" },
  "emergency-shower": { type: "cylinder", width: 0.3, depth: 0.3, height: 2.2, color: "#fbbf24", material: "metal" },

  // Electronics
  "3d-printer": { type: "box", width: 0.5, depth: 0.5, height: 0.5, color: "#374151", material: "plastic" },
  "oscilloscope": { type: "box", width: 0.35, depth: 0.25, height: 0.2, color: "#1f2937", material: "plastic" },

  // Utilities
  "freezer": { type: "box", width: 0.7, depth: 0.75, height: 1.8, color: "#e5e7eb", material: "metal" },
  "incubator": { type: "box", width: 0.6, depth: 0.65, height: 0.8, color: "#d1d5db", material: "metal" },
  "autoclave": { type: "cylinder", width: 0.5, depth: 0.8, height: 0.6, color: "#9ca3af", material: "metal" },
  "centrifuge": { type: "cylinder", width: 0.4, depth: 0.4, height: 0.35, color: "#e5e7eb", material: "metal" },

  // Default
  "default": { type: "box", width: 0.5, depth: 0.5, height: 0.5, color: "#6b7280", material: "plastic" },
};

/** Get model config for an equipment name (fuzzy match) */
export function getEquipmentModel(equipmentName: string): ModelConfig {
  const lower = equipmentName.toLowerCase();

  // Direct match
  if (EQUIPMENT_MODELS[lower]) return EQUIPMENT_MODELS[lower];

  // Fuzzy match by keywords
  for (const [key, model] of Object.entries(EQUIPMENT_MODELS)) {
    if (lower.includes(key) || key.includes(lower)) return model;
  }

  // Category-based fallback
  if (lower.includes("server") || lower.includes("gpu") || lower.includes("rack")) return EQUIPMENT_MODELS["server-rack"];
  if (lower.includes("desk") || lower.includes("bench") || lower.includes("table")) return EQUIPMENT_MODELS["desk"];
  if (lower.includes("chair") || lower.includes("seat")) return EQUIPMENT_MODELS["chair"];
  if (lower.includes("cabinet") || lower.includes("storage")) return EQUIPMENT_MODELS["cabinet"];
  if (lower.includes("hood") || lower.includes("fume")) return EQUIPMENT_MODELS["fume-hood"];
  if (lower.includes("freezer") || lower.includes("fridge") || lower.includes("\u51B0\u7BB1")) return EQUIPMENT_MODELS["freezer"];
  if (lower.includes("printer") || lower.includes("3d")) return EQUIPMENT_MODELS["3d-printer"];
  if (lower.includes("monitor") || lower.includes("display") || lower.includes("\u663E\u793A")) return EQUIPMENT_MODELS["monitor"];

  return EQUIPMENT_MODELS["default"];
}
