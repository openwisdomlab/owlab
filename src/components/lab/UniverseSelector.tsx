// src/components/lab/UniverseSelector.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Plus,
  GitBranch,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";
import { useMultiverseStore } from "@/stores/multiverse-store";

interface UniverseSelectorProps {
  onBranchRequest?: () => void;
}

export function UniverseSelector({ onBranchRequest }: UniverseSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    universes,
    activeUniverseId,
    setActiveUniverse,
    deleteUniverse,
    getActiveUniverse,
  } = useMultiverseStore();

  const activeUniverse = getActiveUniverse();

  if (universes.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
      >
        <Globe className="w-4 h-4 text-[var(--neon-purple)]" />
        <span className="text-sm font-medium">
          {activeUniverse?.name || "选择宇宙"}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-2 w-64 glass-card p-2 z-50"
          >
            <div className="space-y-1">
              {universes.map((universe) => (
                <div
                  key={universe.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    universe.id === activeUniverseId
                      ? "bg-[var(--neon-purple)]/20 border border-[var(--neon-purple)]"
                      : "hover:bg-[var(--glass-bg)]"
                  }`}
                  onClick={() => {
                    setActiveUniverse(universe.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {universe.id === activeUniverseId && (
                      <Check className="w-4 h-4 text-[var(--neon-purple)]" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{universe.name}</div>
                      {universe.parentId && (
                        <div className="text-xs text-[var(--muted-foreground)]">
                          <GitBranch className="w-3 h-3 inline mr-1" />
                          分支自父宇宙
                        </div>
                      )}
                    </div>
                  </div>

                  {universes.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteUniverse(universe.id);
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--glass-border)] mt-2 pt-2">
              <button
                onClick={() => {
                  onBranchRequest?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors text-[var(--neon-cyan)]"
              >
                <GitBranch className="w-4 h-4" />
                <span className="text-sm">创建分支宇宙</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
