/**
 * Constraint-Aware Prompt Builder
 * Serializes design rules into system prompt context for AI agents.
 *
 * This module bridges the gap between the machine-readable design rules
 * (JSON data files) and the AI layout generation agents. By serializing
 * relevant rules into structured text blocks, we give the AI full
 * awareness of safety codes, spacing requirements, ventilation standards,
 * and zone adjacency constraints — enabling it to generate compliant
 * layouts on the first attempt and self-correct when violations are found.
 */

import { ZONE_TYPES, ZONE_LABELS } from "@/lib/constants/zone-types";
import type { Discipline } from "@/lib/schemas/launcher";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type {
  ZoneAdjacencyRule,
  SpacingRule,
  VentilationRule,
  SafetyDistanceRule,
  DisciplineRuleOverride,
} from "@/lib/schemas/design-rules";

// Import rule data
import adjacencyRulesData from "@/data/design-rules/zone-adjacency.json";
import spacingRulesData from "@/data/design-rules/spacing-rules.json";
import safetyCodesData from "@/data/design-rules/safety-codes.json";
import ventilationRulesData from "@/data/design-rules/ventilation-rules.json";

// ============================================
// Types
// ============================================

export interface ConstraintBlockOptions {
  /** Filter rules to only those involving these zone types */
  zoneTypes?: string[];
  /** Discipline for loading discipline-specific overrides */
  discipline?: Discipline;
  /** Optional discipline overrides to merge into the constraint block */
  disciplineOverrides?: DisciplineRuleOverride;
  /** Whether to include the full zone type reference list (default: true) */
  includeZoneReference?: boolean;
}

export interface ViolationEntry {
  ruleId: string;
  severity: string;
  messageZh: string;
  affectedZones: string[];
  suggestionZh?: string;
}

// ============================================
// Helpers
// ============================================

/**
 * Map adjacency relation to a human-readable symbol for the AI prompt.
 */
function adjacencySymbol(relation: string): string {
  switch (relation) {
    case "must_adjacent":
      return "\u2713 MUST";
    case "must_separate":
      return "\u2717 MUST NOT";
    case "preferred_adjacent":
      return "\u2192 SHOULD";
    case "preferred_separate":
      return "\u2190 SHOULD NOT";
    default:
      return "\u25CB";
  }
}

/**
 * Get label for a zone type, with fallback to the raw type string.
 */
function zoneLabel(zoneType: string): string {
  return ZONE_LABELS[zoneType as keyof typeof ZONE_LABELS] || zoneType;
}

/**
 * Check whether a zone type matches the optional filter.
 */
function matchesZoneFilter(zoneType: string, zoneTypes?: string[]): boolean {
  if (!zoneTypes || zoneTypes.length === 0) return true;
  return zoneTypes.includes(zoneType);
}

// ============================================
// Constraint Block Builder
// ============================================

/**
 * Build a constraint block that lists all relevant rules for the AI.
 * Filters rules to only those relevant to the given zone types.
 *
 * The output is a structured Markdown text block that can be appended
 * to the AI system prompt. It includes:
 * - Zone adjacency rules (which zones must/must-not be adjacent)
 * - Spacing requirements (minimum distances)
 * - Safety codes (OSHA/NFPA distance requirements)
 * - Ventilation requirements (ACH, pressure, HEPA, exhaust)
 * - Available zone types reference
 *
 * @param opts - Options for filtering and customizing the constraint block
 * @returns Formatted constraint text block for AI system prompt
 */
