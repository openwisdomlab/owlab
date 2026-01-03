/**
 * useSearch Hook - Client-side search with debouncing and caching
 */

"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSearchStore, type SearchMode } from "@/stores/search-store";
import { trackSearch, trackEscalation } from "@/lib/search/analytics";
import type { UnifiedSearchResponse } from "@/lib/schemas/search";

interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  locale?: "en" | "zh";
  autoSearch?: boolean;
}

interface SearchParams {
  query: string;
  mode?: SearchMode;
  locale?: "en" | "zh";
  limit?: number;
}

// Simple in-memory cache
const searchCache = new Map<string, { data: UnifiedSearchResponse; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(params: SearchParams): string {
  return `${params.query}-${params.mode}-${params.locale}-${params.limit}`;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    locale = "zh",
    autoSearch = true,
  } = options;

  const {
    query,
    setQuery,
    mode,
    setMode,
    results,
    setResults,
    isLoading,
    setIsLoading,
    error,
    setError,
    addToHistory,
    searchHistory,
  } = useSearchStore();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string, searchMode: SearchMode = mode) => {
      if (searchQuery.length < minQueryLength) {
        setResults(null);
        return null;
      }

      const params: SearchParams = {
        query: searchQuery,
        mode: searchMode,
        locale,
        limit: 10,
      };

      // Check cache first
      const cacheKey = getCacheKey(params);
      const cached = searchCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        setResults(cached.data);
        return cached.data;
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Search failed");
        }

        const data: UnifiedSearchResponse = await response.json();

        // Cache the result
        searchCache.set(cacheKey, { data, timestamp: Date.now() });

        setResults(data);
        setIsLoading(false);

        // Track analytics
        trackSearch(
          searchQuery,
          data.mode,
          locale,
          data.total,
          data.processingTime
        );

        // Track escalation if occurred
        if (data.escalated && data.originalMode) {
          trackEscalation(
            searchQuery,
            data.originalMode,
            data.mode,
            locale
          );
        }

        // Add to history
        if (data.results.length > 0) {
          addToHistory({
            query: searchQuery,
            mode: searchMode,
            resultCount: data.total,
          });
        }

        return data;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }
        const errorMessage = err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        setIsLoading(false);
        return null;
      }
    },
    [mode, locale, minQueryLength, setResults, setIsLoading, setError, addToHistory]
  );

  // Debounced search
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (searchQuery.length < minQueryLength) {
        setResults(null);
        return;
      }

      debounceTimerRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, debounceMs);
    },
    [debounceMs, minQueryLength, performSearch, setResults]
  );

  // Handle query change
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      if (autoSearch) {
        debouncedSearch(newQuery);
      }
    },
    [setQuery, autoSearch, debouncedSearch]
  );

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: SearchMode) => {
      setMode(newMode);
      if (query.length >= minQueryLength) {
        performSearch(query, newMode);
      }
    },
    [setMode, query, minQueryLength, performSearch]
  );

  // Manual search trigger
  const search = useCallback(
    (searchQuery?: string) => {
      const q = searchQuery ?? query;
      return performSearch(q);
    },
    [query, performSearch]
  );

  // Clear results
  const clear = useCallback(() => {
    setQuery("");
    setResults(null);
    setError(null);
  }, [setQuery, setResults, setError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    // State
    query,
    mode,
    results,
    isLoading,
    error,
    searchHistory,

    // Actions
    setQuery: handleQueryChange,
    setMode: handleModeChange,
    search,
    clear,

    // Helpers
    hasResults: results !== null && results.results.length > 0,
    isEmpty: query.length > 0 && !isLoading && results?.results.length === 0,
    isReady: query.length >= minQueryLength,
  };
}

// Hook for keyboard shortcuts
export function useSearchShortcut() {
  const { openDialog, toggleDialog } = useSearchStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleDialog();
      }
      // "/" to open search (when not in input)
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")
      ) {
        e.preventDefault();
        openDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openDialog, toggleDialog]);
}
