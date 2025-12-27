/**
 * Unified Search Service - Three-Layer Architecture
 *
 * Automatically escalates between layers based on query complexity and results:
 * Layer 1: Pagefind (Basic) - Fast keyword matching
 * Layer 2: RAG (Semantic) - AI-powered understanding
 * Layer 3: Agentic (Interactive) - Multi-turn with tools
 */

import type { UnifiedSearchQuery, UnifiedSearchResponse } from "@/lib/schemas";
import { searchWithPagefind, type PagefindSearchResponse } from "./pagefind";
import { getRAGPipeline } from "./rag";
import { searchWithAgent } from "./agentic";

// ============================================
// Query Complexity Analysis
// ============================================

interface QueryAnalysis {
  complexity: "simple" | "moderate" | "complex";
  hasQuestion: boolean;
  requiresReasoning: boolean;
  requiresMultiStep: boolean;
  suggestedMode: "basic" | "semantic" | "agentic";
}

function analyzeQuery(query: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();

  // Question indicators
  const hasQuestion =
    query.includes("?") ||
    /^(what|how|why|when|where|who|which|can|could|would|should|is|are|do|does|did)/i.test(query);

  // Reasoning indicators
  const reasoningWords = [
    "explain",
    "compare",
    "analyze",
    "evaluate",
    "recommend",
    "suggest",
    "best",
    "difference",
    "pros and cons",
    "trade-off",
  ];
  const requiresReasoning = reasoningWords.some((word) => lowerQuery.includes(word));

  // Multi-step indicators
  const multiStepWords = [
    "and then",
    "after that",
    "step by step",
    "guide me",
    "help me",
    "walk through",
    "create",
    "build",
    "implement",
  ];
  const requiresMultiStep = multiStepWords.some((word) => lowerQuery.includes(word));

  // Determine complexity
  let complexity: "simple" | "moderate" | "complex" = "simple";
  if (requiresMultiStep) {
    complexity = "complex";
  } else if (requiresReasoning || (hasQuestion && query.length > 50)) {
    complexity = "moderate";
  }

  // Suggest mode
  let suggestedMode: "basic" | "semantic" | "agentic" = "basic";
  if (complexity === "complex") {
    suggestedMode = "agentic";
  } else if (complexity === "moderate") {
    suggestedMode = "semantic";
  }

  return {
    complexity,
    hasQuestion,
    requiresReasoning,
    requiresMultiStep,
    suggestedMode,
  };
}

// ============================================
// Unified Search Implementation
// ============================================

