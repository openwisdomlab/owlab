/**
 * Schema Index - Single Source of Truth exports
 *
 * This module exports all Zod schemas and TypeScript types
 * for use throughout the application.
 *
 * Usage:
 *   import { DocumentSchema, type Document } from "@/lib/schemas";
 */

// ============================================
// Content Schemas
// ============================================
export {
  // Document schemas
  DocMetaSchema,
  DocumentSchema,
  SearchIndexEntrySchema,
  // Lab schemas
  ZoneTypeSchema,
  PositionSchema,
  SizeSchema,
  ZoneSchema,
  LayoutDimensionsSchema,
  LayoutSchema,
  CaseStudySchema,
  // Types
  type DocMeta,
  type Document,
  type SearchIndexEntry,
  type ZoneType,
  type Zone,
  type Layout,
  type CaseStudy,
} from "./content";

// ============================================
// API Schemas
// ============================================
export {
  // Chat schemas
  ChatMessageSchema,
  ChatRequestSchema,
  ChatResponseSchema,
  // Search API schemas
  SearchQuerySchema,
  SearchResultSchema,
  SearchResponseSchema,
  // Layout generation schemas
  LayoutGenerationRequestSchema,
  LayoutGenerationResponseSchema,
  // Image generation schemas
  ImageGenerationRequestSchema,
  ImageGenerationResponseSchema,
  // Agent schemas
  AgentToolSchema,
  AgentActionSchema,
  AgentSessionSchema,
  // Error schema
  ApiErrorSchema,
  // Types
  type ChatMessage,
  type ChatRequest,
  type ChatResponse,
  type SearchQuery,
  type SearchResult,
  type SearchResponse,
  type LayoutGenerationRequest,
  type LayoutGenerationResponse,
  type ImageGenerationRequest,
  type ImageGenerationResponse,
  type AgentTool,
  type AgentAction,
  type AgentSession,
  type ApiError,
} from "./api";

// ============================================
// Configuration Schemas
// ============================================
export {
  // Provider schemas
  AIProviderSchema,
  ModelCapabilitySchema,
  ModelConfigSchema,
  // Config schemas
  SearchConfigSchema,
  ThemeConfigSchema,
  LocaleConfigSchema,
  FeatureFlagsSchema,
  AppConfigSchema,
  EnvSchema,
  // Utilities
  validateEnv,
  // Types
  type AIProvider,
  type ModelCapability,
  type ModelConfig,
  type SearchConfig,
  type ThemeConfig,
  type LocaleConfig,
  type FeatureFlags,
  type AppConfig,
  type Env,
} from "./config";

// ============================================
// Search Schemas (Three-Layer Architecture)
// ============================================
export {
  // Layer 1: Pagefind
  PagefindResultSchema,
  PagefindSearchResultSchema,
  // Layer 2: RAG
  EmbeddingSchema,
  RAGChunkSchema,
  RAGQuerySchema,
  RAGResponseSchema,
  // Layer 3: Agentic
  AgenticToolDefinitionSchema,
  AgenticThoughtSchema,
  AgenticToolCallSchema,
  AgenticStepSchema,
  AgenticSessionStateSchema,
  AgenticQuerySchema,
  AgenticResponseSchema,
  // Unified Interface
  UnifiedSearchQuerySchema,
  UnifiedSearchResponseSchema,
  // Types
  type PagefindResult,
  type PagefindSearchResult,
  type Embedding,
  type RAGChunk,
  type RAGQuery,
  type RAGResponse,
  type AgenticToolDefinition,
  type AgenticThought,
  type AgenticToolCall,
  type AgenticStep,
  type AgenticSessionState,
  type AgenticQuery,
  type AgenticResponse,
  type UnifiedSearchQuery,
  type UnifiedSearchResponse,
} from "./search";

// ============================================
// Launcher Schemas (AI Lab Designer)
// ============================================
export {
  // Launch mode schemas
  LaunchModeSchema,
  DisciplineSchema,
  SubDisciplineMapSchema,
  LauncherStateSchema,
  LauncherInputSchema,
  // Constants
  DEFAULT_SUB_DISCIPLINES,
  DISCIPLINE_METADATA,
  // Types
  type LaunchMode,
  type Discipline,
  type SubDisciplineMap,
  type LauncherState,
  type LauncherInput,
  type DisciplineMetadata,
} from "./launcher";

// ============================================
// Schema Utilities
// ============================================

import { z } from "zod";

/**
 * Create a JSON Schema from a Zod schema
 * Useful for external tools and documentation
 *
 * Note: For full JSON Schema support, consider using zod-to-json-schema package.
 * This is a simplified implementation that handles basic types.
 */
export function toJsonSchema<T extends z.ZodTypeAny>(
  schema: T,
  options?: { name?: string; description?: string }
): Record<string, unknown> {
  // Basic implementation - returns a generic object schema
  // For production use, install zod-to-json-schema package
  return {
    $schema: "http://json-schema.org/draft-07/schema#",
    title: options?.name,
    description: options?.description,
    type: "object",
  };
}

/**
 * Validate data against a schema with helpful error messages
 */
export function validateSchema<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map(
    (err) => `${err.path.join(".")}: ${err.message}`
  );

  return { success: false, errors };
}
