/**
 * Psychological Safety Calculator
 * Calculates psychological safety scores based on spatial attributes
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type {
  PsychologicalSafetyDimension,
  DimensionScore,
  SpatialFactors,
  ZonePsychologicalSafety,
  Recommendation,
} from "@/lib/schemas/psychological-safety";
import { DIMENSION_LABELS } from "@/lib/schemas/psychological-safety";

/**
 * Default dimension weights
 */
export const DEFAULT_DIMENSION_WEIGHTS: Record<PsychologicalSafetyDimension, number> = {
  inclusion: 0.20,
  learner: 0.20,
  contributor: 0.20,
  challenger: 0.15,
  restorative: 0.15,
  privacy: 0.10,
};

/**
 * Weight adjustments by zone type
 */
export const ZONE_TYPE_WEIGHT_ADJUSTMENTS: Record<string, Partial<Record<PsychologicalSafetyDimension, number>>> = {
  workspace: { learner: 0.25, restorative: 0.20 },
  meeting: { contributor: 0.25, challenger: 0.20, privacy: 0.15 },
  compute: { learner: 0.25, privacy: 0.15 },
  entrance: { inclusion: 0.35 },
  storage: { privacy: 0.20 },
  utility: { privacy: 0.15 },
};

/**
 * Get adjusted weights for a zone type
 */
function getAdjustedWeights(zoneType: string): Record<PsychologicalSafetyDimension, number> {
  const weights = { ...DEFAULT_DIMENSION_WEIGHTS };
  const adjustments = ZONE_TYPE_WEIGHT_ADJUSTMENTS[zoneType];

  if (adjustments) {
    Object.entries(adjustments).forEach(([dim, weight]) => {
      weights[dim as PsychologicalSafetyDimension] = weight as number;
    });
  }

  // Normalize weights to sum to 1
  const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
  Object.keys(weights).forEach((key) => {
    weights[key as PsychologicalSafetyDimension] /= total;
  });

  return weights;
}

/**
 * Calculate distance between two zones
 */
function calculateDistanceBetweenZones(zone1: ZoneData, zone2: ZoneData): number {
  const center1X = zone1.position.x + zone1.size.width / 2;
  const center1Y = zone1.position.y + zone1.size.height / 2;
  const center2X = zone2.position.x + zone2.size.width / 2;
  const center2Y = zone2.position.y + zone2.size.height / 2;

  return Math.sqrt(Math.pow(center1X - center2X, 2) + Math.pow(center1Y - center2Y, 2));
}

/**
 * Find neighboring zones (within 2 units distance)
 */
function findNeighboringZones(zone: ZoneData, allZones: ZoneData[]): ZoneData[] {
  return allZones.filter((other) => {
    if (other.id === zone.id) return false;
    const distance = calculateDistanceBetweenZones(zone, other);
    return distance < Math.max(zone.size.width, zone.size.height, other.size.width, other.size.height) + 2;
  });
}

/**
 * Calculate spatial factors for a zone
 */
