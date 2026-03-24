"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Loader2, Download, X, Check } from "lucide-react";
import {
  SUITE_PRESETS,
  VIEW_TYPE_CONFIGS,
  type SuitePreset,
  type ViewType,
} from "@/lib/ai/prompts/visualization";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

interface ReportSuiteGeneratorProps {
  layout: LayoutData;
  onClose: () => void;
}

interface GeneratedImage {
  viewType: ViewType;
  imageData: string; // base64
}

export function ReportSuiteGenerator({ layout, onClose }: ReportSuiteGeneratorProps) {
  const [selectedPreset, setSelectedPreset] = useState<SuitePreset>("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const preset = SUITE_PRESETS[selectedPreset];
  const aiViews = preset.views.filter(v => {
    const config = VIEW_TYPE_CONFIGS.find(c => c.id === v);
    return config && config.generationMethod !== "programmatic";
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    setResults([]);
    setProgress(0);

    for (let i = 0; i < aiViews.length; i++) {
      const viewType = aiViews[i];
      setCurrentView(viewType);
      setProgress(Math.round((i / aiViews.length) * 100));

      try {
        const resp = await fetch("/api/ai/visualize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ layout, viewType, style: "architectural" }),
        });

        if (resp.ok) {
          const data = await resp.json();
          if (data.imageData) {
            setResults(prev => [...prev, { viewType, imageData: data.imageData }]);
          }
        }
      } catch (err) {
        console.error(`Failed to generate ${viewType}`, err);
      }
    }

    setIsGenerating(false);
    setCurrentView(null);
    setProgress(100);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="w-[640px] max-h-[80vh] overflow-y-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h2 className="text-lg font-semibold">汇报套图生成</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Selection */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(SUITE_PRESETS) as [SuitePreset, typeof SUITE_PRESETS[SuitePreset]][]).map(([key, suite]) => (
              <button
                key={key}
                onClick={() => setSelectedPreset(key)}
                className={`p-3 rounded-xl border text-left transition-colors ${
                  selectedPreset === key
                    ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                    : "border-[var(--glass-border)] hover:bg-white/5"
                }`}
              >
                <p className="font-medium text-sm">{suite.nameZh}</p>
                <p className="text-xs text-white/50 mt-1">
                  {suite.views.length} 张图 ({aiViews.length} AI生成)
                </p>
              </button>
            ))}
          </div>

          {/* View list */}
          <div className="space-y-1">
            <p className="text-sm text-white/60">包含视图:</p>
            <div className="flex flex-wrap gap-1.5">
              {preset.views.map(v => {
                const config = VIEW_TYPE_CONFIGS.find(c => c.id === v);
                const generated = results.find(r => r.viewType === v);
                return (
                  <span key={v} className={`text-xs px-2 py-1 rounded-full ${
                    generated ? "bg-green-500/20 text-green-400" :
                    currentView === v ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] animate-pulse" :
                    "bg-white/10 text-white/50"
                  }`}>
                    {config?.nameZh || v}
                    {generated && <Check className="inline w-3 h-3 ml-1" />}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--neon-cyan)]" />
                正在生成: {VIEW_TYPE_CONFIGS.find(c => c.id === currentView)?.nameZh || "..."}
              </div>
              <div className="h-1.5 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[var(--neon-cyan)] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Results preview */}
          {results.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {results.map((r, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[var(--glass-border)]">
                  <img src={`data:image/jpeg;base64,${r.imageData}`} alt={r.viewType} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[10px] bg-black/60 px-1.5 py-0.5 rounded">
                    {VIEW_TYPE_CONFIGS.find(c => c.id === r.viewType)?.nameZh}
                  </span>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--glass-border)] flex justify-end gap-3">
          {results.length > 0 && (
            <button
              onClick={() => {
                // Download all as JSON for now
                const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${layout.name}-suite.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-white/5"
            >
              <Download className="w-4 h-4" /> 下载
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-black font-medium disabled:opacity-30"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
            {isGenerating ? "生成中..." : "开始生成"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
