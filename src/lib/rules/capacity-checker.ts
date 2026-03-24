/**
 * Capacity Checker — validates zone occupancy against area-per-person rules.
 * Calculates maximum safe occupancy from zone dimensions and rule constraints.
 */

import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { CapacityRule, RuleViolation } from "@/lib/schemas/design-rules";

/**
 * Parse occupancy from a zone's requirements array.
 * Looks for strings like "occupancy: 12", "max 10 people", "capacity: 8",
 * or Chinese equivalents like "容纳 12 人".
 */
function parseOccupancy(requirements?: string[]): number | null {
  if (!requirements) return null;

  for (const req of requirements) {
    const lower = req.toLowerCase();

    // English patterns: "occupancy: 12", "max 10 people", "capacity: 8"
    const enMatch = lower.match(
      /(?:occupancy|capacity|max\s*people|persons?)\s*[:=]?\s*(\d+)/,
    );
    if (enMatch) return parseInt(enMatch[1], 10);

    const enMatch2 = lower.match(/(\d+)\s*(?:people|persons?|occupants?)/);
    if (enMatch2) return parseInt(enMatch2[1], 10);

    // Chinese patterns: "容纳 12 人", "最多 10 人"
    const zhMatch = req.match(/(?:\u5bb9\u7eb3|\u6700\u591a|\u4eba\u6570)\s*[:=\uff1a]?\s*(\d+)/);
    if (zhMatch) return parseInt(zhMatch[1], 10);

    const zhMatch2 = req.match(/(\d+)\s*\u4eba/);
    if (zhMatch2) return parseInt(zhMatch2[1], 10);
  }

  return null;
}

/**
 * Run capacity rules against a layout.
 *
 * For each zone, find the applicable capacity rule by zone type, then:
 * 1. If the zone has explicit occupancy in requirements, check it against the rule
 * 2. Compute max occupancy from zone area and report it
 * 3. If a hard cap (maxOccupancy) is set on the rule, check against that too
 */
export function checkCapacity(
  layout: LayoutData,
  rules: CapacityRule[],
): RuleViolation[] {
  const violations: RuleViolation[] = [];

  // Build a lookup map: zoneType -> CapacityRule
  const ruleMap = new Map<string, CapacityRule>();
  for (const rule of rules) {
    ruleMap.set(rule.zoneType, rule);
  }

  for (const zone of layout.zones) {
    const rule = ruleMap.get(zone.type);
    if (!rule) continue;

    const area = zone.size.width * zone.size.height;
    const maxFromArea = Math.floor(area / rule.minAreaPerPersonM2);
    const declaredOccupancy = parseOccupancy(zone.requirements);

    // Check declared occupancy against area-based maximum
    if (declaredOccupancy !== null && declaredOccupancy > maxFromArea) {
      violations.push({
        ruleId: rule.id,
        ruleCategory: "capacity",
        severity: "error",
        message: `${zone.name} declares ${declaredOccupancy} occupants but area (${area.toFixed(1)}m\u00b2) only supports ${maxFromArea} at ${rule.minAreaPerPersonM2}m\u00b2/person: ${rule.description}`,
        messageZh: `${zone.name} \u58f0\u660e ${declaredOccupancy} \u4eba\u4f46\u9762\u79ef (${area.toFixed(1)}m\u00b2) \u6309 ${rule.minAreaPerPersonM2}m\u00b2/\u4eba \u4ec5\u652f\u6301 ${maxFromArea} \u4eba\uff1a${rule.descriptionZh}`,
        affectedZones: [zone.id],
        suggestion: `Reduce occupancy to ${maxFromArea} or increase zone area to at least ${(declaredOccupancy * rule.minAreaPerPersonM2).toFixed(1)}m\u00b2`,
        suggestionZh: `\u5c06\u5bb9\u7eb3\u4eba\u6570\u51cf\u81f3 ${maxFromArea} \u6216\u5c06\u533a\u57df\u9762\u79ef\u589e\u5927\u81f3\u81f3\u5c11 ${(declaredOccupancy * rule.minAreaPerPersonM2).toFixed(1)}m\u00b2`,
        standard: rule.standard,
      });
    }

    // Check declared occupancy against hard cap
    if (
      declaredOccupancy !== null &&
      rule.maxOccupancy !== undefined &&
      declaredOccupancy > rule.maxOccupancy
    ) {
      violations.push({
        ruleId: rule.id,
        ruleCategory: "capacity",
        severity: "error",
        message: `${zone.name} declares ${declaredOccupancy} occupants, exceeding hard cap of ${rule.maxOccupancy}: ${rule.description}`,
        messageZh: `${zone.name} \u58f0\u660e ${declaredOccupancy} \u4eba\uff0c\u8d85\u8fc7\u6700\u5927\u5141\u8bb8 ${rule.maxOccupancy} \u4eba\uff1a${rule.descriptionZh}`,
        affectedZones: [zone.id],
        suggestion: `Reduce occupancy to at most ${rule.maxOccupancy}`,
        suggestionZh: `\u5c06\u5bb9\u7eb3\u4eba\u6570\u51cf\u81f3\u6700\u591a ${rule.maxOccupancy} \u4eba`,
        standard: rule.standard,
      });
    }

    // Warning if zone area is very small relative to rule minimum
    // (even without declared occupancy, a tiny zone is suspicious)
    if (maxFromArea < 1 && area > 0) {
      violations.push({
        ruleId: rule.id,
        ruleCategory: "capacity",
        severity: "warning",
        message: `${zone.name} area (${area.toFixed(1)}m\u00b2) is too small for even 1 person at ${rule.minAreaPerPersonM2}m\u00b2/person: ${rule.description}`,
        messageZh: `${zone.name} \u9762\u79ef (${area.toFixed(1)}m\u00b2) \u6309 ${rule.minAreaPerPersonM2}m\u00b2/\u4eba \u8fde 1 \u4eba\u90fd\u4e0d\u8db3\uff1a${rule.descriptionZh}`,
        affectedZones: [zone.id],
        suggestion: `Increase ${zone.name} area to at least ${rule.minAreaPerPersonM2}m\u00b2`,
        suggestionZh: `\u5c06 ${zone.name} \u9762\u79ef\u589e\u5927\u81f3\u81f3\u5c11 ${rule.minAreaPerPersonM2}m\u00b2`,
        standard: rule.standard,
      });
    }
  }

  return violations;
}
