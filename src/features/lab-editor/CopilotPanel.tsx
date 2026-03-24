"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, Wrench, X, Zap } from "lucide-react";
import { getInstantSuggestions, type CopilotSuggestion } from "@/lib/ai/agents/copilot-agent";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";

interface CopilotPanelProps {
  layout: LayoutData;
  onClose: () => void;
  onApplyFix?: (zoneId: string, updates: Partial<ZoneData>) => void;
}

export function CopilotPanel({ layout, onClose, onApplyFix }: CopilotPanelProps) {
  const suggestions = useMemo(() => getInstantSuggestions(layout), [layout]);

  const errors = suggestions.filter(s => s.type === "error");
  const warnings = suggestions.filter(s => s.type === "warning");
  const tips = suggestions.filter(s => s.type === "tip");

  const icon = (type: CopilotSuggestion["type"]) => {
    switch (type) {
      case "error": return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0" />;
      case "tip": return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 right-4 w-80 max-h-96 overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl"
    >
      {/* Header */}
      <div className="sticky top-0 bg-[var(--glass-bg)] backdrop-blur-xl border-b border-[var(--glass-border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--neon-cyan)]" />
          <span className="text-sm font-medium">Copilot</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            errors.length > 0 ? "bg-red-500/20 text-red-400" :
            warnings.length > 0 ? "bg-yellow-500/20 text-yellow-400" :
            "bg-green-500/20 text-green-400"
          }`}>
            {errors.length > 0 ? `${errors.length} 错误` :
             warnings.length > 0 ? `${warnings.length} 警告` : "✓ 合规"}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestions list */}
      <div className="p-3 space-y-2">
        {suggestions.length === 0 && (
          <p className="text-sm text-white/50 text-center py-4">布局符合所有规则 ✓</p>
        )}
        {[...errors, ...warnings, ...tips].map((s, i) => (
          <div key={i} className="flex gap-2 p-2 rounded-lg bg-white/5 text-sm">
            {icon(s.type)}
            <div className="flex-1 min-w-0">
              <p className="text-white/80">{s.messageZh}</p>
              {s.autoFixAvailable && s.autoFix && onApplyFix && (
                <button
                  onClick={() => onApplyFix(s.autoFix!.zoneId, s.autoFix!.updates)}
                  className="mt-1 flex items-center gap-1 text-xs text-[var(--neon-cyan)] hover:underline"
                >
                  <Wrench className="w-3 h-3" /> 自动修复
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