export function buildConstraintBlock(opts?: ConstraintBlockOptions): string {
  const zoneTypes = opts?.zoneTypes?.filter(t => (ZONE_TYPES as readonly string[]).includes(t));
  const includeZoneRef = opts?.includeZoneReference ?? true;

  const sections: string[] = [];

  sections.push("## DESIGN CONSTRAINTS (MUST COMPLY)");
  sections.push("");

  // ------------------------------------------
  // Zone Adjacency Rules
  // ------------------------------------------
  const adjRules = (adjacencyRulesData as ZoneAdjacencyRule[]).filter((r) => {
    if (!zoneTypes || zoneTypes.length === 0) return true;
    return zoneTypes.includes(r.zoneTypeA) || zoneTypes.includes(r.zoneTypeB);
  });

  // Merge discipline-specific additional adjacency rules
  if (opts?.disciplineOverrides?.additionalAdjacency) {
    const extraAdj = opts.disciplineOverrides.additionalAdjacency.filter((r) => {
      if (!zoneTypes || zoneTypes.length === 0) return true;
      return zoneTypes.includes(r.zoneTypeA) || zoneTypes.includes(r.zoneTypeB);
    });
    adjRules.push(...extraAdj);
  }

  if (adjRules.length > 0) {
    sections.push("### Zone Adjacency Rules");
    for (const r of adjRules) {
      const symbol = adjacencySymbol(r.relation);
      const labelA = zoneLabel(r.zoneTypeA);
      const labelB = zoneLabel(r.zoneTypeB);
      const standardRef = r.standard ? ` [${r.standard}]` : "";
      sections.push(
        `- ${symbol} be adjacent: ${r.zoneTypeA}(${labelA}) \u2194 ${r.zoneTypeB}(${labelB}) \u2014 ${r.reasonZh}${standardRef}`,
      );
    }
    sections.push("");
  }

  // ------------------------------------------
  // Spacing Requirements
  // ------------------------------------------
  let spRules = spacingRulesData as SpacingRule[];

  // Apply discipline spacing overrides
  if (opts?.disciplineOverrides?.spacingOverrides) {
    const overrideMap = new Map(
      opts.disciplineOverrides.spacingOverrides.map((o) => [o.ruleId, o.minDistanceM]),
    );
    spRules = spRules.map((rule) => {
      const override = overrideMap.get(rule.id);
      if (override !== undefined) {
        return { ...rule, minDistanceM: override };
      }
      return rule;
    });
  }

  // Filter by zone types if applicable
  const filteredSpRules = spRules.filter((r) => {
    if (!zoneTypes || zoneTypes.length === 0) return true;
    // If the rule has zoneTypes filter, check overlap
    if (r.zoneTypes && r.zoneTypes.length > 0) {
      return r.zoneTypes.some((zt) => zoneTypes.includes(zt));
    }
    // Generic rules (no zoneTypes filter) always apply
    return true;
  });

  if (filteredSpRules.length > 0) {
    sections.push("### Spacing Requirements");
    for (const r of filteredSpRules) {
      const standardRef = r.standard ? ` [${r.standard}]` : "";
      const zoneScope = r.zoneTypes?.length
        ? ` (applies to: ${r.zoneTypes.map((t) => `${t}(${zoneLabel(t)})`).join(", ")})`
        : "";
      sections.push(
        `- ${r.descriptionZh}: \u2265${r.minDistanceM}m${standardRef} (${r.severity})${zoneScope}`,
      );
    }
    sections.push("");
  }

  // ------------------------------------------
  // Safety Codes (OSHA / NFPA)
  // ------------------------------------------
  const safeRules = safetyCodesData as SafetyDistanceRule[];
  if (safeRules.length > 0) {
    sections.push("### Safety Codes");
    for (const r of safeRules) {
      const op = r.constraint === "min" ? "\u2265" : "\u2264";
      sections.push(`- ${r.descriptionZh}: ${op}${r.valueM}m [${r.standard}]`);
    }
    sections.push("");
  }

  // ------------------------------------------
  // Ventilation Requirements
  // ------------------------------------------
  let ventRules = (ventilationRulesData as VentilationRule[]).filter((r) =>
    matchesZoneFilter(r.zoneType, zoneTypes),
  );

  // Apply discipline ventilation overrides
  if (opts?.disciplineOverrides?.ventilationOverrides) {
    const ventOverrideMap = new Map(
      opts.disciplineOverrides.ventilationOverrides.map((o) => [o.zoneType, o]),
    );
    ventRules = ventRules.map((rule) => {
      const override = ventOverrideMap.get(rule.zoneType);
      if (override) {
        return {
          ...rule,
          minACH: override.minACH,
          ...(override.pressurePa !== undefined ? { pressurePa: override.pressurePa } : {}),
          ...(override.hepaClass !== undefined ? { hepaClass: override.hepaClass } : {}),
        };
      }
      return rule;
    });
  }

  if (ventRules.length > 0) {
    sections.push("### Ventilation Requirements");
    for (const r of ventRules) {
      const label = zoneLabel(r.zoneType);
      let line = `- ${r.zoneType}(${label}): \u2265${r.minACH} ACH`;
      if (r.pressurePa !== undefined && r.pressurePa !== null) {
        line += `, ${r.pressurePa > 0 ? "+" : ""}${r.pressurePa}Pa`;
      }
      if (r.hepaClass) {
        line += `, HEPA ${r.hepaClass}`;
      }
      if (r.exhaustRequired) {
        line += `, \u9700\u6392\u98CE`;
      }
      if (r.fumeHoodRequired) {
        line += `, \u9700\u901A\u98CE\u6A71`;
      }
      const standardRef = r.standard ? ` [${r.standard}]` : "";
      line += standardRef;
      sections.push(line);
    }
    sections.push("");
  }

  // ------------------------------------------
  // Available Zone Types Reference
  // ------------------------------------------
  if (includeZoneRef) {
    sections.push("### Available Zone Types");
    sections.push(
      ZONE_TYPES.map((t) => `${t}(${ZONE_LABELS[t]})`).join(", "),
    );
    sections.push("");
  }

  return sections.join("\n");
}

// ============================================
// Violation Feedback Builder
// ============================================

/**
 * Build a violation feedback prompt for iterative correction.
 *
 * When the rules engine finds violations in a generated layout, this
 * function formats them into a structured prompt that guides the AI
 * to fix specific issues. Violations are grouped by severity (errors
 * first, then warnings) with actionable suggestions.
 *
 * @param violations - Array of violation entries from the rules engine
 * @returns Formatted violation feedback text, or empty string if no violations
 */
