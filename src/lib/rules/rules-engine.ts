/**
 * Rules Engine — main orchestrator for layout validation.
 * Loads design rules from JSON data files and runs all checkers
 * (adjacency, spacing, capacity) to produce a validation result.
 */

import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type {
  RuleViolation,
  DisciplineRuleOverride,
  ZoneAdjacencyRule,
  SpacingRule,
  CapacityRule,
} from "@/lib/schemas/design-rules";
import {
  ZoneAdjacencyRuleSchema,
  SpacingRuleSchema,
  CapacityRuleSchema,
} from "@/lib/schemas/design-rules";
import { z } from "zod";
import { checkAdjacency } from "./adjacency-checker";
import { checkSpacing } from "./spacing-checker";
import { checkCapacity } from "./capacity-checker";

function safeParseArray<T>(schema: z.ZodType<T>, data: unknown, label: string): T[] {
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    console.warn(`[rules-engine] Invalid ${label} data:`, result.error.issues.slice(0, 3));
    return [];
  }
  return result.data;
}

// Import rule data — JSON files may be empty arrays during development.
// Using try/catch pattern via default values for resilience.
let adjacencyRulesRaw: ZoneAdjacencyRule[] = [];
let spacingRulesRaw: SpacingRule[] = [];
let capacityRulesRaw: CapacityRule[] = [];

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawAdj = require("@/data/design-rules/zone-adjacency.json");
  adjacencyRulesRaw = safeParseArray(ZoneAdjacencyRuleSchema, rawAdj, "adjacency");
} catch {
  // File not yet created — use empty rules
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawSpc = require("@/data/design-rules/spacing-rules.json");
  spacingRulesRaw = safeParseArray(SpacingRuleSchema, rawSpc, "spacing");
} catch {
  // File not yet created — use empty rules
}

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const rawCap = require("@/data/design-rules/capacity-rules.json");
  capacityRulesRaw = safeParseArray(CapacityRuleSchema, rawCap, "capacity");
} catch {
  // File not yet created — use empty rules
}

// ============================================
// Score Calculation
// ============================================

/** Penalty weights by severity */
const SEVERITY_PENALTY = {
  error: 10,
  warning: 3,
  info: 1,
} as const;

function computeScore(violations: RuleViolation[]): number {
  let deductions = 0;
  for (const v of violations) {
    deductions += SEVERITY_PENALTY[v.severity] ?? 0;
  }
  return Math.max(0, 100 - deductions);
}

// ============================================
// Validation Result
// ============================================

export interface ValidationResult {
  /** All violations across all rule categories */
  violations: RuleViolation[];
  /** Violations with severity "error" */
  errors: RuleViolation[];
  /** Violations with severity "warning" */
  warnings: RuleViolation[];
  /** Violations with severity "info" */
  info: RuleViolation[];
  /** Score from 0-100. Start at 100, deduct per violation. */
  score: number;
  /** True when there are no errors (warnings and info are acceptable) */
  isCompliant: boolean;
}

// ============================================
// Discipline Override Application
// ============================================

/**
 * Apply discipline-specific overrides to base rules.
 * - Spacing overrides replace minDistanceM for matching rule IDs
 * - Additional adjacency rules are appended
 * - Capacity overrides replace minAreaPerPersonM2 for matching zone types
 */
function applyOverrides(
  adjacencyRules: ZoneAdjacencyRule[],
  spacingRules: SpacingRule[],
  capacityRules: CapacityRule[],
  overrides: DisciplineRuleOverride,
): {
  adjacencyRules: ZoneAdjacencyRule[];
  spacingRules: SpacingRule[];
  capacityRules: CapacityRule[];
} {
  // Clone arrays to avoid mutating imports
  let adjRules = [...adjacencyRules];
  let spcRules = [...spacingRules];
  let capRules = [...capacityRules];

  // Apply spacing overrides
  if (overrides.spacingOverrides) {
    const overrideMap = new Map(
      overrides.spacingOverrides.map((o) => [o.ruleId, o.minDistanceM]),
    );
    spcRules = spcRules.map((rule) => {
      const override = overrideMap.get(rule.id);
      if (override !== undefined) {
        return { ...rule, minDistanceM: override };
      }
      return rule;
    });
  }

  // Append additional adjacency rules
  if (overrides.additionalAdjacency) {
    adjRules = [...adjRules, ...overrides.additionalAdjacency];
  }

  // Apply capacity overrides
  if (overrides.capacityOverrides) {
    const capOverrideMap = new Map(
      overrides.capacityOverrides.map((o) => [o.zoneType, o.minAreaPerPersonM2]),
    );
    capRules = capRules.map((rule) => {
      const override = capOverrideMap.get(rule.zoneType);
      if (override !== undefined) {
        return { ...rule, minAreaPerPersonM2: override };
      }
      return rule;
    });
  }

  return { adjacencyRules: adjRules, spacingRules: spcRules, capacityRules: capRules };
}

// ============================================
// Main Validation Function
// ============================================

