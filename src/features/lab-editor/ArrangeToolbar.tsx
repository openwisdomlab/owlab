"use client";

import { motion } from "framer-motion";
import {
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  LayoutGrid,
  Sparkles,
} from "lucide-react";

interface ArrangeToolbarProps {
  onDistributeHorizontally: () => void;
  onDistributeVertically: () => void;
  onAutoArrange: () => void;
  selectedZoneCount: number;
  disabled?: boolean;
}

export function ArrangeToolbar({
  onDistributeHorizontally,
  onDistributeVertically,
  onAutoArrange,
  selectedZoneCount,
  disabled = false,
}: ArrangeToolbarProps) {
  const needsSelection = selectedZoneCount < 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-2"
    >
      <div className="flex items-center gap-2">
        {/* Distribute Horizontally */}
        <button
          onClick={onDistributeHorizontally}
          disabled={disabled || needsSelection}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
            ${
              disabled || needsSelection
                ? "opacity-50 cursor-not-allowed border-[var(--glass-border)]"
                : "border-[var(--glass-border)] hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
            }
          `}
          title={
            needsSelection
              ? "Select 2+ zones to distribute"
              : "Distribute zones horizontally"
          }
        >
          <AlignHorizontalDistributeCenter className="w-4 h-4" />
          <span className="text-xs font-medium">Distribute H</span>
        </button>

        {/* Distribute Vertically */}
        <button
          onClick={onDistributeVertically}
          disabled={disabled || needsSelection}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
            ${
              disabled || needsSelection
                ? "opacity-50 cursor-not-allowed border-[var(--glass-border)]"
                : "border-[var(--glass-border)] hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
            }
          `}
          title={
            needsSelection
              ? "Select 2+ zones to distribute"
              : "Distribute zones vertically"
          }
        >
          <AlignVerticalDistributeCenter className="w-4 h-4" />
          <span className="text-xs font-medium">Distribute V</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[var(--glass-border)]" />

        {/* Auto Arrange */}
        <button
          onClick={onAutoArrange}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
            ${
              disabled
                ? "opacity-50 cursor-not-allowed border-[var(--glass-border)]"
                : "border-[var(--neon-violet)]/50 hover:border-[var(--neon-violet)] hover:bg-[var(--neon-violet)]/10"
            }
          `}
          title="Auto-arrange all zones in a grid layout"
        >
          <LayoutGrid className="w-4 h-4 text-[var(--neon-violet)]" />
          <span className="text-xs font-medium">Auto Arrange</span>
          <Sparkles className="w-3 h-3 text-[var(--neon-violet)]" />
        </button>
      </div>

      {/* Help Text */}
      {needsSelection && (
        <div className="mt-2 text-[10px] text-[var(--muted-foreground)] text-center">
          Select 2 or more zones to use distribute tools
        </div>
      )}
    </motion.div>
  );
}