export function buildViolationFeedback(
  violations: ViolationEntry[],
  layout?: LayoutData
): string {
  if (violations.length === 0) return "";

  const lines: string[] = [];
  lines.push("## VIOLATIONS FOUND \u2014 Please fix the following issues:");
  lines.push("");

  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");
  const infos = violations.filter((v) => v.severity === "info");

  if (errors.length > 0) {
    lines.push(`### ERRORS (${errors.length} \u2014 must fix):`);
    for (const v of errors) {
      lines.push(`- [${v.ruleId}] ${v.messageZh}`);
      if (v.suggestionZh) {
        lines.push(`  \u2192 \u5EFA\u8BAE: ${v.suggestionZh}`);
      }
      lines.push(`  \u5F71\u54CD\u533A\u57DF: ${v.affectedZones.join(", ")}`);

      // Add specific position guidance if layout available
      if (layout && v.ruleId === "boundary-width" && v.affectedZones.length > 0) {
        const zone = layout.zones.find(z => z.id === v.affectedZones[0]);
        if (zone) {
          const maxX = layout.dimensions.width - zone.size.width;
          lines.push(`  \u2192 \u5177\u4F53\u64CD\u4F5C: \u5C06 position.x \u8BBE\u4E3A \u2264${maxX.toFixed(1)}`);
        }
      }
      if (layout && v.ruleId === "boundary-height" && v.affectedZones.length > 0) {
        const zone = layout.zones.find(z => z.id === v.affectedZones[0]);
        if (zone) {
          const maxY = layout.dimensions.height - zone.size.height;
          lines.push(`  \u2192 \u5177\u4F53\u64CD\u4F5C: \u5C06 position.y \u8BBE\u4E3A \u2264${maxY.toFixed(1)}`);
        }
      }
      if (layout && v.ruleId === "zone-overlap" && v.affectedZones.length >= 2) {
        const zA = layout.zones.find(z => z.id === v.affectedZones[0]);
        const zB = layout.zones.find(z => z.id === v.affectedZones[1]);
        if (zA && zB) {
          lines.push(`  \u2192 \u5177\u4F53\u64CD\u4F5C: \u5C06 ${zB.name} \u79FB\u81F3 x=${(zA.position.x + zA.size.width + 0.5).toFixed(1)} \u6216\u8C03\u6574\u5C3A\u5BF8`);
        }
      }
    }
    lines.push("");
  }

  if (warnings.length > 0) {
    lines.push(`### WARNINGS (${warnings.length} \u2014 should fix):`);
    for (const w of warnings) {
      lines.push(`- [${w.ruleId}] ${w.messageZh}`);
      if (w.suggestionZh) {
        lines.push(`  \u2192 \u5EFA\u8BAE: ${w.suggestionZh}`);
      }
      if (w.affectedZones.length > 0) {
        lines.push(`  \u5F71\u54CD\u533A\u57DF: ${w.affectedZones.join(", ")}`);
      }
    }
    lines.push("");
  }

  if (infos.length > 0) {
    lines.push(`### INFO (${infos.length} \u2014 consider):`);
    for (const v of infos) {
      lines.push(`- [${v.ruleId}] ${v.messageZh}`);
      if (v.suggestionZh) {
        lines.push(`  \u2192 \u5EFA\u8BAE: ${v.suggestionZh}`);
      }
    }
    lines.push("");
  }

  lines.push(
    "Output the corrected layout as JSON, keeping the same structure. " +
    "Fix the violations while preserving the overall design intent.",
  );

  return lines.join("\n");
}

// ============================================
// Compact Constraint Summary
// ============================================

/**
 * Build a compact one-paragraph summary of the most critical constraints.
 * Useful for token-constrained contexts (e.g., user-facing messages).
 *
 * @param opts - Same options as buildConstraintBlock
 * @returns Short text summary of key constraints
 */
export function buildConstraintSummary(opts?: ConstraintBlockOptions): string {
  const zoneTypes = opts?.zoneTypes;

  const criticalAdj = (adjacencyRulesData as ZoneAdjacencyRule[]).filter(
    (r) =>
      (r.relation === "must_adjacent" || r.relation === "must_separate") &&
      matchesZoneFilter(r.zoneTypeA, zoneTypes),
  );

  const criticalSafety = (safetyCodesData as SafetyDistanceRule[]).length;

  const criticalVent = (ventilationRulesData as VentilationRule[]).filter((r) =>
    matchesZoneFilter(r.zoneType, zoneTypes),
  );

  const parts: string[] = [];
  parts.push(`${criticalAdj.length} mandatory adjacency rules`);
  parts.push(`${criticalSafety} safety codes (OSHA/NFPA)`);
  parts.push(`${criticalVent.length} ventilation requirements`);

  return `Active constraints: ${parts.join(", ")}.`;
}
