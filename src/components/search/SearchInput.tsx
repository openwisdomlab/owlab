"use client";

import { useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { SearchMode } from "@/stores/search-store";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
  isLoading: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const modeOptions: { value: SearchMode; label: string; shortLabel: string }[] = [
  { value: "auto", label: "Auto", shortLabel: "Auto" },
  { value: "basic", label: "Keyword", shortLabel: "KW" },
  { value: "semantic", label: "Semantic", shortLabel: "AI" },
  { value: "agentic", label: "Agent", shortLabel: "Agent" },
];

export function SearchInput({
  value,
  onChange,
  mode,
  onModeChange,
  isLoading,
  placeholder,
  autoFocus = true,
  onKeyDown,
}: SearchInputProps) {
  const t = useTranslations("search");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search icon / Loading spinner */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Search className="w-5 h-5 text-[var(--muted-foreground)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder || t("inputPlaceholder")}
        className="
          w-full h-14 pl-12 pr-32
          bg-transparent
          text-lg text-[var(--foreground)]
          placeholder:text-[var(--muted-foreground)]
          border-b border-[var(--border)]
          focus:outline-none focus:border-[var(--primary)]
          transition-colors
        "
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Right section */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {/* Mode selector */}
        <div className="flex items-center bg-[var(--glass-bg)] rounded-lg p-0.5">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onModeChange(option.value)}
              className={`
                px-2 py-1 text-xs font-medium rounded-md transition-all
                ${mode === option.value
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }
              `}
              title={option.label}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>

        {/* Clear button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              aria-label={t("clear")}
            >
              <X className="w-4 h-4 text-[var(--muted-foreground)]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
