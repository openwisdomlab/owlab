/**
 * Allen Curve Communication Analysis Schemas
 * Based on Thomas Allen's research on communication frequency vs distance
 */

import { z } from "zod";

/**
 * Collaboration intensity levels
 */
export const CollaborationIntensitySchema = z.enum(["high", "medium", "low"]);
export type CollaborationIntensity = z.infer<typeof CollaborationIntensitySchema>;

/**
 * Collaboration link between two zones
 */
export const CollaborationLinkSchema = z.object({
  id: z.string(),
  sourceZoneId: z.string(),
  targetZoneId: z.string(),
  intensity: CollaborationIntensitySchema,
  autoInferred: z.boolean(),
  customWeight: z.number().min(0).max(1).optional(),
});
export type CollaborationLink = z.infer<typeof CollaborationLinkSchema>;

/**
 * Link assessment status
 */
export const LinkStatusSchema = z.enum(["optimal", "acceptable", "warning", "critical"]);
export type LinkStatus = z.infer<typeof LinkStatusSchema>;

/**
 * Assessment result for a single link
 */
export const LinkAssessmentSchema = z.object({
  link: CollaborationLinkSchema,
  distance: z.number(),
  efficiency: z.number().min(0).max(100),
  status: LinkStatusSchema,
});
export type LinkAssessment = z.infer<typeof LinkAssessmentSchema>;

/**
 * Recommendation types
 */
export const RecommendationTypeSchema = z.enum(["move_closer", "move_apart", "cluster"]);
export type RecommendationType = z.infer<typeof RecommendationTypeSchema>;

/**
 * Optimization recommendation
 */
export const AllenCurveRecommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  type: RecommendationTypeSchema,
  affectedZones: z.array(z.string()),
  message: z.string(),
  estimatedImprovement: z.number(),
});
export type AllenCurveRecommendation = z.infer<typeof AllenCurveRecommendationSchema>;

/**
 * Overall Allen Curve assessment
 */
export const AllenCurveAssessmentSchema = z.object({
  links: z.array(LinkAssessmentSchema),
  overallScore: z.number().min(0).max(100),
  safetyLevel: z.enum(["excellent", "good", "moderate", "needs_improvement", "critical"]),
  recommendations: z.array(AllenCurveRecommendationSchema),
  assessedAt: z.coerce.date(),
});
export type AllenCurveAssessment = z.infer<typeof AllenCurveAssessmentSchema>;

/**
 * Zone type collaboration matrix
 * Defines default collaboration intensity between zone types
 */
export const ZONE_COLLABORATION_MATRIX: Record<string, Record<string, CollaborationIntensity>> = {
  compute: {
    compute: "medium",
    workspace: "high",
    meeting: "medium",
    storage: "low",
    break: "low",
    entrance: "low",
  },
  workspace: {
    compute: "high",
    workspace: "medium",
    meeting: "high",
    storage: "low",
    break: "medium",
    entrance: "medium",
  },
  meeting: {
    compute: "medium",
    workspace: "high",
    meeting: "low",
    storage: "low",
    break: "medium",
    entrance: "medium",
  },
  storage: {
    compute: "low",
    workspace: "low",
    meeting: "low",
    storage: "low",
    break: "low",
    entrance: "low",
  },
  break: {
    compute: "low",
    workspace: "medium",
    meeting: "medium",
    storage: "low",
    break: "low",
    entrance: "medium",
  },
  entrance: {
    compute: "low",
    workspace: "medium",
    meeting: "medium",
    storage: "low",
    break: "medium",
    entrance: "low",
  },
};

/**
 * Intensity labels in Chinese
 */
export const INTENSITY_LABELS: Record<CollaborationIntensity, string> = {
  high: "高频协作",
  medium: "中等协作",
  low: "低频协作",
};

/**
 * Status labels in Chinese
 */
export const STATUS_LABELS: Record<LinkStatus, string> = {
  optimal: "最佳",
  acceptable: "良好",
  warning: "需注意",
  critical: "需改进",
};

/**
 * Status colors for UI
 */
export const STATUS_COLORS: Record<LinkStatus, string> = {
  optimal: "#10b981",
  acceptable: "#22d3ee",
  warning: "#eab308",
  critical: "#ef4444",
};

/**
 * Status line widths
 */
export const STATUS_LINE_WIDTHS: Record<LinkStatus, number> = {
  optimal: 3,
  acceptable: 2,
  warning: 2,
  critical: 1,
};
