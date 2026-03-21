"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquarePlus, User, GraduationCap, BookOpen } from "lucide-react";
import { useAnnotationStore } from "@/stores/annotation-store";
import { useTranslations } from "next-intl";

interface AnnotationDialogProps {
  pageId: string;
  selectedText: string;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export function AnnotationDialog({
  pageId,
  selectedText,
  onClose,
  onCreated,
}: AnnotationDialogProps) {
  const t = useTranslations("annotations");
  const { addAnnotation, openPanel } = useAnnotationStore();

  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState<"mentor" | "student">("mentor");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!author.trim()) newErrors.author = t("authorRequired");
    if (!comment.trim()) newErrors.comment = t("commentRequired");
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const id = addAnnotation({
      pageId,
      selectedText,
      comment: comment.trim(),
      author: author.trim(),
      role,
    });

    openPanel();
    onCreated?.(id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="
            relative z-10 w-full max-w-md
            rounded-2xl border border-[var(--glass-border)]
            bg-[var(--background)]/95 backdrop-blur-xl
            shadow-2xl overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--glass-border)]">
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-[var(--neon-cyan)]" />
              <h2 className="font-semibold">{t("add")}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4">
            {/* Selected text preview */}
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
                {t("selectedText")}
              </label>
              <div className="text-sm px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] italic text-[var(--foreground)]/70 line-clamp-3">
                &ldquo;{selectedText}&rdquo;
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
                {t("authorLabel")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => {
                    setAuthor(e.target.value);
                    setErrors((prev) => ({ ...prev, author: "" }));
                  }}
                  placeholder={t("authorPlaceholder")}
                  className={`
                    w-full text-sm rounded-lg pl-9 pr-3 py-2
                    bg-[var(--background)] border
                    placeholder:text-[var(--muted-foreground)]/50
                    focus:outline-none transition-colors
                    ${errors.author
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-[var(--glass-border)] focus:border-[var(--neon-cyan)]"
                    }
                  `}
                />
              </div>
              {errors.author && (
                <p className="text-[10px] text-red-400 mt-0.5">{errors.author}</p>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1.5 block">
                {t("roleLabel")}
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setRole("mentor")}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all border
                    ${role === "mentor"
                      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
                      : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--muted-foreground)] hover:bg-[var(--glass-bg)]"
                    }
                  `}
                >
                  <GraduationCap className="w-4 h-4" />
                  {t("mentor")}
                </button>
                <button
                  onClick={() => setRole("student")}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg
                    text-sm font-medium transition-all border
                    ${role === "student"
                      ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400"
                      : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--muted-foreground)] hover:bg-[var(--glass-bg)]"
                    }
                  `}
                >
                  <BookOpen className="w-4 h-4" />
                  {t("student")}
                </button>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs font-medium text-[var(--muted-foreground)] mb-1 block">
                {t("commentLabel")}
              </label>
              <textarea
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  setErrors((prev) => ({ ...prev, comment: "" }));
                }}
                placeholder={t("commentPlaceholder")}
                rows={4}
                className={`
                  w-full text-sm rounded-lg px-3 py-2 resize-none
                  bg-[var(--background)] border
                  placeholder:text-[var(--muted-foreground)]/50
                  focus:outline-none transition-colors
                  ${errors.comment
                    ? "border-red-500/50 focus:border-red-500"
                    : "border-[var(--glass-border)] focus:border-[var(--neon-cyan)]"
                  }
                `}
              />
              {errors.comment && (
                <p className="text-[10px] text-red-400 mt-0.5">{errors.comment}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--glass-border)]">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="text-sm px-4 py-2 rounded-lg font-medium bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/25 transition-colors"
            >
              {t("submit")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
