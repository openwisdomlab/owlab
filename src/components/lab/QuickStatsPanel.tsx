"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  BarChart3,
  Grid3x3,
  Target,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Box,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import { formatCurrency } from "@/lib/utils/budget";

interface QuickStatsPanelProps {
  layout: LayoutData;
  onClose: () => void;
}

// Calculate safety warnings (same logic as FloorPlanCanvas)
function countSafetyWarnings(layout: LayoutData): number {
  const zones = layout.zones;
  let warningCount = 0;
  const MIN_PATHWAY_WIDTH = 1.2;

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const z1 = zones[i];
      const z2 = zones[j];

      // Check for overlapping zones
      const overlapX = !(
        z1.position.x + z1.size.width <= z2.position.x ||
        z2.position.x + z2.size.width <= z1.position.x
      );
      const overlapY = !(
        z1.position.y + z1.size.height <= z2.position.y ||
        z2.position.y + z2.size.height <= z1.position.y
      );

      if (overlapX && overlapY) {
        warningCount++;
        continue;
      }

      // Check pathway width
      const gapX = Math.max(
        0,
        Math.max(z1.position.x, z2.position.x) -
          Math.min(z1.position.x + z1.size.width, z2.position.x + z2.size.width)
      );
      const gapY = Math.max(
        0,
        Math.max(z1.position.y, z2.position.y) -
          Math.min(z1.position.y + z1.size.height, z2.position.y + z2.size.height)
      );

      const minGap = Math.min(gapX, gapY);
      const isAdjacent = minGap === 0 && Math.max(gapX, gapY) < MIN_PATHWAY_WIDTH;

      if (isAdjacent && Math.max(gapX, gapY) > 0) {
        warningCount++;
      }
    }
  }

  return warningCount;
}

export function QuickStatsPanel({ layout, onClose }: QuickStatsPanelProps) {
  const stats = useMemo(() => {
    const totalArea = layout.dimensions.width * layout.dimensions.height;
    const usedArea = layout.zones.reduce(
      (sum, zone) => sum + zone.size.width * zone.size.height,
      0
    );
    const efficiency = totalArea > 0 ? (usedArea / totalArea) * 100 : 0;

    // Calculate total equipment and budget
    let totalEquipment = 0;
    let totalBudget = 0;

    layout.zones.forEach((zone) => {
      if (zone.equipment && Array.isArray(zone.equipment)) {
        zone.equipment.forEach((equip: unknown) => {
          if (typeof equip === "object" && equip !== null) {
            const equipObj = equip as { quantity?: number; price?: number };
            totalEquipment += equipObj.quantity || 1;
            totalBudget += (equipObj.price || 0) * (equipObj.quantity || 1);
          }
        });
      }
    });

    const warningCount = countSafetyWarnings(layout);

    // Categorize zones by type
    const zonesByType = layout.zones.reduce((acc, zone) => {
      acc[zone.type] = (acc[zone.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalArea,
      usedArea,
      efficiency,
      zoneCount: layout.zones.length,
      zonesByType,
      totalEquipment,
      totalBudget,
      warningCount,
    };
  }, [layout]);

  // Determine efficiency status
  const getEfficiencyStatus = () => {
    if (stats.efficiency < 40) return { color: "text-red-400", label: "Low" };
    if (stats.efficiency < 60) return { color: "text-yellow-400", label: "Moderate" };
    if (stats.efficiency < 80) return { color: "text-green-400", label: "Good" };
    return { color: "text-[var(--neon-cyan)]", label: "Excellent" };
  };

  const efficiencyStatus = getEfficiencyStatus();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      className="absolute top-20 right-4 z-30 w-72 glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--neon-cyan)]" />
          <h3 className="text-sm font-semibold">Quick Stats</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close quick stats"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="p-3 space-y-3">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-2">
          {/* Zone Count */}
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs mb-1">
              <Grid3x3 className="w-3 h-3" />
              <span>Zones</span>
            </div>
            <div className="text-lg font-bold text-[var(--neon-cyan)]">
              {stats.zoneCount}
            </div>
          </div>

          {/* Efficiency */}
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs mb-1">
              <Target className="w-3 h-3" />
              <span>Efficiency</span>
            </div>
            <div className={`text-lg font-bold ${efficiencyStatus.color}`}>
              {stats.efficiency.toFixed(0)}%
            </div>
          </div>

          {/* Used Area */}
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs mb-1">
              <Box className="w-3 h-3" />
              <span>Used Area</span>
            </div>
            <div className="text-lg font-bold">
              {stats.usedArea}
              <span className="text-xs text-[var(--muted-foreground)] ml-1">
                / {stats.totalArea} {layout.dimensions.unit}²
              </span>
            </div>
          </div>

          {/* Safety Warnings */}
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs mb-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Warnings</span>
            </div>
            <div
              className={`text-lg font-bold ${
                stats.warningCount > 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {stats.warningCount}
            </div>
          </div>
        </div>

        {/* Budget */}
        {stats.totalBudget > 0 && (
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs">
                <DollarSign className="w-3 h-3" />
                <span>Estimated Budget</span>
              </div>
              <div className="text-sm font-semibold text-[var(--neon-cyan)]">
                {formatCurrency(stats.totalBudget)}
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">
              {stats.totalEquipment} equipment items
            </div>
          </div>
        )}

        {/* Zone Types Distribution */}
        {Object.keys(stats.zonesByType).length > 0 && (
          <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
            <div className="flex items-center gap-1.5 text-[var(--muted-foreground)] text-xs mb-2">
              <TrendingUp className="w-3 h-3" />
              <span>Zone Distribution</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stats.zonesByType).map(([type, count]) => (
                <span
                  key={type}
                  className="px-2 py-0.5 text-xs rounded-full bg-[var(--background)] text-[var(--muted-foreground)] capitalize"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Efficiency Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--muted-foreground)]">Space Usage</span>
            <span className={efficiencyStatus.color}>{efficiencyStatus.label}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--background)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.efficiency, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                stats.efficiency < 40
                  ? "bg-red-400"
                  : stats.efficiency < 60
                  ? "bg-yellow-400"
                  : stats.efficiency < 80
                  ? "bg-green-400"
                  : "bg-[var(--neon-cyan)]"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-3 py-2 border-t border-[var(--glass-border)] text-center">
        <span className="text-[10px] text-[var(--muted-foreground)]">
          Press <kbd className="px-1 py-0.5 rounded bg-[var(--background)] text-[10px]">Q</kbd> to toggle
        </span>
      </div>
    </motion.div>
  );
}