export function calculateSpatialFactors(
  zone: ZoneData,
  layout: LayoutData,
  allZones: ZoneData[]
): SpatialFactors {
  const { position, size, type } = zone;
  const { dimensions: layoutDims } = layout;

  // Area
  const area = size.width * size.height;

  // Aspect ratio
  const aspectRatio = Math.max(size.width, size.height) / Math.min(size.width, size.height);

  // Openness based on zone type
  const baseOpenness: Record<string, number> = {
    entrance: 0.9,
    workspace: 0.6,
    meeting: 0.4,
    compute: 0.3,
    storage: 0.2,
    utility: 0.2,
  };
  const neighbors = findNeighboringZones(zone, allZones);
  let openness = baseOpenness[type] || 0.5;
  const openNeighbors = neighbors.filter((n) => n.type === "entrance" || n.type === "workspace").length;
  if (neighbors.length > 0) {
    openness += (openNeighbors / neighbors.length) * 0.2;
  }
  openness = Math.min(1, Math.max(0, openness));

  // Visibility
  const centerX = layoutDims.width / 2;
  const centerY = layoutDims.height / 2;
  const zoneCenterX = position.x + size.width / 2;
  const zoneCenterY = position.y + size.height / 2;
  const normalizedDistX = Math.abs(zoneCenterX - centerX) / centerX;
  const normalizedDistY = Math.abs(zoneCenterY - centerY) / centerY;
  let visibility = 1 - (normalizedDistX + normalizedDistY) / 2;
  if (type === "meeting") visibility *= 0.7;
  if (type === "entrance") visibility = 0.95;
  visibility = Math.min(1, Math.max(0, visibility));

  // Accessibility
  const entrances = allZones.filter((z) => z.type === "entrance");
  let accessibility: number;
  if (entrances.length === 0) {
    const edgeDistance = Math.min(
      position.x,
      position.y,
      layoutDims.width - (position.x + size.width),
      layoutDims.height - (position.y + size.height)
    );
    accessibility = 1 - edgeDistance / Math.min(layoutDims.width, layoutDims.height);
  } else {
    const minDistance = Math.min(...entrances.map((e) => calculateDistanceBetweenZones(zone, e)));
    const maxPossibleDistance = Math.sqrt(Math.pow(layoutDims.width, 2) + Math.pow(layoutDims.height, 2));
    accessibility = 1 - minDistance / maxPossibleDistance;
  }
  accessibility = Math.min(1, Math.max(0, accessibility));

  // Centrality
  const distanceToCenter = Math.sqrt(Math.pow(zoneCenterX - centerX, 2) + Math.pow(zoneCenterY - centerY, 2));
  const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
  const centralityIndex = 1 - distanceToCenter / maxDistance;

  // Proximity to entrance
  const proximityToEntrance = entrances.length > 0
    ? Math.min(...entrances.map((e) => calculateDistanceBetweenZones(zone, e)))
    : layoutDims.width;

  // Natural light (edge positions more likely)
  const isNearEdge =
    position.x === 0 ||
    position.y === 0 ||
    position.x + size.width >= layoutDims.width ||
    position.y + size.height >= layoutDims.height;

  // Private corner (larger areas or meeting rooms)
  const hasPrivateCorner = area >= 20 || type === "meeting";

  return {
    size: area,
    aspectRatio,
    openness,
    visibility,
    accessibility,
    centralityIndex,
    proximityToEntrance,
    neighboringZones: neighbors.map((z) => z.id),
    hasNaturalLight: isNearEdge,
    hasPrivateCorner,
  };
}

/**
 * Calculate inclusion safety score
 */
function calculateInclusionScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);

  const factorContributions = [
    {
      name: "accessibility",
      value: factors.accessibility,
      contribution: factors.accessibility * 30,
      description: "空间可达性 - 越容易到达越包容",
    },
    {
      name: "openness",
      value: factors.openness,
      contribution: factors.openness * 25,
      description: "空间开放度 - 开放的空间更易接纳",
    },
    {
      name: "centralityIndex",
      value: factors.centralityIndex,
      contribution: factors.centralityIndex * 20,
      description: "位置中心性 - 中心位置象征重要性",
    },
    {
      name: "proximityToEntrance",
      value: 1 - Math.min(factors.proximityToEntrance / 20, 1),
      contribution: (1 - Math.min(factors.proximityToEntrance / 20, 1)) * 15,
      description: "接近入口 - 新人更易找到",
    },
    {
      name: "aspectRatio",
      value: factors.aspectRatio <= 2 ? 1 : 1 / factors.aspectRatio,
      contribution: factors.aspectRatio <= 2 ? 10 : 10 / factors.aspectRatio,
      description: "空间比例 - 均衡比例更舒适",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (factors.accessibility < 0.6) {
    suggestions.push("考虑增加通往此区域的通道或调整位置，提高可达性");
  }
  if (factors.openness < 0.4) {
    suggestions.push("可考虑使用透明隔断或减少物理障碍，增强开放感");
  }
  if (1 - Math.min(factors.proximityToEntrance / 20, 1) < 0.3) {
    suggestions.push("此区域较难被新人发现，可增加导视标识");
  }
  if (suggestions.length === 0) {
    suggestions.push("包容性设计良好，继续保持");
  }

  return {
    dimension: "inclusion",
    score: Math.min(100, Math.round(score)),
    weight: weights.inclusion,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate learner safety score
 */
function calculateLearnerSafetyScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);
  const optimalVisibility = 0.5;
  const visibilityScore = 1 - Math.abs(factors.visibility - optimalVisibility) * 2;

  const factorContributions = [
    {
      name: "size",
      value: factors.size,
      contribution: Math.min(factors.size / 30, 1) * 25,
      description: "空间面积 - 足够空间支持试错",
    },
    {
      name: "hasPrivateCorner",
      value: factors.hasPrivateCorner ? 1 : 0,
      contribution: factors.hasPrivateCorner ? 25 : 0,
      description: "私密角落 - 可以安静学习和犯错",
    },
    {
      name: "visibility",
      value: visibilityScore,
      contribution: Math.max(0, visibilityScore) * 20,
      description: "适中可见性 - 既有支持又不过度暴露",
    },
    {
      name: "hasNaturalLight",
      value: factors.hasNaturalLight ? 1 : 0,
      contribution: factors.hasNaturalLight ? 15 : 0,
      description: "自然光 - 提升学习效率和情绪",
    },
    {
      name: "neighborSupport",
      value: factors.neighboringZones.length > 0 ? 1 : 0.5,
      contribution: factors.neighboringZones.length > 0 ? 15 : 7.5,
      description: "相邻区域 - 可获得支持和帮助",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (factors.size < 15) {
    suggestions.push("空间较小，可能限制学习活动的展开");
  }
  if (!factors.hasPrivateCorner) {
    suggestions.push("建议增加私密角落，让学习者有安静反思的空间");
  }
  if (!factors.hasNaturalLight) {
    suggestions.push("考虑增加自然光源或模拟自然光的照明");
  }
  if (suggestions.length === 0) {
    suggestions.push("学习安全设计良好，继续保持");
  }

  return {
    dimension: "learner",
    score: Math.min(100, Math.round(score)),
    weight: weights.learner,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate contributor safety score
 */
function calculateContributorSafetyScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);
  const aspectRatioScore =
    factors.aspectRatio <= 1.5 ? 1 : factors.aspectRatio <= 2 ? 0.8 : Math.max(0, 1 - (factors.aspectRatio - 2) * 0.2);

  const factorContributions = [
    {
      name: "size",
      value: factors.size,
      contribution: Math.min(factors.size / 20, 1) * 25,
      description: "空间面积 - 每人有足够发言空间",
    },
    {
      name: "aspectRatio",
      value: aspectRatioScore,
      contribution: aspectRatioScore * 30,
      description: "空间比例 - 正方形/圆形促进平等对话",
    },
    {
      name: "openness",
      value: factors.openness,
      contribution: factors.openness * 25,
      description: "开放度 - 开放环境鼓励表达",
    },
    {
      name: "centralityIndex",
      value: factors.centralityIndex,
      contribution: factors.centralityIndex * 20,
      description: "位置中心性 - 中心位置更受关注",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (aspectRatioScore < 0.6) {
    suggestions.push("空间过于狭长，考虑调整为更接近正方形的比例");
  }
  if (factors.openness < 0.4) {
    suggestions.push("空间较封闭，可能抑制自由表达");
  }
  if (suggestions.length === 0) {
    suggestions.push("贡献安全设计良好，继续保持");
  }

  return {
    dimension: "contributor",
    score: Math.min(100, Math.round(score)),
    weight: weights.contributor,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate challenger safety score
 */
function calculateChallengerSafetyScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);
  const lowVisibilityScore = 1 - factors.visibility;

  const factorContributions = [
    {
      name: "lowVisibility",
      value: lowVisibilityScore,
      contribution: lowVisibilityScore * 35,
      description: "低可见性 - 安全提出不同意见",
    },
    {
      name: "hasPrivateCorner",
      value: factors.hasPrivateCorner ? 1 : 0,
      contribution: factors.hasPrivateCorner ? 30 : 0,
      description: "私密角落 - 可进行敏感对话",
    },
    {
      name: "size",
      value: factors.size >= 15 ? 1 : factors.size / 15,
      contribution: (factors.size >= 15 ? 1 : factors.size / 15) * 20,
      description: "空间大小 - 足够空间保持距离",
    },
    {
      name: "neighborCount",
      value: factors.neighboringZones.length <= 2 ? 1 : 0.5,
      contribution: (factors.neighboringZones.length <= 2 ? 1 : 0.5) * 15,
      description: "较少相邻区域 - 减少被打断干扰",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (factors.visibility > 0.7) {
    suggestions.push("空间过于暴露，不利于提出挑战性观点");
  }
  if (!factors.hasPrivateCorner) {
    suggestions.push("缺少私密空间，难以进行敏感讨论");
  }
  if (suggestions.length === 0) {
    suggestions.push("挑战安全设计良好，继续保持");
  }

  return {
    dimension: "challenger",
    score: Math.min(100, Math.round(score)),
    weight: weights.challenger,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate restorative score
 */
function calculateRestorativeScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);

  const factorContributions = [
    {
      name: "hasNaturalLight",
      value: factors.hasNaturalLight ? 1 : 0,
      contribution: factors.hasNaturalLight ? 30 : 0,
      description: "自然光 - 核心恢复性要素",
    },
    {
      name: "size",
      value: Math.min(factors.size / 25, 1),
      contribution: Math.min(factors.size / 25, 1) * 25,
      description: "空间面积 - 宽敞空间更放松",
    },
    {
      name: "lowVisibility",
      value: 1 - factors.visibility,
      contribution: (1 - factors.visibility) * 25,
      description: "低可见性 - 可以安心休息",
    },
    {
      name: "hasPrivateCorner",
      value: factors.hasPrivateCorner ? 1 : 0,
      contribution: factors.hasPrivateCorner ? 20 : 0,
      description: "私密角落 - 压力缓冲区",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (!factors.hasNaturalLight) {
    suggestions.push("增加自然光或绿植，提升恢复性");
  }
  if (factors.size < 20) {
    suggestions.push("空间较紧凑，考虑增加休息区域");
  }
  if (suggestions.length === 0) {
    suggestions.push("恢复性设计良好，继续保持");
  }

  return {
    dimension: "restorative",
    score: Math.min(100, Math.round(score)),
    weight: weights.restorative,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate privacy score
 */
function calculatePrivacyScore(
  zone: ZoneData,
  factors: SpatialFactors
): DimensionScore {
  const weights = getAdjustedWeights(zone.type);
  const distanceFromEntranceScore = Math.min(factors.proximityToEntrance / 10, 1);

  const factorContributions = [
    {
      name: "lowVisibility",
      value: 1 - factors.visibility,
      contribution: (1 - factors.visibility) * 30,
      description: "低可见性 - 不易被观察",
    },
    {
      name: "lowOpenness",
      value: 1 - factors.openness,
      contribution: (1 - factors.openness) * 25,
      description: "低开放度 - 物理隔离",
    },
    {
      name: "hasPrivateCorner",
      value: factors.hasPrivateCorner ? 1 : 0,
      contribution: factors.hasPrivateCorner ? 25 : 0,
      description: "私密角落 - 一对一对话空间",
    },
    {
      name: "distanceFromEntrance",
      value: distanceFromEntranceScore,
      contribution: distanceFromEntranceScore * 20,
      description: "远离入口 - 减少人流干扰",
    },
  ];

  const score = factorContributions.reduce((sum, f) => sum + f.contribution, 0);
  const suggestions: string[] = [];

  if (factors.visibility > 0.6) {
    suggestions.push("可见性较高，考虑增加隔断或屏风");
  }
  if (factors.openness > 0.7) {
    suggestions.push("空间过于开放，私密性不足");
  }
  if (suggestions.length === 0) {
    suggestions.push("隐私性设计良好，继续保持");
  }

  return {
    dimension: "privacy",
    score: Math.min(100, Math.round(score)),
    weight: weights.privacy,
    factors: factorContributions,
    suggestions,
  };
}

/**
 * Calculate all dimension scores
 */
export function calculateDimensionScores(
  zone: ZoneData,
  spatialFactors: SpatialFactors
): DimensionScore[] {
  return [
    calculateInclusionScore(zone, spatialFactors),
    calculateLearnerSafetyScore(zone, spatialFactors),
    calculateContributorSafetyScore(zone, spatialFactors),
    calculateChallengerSafetyScore(zone, spatialFactors),
    calculateRestorativeScore(zone, spatialFactors),
    calculatePrivacyScore(zone, spatialFactors),
  ];
}

/**
 * Calculate overall weighted score
 */
export function calculateOverallScore(dimensions: DimensionScore[]): number {
  let totalScore = 0;
  let totalWeight = 0;

  for (const dim of dimensions) {
    totalScore += dim.score * dim.weight;
    totalWeight += dim.weight;
  }

  return Math.round(totalScore / totalWeight);
}

/**
 * Get safety level from score
 */
export function getSafetyLevel(score: number): ZonePsychologicalSafety["safetyLevel"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  if (score >= 40) return "needs_improvement";
  return "critical";
}

/**
 * Generate recommendations for a zone
 */
export function generateZoneRecommendations(
  dimensions: DimensionScore[],
  zoneType: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const dim of dimensions) {
    if (dim.score < 60) {
      for (const suggestion of dim.suggestions) {
        if (!suggestion.includes("良好") && !suggestion.includes("继续保持")) {
          recommendations.push({
            priority: dim.score < 40 ? "high" : "medium",
            action: suggestion,
            impact: `提升${DIMENSION_LABELS[dim.dimension]}指数`,
            dimension: dim.dimension,
          });
        }
      }
    }
  }

  // Sort by priority
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations.slice(0, 5);
}

/**
 * Assess a complete layout
 */
export function assessLayout(layout: LayoutData): {
  zoneAssessments: ZonePsychologicalSafety[];
  overallScore: number;
  safetyLevel: ZonePsychologicalSafety["safetyLevel"];
  summary: string;
  topRecommendations: string[];
} {
  const zoneAssessments: ZonePsychologicalSafety[] = [];

  for (const zone of layout.zones) {
    const spatialFactors = calculateSpatialFactors(zone, layout, layout.zones);
    const dimensions = calculateDimensionScores(zone, spatialFactors);
    const overallScore = calculateOverallScore(dimensions);
    const safetyLevel = getSafetyLevel(overallScore);
    const recommendations = generateZoneRecommendations(dimensions, zone.type);

    zoneAssessments.push({
      zoneId: zone.id,
      overallScore,
      safetyLevel,
      dimensions,
      spatialFactors,
      recommendations,
      lastAssessedAt: new Date(),
    });
  }

  // Calculate layout overall score
  const layoutOverallScore = Math.round(
    zoneAssessments.reduce((sum, z) => sum + z.overallScore, 0) / zoneAssessments.length
  );
  const layoutSafetyLevel = getSafetyLevel(layoutOverallScore);

  // Generate summary
  const lowestZone = zoneAssessments.reduce((min, a) => (a.overallScore < min.overallScore ? a : min));
  const highestZone = zoneAssessments.reduce((max, a) => (a.overallScore > max.overallScore ? a : max));
  const lowestZoneName = layout.zones.find((z) => z.id === lowestZone.zoneId)?.name || "未知区域";
  const highestZoneName = layout.zones.find((z) => z.id === highestZone.zoneId)?.name || "未知区域";

  let summary: string;
  if (layoutOverallScore >= 70) {
    summary = `整体心理安全环境良好。${highestZoneName}表现最佳（${highestZone.overallScore}分），建议关注${lowestZoneName}的改进空间（${lowestZone.overallScore}分）。`;
  } else if (layoutOverallScore >= 50) {
    summary = `整体心理安全环境处于中等水平。${lowestZoneName}（${lowestZone.overallScore}分）需要优先改进，可参考${highestZoneName}的设计经验。`;
  } else {
    summary = `整体心理安全环境需要关注。建议从${lowestZoneName}开始改进，重点提升包容性和学习安全感。`;
  }

  // Collect top recommendations
  const allRecommendations: Array<{ action: string; score: number }> = [];
  for (const assessment of zoneAssessments) {
    for (const rec of assessment.recommendations) {
      if (rec.priority === "high") {
        allRecommendations.push({
          action: rec.action,
          score: assessment.overallScore,
        });
      }
    }
  }
  allRecommendations.sort((a, b) => a.score - b.score);
  const topRecommendations = [...new Set(allRecommendations.map((r) => r.action))].slice(0, 5);

  return {
    zoneAssessments,
    overallScore: layoutOverallScore,
    safetyLevel: layoutSafetyLevel,
    summary,
    topRecommendations,
  };
}
