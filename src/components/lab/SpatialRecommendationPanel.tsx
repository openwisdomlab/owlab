// src/components/lab/SpatialRecommendationPanel.tsx
"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  Sun,
  Palette,
  Volume2,
  Layers,
  LayoutGrid,
  Armchair,
  Info,
  ChevronRight,
} from "lucide-react";
import type { EmotionToSpaceResult, SpatialElement } from "@/lib/schemas/emotion-design";
import { EMOTION_COLORS, EMOTION_LABELS, type EmotionType } from "@/lib/schemas/emotion-design";

interface SpatialRecommendationPanelProps {
  result: EmotionToSpaceResult;
  onApplyZone?: (zone: EmotionToSpaceResult["suggestedZones"][0]) => void;
}

const CATEGORY_ICONS: Record<SpatialElement["category"], React.ReactNode> = {
  height: <ArrowUp className="w-4 h-4" />,
  lighting: <Sun className="w-4 h-4" />,
  color: <Palette className="w-4 h-4" />,
  acoustics: <Volume2 className="w-4 h-4" />,
  material: <Layers className="w-4 h-4" />,
  layout: <LayoutGrid className="w-4 h-4" />,
  furniture: <Armchair className="w-4 h-4" />,
};

const CATEGORY_LABELS: Record<SpatialElement["category"], string> = {
  height: "空间高度",
  lighting: "光线设计",
  color: "色彩方案",
  acoustics: "声学环境",
  material: "材质选择",
  layout: "布局规划",
  furniture: "家具配置",
};

const PRIORITY_COLORS: Record<SpatialElement["priority"], string> = {
  high: "text-red-400 bg-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/20",
  low: "text-green-400 bg-green-500/20",
};

const PRIORITY_LABELS: Record<SpatialElement["priority"], string> = {
  high: "高优先",
  medium: "中优先",
  low: "低优先",
};

export function SpatialRecommendationPanel({
  result,
  onApplyZone,
}: SpatialRecommendationPanelProps) {
  return (
    <div className="space-y-6">
      {/* Design Narrative */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--neon-cyan)]" />
          设计叙事
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
          {result.designNarrative}
        </p>
      </div>

      {/* Spatial Elements */}
      <div>
        <h3 className="text-sm font-medium mb-3">空间要素建议</h3>
        <div className="grid gap-3">
          {result.spatialElements.map((element, index) => (
            <motion.div
              key={`${element.category}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[var(--glass-bg)]">
                    {CATEGORY_ICONS[element.category]}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">
                      {CATEGORY_LABELS[element.category]}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[element.priority]}`}
                    >
                      {PRIORITY_LABELS[element.priority]}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm mb-2">{element.recommendation}</p>
              <p className="text-xs text-[var(--muted-foreground)] italic">
                📚 {element.rationale}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Suggested Zones */}
      <div>
        <h3 className="text-sm font-medium mb-3">建议区域</h3>
        <div className="grid gap-3">
          {result.suggestedZones.map((zone, index) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{zone.name}</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {zone.purpose}
                  </p>
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {zone.suggestedSize.width}m × {zone.suggestedSize.height}m
                </div>
              </div>

              {/* Target Emotions */}
              <div className="flex flex-wrap gap-1 mb-3">
                {zone.targetEmotions.map((emotion) => (
                  <span
                    key={emotion}
                    className="px-2 py-0.5 text-xs rounded-full"
                    style={{ backgroundColor: EMOTION_COLORS[emotion as EmotionType] }}
                  >
                    {EMOTION_LABELS[emotion as EmotionType]}
                  </span>
                ))}
              </div>

              {/* Key Features */}
              <div className="space-y-1 mb-3">
                {zone.keyFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Apply Button */}
              {onApplyZone && (
                <button
                  onClick={() => onApplyZone(zone)}
                  className="w-full py-2 text-sm rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] font-medium hover:opacity-90 transition-colors"
                >
                  应用此区域
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
