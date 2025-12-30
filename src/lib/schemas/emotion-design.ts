// src/lib/schemas/emotion-design.ts
import { z } from "zod";

// 情绪类型
export const EmotionTypeSchema = z.enum([
  "awe",        // 敬畏
  "curiosity",  // 好奇
  "focus",      // 专注
  "excitement", // 兴奋
  "calm",       // 平静
  "collaboration", // 协作
  "creativity", // 创造力
  "safety",     // 安全感
]);

export type EmotionType = z.infer<typeof EmotionTypeSchema>;

// 情绪节点（时间轴上的一个点）
export const EmotionNodeSchema = z.object({
  id: z.string(),
  emotion: EmotionTypeSchema,
  intensity: z.number().min(0).max(1), // 情绪强度
  timestamp: z.number(), // 相对时间（分钟）
  description: z.string().optional(),
});

export type EmotionNode = z.infer<typeof EmotionNodeSchema>;

// 情绪剧本（时间轴）
export const EmotionScriptSchema = z.object({
  id: z.string(),
  name: z.string(),
  nodes: z.array(EmotionNodeSchema),
  totalDuration: z.number(), // 总时长（分钟）
});

export type EmotionScript = z.infer<typeof EmotionScriptSchema>;

// 空间要素推荐
export const SpatialElementSchema = z.object({
  category: z.enum([
    "height",     // 空间高度
    "lighting",   // 光线
    "color",      // 色调
    "acoustics",  // 声学
    "material",   // 材质
    "layout",     // 布局
    "furniture",  // 家具
  ]),
  recommendation: z.string(),
  rationale: z.string(), // 科学依据
  priority: z.enum(["high", "medium", "low"]),
});

export type SpatialElement = z.infer<typeof SpatialElementSchema>;

// 情绪到空间的映射结果
export const EmotionToSpaceResultSchema = z.object({
  emotionScript: EmotionScriptSchema,
  spatialElements: z.array(SpatialElementSchema),
  suggestedZones: z.array(z.object({
    name: z.string(),
    purpose: z.string(),
    targetEmotions: z.array(EmotionTypeSchema),
    suggestedSize: z.object({ width: z.number(), height: z.number() }),
    keyFeatures: z.array(z.string()),
  })),
  designNarrative: z.string(), // 设计叙事
});

export type EmotionToSpaceResult = z.infer<typeof EmotionToSpaceResultSchema>;

// 情绪颜色映射（用于 UI）
export const EMOTION_COLORS: Record<EmotionType, string> = {
  awe: "#8b5cf6",        // 紫色
  curiosity: "#22d3ee",  // 青色
  focus: "#3b82f6",      // 蓝色
  excitement: "#f59e0b", // 橙色
  calm: "#10b981",       // 绿色
  collaboration: "#ec4899", // 粉色
  creativity: "#f97316", // 橙红
  safety: "#6b7280",     // 灰色
};

// 情绪中文名称
export const EMOTION_LABELS: Record<EmotionType, string> = {
  awe: "敬畏感",
  curiosity: "好奇心",
  focus: "专注力",
  excitement: "兴奋感",
  calm: "平静",
  collaboration: "协作感",
  creativity: "创造力",
  safety: "安全感",
};
