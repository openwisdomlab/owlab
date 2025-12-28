/**
 * Content Schemas - Single Source of Truth for document types
 * Using Zod for runtime validation and TypeScript type inference
 */

import { z } from "zod";
import { ZoneEquipmentSchema } from "./equipment";

// ============================================
// Base Document Metadata Schema
// ============================================

export const DocMetaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  author: z.string().optional(),
  lastUpdated: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  locale: z.enum(["en", "zh"]).default("en"),
  draft: z.boolean().default(false),
});

export type DocMeta = z.infer<typeof DocMetaSchema>;

// ============================================
// Full Document Schema (with content)
// ============================================

export const DocumentSchema = DocMetaSchema.extend({
  id: z.string().uuid(),
  content: z.string(),
  contentHtml: z.string().optional(),
  readingTime: z.number().optional(), // in minutes
  wordCount: z.number().optional(),
  headings: z
    .array(
      z.object({
        level: z.number().min(1).max(6),
        text: z.string(),
        slug: z.string(),
      })
    )
    .default([]),
});

export type Document = z.infer<typeof DocumentSchema>;

// ============================================
// Search Index Entry Schema
// ============================================

export const SearchIndexEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  content: z.string(),
  url: z.string(),
  locale: z.enum(["en", "zh"]),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  lastUpdated: z.coerce.date(),
  // For vector search
  embedding: z.array(z.number()).optional(),
});

export type SearchIndexEntry = z.infer<typeof SearchIndexEntrySchema>;

// ============================================
// Lab Zone Schema (for floor plan)
// ============================================

export const ZoneTypeSchema = z.enum([
  "compute",
  "workspace",
  "meeting",
  "storage",
  "utility",
  "entrance",
]);

export type ZoneType = z.infer<typeof ZoneTypeSchema>;

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const SizeSchema = z.object({
  width: z.number().min(1),
  height: z.number().min(1),
});

export const ZoneSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: ZoneTypeSchema,
  position: PositionSchema,
  size: SizeSchema,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  equipment: z.array(ZoneEquipmentSchema).default([]),
  requirements: z.string().optional(),
});

export type Zone = z.infer<typeof ZoneSchema>;

// ============================================
// Lab Layout Schema
// ============================================

export const LayoutDimensionsSchema = z.object({
  width: z.number().min(1),
  height: z.number().min(1),
  unit: z.enum(["meters", "feet"]).default("meters"),
});

export const LayoutSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().default("Untitled Layout"),
  dimensions: LayoutDimensionsSchema,
  zones: z.array(ZoneSchema).default([]),
  notes: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type Layout = z.infer<typeof LayoutSchema>;

// ============================================
// Case Study Schema
// ============================================

export const CaseStudySchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
  layout: LayoutSchema.optional(),
  publishedAt: z.coerce.date(),
  featured: z.boolean().default(false),
});

export type CaseStudy = z.infer<typeof CaseStudySchema>;