export async function unifiedSearch(
  query: UnifiedSearchQuery
): Promise<UnifiedSearchResponse> {
  const startTime = performance.now();

  // Determine initial mode
  let mode = query.mode;
  let escalated = false;
  const originalMode = query.mode;

  // Auto mode: analyze query to determine best starting mode
  if (mode === "auto") {
    const analysis = analyzeQuery(query.query);
    mode = analysis.suggestedMode;
    escalated = true;
  }

  // Start with the determined mode
  try {
    // Layer 1: Basic (Pagefind)
    if (mode === "basic") {
      const pagefindResults = await searchWithPagefind({
        query: query.query,
        locale: query.locale,
        limit: query.limit,
      });

      // Check if we should escalate to semantic
      if (
        query.autoEscalate &&
        shouldEscalateToSemantic(pagefindResults, query.escalationThreshold)
      ) {
        mode = "semantic";
        escalated = true;
      } else {
        const endTime = performance.now();
        return {
          query: query.query,
          mode: "basic",
          escalated,
          originalMode,
          results: pagefindResults.results.map((r) => ({
            id: r.id,
            title: r.title,
            url: r.url,
            excerpt: r.excerpt,
            score: r.score,
          })),
          total: pagefindResults.total,
          processingTime: endTime - startTime,
        };
      }
    }

    // Layer 2: Semantic (RAG)
    if (mode === "semantic") {
      // First get Pagefind results for context
      const pagefindResults = await searchWithPagefind({
        query: query.query,
        locale: query.locale,
        limit: 10,
      });

      // Use RAG to synthesize answer
      const rag = getRAGPipeline();
      const ragResponse = await rag.hybridSearch(
        query.query,
        pagefindResults.results.map((r) => ({
          url: r.url,
          content: r.excerpt,
          title: r.title,
        }))
      );

      // Check if we should escalate to agentic
      if (
        query.autoEscalate &&
        shouldEscalateToAgentic(ragResponse.confidence, query.escalationThreshold)
      ) {
        mode = "agentic";
        escalated = true;
      } else {
        const endTime = performance.now();
        return {
          query: query.query,
          mode: "semantic",
          escalated,
          originalMode,
          results: pagefindResults.results.map((r) => ({
            id: r.id,
            title: r.title,
            url: r.url,
            excerpt: r.excerpt,
            score: r.score,
          })),
          total: pagefindResults.total,
          answer: ragResponse.answer,
          sources: ragResponse.sources.map((s) => ({
            title: s.metadata.title || "Unknown",
            url: s.metadata.url || "",
            relevance: s.score || 0.5,
          })),
          confidence: ragResponse.confidence,
          processingTime: endTime - startTime,
        };
      }
    }

    // Layer 3: Agentic
    if (mode === "agentic") {
      const agenticResponse = await searchWithAgent({
        query: query.query,
        mode: "auto",
        maxSteps: 5,
        stream: false,
      });

      const endTime = performance.now();
      return {
        query: query.query,
        mode: "agentic",
        escalated,
        originalMode,
        results: agenticResponse.sources.map((s, i) => ({
          id: `source-${i}`,
          title: s.title,
          url: s.url,
          excerpt: s.excerpt,
          score: 1 - i * 0.1,
        })),
        total: agenticResponse.sources.length,
        answer: agenticResponse.answer,
        sources: agenticResponse.sources.map((s) => ({
          title: s.title,
          url: s.url,
          relevance: 0.8,
        })),
        thoughts: agenticResponse.steps
          .filter((s) => s.type === "thought" && s.thought)
          .map((s) => s.thought!),
        actions: agenticResponse.steps
          .filter((s) => s.type === "tool_call" && s.toolCall)
          .map((s) => s.toolCall!),
        followUpQuestions: agenticResponse.followUpQuestions,
        sessionId: agenticResponse.sessionId,
        confidence: agenticResponse.confidence,
        processingTime: endTime - startTime,
      };
    }

    // Fallback
    const endTime = performance.now();
    return {
      query: query.query,
      mode: "basic",
      escalated: false,
      results: [],
      total: 0,
      processingTime: endTime - startTime,
    };
  } catch (error) {
    console.error("Unified search error:", error);

    // Fallback to basic search on error
    try {
      const pagefindResults = await searchWithPagefind({
        query: query.query,
        locale: query.locale,
        limit: query.limit,
      });

      const endTime = performance.now();
      return {
        query: query.query,
        mode: "basic",
        escalated: true,
        originalMode: mode,
        results: pagefindResults.results.map((r) => ({
          id: r.id,
          title: r.title,
          url: r.url,
          excerpt: r.excerpt,
          score: r.score,
        })),
        total: pagefindResults.total,
        processingTime: endTime - startTime,
      };
    } catch {
      const endTime = performance.now();
      return {
        query: query.query,
        mode: "basic",
        escalated: false,
        results: [],
        total: 0,
        processingTime: endTime - startTime,
      };
    }
  }
}

/**
 * Determine if we should escalate from basic to semantic
 */
function shouldEscalateToSemantic(
  results: PagefindSearchResponse,
  threshold: number = 0.5
): boolean {
  // Escalate if:
  // 1. No results found
  if (results.total === 0) return true;

  // 2. Top result score is below threshold
  if (results.results.length > 0 && results.results[0].score < threshold) return true;

  // 3. Too few results for a general query
  if (results.total < 3) return true;

  return false;
}

/**
 * Determine if we should escalate from semantic to agentic
 */
function shouldEscalateToAgentic(confidence: number, threshold: number = 0.5): boolean {
  // Escalate if confidence is below threshold
  return confidence < threshold;
}

// ============================================
// Search API
// ============================================

export interface SearchOptions {
  query: string;
  mode?: "auto" | "basic" | "semantic" | "agentic";
  locale?: "en" | "zh";
  limit?: number;
  autoEscalate?: boolean;
}

/**
 * Main search function - use this for all search operations
 */
export async function search(options: SearchOptions): Promise<UnifiedSearchResponse> {
  return unifiedSearch({
    query: options.query,
    mode: options.mode || "auto",
    locale: options.locale,
    limit: options.limit || 10,
    autoEscalate: options.autoEscalate ?? true,
    escalationThreshold: 0.5,
  });
}
