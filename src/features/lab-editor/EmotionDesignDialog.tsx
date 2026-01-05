// src/components/lab/EmotionDesignDialog.tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Loader2, Sparkles, RotateCcw } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useEmotionDesign } from "@/hooks/useEmotionDesign";
import { EmotionTimelineEditor } from "./EmotionTimelineEditor";
import { SpatialRecommendationPanel } from "./SpatialRecommendationPanel";
import type { EmotionScript, EmotionType, EmotionToSpaceResult } from "@/lib/schemas/emotion-design";
import { EMOTION_COLORS, EMOTION_LABELS } from "@/lib/schemas/emotion-design";

interface EmotionDesignDialogProps {
  onClose: () => void;
  onApplyResult?: (result: EmotionToSpaceResult) => void;
}

const EMOTION_PRESETS: { name: string; emotions: EmotionType[] }[] = [
  { name: "创新探索", emotions: ["curiosity", "creativity", "excitement"] },
  { name: "专注学习", emotions: ["focus", "calm", "safety"] },
  { name: "团队协作", emotions: ["collaboration", "excitement", "creativity"] },
  { name: "深度思考", emotions: ["calm", "focus", "awe"] },
];

const createDefaultScript = (): EmotionScript => ({
  id: uuidv4(),
  name: "新情绪剧本",
  nodes: [],
  totalDuration: 60,
});

export function EmotionDesignDialog({
  onClose,
  onApplyResult,
}: EmotionDesignDialogProps) {
  const [script, setScript] = useState<EmotionScript>(createDefaultScript);
  const { isGenerating, error, result, generateDesign, clearResult } = useEmotionDesign();

  const handleGenerate = useCallback(async () => {
    if (script.nodes.length === 0) return;
    await generateDesign(script);
  }, [script, generateDesign]);

  const handleReset = useCallback(() => {
    setScript(createDefaultScript());
    clearResult();
  }, [clearResult]);

  const handleApplyPreset = useCallback((emotions: EmotionType[]) => {
    const nodes = emotions.map((emotion, index) => ({
      id: uuidv4(),
      emotion,
      intensity: 0.7 + Math.random() * 0.2,
      timestamp: index * 20,
    }));
    setScript((prev) => ({
      ...prev,
      nodes,
      totalDuration: emotions.length * 20,
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="emotion-dialog-title"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl max-h-[85vh] glass-card overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[var(--neon-purple)]" />
            <h2 id="emotion-dialog-title" className="font-semibold">
              反向情绪设计器
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              aria-label="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Left: Editor */}
          <div className="flex-1 overflow-auto p-4 border-r border-[var(--glass-border)]">
            {!result ? (
              <div className="space-y-6">
                {/* Presets */}
                <div>
                  <h3 className="text-sm font-medium mb-3">快速开始：选择情绪预设</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {EMOTION_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset.emotions)}
                        className="p-3 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors text-left"
                      >
                        <div className="font-medium text-sm mb-1">{preset.name}</div>
                        <div className="flex gap-1">
                          {preset.emotions.map((e) => (
                            <span
                              key={e}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: EMOTION_COLORS[e] }}
                              title={EMOTION_LABELS[e]}
                            />
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Editor */}
                <EmotionTimelineEditor
                  script={script}
                  onChange={setScript}
                  maxDuration={120}
                />

                {/* Script Name */}
                <div>
                  <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                    剧本名称
                  </label>
                  <input
                    type="text"
                    value={script.name}
                    onChange={(e) => setScript((s) => ({ ...s, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm" role="alert">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <SpatialRecommendationPanel
                result={result}
                onApplyZone={(zone) => {
                  if (onApplyResult) {
                    onApplyResult(result);
                  }
                  onClose();
                }}
              />
            )}
          </div>

          {/* Right: Summary / Actions */}
          <div className="w-72 p-4 bg-[var(--glass-bg)] flex flex-col">
            <h3 className="text-sm font-medium mb-4">情绪旅程摘要</h3>

            {script.nodes.length > 0 ? (
              <div className="flex-1 overflow-auto space-y-2">
                {script.nodes.map((node, index) => (
                  <div
                    key={node.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[var(--background)]"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: EMOTION_COLORS[node.emotion] }}
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-medium">{EMOTION_LABELS[node.emotion]}</div>
                      <div className="text-[var(--muted-foreground)]">
                        {node.timestamp}分钟 · {(node.intensity * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-[var(--muted-foreground)] text-center">
                添加情绪节点来设计你的情绪旅程
              </div>
            )}

            {/* Generate Button */}
            {!result && (
              <button
                onClick={handleGenerate}
                disabled={script.nodes.length === 0 || isGenerating}
                className="mt-4 w-full py-3 rounded-lg bg-[var(--neon-purple)] text-white font-medium hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    正在生成空间建议...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    生成空间设计
                  </>
                )}
              </button>
            )}

            {/* Back to Edit */}
            {result && (
              <button
                onClick={clearResult}
                className="mt-4 w-full py-3 rounded-lg bg-[var(--glass-border)] text-white font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                修改情绪剧本
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
