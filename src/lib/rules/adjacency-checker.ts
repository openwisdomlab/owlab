/**
 * Adjacency Checker — validates zone placement relationships.
 * Checks whether zones that should be adjacent/separated actually are.
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { ZoneAdjacencyRule, RuleViolation } from "@/lib/schemas/design-rules";

/**
 * Check if two zones are adjacent (boundaries touch or overlap).
 * Uses a threshold to allow for small rounding gaps.
 */
function areAdjacent(a: ZoneData, b: ZoneData, threshold = 0.5): boolean {
  // Calculate gap between zones on each axis
  const gapX = Math.max(
    0,
    Math.max(a.position.x, b.position.x) -
      Math.min(a.position.x + a.size.width, b.position.x + b.size.width),
  );
  const gapY = Math.max(
    0,
    Math.max(a.position.y, b.position.y) -
      Math.min(a.position.y + a.size.height, b.position.y + b.size.height),
  );
  // Adjacent if both gaps are within threshold (zones touch or overlap)
  return gapX <= threshold && gapY <= threshold;
}

/**
 * Run adjacency rules against a layout.
 * For each rule, find all zone pairs matching the specified types and
 * check their spatial relationship.
 */
export function checkAdjacency(
  layout: LayoutData,
  rules: ZoneAdjacencyRule[],
): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const zones = layout.zones;
  const checkedPairs = new Set<string>();

  for (const rule of rules) {
    // Collect pairs in both directions (A->B and B->A) for symmetric checking
    const zonesA = zones.filter((z) => z.type === rule.zoneTypeA);
    const zonesB = zones.filter((z) => z.type === rule.zoneTypeB);
    const zonesAReverse = zones.filter((z) => z.type === rule.zoneTypeB);
    const zonesBReverse = zones.filter((z) => z.type === rule.zoneTypeA);

    const allPairs = [
      ...zonesA.flatMap((a) => zonesB.map((b) => [a, b] as const)),
      ...zonesAReverse.flatMap((a) => zonesBReverse.map((b) => [a, b] as const)),
    ];

    for (const [zA, zB] of allPairs) {
      if (zA.id === zB.id) continue;
      const pairKey = [zA.id, zB.id].sort().join("|") + "|" + rule.id;
      if (checkedPairs.has(pairKey)) continue;
      checkedPairs.add(pairKey);

      const adjacent = areAdjacent(zA, zB);

      if (rule.relation === "must_adjacent" && !adjacent) {
        violations.push({
          ruleId: rule.id,
          ruleCategory: "adjacency",
          severity: "error",
          message: `${zA.name} and ${zB.name} must be adjacent: ${rule.reason}`,
          messageZh: `${zA.name} \u548c ${zB.name} \u5fc5\u987b\u76f8\u90bb\uff1a${rule.reasonZh}`,
          affectedZones: [zA.id, zB.id],
          suggestion: `Move ${zA.name} closer to ${zB.name}`,
          suggestionZh: `\u5c06 ${zA.name} \u79fb\u8fd1 ${zB.name}`,
          standard: rule.standard,
        });
      }

      if (rule.relation === "must_separate" && adjacent) {
        violations.push({
          ruleId: rule.id,
          ruleCategory: "adjacency",
          severity: "error",
          message: `${zA.name} and ${zB.name} must be separated: ${rule.reason}`,
          messageZh: `${zA.name} \u548c ${zB.name} \u5fc5\u987b\u5206\u79bb\uff1a${rule.reasonZh}`,
          affectedZones: [zA.id, zB.id],
          suggestion: `Move ${zA.name} away from ${zB.name}`,
          suggestionZh: `\u5c06 ${zA.name} \u8fdc\u79bb ${zB.name}`,
          standard: rule.standard,
        });
      }

      if (rule.relation === "preferred_adjacent" && !adjacent) {
        violations.push({
          ruleId: rule.id,
          ruleCategory: "adjacency",
          severity: "info",
          message: `${zA.name} and ${zB.name} should ideally be adjacent: ${rule.reason}`,
          messageZh: `${zA.name} \u548c ${zB.name} \u5efa\u8bae\u76f8\u90bb\uff1a${rule.reasonZh}`,
          affectedZones: [zA.id, zB.id],
          standard: rule.standard,
        });
      }

      if (rule.relation === "preferred_separate" && adjacent) {
        violations.push({
          ruleId: rule.id,
          ruleCategory: "adjacency",
          severity: "info",
          message: `${zA.name} and ${zB.name} should ideally be separated: ${rule.reason}`,
          messageZh: `${zA.name} \u548c ${zB.name} \u5efa\u8bae\u5206\u79bb\uff1a${rule.reasonZh}`,
          affectedZones: [zA.id, zB.id],
          standard: rule.standard,
        });
      }
    }
  }

  return violations;
}
