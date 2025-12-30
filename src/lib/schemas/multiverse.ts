/**
 * Multiverse Schemas - Types for parallel universe design feature
 *
 * This module defines schemas for the "Parallel Universe Designer" feature,
 * which allows users to explore multiple design alternatives simultaneously.
 */

import { z } from "zod";
import { LayoutSchema, type LayoutData, type ZoneData } from "@/lib/ai/agents/layout-agent";

// ============================================
// Layout Metrics Schema
// ============================================

export const LayoutMetricsSchema = z.object({
  totalArea: z.number().min(0).describe("Total area in square units"),
  usedArea: z.number().min(0).describe("Area occupied by zones"),
  efficiency: z.number().min(0).max(1).describe("Space utilization ratio (0-1)"),
  estimatedCost: z.number().min(0).optional().describe("Estimated total cost"),
  safetyScore: z.number().min(0).max(100).optional().describe("Safety assessment score (0-100)"),
});

export type LayoutMetrics = z.infer<typeof LayoutMetricsSchema>;

// ============================================
// Universe Schema - Single design alternative
// ============================================

export const UniverseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Universe name is required"),
  description: z.string().optional(),
  layout: LayoutSchema,
  createdAt: z.string().datetime(),
  parentId: z.string().uuid().nullable().describe("ID of parent universe if branched"),
  branchPoint: z.string().optional().describe("Description of branching decision"),
  metrics: LayoutMetricsSchema.optional(),
});

export type Universe = z.infer<typeof UniverseSchema>;

// ============================================
// Multiverse Schema - Collection of universes
// ============================================

export const MultiverseSchema = z.object({
  universes: z.array(UniverseSchema).min(1, "At least one universe is required"),
  activeUniverseId: z.string().uuid().describe("Currently active universe"),
  comparisonIds: z
    .array(z.string().uuid())
    .max(3, "Maximum 3 universes can be compared at once")
    .default([])
    .describe("Universe IDs selected for comparison"),
});

export type Multiverse = z.infer<typeof MultiverseSchema>;

// ============================================
// Utility Functions
// ============================================

/**
 * Calculate layout metrics from a layout
 *
 * @param layout - The layout data to analyze
 * @returns Calculated metrics for the layout
 */
export function calculateLayoutMetrics(layout: LayoutData): LayoutMetrics {
  const { dimensions, zones } = layout;

  // Calculate total area
  const totalArea = dimensions.width * dimensions.height;

  // Calculate used area from zones
  const usedArea = zones.reduce((acc, zone) => {
    return acc + zone.size.width * zone.size.height;
  }, 0);

  // Calculate efficiency (capped at 1.0 for overlapping zones)
  const efficiency = totalArea > 0 ? Math.min(usedArea / totalArea, 1) : 0;

  // Estimate cost based on zone types (simplified estimation)
  // In a real implementation, this would use actual equipment costs
  const zoneCostMultipliers: Record<ZoneData["type"], number> = {
    compute: 5000,
    workspace: 2000,
    meeting: 1500,
    storage: 1000,
    utility: 3000,
    entrance: 500,
  };

  const estimatedCost = zones.reduce((acc, zone) => {
    const multiplier = zoneCostMultipliers[zone.type] || 1000;
    const zoneArea = zone.size.width * zone.size.height;
    return acc + zoneArea * multiplier;
  }, 0);

  // Calculate basic safety score
  // Factors: entrance presence, utility zone separation, adequate spacing
  let safetyScore = 50; // Base score

  // Check for entrance zone
  const hasEntrance = zones.some((zone) => zone.type === "entrance");
  if (hasEntrance) safetyScore += 20;

  // Check for utility zone (important for safety equipment)
  const hasUtility = zones.some((zone) => zone.type === "utility");
  if (hasUtility) safetyScore += 15;

  // Bonus for good efficiency (not overcrowded)
  if (efficiency >= 0.4 && efficiency <= 0.7) {
    safetyScore += 15;
  } else if (efficiency > 0.85) {
    safetyScore -= 10; // Penalty for overcrowding
  }

  // Ensure score is within bounds
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  return {
    totalArea,
    usedArea,
    efficiency,
    estimatedCost,
    safetyScore,
  };
}
