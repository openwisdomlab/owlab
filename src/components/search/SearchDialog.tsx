"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";
import { useSearchStore } from "@/stores/search-store";
import { useSearch, useSearchShortcut } from "@/hooks/useSearch";
import type { Locale } from "@/i18n";

interface SearchDialogProps {
  locale: Locale;
}

export function SearchDialog({ locale }: SearchDialogProps) {
  const t = useTranslations("search");
  const router = useRouter();

  const {
    isOpen,
    closeDialog,
    selectedIndex,
    setSelectedIndex,
    incrementSelectedIndex,
    decrementSelectedIndex,
    searchHistory,
    removeFromHistory,
    clearHistory,
  } = useSearchStore();

  const {
    query,
    mode,
    results,
    isLoading,
    error,
    setQuery,
    setMode,
  } = useSearch({ locale });

  // Register keyboard shortcut
  useSearchShortcut();

  // Handle result click
  const handleResultClick = useCallback(() => {
    closeDialog();
  }, [closeDialog]);

  // Handle history click
  const handleHistoryClick = useCallback((historyQuery: string) => {
    setQuery(historyQuery);
  }, [setQuery]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        incrementSelectedIndex();
        break;
      case "ArrowUp":
        e.preventDefault();
        decrementSelectedIndex();
        break;
      case "Enter":
        e.preventDefault();
        if (results?.results[selectedIndex]) {
          router.push(results.results[selectedIndex].url);
          closeDialog();
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDialog();
        break;
    }
  }, [results, selectedIndex, incrementSelectedIndex, decrementSelectedIndex, router, closeDialog]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDialog();
    }
  }, [closeDialog]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed left-1/2 top-[15%] z-50 w-full max-w-2xl -translate-x-1/2"
          >
            <div className="mx-4 overflow-hidden rounded-xl bg-[var(--card)] shadow-2xl ring-1 ring-[var(--border)]">
              {/* Header */}
              <SearchInput
                value={query}
                onChange={setQuery}
                mode={mode}
                onModeChange={setMode}
                isLoading={isLoading}
                placeholder={t("inputPlaceholder")}
                onKeyDown={handleKeyDown}
              />

              {/* Results */}
              <SearchResults
                query={query}
                results={results}
                isLoading={isLoading}
                error={error}
                selectedIndex={selectedIndex}
                searchHistory={searchHistory}
                onResultClick={handleResultClick}
                onResultHover={setSelectedIndex}
                onHistoryClick={handleHistoryClick}
                onHistoryRemove={removeFromHistory}
                onClearHistory={clearHistory}
              />

              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--glass-bg)]">
                <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--accent)] font-mono">↑</kbd>
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--accent)] font-mono">↓</kbd>
                    <span>{t("navigate")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--accent)] font-mono">↵</kbd>
                    <span>{t("select")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-[var(--accent)] font-mono">esc</kbd>
                    <span>{t("close")}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                  <Command className="w-3 h-3" />
                  <span>K</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
