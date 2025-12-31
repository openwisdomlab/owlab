/**
 * Allen Curve Communication Efficiency Calculator
 * Based on Thomas Allen's research: P(d) = e^(-αd) where α ≈ 0.1
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type {
  CollaborationLink,
  CollaborationIntensity,
  LinkAssessment,
  LinkStatus,
  AllenCurveRecommendation,
  AllenCurveAssessment,
} from "@/lib/schemas/allen-curve";
import { ZONE_COLLABORATION_MATRIX } from "@/lib/schemas/allen-curve";

/**
 * Allen Curve decay constant (α ≈ 0.1)
 */
export const DECAY_ALPHA = 0.1;

/**
 * Distance thresholds for communication efficiency
 */
export const DISTANCE_THRESHOLDS = {
  optimal: 10,
  warning: 30,
};

/**
 * Intensity weights for collaboration links
 */
export const INTENSITY_WEIGHTS: Record<CollaborationIntensity, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
};

/**
 * Get the center point of a zone
 */
export function getZoneCenter(zone: ZoneData): { x: number; y: number } {
  return {
    x: zone.position.x + zone.size.width / 2,
    y: zone.position.y + zone.size.height / 2,
  };
}

/**
 * Calculate Euclidean distance between two zone centers
 */
export function calculateDistance(zoneA: ZoneData, zoneB: ZoneData): number {
  const centerA = getZoneCenter(zoneA);
  const centerB = getZoneCenter(zoneB);

  return Math.sqrt(
    Math.pow(centerA.x - centerB.x, 2) + Math.pow(centerA.y - centerB.y, 2)
  );
}

/**
 * Calculate communication efficiency using Allen Curve formula
 * P(d) = e^(-αd) * 100
 */
export function calculateEfficiency(distance: number): number {
  return Math.exp(-DECAY_ALPHA * distance) * 100;
}

/**
 * Get efficiency status based on thresholds
 */
export function getEfficiencyStatus(efficiency: number): LinkStatus {
  if (efficiency >= 80) return "optimal";
  if (efficiency >= 60) return "acceptable";
  if (efficiency >= 40) return "warning";
  return "critical";
}

/**
 * Infer collaboration intensity from zone types using the collaboration matrix
 */
export function inferCollaborationIntensity(
  sourceType: string,
  targetType: string
): CollaborationIntensity {
  const sourceMatrix = ZONE_COLLABORATION_MATRIX[sourceType];
  if (sourceMatrix && sourceMatrix[targetType]) {
    return sourceMatrix[targetType];
  }
  // Default to low intensity for unknown zone types
  return "low";
}

/**
 * Generate collaboration links for all zone pairs
 */
export function generateCollaborationLinks(
  layout: LayoutData,
  existingLinks?: CollaborationLink[]
): CollaborationLink[] {
  const links: CollaborationLink[] = [];
  const existingLinkMap = new Map<string, CollaborationLink>();

  // Index existing links by their zone pair (both directions)
  if (existingLinks) {
    for (const link of existingLinks) {
      const key1 = `${link.sourceZoneId}-${link.targetZoneId}`;
      const key2 = `${link.targetZoneId}-${link.sourceZoneId}`;
      existingLinkMap.set(key1, link);
      existingLinkMap.set(key2, link);
    }
  }

  const zones = layout.zones;

  // Generate links for all unique zone pairs
  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const zoneA = zones[i];
      const zoneB = zones[j];
      const key = `${zoneA.id}-${zoneB.id}`;

      // Check if an existing link exists for this pair
      const existingLink = existingLinkMap.get(key);

      if (existingLink) {
        links.push(existingLink);
      } else {
        // Create a new auto-inferred link
        const intensity = inferCollaborationIntensity(zoneA.type, zoneB.type);
        links.push({
          id: `link-${zoneA.id}-${zoneB.id}`,
          sourceZoneId: zoneA.id,
          targetZoneId: zoneB.id,
          intensity,
          autoInferred: true,
        });
      }
    }
  }

  return links;
}

/**
 * Assess a single collaboration link
 */
export function assessLink(
  link: CollaborationLink,
  zones: ZoneData[]
): LinkAssessment {
  const sourceZone = zones.find((z) => z.id === link.sourceZoneId);
  const targetZone = zones.find((z) => z.id === link.targetZoneId);

  if (!sourceZone || !targetZone) {
    throw new Error(
      `Zone not found: ${!sourceZone ? link.sourceZoneId : link.targetZoneId}`
    );
  }

  const distance = calculateDistance(sourceZone, targetZone);
  const baseEfficiency = calculateEfficiency(distance);

  // Apply intensity weight and custom weight if provided
  const intensityWeight = INTENSITY_WEIGHTS[link.intensity];
  const customWeight = link.customWeight ?? 1.0;
  const weightedEfficiency = baseEfficiency * intensityWeight * customWeight;

  // Cap efficiency at 100
  const efficiency = Math.min(100, weightedEfficiency);
  const status = getEfficiencyStatus(efficiency);

  return {
    link,
    distance,
    efficiency,
    status,
  };
}

/**
 * Generate optimization recommendations based on assessments
 */
