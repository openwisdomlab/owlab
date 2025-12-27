/**
 * Search Schemas - Three-layer search system types
 * Layer 1: Pagefind (Basic full-text search)
 * Layer 2: RAG (Semantic search with AI)
 * Layer 3: Agentic (Interactive AI with tools)
 */

import { z } from "zod";

// ============================================
// Layer 1: Pagefind Schemas
// ============================================

export const PagefindResultSchema = z.object({
  url: z.string(),
  content: z.string(),
  word_count: z.number(),
  excerpt: z.string(),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
  anchors: z
    .array(
      z.object({
        element: z.string(),
        id: z.string(),
        text: z.string(),
        location: z.number(),
      })
    )
    .optional(),
  weighted_locations: z
    .array(
      z.object({
        weight: z.number(),
        balanced_score: z.number(),
        location: z.number(),
      })
    )
    .optional(),
  locations: z.array(z.number()).optional(),
  raw_content: z.string().optional(),
  raw_url: z.string().optional(),
  sub_results: z.array(z.unknown()).optional(),
});

export type PagefindResult = z.infer<typeof PagefindResultSchema>;

export const PagefindSearchResultSchema = z.object({
  results: z.array(PagefindResultSchema),
  unfilteredResultCount: z.number(),
  filters: z.record(z.string(), z.record(z.string(), z.number())),
  totalFilters: z.record(z.string(), z.number()),
  timings: z.object({
    preload: z.number(),
    search: z.number(),
    total: z.number(),
  }),
});

export type PagefindSearchResult = z.infer<typeof PagefindSearchResultSchema>;

// ============================================
// Layer 2: RAG Schemas
// ============================================

export const EmbeddingSchema = z.object({
  id: z.string(),
  values: z.array(z.number()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Embedding = z.infer<typeof EmbeddingSchema>;

export const RAGChunkSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  content: z.string(),
  embedding: z.array(z.number()).optional(),
  metadata: z.object({
    title: z.string().optional(),
    url: z.string().optional(),
    section: z.string().optional(),
    position: z.number().optional(),
  }),
  score: z.number().optional(), // similarity score when retrieved
});

export type RAGChunk = z.infer<typeof RAGChunkSchema>;

export const RAGQuerySchema = z.object({
  query: z.string(),
  topK: z.number().optional().default(5),
  filter: z.record(z.string(), z.unknown()).optional(),
  includeMetadata: z.boolean().optional().default(true),
  minScore: z.number().min(0).max(1).optional().default(0.7),
});

export type RAGQuery = z.infer<typeof RAGQuerySchema>;

export const RAGResponseSchema = z.object({
  answer: z.string(),
  sources: z.array(RAGChunkSchema),
  confidence: z.number().min(0).max(1),
  query: z.string(),
  processingTime: z.number(),
});

export type RAGResponse = z.infer<typeof RAGResponseSchema>;

// ============================================
// Layer 3: Agentic Schemas
// ============================================

export const AgenticToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.literal("object"),
    properties: z.record(
      z.string(),
      z.object({
        type: z.enum(["string", "number", "boolean", "array", "object"]),
        description: z.string().optional(),
        enum: z.array(z.string()).optional(),
        required: z.boolean().optional(),
      })
    ),
    required: z.array(z.string()).optional(),
  }),
});

export type AgenticToolDefinition = z.infer<typeof AgenticToolDefinitionSchema>;

export const AgenticThoughtSchema = z.object({
  type: z.enum(["observation", "reasoning", "planning", "reflection"]),
  content: z.string(),
  timestamp: z.coerce.date(),
});

export type AgenticThought = z.infer<typeof AgenticThoughtSchema>;

