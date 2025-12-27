/**
 * API Schemas - Request/Response types for all API endpoints
 */

import { z } from "zod";
import { LayoutSchema, ZoneSchema, SearchIndexEntrySchema } from "./content";

// ============================================
// Chat API Schemas
// ============================================

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
  timestamp: z.coerce.date().optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema),
  layout: LayoutSchema.optional(),
  modelKey: z.string().default("claude-sonnet"),
  stream: z.boolean().default(false),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  message: z.string(),
  layout: LayoutSchema.nullable(),
  usage: z
    .object({
      promptTokens: z.number(),
      completionTokens: z.number(),
      totalTokens: z.number(),
    })
    .optional(),
});

export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// ============================================
// Search API Schemas
// ============================================

export const SearchQuerySchema = z.object({
  query: z.string().min(1, "Query is required"),
  locale: z.enum(["en", "zh"]).optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
  // Search mode determines which layer to use
  mode: z.enum(["basic", "semantic", "agentic"]).default("basic"),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

export const SearchResultSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  url: z.string(),
  excerpt: z.string(), // Highlighted excerpt
  score: z.number(), // Relevance score
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchResponseSchema = z.object({
  results: z.array(SearchResultSchema),
  total: z.number(),
  query: z.string(),
  mode: z.enum(["basic", "semantic", "agentic"]),
  processingTime: z.number(), // in milliseconds
  // For semantic/agentic modes
  answer: z.string().optional(),
  sources: z.array(z.string()).optional(),
  followUpQuestions: z.array(z.string()).optional(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ============================================
// Layout Generation API Schemas
// ============================================

export const LayoutGenerationRequestSchema = z.object({
  requirements: z.string(),
  existingLayout: LayoutSchema.optional(),
  constraints: z
    .object({
      maxWidth: z.number().optional(),
      maxHeight: z.number().optional(),
      requiredZones: z.array(z.string()).optional(),
    })
    .optional(),
});

export type LayoutGenerationRequest = z.infer<typeof LayoutGenerationRequestSchema>;

export const LayoutGenerationResponseSchema = z.object({
  layout: LayoutSchema,
  explanation: z.string(),
  suggestions: z.array(z.string()).default([]),
});

export type LayoutGenerationResponse = z.infer<typeof LayoutGenerationResponseSchema>;

// ============================================
// Image Generation API Schemas
// ============================================

export const ImageGenerationRequestSchema = z.object({
  prompt: z.string().min(1),
  model: z.enum(["sdxl", "flux-schnell", "flux-pro", "midjourney"]).default("flux-schnell"),
  size: z
    .object({
      width: z.number().default(1024),
      height: z.number().default(1024),
    })
    .optional(),
  style: z.string().optional(),
});

export type ImageGenerationRequest = z.infer<typeof ImageGenerationRequestSchema>;

export const ImageGenerationResponseSchema = z.object({
  url: z.string().url(),
  prompt: z.string(),
  model: z.string(),
  generatedAt: z.coerce.date(),
});

export type ImageGenerationResponse = z.infer<typeof ImageGenerationResponseSchema>;

// ============================================
// Agentic Interaction Schemas
// ============================================

export const AgentToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.string(), z.unknown()).optional(),
});

export type AgentTool = z.infer<typeof AgentToolSchema>;

export const AgentActionSchema = z.object({
  type: z.enum(["think", "tool_call", "respond", "clarify"]),
  content: z.string(),
  toolName: z.string().optional(),
  toolInput: z.record(z.string(), z.unknown()).optional(),
  toolOutput: z.unknown().optional(),
});

export type AgentAction = z.infer<typeof AgentActionSchema>;

export const AgentSessionSchema = z.object({
  id: z.string().uuid(),
  messages: z.array(ChatMessageSchema),
  actions: z.array(AgentActionSchema).default([]),
  context: z.record(z.string(), z.unknown()).default({}),
  status: z.enum(["active", "waiting", "completed", "error"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type AgentSession = z.infer<typeof AgentSessionSchema>;

// ============================================
// Error Response Schema
// ============================================

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
  status: z.number(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
