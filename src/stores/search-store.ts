/**
 * Search Store - Zustand state management for global search
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UnifiedSearchResponse } from "@/lib/schemas/search";

export type SearchMode = "auto" | "basic" | "semantic" | "agentic";

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  mode: SearchMode;
  resultCount: number;
}

interface SearchState {
  // Dialog state
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;

  // Search state
  query: string;
  setQuery: (query: string) => void;
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;

  // Results
  results: UnifiedSearchResponse | null;
  setResults: (results: UnifiedSearchResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // History (persisted)
  searchHistory: SearchHistoryItem[];
  addToHistory: (item: Omit<SearchHistoryItem, "timestamp">) => void;
  clearHistory: () => void;
  removeFromHistory: (query: string) => void;

  // Suggestions
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;

  // Selected result index (for keyboard navigation)
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  incrementSelectedIndex: () => void;
  decrementSelectedIndex: () => void;

  // Reset
  reset: () => void;
}

const MAX_HISTORY_ITEMS = 20;

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Dialog state
      isOpen: false,
      openDialog: () => set({ isOpen: true }),
      closeDialog: () => set({ isOpen: false, query: "", results: null, error: null, selectedIndex: 0 }),
      toggleDialog: () => {
        const { isOpen } = get();
        if (isOpen) {
          set({ isOpen: false, query: "", results: null, error: null, selectedIndex: 0 });
        } else {
          set({ isOpen: true });
        }
      },

      // Search state
      query: "",
      setQuery: (query) => set({ query, selectedIndex: 0 }),
      mode: "auto",
      setMode: (mode) => set({ mode }),

      // Results
      results: null,
      setResults: (results) => set({ results }),
      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),
      error: null,
      setError: (error) => set({ error }),

      // History
      searchHistory: [],
      addToHistory: (item) => {
        const { searchHistory } = get();
        // Remove duplicate if exists
        const filtered = searchHistory.filter((h) => h.query !== item.query);
        // Add new item at the beginning
        const newHistory = [
          { ...item, timestamp: Date.now() },
          ...filtered,
        ].slice(0, MAX_HISTORY_ITEMS);
        set({ searchHistory: newHistory });
      },
      clearHistory: () => set({ searchHistory: [] }),
      removeFromHistory: (query) => {
        const { searchHistory } = get();
        set({ searchHistory: searchHistory.filter((h) => h.query !== query) });
      },

      // Suggestions
      suggestions: [],
      setSuggestions: (suggestions) => set({ suggestions }),

      // Selected index
      selectedIndex: 0,
      setSelectedIndex: (selectedIndex) => set({ selectedIndex }),
      incrementSelectedIndex: () => {
        const { selectedIndex, results } = get();
        const maxIndex = results?.results?.length ?? 0;
        if (selectedIndex < maxIndex - 1) {
          set({ selectedIndex: selectedIndex + 1 });
        }
      },
      decrementSelectedIndex: () => {
        const { selectedIndex } = get();
        if (selectedIndex > 0) {
          set({ selectedIndex: selectedIndex - 1 });
        }
      },

      // Reset
      reset: () =>
        set({
          query: "",
          results: null,
          isLoading: false,
          error: null,
          selectedIndex: 0,
          suggestions: [],
        }),
    }),
    {
      name: "owl-search-storage",
      partialize: (state) => ({
        searchHistory: state.searchHistory,
      }),
    }
  )
);
