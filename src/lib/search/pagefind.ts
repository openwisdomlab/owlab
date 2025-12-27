/**
 * Pagefind Search Service - Layer 1: Basic Full-Text Search
 *
 * Features:
 * - Fast keyword matching (~10ms)
 * - Full-text search with filtering
 * - Excerpt highlighting
 * - Zero server cost (static)
 */

import type { PagefindResult, PagefindSearchResult } from "@/lib/schemas";

// Pagefind types (loaded dynamically from the browser)
interface PagefindUI {
  search: (query: string, options?: PagefindSearchOptions) => Promise<PagefindRawSearchResponse>;
  filters: () => Promise<Record<string, Record<string, number>>>;
  preload: (query: string) => Promise<void>;
  debouncedSearch: (
    query: string,
    options?: PagefindSearchOptions,
    debounceMs?: number
  ) => Promise<PagefindRawSearchResponse | null>;
}

interface PagefindSearchOptions {
  filters?: Record<string, string | string[]>;
  sort?: Record<string, "asc" | "desc">;
}

interface PagefindRawSearchResponse {
  results: Array<{
    id: string;
    data: () => Promise<PagefindResultData>;
  }>;
  unfilteredResultCount: number;
  filters: Record<string, Record<string, number>>;
  totalFilters: Record<string, number>;
  timings: {
    preload: number;
    search: number;
    total: number;
  };
}

interface PagefindResultData {
  url: string;
  content: string;
  word_count: number;
  excerpt: string;
  meta: {
    title?: string;
    description?: string;
    image?: string;
  };
  anchors?: Array<{
    element: string;
    id: string;
    text: string;
    location: number;
  }>;
}

let pagefindInstance: PagefindUI | null = null;
let isLoading = false;

/**
 * Initialize Pagefind - must be called on client side
 */
export async function initPagefind(): Promise<PagefindUI | null> {
  if (typeof window === "undefined") {
    return null;
  }

  if (pagefindInstance) {
    return pagefindInstance;
  }

  if (isLoading) {
    // Wait for existing load to complete
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (pagefindInstance) {
          clearInterval(checkInterval);
          resolve(pagefindInstance);
        }
      }, 100);
    });
  }

  isLoading = true;

  try {
    // Dynamic import of Pagefind bundle
    // @ts-expect-error - Pagefind is loaded at runtime from static files
    const pagefind = await import("/_pagefind/pagefind.js");
    pagefindInstance = pagefind as unknown as PagefindUI;
    return pagefindInstance;
  } catch (error) {
    console.warn("Pagefind not available:", error);
    return null;
  } finally {
    isLoading = false;
  }
}

/**
 * Search options for Pagefind
 */
export interface PagefindQueryOptions {
  query: string;
  filters?: Record<string, string | string[]>;
  limit?: number;
  locale?: "en" | "zh";
}

/**
 * Processed search result
 */
export interface ProcessedSearchResult {
  id: string;
  url: string;
  title: string;
  description?: string;
  excerpt: string;
  wordCount: number;
  score: number;
  anchors: Array<{
    text: string;
    id: string;
  }>;
}

/**
 * Search response
 */
export interface PagefindSearchResponse {
  results: ProcessedSearchResult[];
  total: number;
  timings: {
    preload: number;
    search: number;
    total: number;
  };
  filters: Record<string, Record<string, number>>;
}

/**
 * Perform a Pagefind search
 */
export async function searchWithPagefind(
  options: PagefindQueryOptions
): Promise<PagefindSearchResponse> {
  const pagefind = await initPagefind();

  if (!pagefind) {
    return {
      results: [],
      total: 0,
      timings: { preload: 0, search: 0, total: 0 },
      filters: {},
    };
  }

  const { query, filters, limit = 10, locale } = options;

  // Add locale filter if specified
  const searchFilters = {
    ...filters,
    ...(locale ? { locale: locale } : {}),
  };

  const startTime = performance.now();

  const response = await pagefind.search(query, {
    filters: Object.keys(searchFilters).length > 0 ? searchFilters : undefined,
  });

  // Fetch result data in parallel (limited to `limit`)
  const resultPromises = response.results.slice(0, limit).map(async (result, index) => {
    const data = await result.data();
    return {
      id: result.id,
      url: data.url,
      title: data.meta.title || "Untitled",
      description: data.meta.description,
      excerpt: data.excerpt,
      wordCount: data.word_count,
      score: 1 - index * 0.1, // Simple relevance scoring based on position
      anchors: (data.anchors || []).map((a) => ({
        text: a.text,
        id: a.id,
      })),
    };
  });

  const results = await Promise.all(resultPromises);

  const endTime = performance.now();

  return {
    results,
    total: response.unfilteredResultCount,
    timings: {
      ...response.timings,
      total: endTime - startTime,
    },
    filters: response.filters,
  };
}

/**
 * Get available filters from Pagefind index
 */
export async function getPagefindFilters(): Promise<Record<string, Record<string, number>>> {
  const pagefind = await initPagefind();

  if (!pagefind) {
    return {};
  }

  return pagefind.filters();
}

/**
 * Preload search for faster results
 */
export async function preloadSearch(query: string): Promise<void> {
  const pagefind = await initPagefind();

  if (pagefind) {
    await pagefind.preload(query);
  }
}

/**
 * Debounced search for real-time input
 */
export async function debouncedSearch(
  query: string,
  options?: PagefindQueryOptions,
  debounceMs: number = 300
): Promise<PagefindSearchResponse | null> {
  const pagefind = await initPagefind();

  if (!pagefind) {
    return null;
  }

  const response = await pagefind.debouncedSearch(
    query,
    {
      filters: options?.filters,
    },
    debounceMs
  );

  if (!response) {
    return null;
  }

  // Process results
  const resultPromises = response.results.slice(0, options?.limit || 10).map(async (result, index) => {
    const data = await result.data();
    return {
      id: result.id,
      url: data.url,
      title: data.meta.title || "Untitled",
      description: data.meta.description,
      excerpt: data.excerpt,
      wordCount: data.word_count,
      score: 1 - index * 0.1,
      anchors: (data.anchors || []).map((a) => ({
        text: a.text,
        id: a.id,
      })),
    };
  });

  const results = await Promise.all(resultPromises);

  return {
    results,
    total: response.unfilteredResultCount,
    timings: response.timings,
    filters: response.filters,
  };
}
