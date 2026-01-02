// src/lib/schemas/discipline-template.ts
import { z } from "zod";
import { DisciplineSchema } from "./launcher";

// 设备推荐优先级
export const EquipmentPrioritySchema = z.enum(["essential", "recommended", "optional"]);

export type EquipmentPriority = z.infer<typeof EquipmentPrioritySchema>;

// 设备推荐
export const EquipmentRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  priority: EquipmentPrioritySchema,
  estimatedPrice: z.number().optional(),
});

export type EquipmentRecommendation = z.infer<typeof EquipmentRecommendationSchema>;

// 区域设备配置
export const ZoneEquipmentConfigSchema = z.object({
  zoneType: z.string(),
  items: z.array(EquipmentRecommendationSchema),
});

export type ZoneEquipmentConfig = z.infer<typeof ZoneEquipmentConfigSchema>;

// 预设区域（简化版 ZoneData）
export const TemplateZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  color: z.string(),
});

export type TemplateZone = z.infer<typeof TemplateZoneSchema>;

// 学科模板元数据
export const DisciplineTemplateMetaSchema = z.object({
  minArea: z.number(),
  capacity: z.number(),
  budgetRange: z.tuple([z.number(), z.number()]),
});

export type DisciplineTemplateMeta = z.infer<typeof DisciplineTemplateMetaSchema>;

// 学科模板
export const DisciplineTemplateSchema = z.object({
  id: DisciplineSchema,
  name: z.string(),
  description: z.string(),
  layout: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      unit: z.enum(["m", "ft"]).default("m"),
    }),
    zones: z.array(TemplateZoneSchema),
  }),
  recommendedEquipment: z.array(ZoneEquipmentConfigSchema),
  meta: DisciplineTemplateMetaSchema,
});

export type DisciplineTemplate = z.infer<typeof DisciplineTemplateSchema>;
