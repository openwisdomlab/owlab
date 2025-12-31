/**
 * Psychological Safety Assessment Schemas
 * Based on Amy Edmondson's Team Psychological Safety Theory
 * Combined with spatial design factors that influence psychological safety
 */

import { z } from "zod";

/**
 * Six dimensions of psychological safety in spatial design
 * Based on Edmondson's theory + environmental psychology research
 */
export const PsychologicalSafetyDimensionSchema = z.enum([
  "inclusion",    // Inclusion Safety - feeling accepted and belonging
  "learner",      // Learner Safety - safe to ask questions, make mistakes, learn
  "contributor",  // Contributor Safety - safe to contribute ideas
  "challenger",   // Challenger Safety - safe to challenge status quo
  "restorative",  // Restorative - stress relief and recovery capacity
  "privacy",      // Privacy - private conversation and reflection space
]);

export type PsychologicalSafetyDimension = z.infer<typeof PsychologicalSafetyDimensionSchema>;

/**
 * Score details for a single dimension
 */
export const DimensionScoreSchema = z.object({
  dimension: PsychologicalSafetyDimensionSchema,
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  factors: z.array(z.object({
    name: z.string(),
    value: z.number(),
    contribution: z.number(),
    description: z.string(),
  })),
  suggestions: z.array(z.string()),
});

export type DimensionScore = z.infer<typeof DimensionScoreSchema>;

/**
 * Spatial factors that influence psychological safety
 */
export const SpatialFactorsSchema = z.object({
  size: z.number(),                      // Area in m²
  aspectRatio: z.number(),               // Width/Height ratio
  openness: z.number().min(0).max(1),    // 0=fully enclosed, 1=fully open
  visibility: z.number().min(0).max(1),  // How visible from outside
  accessibility: z.number().min(0).max(1), // How easy to reach
  centralityIndex: z.number().min(0).max(1), // Position centrality
  proximityToEntrance: z.number(),       // Distance to entrance
  neighboringZones: z.array(z.string()), // Adjacent zone IDs
  hasNaturalLight: z.boolean(),          // Natural light availability
  hasPrivateCorner: z.boolean(),         // Private corner availability
});

export type SpatialFactors = z.infer<typeof SpatialFactorsSchema>;

/**
 * Recommendation for improving psychological safety
 */
export const RecommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  action: z.string(),
  impact: z.string(),
  dimension: PsychologicalSafetyDimensionSchema,
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

/**
 * Zone psychological safety assessment result
 */
export const ZonePsychologicalSafetySchema = z.object({
  zoneId: z.string(),
  overallScore: z.number().min(0).max(100),
  safetyLevel: z.enum(["excellent", "good", "moderate", "needs_improvement", "critical"]),
  dimensions: z.array(DimensionScoreSchema),
  spatialFactors: SpatialFactorsSchema,
  recommendations: z.array(RecommendationSchema),
  lastAssessedAt: z.coerce.date(),
});

export type ZonePsychologicalSafety = z.infer<typeof ZonePsychologicalSafetySchema>;

/**
 * Layout-wide psychological safety assessment
 */
export const LayoutPsychologicalSafetySchema = z.object({
  layoutId: z.string().optional(),
  overallScore: z.number().min(0).max(100),
  safetyLevel: z.enum(["excellent", "good", "moderate", "needs_improvement", "critical"]),
  zoneAssessments: z.array(ZonePsychologicalSafetySchema),
  summary: z.string(),
  topRecommendations: z.array(z.string()),
  assessedAt: z.coerce.date(),
});

export type LayoutPsychologicalSafety = z.infer<typeof LayoutPsychologicalSafetySchema>;

/**
 * Dimension labels in Chinese
 */
export const DIMENSION_LABELS: Record<PsychologicalSafetyDimension, string> = {
  inclusion: "包容安全",
  learner: "学习安全",
  contributor: "贡献安全",
  challenger: "挑战安全",
  restorative: "恢复性",
  privacy: "隐私性",
};

/**
 * Dimension descriptions
 */
export const DIMENSION_DESCRIPTIONS: Record<PsychologicalSafetyDimension, string> = {
  inclusion: "感觉被接纳，是群体的一部分",
  learner: "可以提问、犯错、学习，不会被嘲笑",
  contributor: "可以提出意见和建议",
  challenger: "可以质疑现状，提出不同观点",
  restorative: "压力缓冲，心理恢复能力",
  privacy: "私密对话和反思的空间",
};

/**
 * Safety level labels in Chinese
 */
export const SAFETY_LEVEL_LABELS: Record<string, string> = {
  excellent: "优秀",
  good: "良好",
  moderate: "中等",
  needs_improvement: "需改进",
  critical: "需关注",
};

/**
 * Safety level colors for UI
 */
export const SAFETY_LEVEL_COLORS: Record<string, string> = {
  excellent: "text-green-400",
  good: "text-cyan-400",
  moderate: "text-yellow-400",
  needs_improvement: "text-orange-400",
  critical: "text-red-400",
};
