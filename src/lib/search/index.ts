/**
 * Search Module - Three-Layer Architecture
 *
 * Layer 1: Pagefind (Basic) - Fast keyword matching (~10ms)
 * Layer 2: RAG (Semantic) - AI-powered understanding
 * Layer 3: Agentic (Interactive) - Multi-turn with tools
 *
 * Usage:
 *   import { search } from "@/lib/search";
 *   const results = await search({ query: "how to configure AI models" });
 */

// Unified search (recommended)
export { search, unifiedSearch, type SearchOptions } from "./unified";

// Layer 1: Pagefind
export {
  initPagefind,
  searchWithPagefind,
  getPagefindFilters,
  preloadSearch,
  debouncedSearch,
  type PagefindQueryOptions,
  type ProcessedSearchResult,
  type PagefindSearchResponse,
} from "./pagefind";

// Layer 2: RAG
export {
  RAGPipeline,
  getRAGPipeline,
  searchWithRAG,
  type RAGConfig,
  type VectorStore,
  type EmbeddingService,
} from "./rag";

// Layer 3: Agentic
export {
  AgenticPipeline,
  getAgenticPipeline,
  searchWithAgent,
} from "./agentic";

// Suggestions
export {
  getPopularSearches,
  getModuleQuickLinks,
  getAutocompleteSuggestions,
  analyzeQueryIntent,
  type SearchSuggestion,
} from "./suggestions";

// Analytics
export {
  trackSearch,
  trackClick,
  trackEscalation,
  getSearchMetrics,
  type SearchEvent,
  type SearchMetrics,
} from "./analytics";