/** Check that all zones are within layout dimensions */
function checkBoundaries(layout: LayoutData): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const { width, height } = layout.dimensions;

  for (const zone of layout.zones) {
    if (zone.position.x < 0 || zone.position.y < 0) {
      violations.push({
        ruleId: "boundary-negative",
        ruleCategory: "spacing",
        severity: "error",
        message: `${zone.name} has negative position`,
        messageZh: `${zone.name} 位置为负值`,
        affectedZones: [zone.id],
        suggestion: `Move to positive coordinates`,
        suggestionZh: `移动到正坐标位置`,
      });
    }
    if (zone.position.x + zone.size.width > width) {
      violations.push({
        ruleId: "boundary-width",
        ruleCategory: "spacing",
        severity: "error",
        message: `${zone.name} extends beyond layout width (${width}m)`,
        messageZh: `${zone.name} 超出布局宽度 (${width}m)`,
        affectedZones: [zone.id],
        suggestionZh: `缩小宽度或左移至 x≤${(width - zone.size.width).toFixed(1)}`,
      });
    }
    if (zone.position.y + zone.size.height > height) {
      violations.push({
        ruleId: "boundary-height",
        ruleCategory: "spacing",
        severity: "error",
        message: `${zone.name} extends beyond layout height (${height}m)`,
        messageZh: `${zone.name} 超出布局高度 (${height}m)`,
        affectedZones: [zone.id],
        suggestionZh: `缩小高度或上移至 y≤${(height - zone.size.height).toFixed(1)}`,
      });
    }
  }
  return violations;
}

/** Check for zone overlaps */
function checkOverlaps(layout: LayoutData): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const zones = layout.zones;

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const a = zones[i], b = zones[j];
      const overlapX = a.position.x < b.position.x + b.size.width && a.position.x + a.size.width > b.position.x;
      const overlapY = a.position.y < b.position.y + b.size.height && a.position.y + a.size.height > b.position.y;
      if (overlapX && overlapY) {
        violations.push({
          ruleId: "zone-overlap",
          ruleCategory: "spacing",
          severity: "error",
          message: `${a.name} and ${b.name} overlap`,
          messageZh: `${a.name} 和 ${b.name} 存在重叠`,
          affectedZones: [a.id, b.id],
          suggestionZh: `分离两个区域，确保无重叠`,
        });
      }
    }
  }
  return violations;
}

/**
 * Validate a layout against all design rules.
 *
 * @param layout - The layout to validate
 * @param disciplineOverrides - Optional discipline-specific rule overrides
 * @returns Validation result with violations, score, and compliance status
 */
export function validateLayout(
  layout: LayoutData,
  disciplineOverrides?: DisciplineRuleOverride,
): ValidationResult {
  // Early return for empty layouts
  if (!layout.zones || layout.zones.length === 0) {
    return { violations: [], errors: [], warnings: [], info: [], score: 100, isCompliant: true };
  }

  // 1. Start with base rules from JSON data
  let adjacencyRules = Array.isArray(adjacencyRulesRaw) ? [...adjacencyRulesRaw] : [];
  let spacingRules = Array.isArray(spacingRulesRaw) ? [...spacingRulesRaw] : [];
  let capacityRules = Array.isArray(capacityRulesRaw) ? [...capacityRulesRaw] : [];

  // 2. Apply discipline overrides if provided
  if (disciplineOverrides) {
    const overridden = applyOverrides(
      adjacencyRules,
      spacingRules,
      capacityRules,
      disciplineOverrides,
    );
    adjacencyRules = overridden.adjacencyRules;
    spacingRules = overridden.spacingRules;
    capacityRules = overridden.capacityRules;
  }

  // 3. Run all checkers
  const adjacencyViolations = checkAdjacency(layout, adjacencyRules);
  const spacingViolations = checkSpacing(layout, spacingRules);
  const capacityViolations = checkCapacity(layout, capacityRules);

  // 4. Run boundary and overlap checks
  const boundaryViolations = checkBoundaries(layout);
  const overlapViolations = checkOverlaps(layout);

  // 5. Combine all violations
  const violations = [
    ...adjacencyViolations,
    ...spacingViolations,
    ...capacityViolations,
    ...boundaryViolations,
    ...overlapViolations,
  ];

  // 6. Categorize by severity
  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");
  const info = violations.filter((v) => v.severity === "info");

  // 7. Compute score and compliance
  const score = computeScore(violations);
  const isCompliant = errors.length === 0;

  return {
    violations,
    errors,
    warnings,
    info,
    score,
    isCompliant,
  };
}

// ============================================
// Discipline Override Loader
// ============================================

/**
 * Attempt to load discipline-specific overrides from the data directory.
 * Returns undefined if the discipline file doesn't exist.
 *
 * @param discipline - Discipline identifier (e.g., "biology", "chemistry")
 */
export function getDisciplineOverrides(
  discipline: string,
): DisciplineRuleOverride | undefined {
  try {
    // Dynamic require for discipline-specific rule files.
    // These live at src/data/design-rules/discipline-rules/<discipline>.json
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const data = require(
      `@/data/design-rules/discipline-rules/${discipline}.json`,
    ) as DisciplineRuleOverride;
    return data;
  } catch {
    // Discipline file doesn't exist — no overrides
    return undefined;
  }
}

/**
 * Convenience function: validate a layout with automatic discipline detection.
 *
 * @param layout - The layout to validate
 * @param discipline - Optional discipline name for loading overrides
 */
export function validateLayoutWithDiscipline(
  layout: LayoutData,
  discipline?: string,
): ValidationResult {
  const overrides = discipline ? getDisciplineOverrides(discipline) : undefined;
  return validateLayout(layout, overrides);
}
