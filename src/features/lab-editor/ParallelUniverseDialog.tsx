// src/components/lab/ParallelUniverseDialog.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Globe,
  TrendingUp,
  TrendingDown,
  Check,
  Loader2,
} from "lucide-react";
import { useParallelUniverses } from "@/hooks/useParallelUniverses";
import type { UniverseVariant } from "@/lib/ai/agents/parallel-universe-agent";
import { formatCurrency } from "@/lib/utils/budget";

interface ParallelUniverseDialogProps {
  onClose: () => void;
}

const DECISION_POINTS = [
  { id: "entrance", label: "入口位置", description: "探索不同的入口布局方案" },
  { id: "workspace", label: "工作区布局", description: "优化工作区域的配置" },
  { id: "flow", label: "人流动线", description: "改进空间内的移动路径" },
  { id: "equipment", label: "设备分布", description: "重新规划设备的位置" },
  { id: "collaboration", label: "协作空间", description: "增强团队协作区域" },
];

export function ParallelUniverseDialog({ onClose }: ParallelUniverseDialogProps) {
  const [selectedDecision, setSelectedDecision] = useState<string>("");
  const [constraints, setConstraints] = useState("");

  const {
    isGenerating,
    error,
    variants,
    generateUniverses,
    applyVariant,
    clearVariants,
  } = useParallelUniverses();

  const handleGenerate = async () => {
    if (!selectedDecision) return;
    await generateUniverses(selectedDecision, constraints || undefined);
  };

  const handleApply = (variant: UniverseVariant) => {
    applyVariant(variant);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-4xl max-h-[80vh] glass-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--neon-purple)]" />
            <h2 id="dialog-title" className="font-semibold">平行宇宙设计器</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="关闭对话框"
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {variants.length === 0 ? (
            /* Generation Form */
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">选择决策点</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="radiogroup" aria-label="决策点选择">
                  {DECISION_POINTS.map((point) => (
                    <button
                      key={point.id}
                      onClick={() => setSelectedDecision(point.label)}
                      role="radio"
                      aria-checked={selectedDecision === point.label}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        selectedDecision === point.label
                          ? "bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]"
                          : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                      }`}
                    >
                      <div className="font-medium text-sm">{point.label}</div>
                      <div className="text-xs text-[var(--muted-foreground)] mt-1">
                        {point.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="constraints" className="text-sm font-medium mb-2 block">
                  额外约束条件（可选）
                </label>
                <textarea
                  id="constraints"
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  placeholder="例如：预算不超过100万、需要容纳20人..."
                  className="w-full h-24 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none resize-none"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm" role="alert">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* Variants Display */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  探索到 {variants.length} 个平行宇宙
                </h3>
                <button
                  onClick={clearVariants}
                  className="text-sm text-[var(--muted-foreground)] hover:text-white transition-colors"
                >
                  重新生成
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variants.map((variant, index) => (
                  <motion.div
                    key={variant.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card p-4 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: `hsl(${(index % 12) * 30}, 70%, 50%)`,
                        }}
                      >
                        {index < 24 ? String.fromCharCode(945 + index) : (index + 1)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{variant.name}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {variant.theme}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--muted-foreground)] mb-3 flex-1">
                      {variant.description}
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-[var(--muted-foreground)]">优势:</span>
                      </div>
                      <ul className="text-xs space-y-1 pl-5">
                        {variant.pros.slice(0, 2).map((pro) => (
                          <li key={pro} className="text-green-400">• {pro}</li>
                        ))}
                      </ul>

                      <div className="flex items-center gap-2 text-xs">
                        <TrendingDown className="w-3 h-3 text-red-400" />
                        <span className="text-[var(--muted-foreground)]">劣势:</span>
                      </div>
                      <ul className="text-xs space-y-1 pl-5">
                        {variant.cons.slice(0, 2).map((con) => (
                          <li key={con} className="text-red-400">• {con}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-3 pt-3 border-t border-[var(--glass-border)]">
                      <span>成本: {formatCurrency(variant.estimatedCost, "CNY")}</span>
                      <span>效率: {(variant.efficiencyScore * 100).toFixed(0)}%</span>
                    </div>

                    <button
                      onClick={() => handleApply(variant)}
                      className="w-full py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] text-sm font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      应用此宇宙
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {variants.length === 0 && (
          <div className="p-4 border-t border-[var(--glass-border)]">
            <button
              onClick={handleGenerate}
              disabled={!selectedDecision || isGenerating}
              className="w-full py-3 rounded-lg bg-[var(--neon-purple)] text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  正在探索平行宇宙...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成平行宇宙
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
