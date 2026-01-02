"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { FileText, Hash, ExternalLink, Sparkles, Brain, Bot } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { trackClick } from "@/lib/search/analytics";
import { useSearchStore } from "@/stores/search-store";

export type ResultType = "basic" | "semantic" | "agentic";

interface SearchResultItemProps {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  score: number;
  type?: ResultType;
  isSelected?: boolean;
  index?: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

const typeConfig: Record<ResultType, { icon: typeof FileText; color: string; label: string }> = {
  basic: {
    icon: FileText,
    color: "text-blue-500",
    label: "Keyword",
  },
  semantic: {
    icon: Brain,
    color: "text-purple-500",
    label: "Semantic",
  },
  agentic: {
    icon: Bot,
    color: "text-emerald-500",
    label: "AI",
  },
};

export function SearchResultItem({
  title,
  url,
  excerpt,
  score,
  type = "basic",
  isSelected = false,
  index = 0,
  onClick,
  onMouseEnter,
}: SearchResultItemProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const params = useParams();
  const locale = (params?.locale as string) || "zh";
  const { query } = useSearchStore();

  const handleClick = () => {
    // Track click analytics
    trackClick(query, url, index, locale);
    onClick?.();
  };

  // Extract anchor from URL if present
  const hasAnchor = url.includes("#");
  const displayUrl = url.replace(/^\/[a-z]{2}\//, "/").replace(/^\/docs\//, "");

  // Highlight matched text in excerpt (marked with <mark> tags from API)
  const highlightExcerpt = (text: string) => {
    const parts = text.split(/(<mark>|<\/mark>)/g);
    let isHighlighted = false;

    return parts.map((part, i) => {
      if (part === "<mark>") {
        isHighlighted = true;
        return null;
      }
      if (part === "</mark>") {
        isHighlighted = false;
        return null;
      }
      if (isHighlighted) {
        return (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-[var(--foreground)] px-0.5 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Link
        href={url}
        onClick={handleClick}
        onMouseEnter={onMouseEnter}
        className={`
          block p-3 rounded-lg transition-all duration-150
          ${isSelected
            ? "bg-[var(--accent)] shadow-sm"
            : "hover:bg-[var(--glass-bg)]"
          }
        `}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`mt-0.5 ${config.color}`}>
            <Icon className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-[var(--foreground)] truncate">
                {title}
              </h4>
              {hasAnchor && (
                <Hash className="w-3 h-3 text-[var(--muted-foreground)]" />
              )}
            </div>

            {/* Excerpt */}
            <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2">
              {highlightExcerpt(excerpt)}
            </p>

            {/* Meta */}
            <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
              {/* Path */}
              <span className="truncate max-w-[200px]">{displayUrl}</span>

              {/* Score badge */}
              <span className={`
                inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium
                ${type === "basic" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" : ""}
                ${type === "semantic" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : ""}
                ${type === "agentic" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}
              `}>
                {type === "semantic" || type === "agentic" ? (
                  <Sparkles className="w-2.5 h-2.5" />
                ) : null}
                {Math.round(score * 100)}%
              </span>
            </div>
          </div>

          {/* Arrow */}
          <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
    </motion.div>
  );
}