export const AgenticToolCallSchema = z.object({
  id: z.string(),
  name: z.string(),
  input: z.record(z.string(), z.unknown()),
  output: z.unknown().optional(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  error: z.string().optional(),
  timestamp: z.coerce.date(),
});

export type AgenticToolCall = z.infer<typeof AgenticToolCallSchema>;

export const AgenticStepSchema = z.object({
  id: z.string(),
  type: z.enum(["thought", "tool_call", "response"]),
  thought: AgenticThoughtSchema.optional(),
  toolCall: AgenticToolCallSchema.optional(),
  response: z.string().optional(),
  timestamp: z.coerce.date(),
});

export type AgenticStep = z.infer<typeof AgenticStepSchema>;

export const AgenticSessionStateSchema = z.object({
  sessionId: z.string().uuid(),
  status: z.enum(["idle", "thinking", "executing", "responding", "waiting_input", "completed", "error"]),
  currentStep: z.number().default(0),
  maxSteps: z.number().default(10),
  steps: z.array(AgenticStepSchema).default([]),
  context: z.object({
    documents: z.array(z.string()).default([]),
    searchResults: z.array(z.unknown()).default([]),
    userPreferences: z.record(z.string(), z.unknown()).default({}),
    layout: z.unknown().optional(),
  }),
  memory: z.object({
    shortTerm: z.array(z.string()).default([]),
    longTerm: z.record(z.string(), z.unknown()).default({}),
  }),
  error: z.string().optional(),
  startedAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type AgenticSessionState = z.infer<typeof AgenticSessionStateSchema>;

export const AgenticQuerySchema = z.object({
  query: z.string(),
  sessionId: z.string().uuid().optional(),
  context: z.record(z.string(), z.unknown()).optional(),
  mode: z.enum(["auto", "research", "design", "explain", "action"]).default("auto"),
  maxSteps: z.number().min(1).max(20).default(10),
  stream: z.boolean().default(true),
});

export type AgenticQuery = z.infer<typeof AgenticQuerySchema>;

export const AgenticResponseSchema = z.object({
  sessionId: z.string().uuid(),
  answer: z.string(),
  steps: z.array(AgenticStepSchema),
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      excerpt: z.string(),
    })
  ),
  followUpQuestions: z.array(z.string()),
  actions: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      data: z.unknown().optional(),
    })
  ),
  confidence: z.number().min(0).max(1),
  processingTime: z.number(),
});

export type AgenticResponse = z.infer<typeof AgenticResponseSchema>;

// ============================================
// Unified Search Interface
// ============================================

export const UnifiedSearchQuerySchema = z.object({
  query: z.string().min(1),
  mode: z.enum(["auto", "basic", "semantic", "agentic"]).default("auto"),
  locale: z.enum(["en", "zh"]).optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  limit: z.number().min(1).max(100).default(10),
  // Auto-escalation settings
  autoEscalate: z.boolean().default(true),
  escalationThreshold: z.number().min(0).max(1).default(0.5), // Score below this triggers escalation
});

export type UnifiedSearchQuery = z.infer<typeof UnifiedSearchQuerySchema>;

export const UnifiedSearchResponseSchema = z.object({
  query: z.string(),
  mode: z.enum(["basic", "semantic", "agentic"]),
  escalated: z.boolean(), // Whether mode was auto-escalated
  originalMode: z.enum(["auto", "basic", "semantic", "agentic"]).optional(),

  // Basic results (always present)
  results: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      url: z.string(),
      excerpt: z.string(),
      score: z.number(),
    })
  ),
  total: z.number(),

  // Semantic/RAG results (when mode >= semantic)
  answer: z.string().optional(),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        relevance: z.number(),
      })
    )
    .optional(),

  // Agentic results (when mode = agentic)
  thoughts: z.array(AgenticThoughtSchema).optional(),
  actions: z.array(AgenticToolCallSchema).optional(),
  followUpQuestions: z.array(z.string()).optional(),
  sessionId: z.string().uuid().optional(),

  // Metadata
  processingTime: z.number(),
  confidence: z.number().optional(),
});

export type UnifiedSearchResponse = z.infer<typeof UnifiedSearchResponseSchema>;
