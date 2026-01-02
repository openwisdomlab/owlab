"use client";

import { Search, Command } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchStore } from "@/stores/search-store";

interface SearchButtonProps {
  variant?: "icon" | "full";
  className?: string;
}

export function SearchButton({ variant = "full", className = "" }: SearchButtonProps) {
  const t = useTranslations("search");
  const { openDialog } = useSearchStore();

  if (variant === "icon") {
    return (
      <button
        onClick={openDialog}
        className={`
          p-2 rounded-lg
          hover:bg-[var(--glass-bg)]
          transition-colors
          ${className}
        `}
        aria-label={t("openSearch")}
      >
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={openDialog}
      className={`
        flex items-center gap-3 px-3 py-2
        bg-[var(--glass-bg)] hover:bg-[var(--accent)]
        border border-[var(--border)]
        rounded-lg
        transition-all duration-150
        group
        ${className}
      `}
      aria-label={t("openSearch")}
    >
      <Search className="w-4 h-4 text-[var(--muted-foreground)]" />
      <span className="text-sm text-[var(--muted-foreground)] hidden sm:inline">
        {t("placeholder")}
      </span>
      <div className="hidden sm:flex items-center gap-0.5 ml-auto">
        <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-[var(--card)] border border-[var(--border)] rounded text-[var(--muted-foreground)] group-hover:border-[var(--primary)] transition-colors">
          <Command className="w-2.5 h-2.5 inline" />
        </kbd>
        <kbd className="px-1.5 py-0.5 text-[10px] font-medium bg-[var(--card)] border border-[var(--border)] rounded text-[var(--muted-foreground)] group-hover:border-[var(--primary)] transition-colors">
          K
        </kbd>
      </div>
    </button>
  );
}
