/**
 * 3D Preview Utilities
 * Utilities for converting 2D layouts to 3D visualization data
 * Compatible with Three.js / React Three Fiber
 */

import type { ZoneData } from "@/lib/ai/agents/layout-agent";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Zone3D {
  id: string;
  name: string;
  type: string;
  position: Vector3;
  size: Vector3;
  color: string;
  opacity: number;
}

export interface Camera3DSettings {
  position: Vector3;
  target: Vector3;
  fov: number;
}

export interface Light3D {
  type: "ambient" | "directional" | "point";
  position?: Vector3;
  color: string;
  intensity: number;
}

/**
 * Convert 2D zone to 3D representation
 */
export function zoneTo3D(
  zone: ZoneData,
  gridSize: number = 30,
  wallHeight: number = 3
): Zone3D {
  return {
    id: zone.id,
    name: zone.name,
    type: zone.type,
    position: {
      x: zone.position.x * gridSize,
      y: wallHeight / 2, // Center vertically
      z: zone.position.y * gridSize,
    },
    size: {
      x: zone.size.width * gridSize,
      y: wallHeight,
      z: zone.size.height * gridSize,
    },
    color: zone.color,
    opacity: 0.7,
  };
}

/**
 * Convert multiple zones to 3D
 */
export function convertLayoutTo3D(
  zones: ZoneData[],
  gridSize: number = 30,
  wallHeight: number = 3
): Zone3D[] {
  return zones.map((zone) => zoneTo3D(zone, gridSize, wallHeight));
}

/**
 * Calculate optimal camera position for layout
 */
export function calculateCameraPosition(
  zones: Zone3D[],
  layoutWidth: number,
  layoutHeight: number
): Camera3DSettings {
  if (zones.length === 0) {
    return {
      position: { x: 0, y: 50, z: 50 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50,
    };
  }

  // Calculate center of layout
  const centerX = (layoutWidth / 2) * 30; // Assuming gridSize = 30
  const centerZ = (layoutHeight / 2) * 30;

  // Calculate distance to fit all zones
  const maxDimension = Math.max(layoutWidth, layoutHeight) * 30;
  const distance = maxDimension * 1.5;

  return {
    position: {
      x: centerX + distance * 0.5,
      y: distance * 0.7,
      z: centerZ + distance * 0.5,
    },
    target: {
      x: centerX,
      y: 0,
      z: centerZ,
    },
    fov: 50,
  };
}

/**
 * Get default lighting setup
 */
export function getDefaultLighting(): Light3D[] {
  return [
    {
      type: "ambient",
      color: "#ffffff",
      intensity: 0.5,
    },
    {
      type: "directional",
      position: { x: 10, y: 20, z: 10 },
      color: "#ffffff",
      intensity: 0.8,
    },
    {
      type: "point",
      position: { x: -10, y: 15, z: -10 },
      color: "#22d3ee",
      intensity: 0.3,
    },
  ];
}

/**
 * Generate floor grid data
 */
export function generateFloorGrid(
  width: number,
  height: number,
  gridSize: number = 30,
  spacing: number = 1
): { lines: Array<{ start: Vector3; end: Vector3 }> } {
  const lines: Array<{ start: Vector3; end: Vector3 }> = [];

  const widthInUnits = width * gridSize;
  const heightInUnits = height * gridSize;

  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    lines.push({
      start: { x: x * gridSize, y: 0, z: 0 },
      end: { x: x * gridSize, y: 0, z: heightInUnits },
    });
  }

  // Horizontal lines
  for (let z = 0; z <= height; z += spacing) {
    lines.push({
      start: { x: 0, y: 0, z: z * gridSize },
      end: { x: widthInUnits, y: 0, z: z * gridSize },
    });
  }

  return { lines };
}

/**
 * Export 3D scene data for external tools
 */
export interface Scene3DExport {
  zones: Zone3D[];
  camera: Camera3DSettings;
  lighting: Light3D[];
  grid: ReturnType<typeof generateFloorGrid>;
  metadata: {
    gridSize: number;
    wallHeight: number;
    units: string;
  };
}

