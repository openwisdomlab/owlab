/**
 * Spacing Checker — validates minimum distances between zones.
 * Handles pathway widths, zone-to-zone distances, and equipment clearance.
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { SpacingRule, RuleViolation } from "@/lib/schemas/design-rules";

const EPSILON = 1e-6;

/**
 * Calculate the gap between two zones on each axis.
 * Positive values mean there is space between them;
 * negative values mean they overlap on that axis.
 */
function getGap(
  a: ZoneData,
  b: ZoneData,
): { gapX: number; gapY: number } {
  const gapX =
    Math.max(a.position.x, b.position.x) -
    Math.min(a.position.x + a.size.width, b.position.x + b.size.width);
  const gapY =
    Math.max(a.position.y, b.position.y) -
    Math.min(a.position.y + a.size.height, b.position.y + b.size.height);
  return { gapX, gapY };
}

/**
 * Get the minimum gap between two zones.
 * If zones overlap on one axis, the gap is measured on the other axis.
 * If zones overlap on both axes (physically overlapping), returns 0.
 * If zones are diagonal, returns the Euclidean distance of the corner gap.
 */
function getMinGap(a: ZoneData, b: ZoneData): number {
  const { gapX, gapY } = getGap(a, b);

  // Zones physically overlap
  if (gapX < EPSILON && gapY < EPSILON) return 0;

  // Zones share a vertical band — gap is purely horizontal
  if (gapY < EPSILON) return Math.max(0, gapX);

  // Zones share a horizontal band — gap is purely vertical
  if (gapX < EPSILON) return Math.max(0, gapY);

  // Diagonal: Euclidean distance between nearest corners
  return Math.sqrt(gapX * gapX + gapY * gapY);
}

/**
 * Check whether a zone matches a spacing rule's type filter.
 */
function matchesRule(zone: ZoneData, rule: SpacingRule): boolean {
  if (!rule.zoneTypes || rule.zoneTypes.length === 0) return true;
  return rule.zoneTypes.includes(zone.type);
}

/**
 * Run spacing rules against a layout and return violations.
 */
