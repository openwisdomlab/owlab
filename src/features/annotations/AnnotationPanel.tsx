"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  CheckCircle2,
  Circle,
  Filter,
  Plus,
} from "lucide-react";
import { useAnnotationStore, type Annotation } from "@/stores/annotation-store";
import { useTranslations } from "next-intl";

interface AnnotationPanelProps {
  pageId: string;
  onAddAnnotation: () => void;
}

export function AnnotationPanel({ pageId, onAddAnnotation }: AnnotationPanelProps) {
  const t = useTranslations("annotations");
  const {
    isPanelOpen,
    closePanel,
    filterStatus,
    setFilterStatus,
    activeAnnotationId,
    setActiveAnnotation,
    resolveAnnotation,
    unresolveAnnotation,
    deleteAnnotation,
    getFilteredAnnotations,
    getAnnotationsForPage,
  } = useAnnotationStore();

  const allAnnotations = useMemo(
    () => getAnnotationsForPage(pageId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageId, useAnnotationStore.getState().annotations]
  );

  const filteredAnnotations = useMemo(
    () => getFilteredAnnotations(pageId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageId, filterStatus, useAnnotationStore.getState().annotations]
  );

  const unresolvedCount = allAnnotations.filter((a) => !a.resolved).length;
  const resolvedCount = allAnnotations.filter((a) => a.resolved).length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterOptions: { value: "all" | "resolved" | "unresolved"; label: string; count: number }[] = [
    { value: "all", label: t("all"), count: allAnnotations.length },
    { value: "unresolved", label: t("unresolved"), count: unresolvedCount },
    { value: "resolved", label: t("resolved"), count: resolvedCount },
  ];

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={closePanel}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="
              fixed right-0 top-0 bottom-0 z-50
              w-full max-w-sm
              lg:relative lg:z-auto lg:w-80 lg:min-w-80
              flex flex-col
              border-l border-[var(--glass-border)]
              bg-[var(--background)]/95 backdrop-blur-xl
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--neon-cyan)]" />
                <h3 className="font-semibold text-sm">{t("title")}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--muted-foreground)]">
                  {allAnnotations.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onAddAnnotation}
                  className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--neon-cyan)]"
                  title={t("add")}
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={closePanel}
                  className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-1 px-4 py-2 border-b border-[var(--glass-border)]">
              <Filter className="w-3 h-3 text-[var(--muted-foreground)] mr-1" />
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterStatus(option.value)}
                  className={`
                    text-[11px] px-2 py-1 rounded-lg transition-colors
                    ${filterStatus === option.value
                      ? "bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] font-medium"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--glass-bg)]"
                    }
                  `}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>

            {/* Annotation list */}
            <div className="flex-1 overflow-y-auto">
              {filteredAnnotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[var(--muted-foreground)]">
                  <MessageSquare className="w-8 h-8 opacity-30 mb-2" />
                  <p className="text-sm">{t("empty")}</p>
                  <button
                    onClick={onAddAnnotation}
                    className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/25 transition-colors"
                  >
                    {t("addFirst")}
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[var(--glass-border)]">
                  {filteredAnnotations.map((annotation) => (
                    <AnnotationListItem
                      key={annotation.id}
                      annotation={annotation}
                      isActive={activeAnnotationId === annotation.id}
                      onSelect={() => setActiveAnnotation(annotation.id)}
                      onResolve={() =>
                        annotation.resolved
                          ? unresolveAnnotation(annotation.id)
                          : resolveAnnotation(annotation.id)
                      }
                      onDelete={() => deleteAnnotation(annotation.id)}
                      formatDate={formatDate}
                      t={t}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// --- List Item subcomponent ---

interface AnnotationListItemProps {
  annotation: Annotation;
  isActive: boolean;
  onSelect: () => void;
  onResolve: () => void;
  onDelete: () => void;
  formatDate: (d: string) => string;
  t: ReturnType<typeof useTranslations>;
}

function AnnotationListItem({
  annotation,
  isActive,
  onSelect,
  onResolve,
  onDelete,
  formatDate,
  t,
}: AnnotationListItemProps) {
  const isMentor = annotation.role === "mentor";

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={`
        px-4 py-3 cursor-pointer transition-colors
        ${isActive
          ? isMentor
            ? "bg-amber-500/10 border-l-2 border-l-amber-400"
            : "bg-cyan-500/10 border-l-2 border-l-cyan-400"
          : "hover:bg-[var(--glass-bg)] border-l-2 border-l-transparent"
        }
      `}
    >
      {/* Author and status */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`
              text-[10px] font-semibold px-1.5 py-0.5 rounded-full
              ${isMentor
                ? "bg-amber-500/20 text-amber-400"
                : "bg-cyan-500/20 text-cyan-400"
              }
            `}
          >
            {isMentor ? t("mentor") : t("student")}
          </span>
          <span className="text-xs font-medium text-[var(--foreground)]">
            {annotation.author}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {annotation.resolved ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
          )}
        </div>
      </div>

      {/* Selected text preview */}
      <p
        className={`
          text-[11px] px-2 py-1 rounded mb-1.5 line-clamp-1 italic
          ${isMentor
            ? "bg-amber-500/10 text-amber-300/80"
            : "bg-cyan-500/10 text-cyan-300/80"
          }
        `}
      >
        &ldquo;{annotation.selectedText}&rdquo;
      </p>

      {/* Comment preview */}
      <p className="text-xs text-[var(--foreground)]/70 line-clamp-2 leading-relaxed">
        {annotation.comment}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-[var(--muted-foreground)]">
          {formatDate(annotation.createdAt)}
        </span>
        <div className="flex items-center gap-2">
          {annotation.replies.length > 0 && (
            <span className="text-[10px] text-[var(--muted-foreground)] flex items-center gap-0.5">
              <MessageSquare className="w-2.5 h-2.5" />
              {annotation.replies.length}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResolve();
            }}
            className="text-[10px] px-1.5 py-0.5 rounded hover:bg-[var(--glass-bg)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            {annotation.resolved ? t("unresolve") : t("resolve")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[10px] px-1.5 py-0.5 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors"
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