export function exportScene3D(
  zones: ZoneData[],
  layoutWidth: number,
  layoutHeight: number,
  gridSize: number = 30,
  wallHeight: number = 3,
  unit: string = "m"
): Scene3DExport {
  const zones3D = convertLayoutTo3D(zones, gridSize, wallHeight);

  return {
    zones: zones3D,
    camera: calculateCameraPosition(zones3D, layoutWidth, layoutHeight),
    lighting: getDefaultLighting(),
    grid: generateFloorGrid(layoutWidth, layoutHeight, gridSize),
    metadata: {
      gridSize,
      wallHeight,
      units: unit,
    },
  };
}

/**
 * Calculate bounding box for zones
 */
export function calculateBoundingBox(zones: Zone3D[]): {
  min: Vector3;
  max: Vector3;
  center: Vector3;
  size: Vector3;
} {
  if (zones.length === 0) {
    return {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 0, y: 0, z: 0 },
      center: { x: 0, y: 0, z: 0 },
      size: { x: 0, y: 0, z: 0 },
    };
  }

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  zones.forEach((zone) => {
    const halfX = zone.size.x / 2;
    const halfY = zone.size.y / 2;
    const halfZ = zone.size.z / 2;

    minX = Math.min(minX, zone.position.x - halfX);
    minY = Math.min(minY, zone.position.y - halfY);
    minZ = Math.min(minZ, zone.position.z - halfZ);

    maxX = Math.max(maxX, zone.position.x + halfX);
    maxY = Math.max(maxY, zone.position.y + halfY);
    maxZ = Math.max(maxZ, zone.position.z + halfZ);
  });

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ },
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2,
    },
    size: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
  };
}

/**
 * Generate OBJ file content (simple 3D export format)
 */
export function exportToOBJ(zones: Zone3D[], layoutName: string): string {
  let obj = `# ${layoutName} - 3D Export\n`;
  obj += `# Generated by OWL (Open Wisdom Lab)\n\n`;

  let vertexOffset = 1;

  zones.forEach((zone, zoneIndex) => {
    obj += `\n# Zone: ${zone.name} (${zone.type})\n`;
    obj += `o ${zone.name.replace(/\s+/g, "_")}_${zoneIndex}\n`;

    const { x, y, z } = zone.position;
    const { x: sx, y: sy, z: sz } = zone.size;

    const halfX = sx / 2;
    const halfY = sy / 2;
    const halfZ = sz / 2;

    // Vertices (8 corners of box)
    const vertices = [
      [x - halfX, y - halfY, z - halfZ],
      [x + halfX, y - halfY, z - halfZ],
      [x + halfX, y + halfY, z - halfZ],
      [x - halfX, y + halfY, z - halfZ],
      [x - halfX, y - halfY, z + halfZ],
      [x + halfX, y - halfY, z + halfZ],
      [x + halfX, y + halfY, z + halfZ],
      [x - halfX, y + halfY, z + halfZ],
    ];

    vertices.forEach((v) => {
      obj += `v ${v[0]} ${v[1]} ${v[2]}\n`;
    });

    // Faces (6 faces of box, using vertex indices)
    const faces = [
      [1, 2, 3, 4], // Front
      [5, 8, 7, 6], // Back
      [1, 5, 6, 2], // Bottom
      [4, 3, 7, 8], // Top
      [1, 4, 8, 5], // Left
      [2, 6, 7, 3], // Right
    ];

    faces.forEach((face) => {
      const indices = face.map((i) => i + vertexOffset - 1);
      obj += `f ${indices.join(" ")}\n`;
    });

    vertexOffset += 8;
  });

  return obj;
}

/**
 * Download OBJ file
 */
export function downloadOBJ(objContent: string, filename: string): void {
  const blob = new Blob([objContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".obj") ? filename : `${filename}.obj`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
