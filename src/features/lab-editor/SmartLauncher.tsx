// src/components/lab/SmartLauncher.tsx
"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna,
  Rocket,
  Globe,
  Atom,
  Cpu,
  Sparkles,
  ArrowRight,
  LayoutTemplate,
  PenTool,
  X,
} from "lucide-react";
import {
  type LauncherState,
  type Discipline,
  DISCIPLINE_METADATA,
  DEFAULT_SUB_DISCIPLINES,
} from "@/lib/schemas/launcher";

// ============================================
// Icon Mapping
// ============================================

const DISCIPLINE_ICONS = {
  "life-health": Dna,
  "deep-space-ocean": Rocket,
  "social-innovation": Globe,
  "micro-nano": Atom,
  "digital-info": Cpu,
} as const;

// ============================================
// Component Props
// ============================================

interface SmartLauncherProps {
  onStart: (state: LauncherState) => void;
  onSkip?: () => void;
}

// ============================================
// Animation Variants
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

const expandVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: "easeIn" as const,
    },
  },
};

// ============================================
// Main Component
// ============================================

export function SmartLauncher({ onStart, onSkip }: SmartLauncherProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedSubDisciplines, setSelectedSubDisciplines] = useState<string[]>([]);

  // Handle prompt submission
  const handlePromptSubmit = useCallback(() => {
    if (!prompt.trim()) return;

    const state: LauncherState = {
      mode: "chat",
      prompt: prompt.trim(),
      discipline: selectedDiscipline ?? undefined,
      subDisciplines: selectedSubDisciplines.length > 0 ? selectedSubDisciplines : undefined,
    };

    onStart(state);
  }, [prompt, selectedDiscipline, selectedSubDisciplines, onStart]);

  // Handle keyboard submission
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handlePromptSubmit();
      }
    },
    [handlePromptSubmit]
  );

  // Handle discipline selection
  const handleDisciplineClick = useCallback((discipline: Discipline) => {
    setSelectedDiscipline((prev) => {
      if (prev === discipline) {
        // Deselect
        setSelectedSubDisciplines([]);
        return null;
      }
      // Select new discipline
      setSelectedSubDisciplines([]);
      return discipline;
    });
  }, []);

  // Handle sub-discipline selection (max 2)
  const handleSubDisciplineClick = useCallback((subDiscipline: string) => {
    setSelectedSubDisciplines((prev) => {
      if (prev.includes(subDiscipline)) {
        return prev.filter((s) => s !== subDiscipline);
      }
      if (prev.length >= 2) {
        // Replace the first one
        return [prev[1], subDiscipline];
      }
      return [...prev, subDiscipline];
    });
  }, []);

  // Handle quick start with discipline
  const handleQuickStart = useCallback(() => {
    if (!selectedDiscipline) return;

    const state: LauncherState = {
      mode: "quick",
      discipline: selectedDiscipline,
      subDisciplines: selectedSubDisciplines.length > 0 ? selectedSubDisciplines : undefined,
    };

    onStart(state);
  }, [selectedDiscipline, selectedSubDisciplines, onStart]);

  // Handle template mode
  const handleTemplateClick = useCallback(() => {
    onStart({ mode: "template" });
  }, [onStart]);

  // Handle blank canvas mode
  const handleBlankClick = useCallback(() => {
    onStart({ mode: "blank" });
  }, [onStart]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Header with OWL Logo and Welcome */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--owl-magenta)] to-[var(--owl-blue)] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold gradient-text">
              OWL Lab Designer
            </h1>
          </div>
          <p className="text-lg text-[var(--muted-foreground)]">
            AI 驱动的智能实验室设计助手，帮助您快速规划理想的研究空间
          </p>
        </motion.div>

        {/* Main Input Area */}
        <motion.div variants={itemVariants} className="glass-card p-6 space-y-4">
          <label
            htmlFor="prompt-input"
            className="block text-sm font-medium text-[var(--foreground)]"
          >
            描述您的实验室需求
          </label>
          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例如：我需要一个 50 平米的生物实验室，主要进行细胞培养和基因编辑实验，需要配备超净工作台和 PCR 仪..."
              className="w-full h-32 p-4 pr-12 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--owl-magenta)] transition-all"
            />
            <button
              onClick={handlePromptSubmit}
              disabled={!prompt.trim()}
              aria-label="提交需求"
              className="absolute right-3 bottom-3 p-2 rounded-lg bg-gradient-to-r from-[var(--owl-magenta)] to-[var(--owl-blue)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            按 Enter 提交，Shift + Enter 换行
          </p>
        </motion.div>

        {/* Discipline Selection */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-center">
            或选择研究领域快速开始
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {DISCIPLINE_METADATA.map((discipline) => {
              const Icon = DISCIPLINE_ICONS[discipline.id];
              const isSelected = selectedDiscipline === discipline.id;

              return (
                <motion.button
                  key={discipline.id}
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleDisciplineClick(discipline.id)}
                  className={`glass-card p-4 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? "ring-2 ring-[var(--owl-magenta)] bg-[var(--owl-magenta)]/10"
                      : "hover:bg-[var(--glass-border)]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-gradient-to-br from-[var(--owl-magenta)] to-[var(--owl-blue)] text-white"
                        : "bg-[var(--glass-bg)] text-[var(--owl-magenta)]"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{discipline.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)] mt-1 hidden md:block">
                      {discipline.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Sub-discipline Expansion */}
          <AnimatePresence>
            {selectedDiscipline && (
              <motion.div
                variants={expandVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <div className="glass-card p-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">
                      选择细分方向（最多 2 个）
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedDiscipline(null);
                        setSelectedSubDisciplines([]);
                      }}
                      aria-label="取消选择"
                      className="p-1 rounded hover:bg-[var(--glass-border)] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SUB_DISCIPLINES[selectedDiscipline].map((sub) => {
                      const isSubSelected = selectedSubDisciplines.includes(sub);
                      return (
                        <button
                          key={sub}
                          onClick={() => handleSubDisciplineClick(sub)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            isSubSelected
                              ? "bg-[var(--owl-magenta)] text-white"
                              : "bg-[var(--glass-bg)] text-[var(--foreground)] hover:bg-[var(--glass-border)]"
                          }`}
                          aria-pressed={isSubSelected}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleQuickStart}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--owl-magenta)] to-[var(--owl-blue)] text-white font-medium hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      开始设计
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Links */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 pt-4"
        >
          <button
            onClick={handleTemplateClick}
            className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" />
            <span className="text-sm">从模板开始</span>
          </button>

          <span className="text-[var(--muted-foreground)]">|</span>

          <button
            onClick={handleBlankClick}
            className="flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <PenTool className="w-4 h-4" />
            <span className="text-sm">空白画布</span>
          </button>

          {onSkip && (
            <>
              <span className="text-[var(--muted-foreground)]">|</span>
              <button
                onClick={onSkip}
                className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                跳过
              </button>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