export function generateRecommendations(
  assessments: LinkAssessment[],
  zones: ZoneData[]
): AllenCurveRecommendation[] {
  const recommendations: AllenCurveRecommendation[] = [];

  // Find critical and warning links that need attention
  const criticalLinks = assessments.filter((a) => a.status === "critical");
  const warningLinks = assessments.filter((a) => a.status === "warning");

  // Generate recommendations for critical links
  for (const assessment of criticalLinks) {
    const sourceZone = zones.find((z) => z.id === assessment.link.sourceZoneId);
    const targetZone = zones.find((z) => z.id === assessment.link.targetZoneId);

    if (!sourceZone || !targetZone) continue;

    const currentEfficiency = assessment.efficiency;
    const targetEfficiency = 60; // Move to acceptable threshold
    const estimatedImprovement = targetEfficiency - currentEfficiency;

    recommendations.push({
      priority: "high",
      type: "move_closer",
      affectedZones: [sourceZone.id, targetZone.id],
      message: `将「${sourceZone.name}」和「${targetZone.name}」靠近放置以提高协作效率（当前距离: ${assessment.distance.toFixed(1)}m, 效率: ${currentEfficiency.toFixed(0)}%）`,
      estimatedImprovement,
    });
  }

  // Generate recommendations for warning links with high intensity
  for (const assessment of warningLinks) {
    if (assessment.link.intensity !== "high") continue;

    const sourceZone = zones.find((z) => z.id === assessment.link.sourceZoneId);
    const targetZone = zones.find((z) => z.id === assessment.link.targetZoneId);

    if (!sourceZone || !targetZone) continue;

    const currentEfficiency = assessment.efficiency;
    const targetEfficiency = 70;
    const estimatedImprovement = targetEfficiency - currentEfficiency;

    recommendations.push({
      priority: "medium",
      type: "move_closer",
      affectedZones: [sourceZone.id, targetZone.id],
      message: `建议将高频协作区域「${sourceZone.name}」和「${targetZone.name}」更靠近放置（当前效率: ${currentEfficiency.toFixed(0)}%）`,
      estimatedImprovement,
    });
  }

  // Identify clustering opportunities
  const zoneAssessmentCounts = new Map<string, { critical: number; warning: number }>();

  for (const assessment of [...criticalLinks, ...warningLinks]) {
    for (const zoneId of [assessment.link.sourceZoneId, assessment.link.targetZoneId]) {
      const counts = zoneAssessmentCounts.get(zoneId) || { critical: 0, warning: 0 };
      if (assessment.status === "critical") {
        counts.critical++;
      } else {
        counts.warning++;
      }
      zoneAssessmentCounts.set(zoneId, counts);
    }
  }

  // Zones with multiple problematic links might benefit from clustering
  for (const [zoneId, counts] of zoneAssessmentCounts.entries()) {
    if (counts.critical >= 2 || counts.warning >= 3) {
      const zone = zones.find((z) => z.id === zoneId);
      if (!zone) continue;

      // Find related zones
      const relatedZoneIds = new Set<string>();
      for (const assessment of [...criticalLinks, ...warningLinks]) {
        if (assessment.link.sourceZoneId === zoneId) {
          relatedZoneIds.add(assessment.link.targetZoneId);
        } else if (assessment.link.targetZoneId === zoneId) {
          relatedZoneIds.add(assessment.link.sourceZoneId);
        }
      }

      recommendations.push({
        priority: counts.critical >= 2 ? "high" : "medium",
        type: "cluster",
        affectedZones: [zoneId, ...Array.from(relatedZoneIds).slice(0, 3)],
        message: `考虑将「${zone.name}」与其高频协作区域集中布置，形成协作集群`,
        estimatedImprovement: counts.critical * 15 + counts.warning * 8,
      });
    }
  }

  // Sort by priority and estimated improvement
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.estimatedImprovement - a.estimatedImprovement;
  });

  // Return top recommendations, removing duplicates
  const seen = new Set<string>();
  const uniqueRecommendations: AllenCurveRecommendation[] = [];

  for (const rec of recommendations) {
    const key = rec.affectedZones.sort().join("-");
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRecommendations.push(rec);
    }
  }

  return uniqueRecommendations.slice(0, 5);
}

/**
 * Get safety level from score
 */
export function getSafetyLevel(
  score: number
): AllenCurveAssessment["safetyLevel"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  if (score >= 40) return "needs_improvement";
  return "critical";
}

/**
 * Main entry point: Assess a layout for communication efficiency
 */
export function assessLayout(
  layout: LayoutData,
  customLinks?: CollaborationLink[]
): AllenCurveAssessment {
  // Generate or merge collaboration links
  const links = generateCollaborationLinks(layout, customLinks);

  // Assess each link
  const assessments: LinkAssessment[] = [];
  for (const link of links) {
    const assessment = assessLink(link, layout.zones);
    assessments.push(assessment);
  }

  // Calculate overall score (weighted by intensity)
  let totalWeightedEfficiency = 0;
  let totalWeight = 0;

  for (const assessment of assessments) {
    const weight = INTENSITY_WEIGHTS[assessment.link.intensity];
    totalWeightedEfficiency += assessment.efficiency * weight;
    totalWeight += weight;
  }

  const overallScore =
    totalWeight > 0 ? Math.round(totalWeightedEfficiency / totalWeight) : 0;
  const safetyLevel = getSafetyLevel(overallScore);

  // Generate recommendations
  const recommendations = generateRecommendations(assessments, layout.zones);

  return {
    links: assessments,
    overallScore,
    safetyLevel,
    recommendations,
    assessedAt: new Date(),
  };
}
