/**
 * Alignment Guides Hook
 * Manages alignment guide state for zone dragging
 */

import { useState, useCallback, useMemo } from "react";
import {
  calculateAlignmentGuides,
  type AlignmentGuide,
} from "@/lib/utils/measurements";
import type { ZoneData } from "@/lib/ai/agents/layout-agent";

export interface AlignmentOptions {
  enabled: boolean;
  threshold: number; // Distance in grid units to trigger alignment
  snapToGuides: boolean; // Whether to snap zones to guides
}

export function useAlignmentGuides(
  zones: ZoneData[],
  gridSize: number = 30,
  options: Partial<AlignmentOptions> = {}
) {
  const {
    enabled = true,
    threshold = 5,
    snapToGuides = true,
  } = options;

  const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
  const [draggedZoneId, setDraggedZoneId] = useState<string | null>(null);

  /**
   * Calculate and set alignment guides for a zone being dragged
   */
  const updateGuides = useCallback(
    (zoneId: string, x: number, y: number, width: number, height: number) => {
      if (!enabled) {
        setActiveGuides([]);
        return;
      }

      const otherZones = zones
        .filter((z) => z.id !== zoneId)
        .map((z) => ({
          x: z.position.x,
          y: z.position.y,
          width: z.size.width,
          height: z.size.height,
          name: z.name,
        }));

      const guides = calculateAlignmentGuides(
        { x, y, width, height },
        otherZones,
        threshold
      );

      setActiveGuides(guides);
      setDraggedZoneId(zoneId);
    },
    [enabled, zones, threshold]
  );

  /**
   * Clear all alignment guides
   */
  const clearGuides = useCallback(() => {
    setActiveGuides([]);
    setDraggedZoneId(null);
  }, []);

  /**
   * Snap a position to the nearest guide
   */
  const snapToAlignment = useCallback(
    (x: number, y: number): { x: number; y: number } => {
      if (!snapToGuides || activeGuides.length === 0) {
        return { x, y };
      }

      let snappedX = x;
      let snappedY = y;

      // Check vertical guides (snap x position)
      const verticalGuides = activeGuides.filter((g) => g.type === "vertical");
      for (const guide of verticalGuides) {
        if (Math.abs(x - guide.position) < threshold) {
          snappedX = guide.position;
          break;
        }
      }

      // Check horizontal guides (snap y position)
      const horizontalGuides = activeGuides.filter(
        (g) => g.type === "horizontal"
      );
      for (const guide of horizontalGuides) {
        if (Math.abs(y - guide.position) < threshold) {
          snappedY = guide.position;
          break;
        }
      }

      return { x: snappedX, y: snappedY };
    },
    [snapToGuides, activeGuides, threshold]
  );

  /**
   * Check if a guide is active for a specific axis
   */
  const hasActiveGuide = useMemo(
    () => ({
      vertical: activeGuides.some((g) => g.type === "vertical"),
      horizontal: activeGuides.some((g) => g.type === "horizontal"),
    }),
    [activeGuides]
  );

  return {
    guides: activeGuides,
    draggedZoneId,
    updateGuides,
    clearGuides,
    snapToAlignment,
    hasActiveGuide,
    isEnabled: enabled,
  };
}