export function checkSpacing(
  layout: LayoutData,
  rules: SpacingRule[],
): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const zones = layout.zones;

  // Check for overlapping zones (independent of rules)
  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const zA = zones[i];
      const zB = zones[j];
      const { gapX, gapY } = getGap(zA, zB);
      if (gapX < -EPSILON && gapY < -EPSILON) {
        violations.push({
          ruleId: "overlap-detected",
          ruleCategory: "spacing",
          severity: "error",
          message: `${zA.name} and ${zB.name} overlap`,
          messageZh: `${zA.name} 和 ${zB.name} 存在重叠`,
          affectedZones: [zA.id, zB.id],
          suggestion: "Separate overlapping zones",
          suggestionZh: "分离重叠的区域",
        });
      }
    }
  }

  for (const rule of rules) {
    switch (rule.applicableTo) {
      case "pathway": {
        // Pathway rules: every pair of adjacent zones must have a gap >= minDistanceM
        // between them (to allow a corridor / aisle to pass through).
        for (let i = 0; i < zones.length; i++) {
          for (let j = i + 1; j < zones.length; j++) {
            const a = zones[i];
            const b = zones[j];
            const gap = getMinGap(a, b);

            // Only check zones that are close neighbors (within 3m)
            // to avoid flagging zones on opposite sides of the room
            if (gap > 0 && gap < rule.minDistanceM && gap < 3) {
              violations.push({
                ruleId: rule.id,
                ruleCategory: "spacing",
                severity: rule.severity ?? "warning",
                message: `Pathway between ${a.name} and ${b.name} is ${gap.toFixed(2)}m, minimum is ${rule.minDistanceM}m: ${rule.description}`,
                messageZh: `${a.name} \u548c ${b.name} \u4e4b\u95f4\u901a\u9053\u5bbd ${gap.toFixed(2)}m\uff0c\u6700\u5c0f\u8981\u6c42 ${rule.minDistanceM}m\uff1a${rule.descriptionZh}`,
                affectedZones: [a.id, b.id],
                suggestion: `Increase gap between ${a.name} and ${b.name} to at least ${rule.minDistanceM}m`,
                suggestionZh: `\u5c06 ${a.name} \u548c ${b.name} \u4e4b\u95f4\u8ddd\u79bb\u589e\u5927\u81f3\u81f3\u5c11 ${rule.minDistanceM}m`,
                standard: rule.standard,
              });
            }
          }
        }
        break;
      }

      case "zone_to_zone": {
        // Zone-to-zone rules: check minimum distance between zone types
        for (let i = 0; i < zones.length; i++) {
          for (let j = i + 1; j < zones.length; j++) {
            const a = zones[i];
            const b = zones[j];

            // Both zones must match the rule's type filter
            if (!matchesRule(a, rule) && !matchesRule(b, rule)) continue;

            // At least one must match for the rule to apply;
            // if the rule has zone types, we require both to be relevant types
            if (rule.zoneTypes && rule.zoneTypes.length > 0) {
              const aMatch = rule.zoneTypes.includes(a.type);
              const bMatch = rule.zoneTypes.includes(b.type);
              if (!aMatch && !bMatch) continue;
            }

            const gap = getMinGap(a, b);
            if (gap < rule.minDistanceM) {
              violations.push({
                ruleId: rule.id,
                ruleCategory: "spacing",
                severity: rule.severity ?? "warning",
                message: `Distance between ${a.name} and ${b.name} is ${gap.toFixed(2)}m, minimum is ${rule.minDistanceM}m: ${rule.description}`,
                messageZh: `${a.name} \u548c ${b.name} \u8ddd\u79bb ${gap.toFixed(2)}m\uff0c\u6700\u5c0f\u8981\u6c42 ${rule.minDistanceM}m\uff1a${rule.descriptionZh}`,
                affectedZones: [a.id, b.id],
                suggestion: `Increase distance between ${a.name} and ${b.name} to at least ${rule.minDistanceM}m`,
                suggestionZh: `\u5c06 ${a.name} \u548c ${b.name} \u8ddd\u79bb\u589e\u5927\u81f3\u81f3\u5c11 ${rule.minDistanceM}m`,
                standard: rule.standard,
              });
            }
          }
        }
        break;
      }

      case "equipment_clearance": {
        // Equipment clearance: zones of specified types must have adequate
        // clearance from all neighboring zones.
        const targetZones = zones.filter((z) => matchesRule(z, rule));

        for (const target of targetZones) {
          for (const other of zones) {
            if (target.id === other.id) continue;

            const gap = getMinGap(target, other);
            // Only flag close neighbors
            if (gap >= 0 && gap < rule.minDistanceM) {
              violations.push({
                ruleId: rule.id,
                ruleCategory: "spacing",
                severity: rule.severity ?? "warning",
                message: `Equipment clearance around ${target.name} is ${gap.toFixed(2)}m from ${other.name}, minimum is ${rule.minDistanceM}m: ${rule.description}`,
                messageZh: `${target.name} \u5468\u56f4\u8bbe\u5907\u95f4\u8ddd\u8ddd ${other.name} \u4e3a ${gap.toFixed(2)}m\uff0c\u6700\u5c0f\u8981\u6c42 ${rule.minDistanceM}m\uff1a${rule.descriptionZh}`,
                affectedZones: [target.id, other.id],
                suggestion: `Increase clearance around ${target.name} to at least ${rule.minDistanceM}m from ${other.name}`,
                suggestionZh: `\u5c06 ${target.name} \u4e0e ${other.name} \u7684\u95f4\u8ddd\u589e\u5927\u81f3\u81f3\u5c11 ${rule.minDistanceM}m`,
                standard: rule.standard,
              });
            }
          }
        }
        break;
      }

      case "wall_clearance": {
        // Wall clearance: zones must maintain minimum distance from layout edges
        const targetZones = zones.filter((z) => matchesRule(z, rule));

        for (const zone of targetZones) {
          const distLeft = zone.position.x;
          const distTop = zone.position.y;
          const distRight = layout.dimensions.width - (zone.position.x + zone.size.width);
          const distBottom = layout.dimensions.height - (zone.position.y + zone.size.height);
          const minWallDist = Math.min(distLeft, distTop, distRight, distBottom);

          if (minWallDist < rule.minDistanceM) {
            violations.push({
              ruleId: rule.id,
              ruleCategory: "spacing",
              severity: rule.severity ?? "warning",
              message: `${zone.name} is ${minWallDist.toFixed(2)}m from wall, minimum is ${rule.minDistanceM}m: ${rule.description}`,
              messageZh: `${zone.name} \u8ddd\u5899 ${minWallDist.toFixed(2)}m\uff0c\u6700\u5c0f\u8981\u6c42 ${rule.minDistanceM}m\uff1a${rule.descriptionZh}`,
              affectedZones: [zone.id],
              suggestion: `Move ${zone.name} at least ${rule.minDistanceM}m from the nearest wall`,
              suggestionZh: `\u5c06 ${zone.name} \u79fb\u81f3\u8ddd\u5899\u81f3\u5c11 ${rule.minDistanceM}m`,
              standard: rule.standard,
            });
          }
        }
        break;
      }

      case "exit_access": {
        // Exit access: zones must be within max travel distance of an entrance zone.
        // For this rule, minDistanceM is used as the maximum allowed distance.
        const entrances = zones.filter((z) => z.type === "entrance");
        if (entrances.length === 0) break; // Skip if no entrance zones defined

        const targetZones = zones.filter(
          (z) => z.type !== "entrance" && matchesRule(z, rule),
        );

        for (const zone of targetZones) {
          // Find nearest entrance
          let nearestDist = Infinity;
          for (const entrance of entrances) {
            const dist = getMinGap(zone, entrance);
            if (dist < nearestDist) nearestDist = dist;
          }

          if (nearestDist > rule.minDistanceM) {
            violations.push({
              ruleId: rule.id,
              ruleCategory: "spacing",
              severity: rule.severity ?? "warning",
              message: `${zone.name} is ${nearestDist.toFixed(2)}m from nearest exit, maximum allowed is ${rule.minDistanceM}m: ${rule.description}`,
              messageZh: `${zone.name} \u8ddd\u6700\u8fd1\u51fa\u53e3 ${nearestDist.toFixed(2)}m\uff0c\u6700\u5927\u5141\u8bb8 ${rule.minDistanceM}m\uff1a${rule.descriptionZh}`,
              affectedZones: [zone.id],
              suggestion: `Consider adding an exit closer to ${zone.name} or relocating it`,
              suggestionZh: `\u8003\u8651\u5728 ${zone.name} \u9644\u8fd1\u589e\u8bbe\u51fa\u53e3\u6216\u91cd\u65b0\u5e03\u5c40`,
              standard: rule.standard,
            });
          }
        }
        break;
      }
    }
  }

  return violations;
}
