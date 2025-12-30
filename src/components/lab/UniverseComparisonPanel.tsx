// src/components/lab/UniverseComparisonPanel.tsx
"use client";

import { motion } from "framer-motion";
import {
  X,
  GitMerge,
  TrendingUp,
  DollarSign,
  Shield,
  BarChart3,
} from "lucide-react";
import { useMultiverseStore } from "@/stores/multiverse-store";
import { useParallelUniverses } from "@/hooks/useParallelUniverses";
import { formatCurrency } from "@/lib/utils/budget";

interface UniverseComparisonPanelProps {
  onClose: () => void;
}

export function UniverseComparisonPanel({ onClose }: UniverseComparisonPanelProps) {
  const { universes, comparisonIds, addToComparison, removeFromComparison, getUniverse } =
    useMultiverseStore();
  const { isFusing, fuseSelected, error } = useParallelUniverses();

  const comparedUniverses = comparisonIds
    .map((id) => getUniverse(id))
    .filter(Boolean);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-[500px] h-full border-l border-[var(--glass-border)] bg-[var(--background)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[var(--neon-purple)]" />
          <h2 className="font-semibold">宇宙对比</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="关闭对比面板"
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Universe Selection */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <h3 className="text-sm font-medium mb-2">选择要对比的宇宙（最多3个）</h3>
        <div className="flex flex-wrap gap-2" role="group" aria-label="宇宙选择">
          {universes.map((universe) => (
            <button
              key={universe.id}
              onClick={() =>
                comparisonIds.includes(universe.id)
                  ? removeFromComparison(universe.id)
                  : addToComparison(universe.id)
              }
              aria-pressed={comparisonIds.includes(universe.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                comparisonIds.includes(universe.id)
                  ? "bg-[var(--neon-purple)] text-white"
                  : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
              }`}
            >
              {universe.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-auto p-4">
        {comparedUniverses.length === 0 ? (
          <div className="text-center text-[var(--muted-foreground)] py-8">
            选择至少2个宇宙进行对比
          </div>
        ) : (
          <div className="space-y-4">
            {/* Metrics Comparison */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${comparedUniverses.length}, 1fr)` }}>
              {comparedUniverses.map((universe) => (
                <div key={universe!.id} className="glass-card p-4">
                  <h4 className="font-medium text-sm mb-3">{universe!.name}</h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <TrendingUp className="w-3 h-3" />
                        效率
                      </span>
                      <span className="font-medium">
                        {((universe!.metrics?.efficiency || 0) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <DollarSign className="w-3 h-3" />
                        成本
                      </span>
                      <span className="font-medium">
                        {formatCurrency(universe!.metrics?.estimatedCost || 0, "CNY")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                        <Shield className="w-3 h-3" />
                        安全
                      </span>
                      <span className="font-medium">
                        {universe!.metrics?.safetyScore || 0}/100
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {universe!.layout.zones.length} 个区域 ·
                      {universe!.metrics?.usedArea?.toFixed(0) || 0} m²
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fusion Actions */}
      {comparedUniverses.length >= 2 && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <GitMerge className="w-4 h-4" />
            融合宇宙
          </h3>

          {error && (
            <div className="text-red-400 text-sm mb-2" role="alert">{error}</div>
          )}

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fuseSelected("best-of-each")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50"
            >
              取长补短
            </button>
            <button
              onClick={() => fuseSelected("compromise")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50"
            >
              折中平衡
            </button>
            <button
              onClick={() => fuseSelected("innovative")}
              disabled={isFusing}
              className="px-3 py-2 text-xs rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-90 transition-colors disabled:opacity-50"
            >
              创新融合
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
