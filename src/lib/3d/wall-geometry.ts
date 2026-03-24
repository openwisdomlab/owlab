/**
 * Wall Geometry Generator — creates wall meshes from layout data.
 * Generates perimeter walls and zone partition walls with door openings.
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";

export interface WallSegment {
  id: string;
  start: { x: number; z: number };
  end: { x: number; z: number };
  height: number;
  thickness: number;
  hasDoor: boolean;
  doorWidth?: number;
  doorHeight?: number;
  color: string;
}

export interface WallGeometryResult {
  perimeterWalls: WallSegment[];
  partitionWalls: WallSegment[];
}

const WALL_HEIGHT = 3.0;        // meters
const WALL_THICKNESS = 0.15;    // meters
const DOOR_WIDTH = 1.0;         // meters
const DOOR_HEIGHT = 2.1;        // meters
const GRID_SCALE = 1;           // 1 unit = 1 meter

/**
 * Generate wall geometry from layout data.
 * Creates perimeter walls around the layout boundary and
 * partition walls between zones that share edges.
 */
export function generateWalls(layout: LayoutData): WallGeometryResult {
  const { width, height } = layout.dimensions;
  const w = width * GRID_SCALE;
  const h = height * GRID_SCALE;

  // Perimeter walls (4 sides)
  const perimeterWalls: WallSegment[] = [
    { id: "wall-north", start: { x: 0, z: 0 }, end: { x: w, z: 0 }, height: WALL_HEIGHT, thickness: WALL_THICKNESS, hasDoor: true, doorWidth: DOOR_WIDTH, doorHeight: DOOR_HEIGHT, color: "#e5e7eb" },
    { id: "wall-south", start: { x: 0, z: h }, end: { x: w, z: h }, height: WALL_HEIGHT, thickness: WALL_THICKNESS, hasDoor: false, color: "#e5e7eb" },
    { id: "wall-west", start: { x: 0, z: 0 }, end: { x: 0, z: h }, height: WALL_HEIGHT, thickness: WALL_THICKNESS, hasDoor: false, color: "#e5e7eb" },
    { id: "wall-east", start: { x: w, z: 0 }, end: { x: w, z: h }, height: WALL_HEIGHT, thickness: WALL_THICKNESS, hasDoor: false, color: "#e5e7eb" },
  ];

  // Partition walls between adjacent zones
  const partitionWalls: WallSegment[] = [];
  const zones = layout.zones;

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const wall = generatePartitionWall(zones[i], zones[j]);
      if (wall) partitionWalls.push(wall);
    }
  }

  return { perimeterWalls, partitionWalls };
}

function generatePartitionWall(a: ZoneData, b: ZoneData): WallSegment | null {
  // Check if zones share a horizontal edge
  const aRight = a.position.x + a.size.width;
  const bRight = b.position.x + b.size.width;
  const aBottom = a.position.y + a.size.height;
  const bBottom = b.position.y + b.size.height;

  // Shared vertical edge (a's right = b's left or vice versa)
  if (Math.abs(aRight - b.position.x) < 0.3) {
    const overlapStart = Math.max(a.position.y, b.position.y);
    const overlapEnd = Math.min(aBottom, bBottom);
    if (overlapEnd > overlapStart) {
      return {
        id: `partition-${a.id}-${b.id}`,
        start: { x: aRight * GRID_SCALE, z: overlapStart * GRID_SCALE },
        end: { x: aRight * GRID_SCALE, z: overlapEnd * GRID_SCALE },
        height: WALL_HEIGHT,
        thickness: WALL_THICKNESS * 0.6,
        hasDoor: true,
        doorWidth: DOOR_WIDTH,
        doorHeight: DOOR_HEIGHT,
        color: "#d1d5db",
      };
    }
  }

  if (Math.abs(bRight - a.position.x) < 0.3) {
    const overlapStart = Math.max(a.position.y, b.position.y);
    const overlapEnd = Math.min(aBottom, bBottom);
    if (overlapEnd > overlapStart) {
      return {
        id: `partition-${b.id}-${a.id}`,
        start: { x: a.position.x * GRID_SCALE, z: overlapStart * GRID_SCALE },
        end: { x: a.position.x * GRID_SCALE, z: overlapEnd * GRID_SCALE },
        height: WALL_HEIGHT,
        thickness: WALL_THICKNESS * 0.6,
        hasDoor: true,
        doorWidth: DOOR_WIDTH,
        doorHeight: DOOR_HEIGHT,
        color: "#d1d5db",
      };
    }
  }

  // Shared horizontal edge
  if (Math.abs(aBottom - b.position.y) < 0.3) {
    const overlapStart = Math.max(a.position.x, b.position.x);
    const overlapEnd = Math.min(aRight, bRight);
    if (overlapEnd > overlapStart) {
      return {
        id: `partition-${a.id}-${b.id}-h`,
        start: { x: overlapStart * GRID_SCALE, z: aBottom * GRID_SCALE },
        end: { x: overlapEnd * GRID_SCALE, z: aBottom * GRID_SCALE },
        height: WALL_HEIGHT,
        thickness: WALL_THICKNESS * 0.6,
        hasDoor: true,
        doorWidth: DOOR_WIDTH,
        doorHeight: DOOR_HEIGHT,
        color: "#d1d5db",
      };
    }
  }

  if (Math.abs(bBottom - a.position.y) < 0.3) {
    const overlapStart = Math.max(a.position.x, b.position.x);
    const overlapEnd = Math.min(aRight, bRight);
    if (overlapEnd > overlapStart) {
      return {
        id: `partition-${b.id}-${a.id}-h`,
        start: { x: overlapStart * GRID_SCALE, z: a.position.y * GRID_SCALE },
        end: { x: overlapEnd * GRID_SCALE, z: a.position.y * GRID_SCALE },
        height: WALL_HEIGHT,
        thickness: WALL_THICKNESS * 0.6,
        hasDoor: true,
        doorWidth: DOOR_WIDTH,
        doorHeight: DOOR_HEIGHT,
        color: "#d1d5db",
      };
    }
  }

  return null;
}
