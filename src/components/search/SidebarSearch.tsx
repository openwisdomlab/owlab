"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, FileText, FolderOpen, X, ArrowRight, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/stores/search-store";

interface DocItem {
  title: string;
  href: string;
  type: "page" | "folder";
  breadcrumb?: string;
}

interface SidebarSearchProps {
  locale: string;
  docs: DocItem[];
  className?: string;
}

export function SidebarSearch({ locale, docs, className }: SidebarSearchProps) {
  const t = useTranslations("search");
  const router = useRouter();
  const { openDialog } = useSearchStore();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter docs based on query
  const filteredDocs = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    return docs
      .filter((doc) => {
        const titleMatch = doc.title.toLowerCase().includes(searchTerm);
        const breadcrumbMatch = doc.breadcrumb?.toLowerCase().includes(searchTerm);
        return titleMatch || breadcrumbMatch;
      })
      .slice(0, 8); // Limit to 8 results for quick navigation
  }, [query, docs]);

  const showResults = isFocused && query.trim().length > 0;

  // Navigate to selected doc
  const navigateToDoc = useCallback((doc: DocItem) => {
    router.push(doc.href);
    setQuery("");
    setIsFocused(false);
    inputRef.current?.blur();
  }, [router]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredDocs.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredDocs.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredDocs[selectedIndex]) {
          navigateToDoc(filteredDocs[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setQuery("");
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  }, [showResults, filteredDocs, selectedIndex, navigateToDoc]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredDocs]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay to allow click on results
            setTimeout(() => setIsFocused(false), 150);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("sidebar.quickFind")}
          className={cn(
            "w-full pl-9 pr-8 py-2 text-sm",
            "bg-[var(--glass-bg)] border border-[var(--glass-border)]",
            "rounded-lg outline-none",
            "placeholder:text-[var(--muted-foreground)]",
            "focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]/20",
            "transition-all duration-200"
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute z-50 top-full left-0 right-0 mt-1",
              "bg-[var(--card)] border border-[var(--border)]",
              "rounded-lg shadow-lg overflow-hidden",
              "max-h-64 overflow-y-auto"
            )}
          >
            {filteredDocs.length > 0 ? (
              <ul className="py-1">
                {filteredDocs.map((doc, index) => (
                  <li key={doc.href}>
                    <button
                      onClick={() => navigateToDoc(doc)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 text-left",
                        "text-sm transition-colors",
                        index === selectedIndex
                          ? "bg-[var(--accent)] text-[var(--foreground)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--accent)]/50"
                      )}
                    >
                      {doc.type === "folder" ? (
                        <FolderOpen className="w-4 h-4 shrink-0 text-[var(--neon-cyan)]" />
                      ) : (
                        <FileText className="w-4 h-4 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{doc.title}</div>
                        {doc.breadcrumb && (
                          <div className="text-[10px] text-[var(--muted-foreground)] truncate">
                            {doc.breadcrumb}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-3 h-3 shrink-0 opacity-50" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-[var(--muted-foreground)]">
                {t("sidebar.noMatching")}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint Text with Global Search Link */}
      {!isFocused && !query && (
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[10px] text-[var(--muted-foreground)] opacity-70">
            {t("sidebar.hint")}
          </span>
          <button
            onClick={openDialog}
            className="flex items-center gap-1 text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
            <span className="ml-0.5 opacity-70">
              {locale === "zh" ? "深度搜索" : "deep search"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
