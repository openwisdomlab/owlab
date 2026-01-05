/**
 * Strongly-typed data layer
 * Provides type-safe access to static data with IDE autocompletion
 */

import type { EquipmentItem, EquipmentCategory } from "@/lib/schemas/equipment";
import type { Template } from "@/lib/schemas/template";
import equipmentCatalogJson from "./equipment-catalog.json";
import templatesJson from "./templates.json";

// ============================================
// Equipment Catalog
// ============================================

export interface EquipmentCatalogData {
  equipment: EquipmentItem[];
}

export const equipmentCatalog: EquipmentCatalogData = equipmentCatalogJson as unknown as EquipmentCatalogData;

/**
 * Get all equipment items
 */
export function getAllEquipment(): EquipmentItem[] {
  return equipmentCatalog.equipment;
}

/**
 * Get equipment by category
 */
export function getEquipmentByCategory(category: EquipmentCategory): EquipmentItem[] {
  return equipmentCatalog.equipment.filter((item) => item.category === category);
}

/**
 * Get featured equipment
 */
export function getFeaturedEquipment(): EquipmentItem[] {
  return equipmentCatalog.equipment.filter((item) => item.featured);
}

/**
 * Get equipment by ID
 */
export function getEquipmentById(id: string): EquipmentItem | undefined {
  return equipmentCatalog.equipment.find((item) => item.id === id);
}

/**
 * Search equipment by name or tags
 */
export function searchEquipment(query: string): EquipmentItem[] {
  const lowerQuery = query.toLowerCase();
  return equipmentCatalog.equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      item.description?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// Templates Catalog
// ============================================

export interface TemplatesCatalogData {
  templates: Template[];
}

export const templatesCatalog: TemplatesCatalogData = templatesJson as unknown as TemplatesCatalogData;

/**
 * Get all templates
 */
export function getAllTemplates(): Template[] {
  return templatesCatalog.templates;
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): Template[] {
  return templatesCatalog.templates.filter((template) => template.category === category);
}

/**
 * Get featured templates
 */
export function getFeaturedTemplates(): Template[] {
  return templatesCatalog.templates.filter((template) => template.featured);
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return templatesCatalog.templates.find((template) => template.id === id);
}

/**
 * Search templates by name or tags
 */
export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase();
  return templatesCatalog.templates.filter(
    (template) =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      template.description?.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// Re-export types
// ============================================

export type { EquipmentItem, EquipmentCategory } from "@/lib/schemas/equipment";
export type { Template } from "@/lib/schemas/template";
