"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Ruler,
  Square,
  Triangle,
  X,
  Trash2,
  Info,
} from "lucide-react";
import type { MeasurementMode } from "@/hooks/useMeasurementTools";
import type { Measurement } from "@/lib/utils/measurements";

interface MeasurementToolbarProps {
  mode: MeasurementMode;
  onModeChange: (mode: MeasurementMode) => void;
  helpText: string;
  history: Measurement[];
  onClearHistory: () => void;
  onRemoveMeasurement: (index: number) => void;
}

export function MeasurementToolbar({
  mode,
  onModeChange,
  helpText,
  history,
  onClearHistory,
  onRemoveMeasurement,
}: MeasurementToolbarProps) {
  const tools = [
    {
      id: "distance" as const,
      icon: Ruler,
      label: "Distance",
      description: "Measure distance between two points",
    },
    {
      id: "area" as const,
      icon: Square,
      label: "Area",
      description: "Measure area of a rectangle",
    },
    {
      id: "angle" as const,
      icon: Triangle,
      label: "Angle",
      description: "Measure angle between three points",
    },
  ];

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
      <div className="glass-card p-3">
        {/* Tool Buttons */}
        <div className="flex items-center gap-2 mb-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = mode === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => onModeChange(isActive ? null : tool.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                  ${
                    isActive
                      ? "bg-[var(--neon-cyan)]/20 border-[var(--neon-cyan)] text-[var(--neon-cyan)]"
                      : "border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/50"
                  }
                `}
                title={tool.description}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tool.label}</span>
              </button>
            );
          })}

          {mode && (
            <button
              onClick={() => onModeChange(null)}
              className="ml-2 p-2 rounded-lg border border-[var(--glass-border)] hover:border-red-500 hover:text-red-500 transition-colors"
              title="Cancel measurement"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Help Text */}
        <AnimatePresence>
          {helpText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--neon-cyan)]/10 border border-[var(--neon-cyan)]/30"
            >
              <Info className="w-4 h-4 text-[var(--neon-cyan)] flex-shrink-0" />
              <span className="text-xs text-[var(--neon-cyan)]">{helpText}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Measurement History */}
        {history.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                Measurements ({history.length})
              </span>
              <button
                onClick={onClearHistory}
                className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                title="Clear all measurements"
              >
                <Trash2 className="w-3 h-3 text-[var(--muted-foreground)]" />
              </button>
            </div>

            <div className="space-y-1 max-h-32 overflow-y-auto">
              {history.map((measurement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)]/80 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {measurement.type === "distance" && (
                      <Ruler className="w-3 h-3 text-[var(--muted-foreground)]" />
                    )}
                    {measurement.type === "area" && (
                      <Square className="w-3 h-3 text-[var(--muted-foreground)]" />
                    )}
                    {measurement.type === "angle" && (
                      <Triangle className="w-3 h-3 text-[var(--muted-foreground)]" />
                    )}
                    <span className="font-mono">{measurement.label}</span>
                  </div>
                  <button
                    onClick={() => onRemoveMeasurement(index)}
                    className="p-1 rounded hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
