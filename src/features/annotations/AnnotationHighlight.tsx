"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Check, Trash2, Reply, X } from "lucide-react";
import { useAnnotationStore, type Annotation } from "@/stores/annotation-store";
import { useTranslations } from "next-intl";

interface AnnotationHighlightProps {
  annotation: Annotation;
}

export function AnnotationHighlight({ annotation }: AnnotationHighlightProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const t = useTranslations("annotations");

  const {
    resolveAnnotation,
    unresolveAnnotation,
    deleteAnnotation,
    addReply,
    deleteReply,
    setActiveAnnotation,
  } = useAnnotationStore();

  const isMentor = annotation.role === "mentor";
  const accentColor = isMentor ? "amber" : "cyan";

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setActiveAnnotation(isOpen ? null : annotation.id);
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    addReply(annotation.id, {
      author: annotation.author,
      role: annotation.role,
      content: replyText.trim(),
    });
    setReplyText("");
    setShowReplyInput(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <span className="relative inline">
      {/* Highlighted text trigger */}
      <span
        ref={triggerRef}
        onClick={handleToggle}
        className={`
          cursor-pointer relative transition-colors duration-200
          ${isMentor
            ? "underline decoration-amber-400/60 decoration-2 underline-offset-2 hover:decoration-amber-400"
            : "underline decoration-cyan-400/60 decoration-2 underline-offset-2 hover:decoration-cyan-400"
          }
        `}
      >
        {annotation.selectedText}
        {/* Badge */}
        <span
          className={`
            inline-flex items-center justify-center ml-0.5 align-super
            w-4 h-4 rounded-full text-[10px] font-bold
            ${isMentor
              ? "bg-amber-500/20 text-amber-400"
              : "bg-cyan-500/20 text-cyan-400"
            }
          `}
        >
          {1 + annotation.replies.length}
        </span>
      </span>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 top-full left-0 mt-2 w-80
              rounded-xl border backdrop-blur-xl shadow-2xl
              ${isMentor
                ? "bg-amber-950/80 border-amber-500/30"
                : "bg-cyan-950/80 border-cyan-500/30"
              }
            `}
          >
            {/* Header */}
            <div className={`
              flex items-center justify-between px-4 py-2.5 border-b
              ${isMentor ? "border-amber-500/20" : "border-cyan-500/20"}
            `}>
              <div className="flex items-center gap-2">
                <span className={`
                  text-xs font-semibold px-2 py-0.5 rounded-full
                  ${isMentor
                    ? "bg-amber-500/20 text-amber-300"
                    : "bg-cyan-500/20 text-cyan-300"
                  }
                `}>
                  {isMentor ? t("mentor") : t("student")}
                </span>
                <span className="text-sm font-medium text-white/90">
                  {annotation.author}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>

            {/* Comment body */}
            <div className="px-4 py-3">
              <p className="text-sm text-white/80 leading-relaxed">
                {annotation.comment}
              </p>
              <span className="text-[10px] text-white/40 mt-1.5 block">
                {formatDate(annotation.createdAt)}
              </span>
            </div>

            {/* Replies */}
            {annotation.replies.length > 0 && (
              <div className={`
                border-t px-4 py-2 space-y-2
                ${isMentor ? "border-amber-500/20" : "border-cyan-500/20"}
              `}>
                {annotation.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="flex items-start gap-2 group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`
                          text-[10px] font-medium px-1.5 py-0.5 rounded-full
                          ${reply.role === "mentor"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-cyan-500/15 text-cyan-300"
                          }
                        `}>
                          {reply.author}
                        </span>
                        <span className="text-[10px] text-white/30">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteReply(annotation.id, reply.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="w-3 h-3 text-white/30" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            <AnimatePresence>
              {showReplyInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`
                    overflow-hidden border-t
                    ${isMentor ? "border-amber-500/20" : "border-cyan-500/20"}
                  `}
                >
                  <div className="px-4 py-2.5">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={t("replyPlaceholder")}
                      className={`
                        w-full text-xs rounded-lg px-3 py-2 resize-none
                        bg-white/5 border text-white/80
                        placeholder:text-white/30 focus:outline-none
                        ${isMentor
                          ? "border-amber-500/20 focus:border-amber-500/50"
                          : "border-cyan-500/20 focus:border-cyan-500/50"
                        }
                      `}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleReply();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-1.5 mt-1.5">
                      <button
                        onClick={() => setShowReplyInput(false)}
                        className="text-[10px] px-2 py-1 rounded text-white/50 hover:bg-white/10 transition-colors"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className={`
                          text-[10px] px-2 py-1 rounded font-medium transition-colors
                          disabled:opacity-30
                          ${isMentor
                            ? "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                            : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                          }
                        `}
                      >
                        {t("send")}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className={`
              flex items-center gap-1 px-3 py-2 border-t
              ${isMentor ? "border-amber-500/20" : "border-cyan-500/20"}
            `}>
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
              >
                <Reply className="w-3 h-3" />
                {t("reply")}
              </button>
              <button
                onClick={() =>
                  annotation.resolved
                    ? unresolveAnnotation(annotation.id)
                    : resolveAnnotation(annotation.id)
                }
                className={`
                  flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg transition-colors
                  ${annotation.resolved
                    ? "text-green-400 hover:bg-green-500/10"
                    : "text-white/50 hover:text-white/80 hover:bg-white/10"
                  }
                `}
              >
                <Check className="w-3 h-3" />
                {annotation.resolved ? t("resolved") : t("resolve")}
              </button>
              <div className="flex-1" />
              <button
                onClick={() => {
                  deleteAnnotation(annotation.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                {t("delete")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
