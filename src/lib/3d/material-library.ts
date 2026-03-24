/**
 * Material Library — PBR material presets for 3D lab visualization.
 * Returns Three.js material parameters (not actual Three.js objects,
 * so this module works in both server and client contexts).
 */

export interface MaterialParams {
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
  transparent: boolean;
  emissive?: string;
  emissiveIntensity?: number;
}

export type MaterialType =
  | "concrete-floor"
  | "tile-floor"
  | "epoxy-floor"
  | "wall-paint"
  | "glass"
  | "glass-partition"
  | "metal"
  | "brushed-metal"
  | "wood-light"
  | "wood-dark"
  | "plastic-white"
  | "plastic-dark"
  | "fabric"
  | "ceiling-tile"
  | "rubber-mat";

export const MATERIALS: Record<MaterialType, MaterialParams> = {
  "concrete-floor": { color: "#c4c4c4", roughness: 0.8, metalness: 0.0, opacity: 1, transparent: false },
  "tile-floor": { color: "#e8e8e8", roughness: 0.4, metalness: 0.0, opacity: 1, transparent: false },
  "epoxy-floor": { color: "#d4dce4", roughness: 0.2, metalness: 0.1, opacity: 1, transparent: false },
  "wall-paint": { color: "#f5f5f5", roughness: 0.6, metalness: 0.0, opacity: 1, transparent: false },
  "glass": { color: "#e0f2fe", roughness: 0.05, metalness: 0.1, opacity: 0.3, transparent: true },
  "glass-partition": { color: "#e0f2fe", roughness: 0.1, metalness: 0.0, opacity: 0.4, transparent: true },
  "metal": { color: "#b0b0b0", roughness: 0.3, metalness: 0.8, opacity: 1, transparent: false },
  "brushed-metal": { color: "#d0d0d0", roughness: 0.4, metalness: 0.9, opacity: 1, transparent: false },
  "wood-light": { color: "#c4a882", roughness: 0.6, metalness: 0.0, opacity: 1, transparent: false },
  "wood-dark": { color: "#6b4c3b", roughness: 0.5, metalness: 0.0, opacity: 1, transparent: false },
  "plastic-white": { color: "#f0f0f0", roughness: 0.4, metalness: 0.0, opacity: 1, transparent: false },
  "plastic-dark": { color: "#2d2d2d", roughness: 0.3, metalness: 0.1, opacity: 1, transparent: false },
  "fabric": { color: "#4a4a5a", roughness: 0.9, metalness: 0.0, opacity: 1, transparent: false },
  "ceiling-tile": { color: "#fafafa", roughness: 0.7, metalness: 0.0, opacity: 1, transparent: false },
  "rubber-mat": { color: "#2a2a2a", roughness: 0.95, metalness: 0.0, opacity: 1, transparent: false },
};

/** Get material params for an equipment material type */
export function getMaterialForEquipment(materialType: string): MaterialParams {
  const mapping: Record<string, MaterialType> = {
    metal: "metal",
    wood: "wood-light",
    glass: "glass",
    plastic: "plastic-dark",
    fabric: "fabric",
  };
  return MATERIALS[mapping[materialType] || "plastic-dark"];
}

/** Get floor material for a zone type */
export function getFloorMaterial(zoneType: string): MaterialParams {
  const mapping: Record<string, MaterialType> = {
    compute: "rubber-mat",
    workspace: "tile-floor",
    meeting: "tile-floor",
    storage: "concrete-floor",
    utility: "concrete-floor",
    entrance: "tile-floor",
    lab: "epoxy-floor",
    biosafety: "epoxy-floor",
    "pcr-isolation": "epoxy-floor",
    "clean-room": "epoxy-floor",
    "chemical-storage": "epoxy-floor",
    "waste-handling": "epoxy-floor",
    makerspace: "concrete-floor",
    prototyping: "concrete-floor",
    testing: "epoxy-floor",
    observation: "tile-floor",
    break: "tile-floor",
    "changing-room": "tile-floor",
    airlock: "epoxy-floor",
    simulation: "rubber-mat",
  };
  return MATERIALS[mapping[zoneType] || "tile-floor"];
}
