/**
 * Canvas Utility Functions
 */

import type { ZoneData } from "@/lib/ai/agents/layout-agent";

/**
 * Grid snapping threshold (percentage of grid cell)
 */
const SNAP_THRESHOLD = 0.3;

/**
 * Snap a value to the nearest grid unit
 */
export function snapToGrid(value: number, enabled: boolean = true): number {
  if (!enabled) return value;

  const rounded = Math.round(value);
  const diff = Math.abs(value - rounded);
  return diff < SNAP_THRESHOLD ? rounded : value;
}

/**
 * Color schemes for zones
 */
export const COLOR_SCHEMES = {
  neon: {
    compute: "#22d3ee",
    workspace: "#8b5cf6",
    meeting: "#10b981",
    storage: "#f59e0b",
    utility: "#6b7280",
    entrance: "#ec4899",
  },
  pastel: {
    compute: "#93c5fd",
    workspace: "#c4b5fd",
    meeting: "#86efac",
    storage: "#fcd34d",
    utility: "#d1d5db",
    entrance: "#f9a8d4",
  },
  professional: {
    compute: "#3b82f6",
    workspace: "#8b5cf6",
    meeting: "#10b981",
    storage: "#f59e0b",
    utility: "#6b7280",
    entrance: "#ec4899",
  },
  monochrome: {
    compute: "#1f2937",
    workspace: "#374151",
    meeting: "#4b5563",
    storage: "#6b7280",
    utility: "#9ca3af",
    entrance: "#d1d5db",
  },
  vibrant: {
    compute: "#06b6d4",
    workspace: "#a855f7",
    meeting: "#22c55e",
    storage: "#f97316",
    utility: "#64748b",
    entrance: "#ec4899",
  },
};

export type ColorScheme = keyof typeof COLOR_SCHEMES;
export type ZoneType = keyof typeof COLOR_SCHEMES.neon;

/**
 * Get zone color for a specific color scheme
 */
export function getZoneColor(
  zoneType: ZoneType,
  scheme: ColorScheme = "neon"
): string {
  return COLOR_SCHEMES[scheme][zoneType] || COLOR_SCHEMES.neon[zoneType];
}

/**
 * Apply color scheme to all zones
 */
export function applyColorScheme(
  zones: ZoneData[],
  scheme: ColorScheme
): ZoneData[] {
  return zones.map((zone) => ({
    ...zone,
    color: getZoneColor(zone.type as ZoneType, scheme),
  }));
}
