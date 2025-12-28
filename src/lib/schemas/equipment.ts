/**
 * Equipment Schemas - Types for equipment catalog and budget management
 */

import { z } from "zod";

// ============================================
// Equipment Item Schema
// ============================================

export const EquipmentCategorySchema = z.enum([
  "compute",
  "furniture",
  "tools",
  "safety",
  "utilities",
  "electronics",
  "software",
]);

export type EquipmentCategory = z.infer<typeof EquipmentCategorySchema>;

export const EquipmentItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  category: EquipmentCategorySchema,
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.enum(["USD", "CNY", "EUR"]).default("USD"),
  vendor: z.string().optional(),
  vendorUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  specs: z.record(z.string(), z.string()).optional(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export type EquipmentItem = z.infer<typeof EquipmentItemSchema>;

// ============================================
// Zone Equipment Assignment Schema
// ============================================

export const ZoneEquipmentSchema = z.object({
  equipmentId: z.string().uuid(),
  name: z.string(),
  quantity: z.number().int().min(1).default(1),
  price: z.number().min(0).optional(),
  category: EquipmentCategorySchema.optional(),
});

export type ZoneEquipment = z.infer<typeof ZoneEquipmentSchema>;

// ============================================
// Budget Item Schema
// ============================================

export const BudgetItemSchema = z.object({
  equipmentId: z.string().uuid(),
  equipmentName: z.string(),
  category: EquipmentCategorySchema,
  quantity: z.number().int().min(1),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  zoneId: z.string().uuid(),
  zoneName: z.string(),
});

export type BudgetItem = z.infer<typeof BudgetItemSchema>;

// ============================================
// Budget Summary Schema
// ============================================

export const BudgetSummarySchema = z.object({
  totalCost: z.number().min(0),
  currency: z.enum(["USD", "CNY", "EUR"]).default("USD"),
  costByCategory: z.record(z.string(), z.number()),
  costByZone: z.record(z.string(), z.number()),
  itemCount: z.number().int().min(0),
  items: z.array(BudgetItemSchema),
});

export type BudgetSummary = z.infer<typeof BudgetSummarySchema>;

// ============================================
// Equipment Catalog Filter Schema
// ============================================

export const EquipmentFilterSchema = z.object({
  category: EquipmentCategorySchema.optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(["name", "price-asc", "price-desc", "category"]).default("name"),
});

export type EquipmentFilter = z.infer<typeof EquipmentFilterSchema>;
