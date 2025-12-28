/**
 * Template Schemas - Types for layout templates and marketplace
 */

import { z } from "zod";
import { LayoutSchema } from "@/lib/ai/agents/layout-agent";

// ============================================
// Template Category Schema
// ============================================

export const TemplateCategorySchema = z.enum([
  "k12",
  "university",
  "corporate",
  "maker-space",
  "research",
  "training",
  "community",
]);

export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;

// ============================================
// Template Schema
// ============================================

export const TemplateMetadataSchema = z.object({
  estimatedCost: z.number().min(0).optional(),
  capacity: z.number().int().min(1).optional(), // Number of people
  areaSize: z.number().min(0).optional(), // In square meters
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
});

export type TemplateMetadata = z.infer<typeof TemplateMetadataSchema>;

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  category: TemplateCategorySchema,
  tags: z.array(z.string()).default([]),
  layout: LayoutSchema,
  thumbnail: z.string().optional(), // Base64 or URL
  author: z.string().optional(),
  organization: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  downloadCount: z.number().int().min(0).default(0),
  metadata: TemplateMetadataSchema.optional(),
  // Future fields
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
});

export type Template = z.infer<typeof TemplateSchema>;

// ============================================
// Template Filter Schema
// ============================================

export const TemplateFilterSchema = z.object({
  category: TemplateCategorySchema.optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
  costMin: z.number().min(0).optional(),
  costMax: z.number().min(0).optional(),
  capacityMin: z.number().int().min(1).optional(),
  capacityMax: z.number().int().min(1).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  sortBy: z
    .enum(["recent", "popular", "name", "cost", "capacity"])
    .default("recent"),
});

export type TemplateFilter = z.infer<typeof TemplateFilterSchema>;

// ============================================
// Template Collection Schema
// ============================================

export const TemplateCollectionSchema = z.object({
  templates: z.array(TemplateSchema),
  total: z.number().int().min(0),
  categories: z.array(TemplateCategorySchema),
  allTags: z.array(z.string()),
});

export type TemplateCollection = z.infer<typeof TemplateCollectionSchema>;
