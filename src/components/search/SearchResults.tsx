"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, Sparkles, History, X, ArrowRight, TrendingUp, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/components/ui/Link";
import { SearchResultItem, type ResultType } from "./SearchResultItem";
import { getPopularSearches, getModuleQuickLinks } from "@/lib/search/suggestions";
import type { UnifiedSearchResponse } from "@/lib/schemas/search";
import type { SearchHistoryItem } from "@/stores/search-store";

interface SearchResultsProps {
  query: string;
  results: UnifiedSearchResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedIndex: number;
  searchHistory: SearchHistoryItem[];
  onResultClick: () => void;
  onResultHover: (index: number) => void;
  onHistoryClick: (query: string) => void;
  onHistoryRemove: (query: string) => void;
  onClearHistory: () => void;
}

export function SearchResults({
  query,
  results,
  isLoading,
  error,
  selectedIndex,
  searchHistory,
  onResultClick,
  onResultHover,
  onHistoryClick,
  onHistoryRemove,
  onClearHistory,
}: SearchResultsProps) {
  const t = useTranslations("search");
  const params = useParams();
  const locale = (params?.locale as string) || "zh";

  const popularSearches = getPopularSearches(locale);
  const moduleLinks = getModuleQuickLinks(locale);

  // Show search history and suggestions when no query
  if (!query) {
    return (
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {/* Recent searches */}
        {searchHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                <History className="w-3.5 h-3.5" />
                <span>{t("recentSearches")}</span>
              </div>
              <button
                onClick={onClearHistory}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {t("clearHistory")}
              </button>
            </div>
            <div className="space-y-1">
              {searchHistory.slice(0, 3).map((item) => (
                <div
                  key={item.query}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors group cursor-pointer"
                  onClick={() => onHistoryClick(item.query)}
                >
                  <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span className="flex-1 text-sm truncate">{item.query}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {item.resultCount} {t("results")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onHistoryRemove(item.query);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[var(--accent)] rounded transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Popular searches */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{locale === "zh" ? "热门搜索" : "Popular Searches"}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((item, i) => (
              <button
                key={i}
                onClick={() => onHistoryClick(item.query)}
                className="px-3 py-1.5 text-xs bg-[var(--glass-bg)] hover:bg-[var(--accent)] rounded-full border border-[var(--border)] hover:border-[var(--primary)] transition-all"
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>

        {/* Quick module access */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{locale === "zh" ? "快速导航" : "Quick Navigation"}</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {moduleLinks.slice(0, 5).map((link, i) => (
              <Link
                key={i}
                href={link.path}
                onClick={onResultClick}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-sm"
              >
                <span className="w-6 h-6 flex items-center justify-center bg-[var(--accent)] rounded text-xs font-medium">
                  {link.title.slice(0, 3)}
                </span>
                <span className="truncate">{link.title}</span>
                <ArrowRight className="w-3 h-3 ml-auto text-[var(--muted-foreground)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 p-3 bg-[var(--glass-bg)] rounded-lg">
          <p className="text-xs text-[var(--muted-foreground)]">
            {t("tips")}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 mx-auto text-[var(--primary)] animate-spin" />
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {t("searching")}
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="w-8 h-8 mx-auto text-red-500" />
        <p className="mt-4 text-sm text-red-500">{error}</p>
      </div>
    );
  }

  // No results
  if (results && results.results.length === 0) {
    return (
      <div className="p-8 text-center">
        <Search className="w-8 h-8 mx-auto text-[var(--muted-foreground)] opacity-40" />
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          {t("noResults")} &ldquo;{query}&rdquo;
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)] opacity-60">
          {t("tryDifferent")}
        </p>
      </div>
    );
  }

  // Results
  if (!results) return null;

  // Determine result type based on search mode
  const getResultType = (index: number): ResultType => {
    if (results.mode === "agentic") return "agentic";
    if (results.mode === "semantic") return "semantic";
    return "basic";
  };

  return (
    <div className="overflow-hidden">
      {/* Results header */}
      <div className="px-4 py-2 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <span>
            {results.total} {t("resultsFor")} &ldquo;{query}&rdquo;
          </span>
          {results.escalated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-[10px]">
              <Sparkles className="w-2.5 h-2.5" />
              {t("aiEnhanced")}
            </span>
          )}
        </div>
        {results.processingTime && (
          <span className="text-xs text-[var(--muted-foreground)]">
            {results.processingTime.toFixed(0)}ms
          </span>
        )}
      </div>

      {/* AI Answer (if semantic/agentic mode) */}
      {results.answer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-[var(--border)]"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-[var(--card)] rounded-lg shadow-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
                {t("aiAnswer")}
              </p>
              <p className="text-sm text-[var(--foreground)]">{results.answer}</p>
              {results.sources && results.sources.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {results.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {source.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Follow-up questions (if agentic mode) */}
      {results.followUpQuestions && results.followUpQuestions.length > 0 && (
        <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--glass-bg)]">
          <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">
            {t("relatedQuestions")}
          </p>
          <div className="flex flex-wrap gap-2">
            {results.followUpQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onHistoryClick(q)}
                className="px-3 py-1.5 text-xs bg-white dark:bg-[var(--card)] rounded-full border border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results list */}
      <div className="max-h-[400px] overflow-y-auto p-2">
        <AnimatePresence mode="popLayout">
          {results.results.map((result, index) => (
            <SearchResultItem
              key={result.id}
              {...result}
              type={getResultType(index)}
              isSelected={selectedIndex === index}
              index={index}
              onClick={onResultClick}
              onMouseEnter={() => onResultHover(index)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
