/**
 * Design Rules Schema — machine-readable lab design constraints.
 * Used by the rules engine to validate layouts against safety codes,
 * spacing requirements, ventilation standards, and accessibility rules.
 */

import { z } from "zod";

// ============================================
// Rule Severity & Violation
// ============================================

export const RuleSeveritySchema = z.enum(["error", "warning", "info"]);
export type RuleSeverity = z.infer<typeof RuleSeveritySchema>;

export const RuleViolationSchema = z.object({
  ruleId: z.string(),
  ruleCategory: z.enum([
    "adjacency",
    "spacing",
    "ventilation",
    "safety",
    "accessibility",
    "capacity",
  ]),
  severity: RuleSeveritySchema,
  message: z.string(),
  messageZh: z.string(),
  affectedZones: z.array(z.string()),
  suggestion: z.string().optional(),
  suggestionZh: z.string().optional(),
  standard: z.string().optional(), // e.g. "OSHA 1910.37", "NFPA 101"
});
export type RuleViolation = z.infer<typeof RuleViolationSchema>;

// ============================================
// Zone Adjacency Rules
// ============================================

export const AdjacencyRelationSchema = z.enum([
  "must_adjacent",     // Must be directly adjacent
  "preferred_adjacent", // Should be adjacent if possible
  "neutral",           // No preference
  "preferred_separate", // Better to keep apart
  "must_separate",     // Must NOT be adjacent
]);
export type AdjacencyRelation = z.infer<typeof AdjacencyRelationSchema>;

export const ZoneAdjacencyRuleSchema = z.object({
  id: z.string(),
  zoneTypeA: z.string(),
  zoneTypeB: z.string(),
  relation: AdjacencyRelationSchema,
  reason: z.string(),
  reasonZh: z.string(),
  standard: z.string().optional(),
});
export type ZoneAdjacencyRule = z.infer<typeof ZoneAdjacencyRuleSchema>;

// ============================================
// Spacing Rules
// ============================================

export const SpacingRuleSchema = z.object({
  id: z.string(),
  description: z.string(),
  descriptionZh: z.string(),
  /** What this spacing applies to */
  applicableTo: z.enum([
    "zone_to_zone",      // Between two zone boundaries
    "pathway",           // Corridor / aisle width
    "equipment_clearance", // Space around equipment
    "exit_access",       // Distance to nearest exit
    "wall_clearance",    // From zone edge to wall
  ]),
  /** Optional filter: only applies to these zone types */
  zoneTypes: z.array(z.string()).optional(),
  /** Minimum distance in meters */
  minDistanceM: z.number(),
  /** Standard reference */
  standard: z.string().optional(),
  severity: RuleSeveritySchema.default("warning"),
});
export type SpacingRule = z.infer<typeof SpacingRuleSchema>;

// ============================================
// Ventilation Rules
// ============================================

export const VentilationRuleSchema = z.object({
  id: z.string(),
  zoneType: z.string(),
  /** Air Changes per Hour */
  minACH: z.number(),
  /** Negative = negative pressure room, Positive = positive pressure */
  pressurePa: z.number().optional(),
  /** HEPA filter class if required */
  hepaClass: z.string().optional(),
  /** Whether exhaust is required */
  exhaustRequired: z.boolean().default(false),
  /** Whether fume hood is required */
  fumeHoodRequired: z.boolean().default(false),
  description: z.string(),
  descriptionZh: z.string(),
  standard: z.string().optional(),
});
export type VentilationRule = z.infer<typeof VentilationRuleSchema>;

// ============================================
// Safety Distance Rules (OSHA / NFPA)
// ============================================

export const SafetyDistanceRuleSchema = z.object({
  id: z.string(),
  description: z.string(),
  descriptionZh: z.string(),
  /** What the rule measures */
  measureType: z.enum([
    "exit_width",           // Min exit door width
    "corridor_width",       // Min corridor width
    "travel_distance",      // Max travel distance to exit
    "dead_end_distance",    // Max dead-end corridor length
    "aisle_width",          // Min aisle width between equipment
    "fire_extinguisher_distance", // Max distance to fire extinguisher
  ]),
  /** Value in meters */
  valueM: z.number(),
  /** Whether this is a minimum or maximum */
  constraint: z.enum(["min", "max"]),
  standard: z.string(),
  severity: RuleSeveritySchema.default("error"),
});
export type SafetyDistanceRule = z.infer<typeof SafetyDistanceRuleSchema>;

// ============================================
// Accessibility Rules (ADA)
// ============================================

export const AccessibilityRuleSchema = z.object({
  id: z.string(),
  description: z.string(),
  descriptionZh: z.string(),
  measureType: z.enum([
    "door_width",           // Min door clear width
    "turning_radius",       // Wheelchair turning radius
    "ramp_slope",           // Max ramp gradient (ratio)
    "counter_height",       // Max accessible counter height
    "clear_floor_space",    // Min clear space at workstation
  ]),
  /** Value in meters (or ratio for slopes) */
  valueM: z.number(),
  constraint: z.enum(["min", "max"]),
  standard: z.string(),
});
export type AccessibilityRule = z.infer<typeof AccessibilityRuleSchema>;

// ============================================
// Capacity Rules
// ============================================

export const CapacityRuleSchema = z.object({
  id: z.string(),
  zoneType: z.string(),
  /** Minimum square meters per person */
  minAreaPerPersonM2: z.number(),
  /** Maximum occupancy per zone (optional hard cap) */
  maxOccupancy: z.number().optional(),
  description: z.string(),
  descriptionZh: z.string(),
  standard: z.string().optional(),
});
export type CapacityRule = z.infer<typeof CapacityRuleSchema>;

// ============================================
// Discipline-Specific Rule Override
// ============================================

export const DisciplineRuleOverrideSchema = z.object({
  discipline: z.string(),
  description: z.string(),
  /** Overrides to spacing rules for this discipline */
  spacingOverrides: z.array(z.object({
    ruleId: z.string(),
    minDistanceM: z.number(),
  })).optional(),
  /** Overrides to ventilation rules */
  ventilationOverrides: z.array(z.object({
    zoneType: z.string(),
    minACH: z.number(),
    pressurePa: z.number().optional(),
    hepaClass: z.string().optional(),
  })).optional(),
  /** Additional adjacency rules */
  additionalAdjacency: z.array(ZoneAdjacencyRuleSchema).optional(),
  /** Additional capacity constraints */
  capacityOverrides: z.array(z.object({
    zoneType: z.string(),
    minAreaPerPersonM2: z.number(),
  })).optional(),
});
export type DisciplineRuleOverride = z.infer<typeof DisciplineRuleOverrideSchema>;

// ============================================
// Complete Rule Set
// ============================================

export const DesignRuleSetSchema = z.object({
  version: z.number(),
  adjacencyRules: z.array(ZoneAdjacencyRuleSchema),
  spacingRules: z.array(SpacingRuleSchema),
  ventilationRules: z.array(VentilationRuleSchema),
  safetyDistanceRules: z.array(SafetyDistanceRuleSchema),
  accessibilityRules: z.array(AccessibilityRuleSchema),
  capacityRules: z.array(CapacityRuleSchema),
});
export type DesignRuleSet = z.infer<typeof DesignRuleSetSchema>;
