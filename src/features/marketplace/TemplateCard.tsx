"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Heart, GitFork, Grid3x3, Maximize } from "lucide-react";
import {
  type DesignTemplate,
  type MarketplaceCategory,
  CATEGORY_COLORS,
} from "@/stores/design-marketplace-store";

// Category gradient backgrounds for thumbnail placeholders
const CATEGORY_GRADIENTS: Record<MarketplaceCategory, string> = {
  makerspace: "from-orange-500/30 via-orange-600/20 to-amber-500/30",
  "stem-lab": "from-blue-500/30 via-blue-600/20 to-cyan-500/30",
  "art-studio": "from-purple-500/30 via-purple-600/20 to-pink-500/30",
  "science-lab": "from-green-500/30 via-green-600/20 to-emerald-500/30",
  "multi-purpose": "from-cyan-500/30 via-cyan-600/20 to-teal-500/30",
  outdoor: "from-emerald-500/30 via-emerald-600/20 to-green-500/30",
};

interface TemplateCardProps {
  template: DesignTemplate;
  onSelect: (template: DesignTemplate) => void;
  onFork: (template: DesignTemplate) => void;
  isLiked: boolean;
  onLike: (template: DesignTemplate) => void;
}

export function TemplateCard({
  template,
  onSelect,
  onFork,
  isLiked,
  onLike,
}: TemplateCardProps) {
  const t = useTranslations("marketplace");
  const categoryColor = CATEGORY_COLORS[template.category];
  const gradient = CATEGORY_GRADIENTS[template.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="glass-card overflow-hidden cursor-pointer group"
      onClick={() => onSelect(template)}
    >
      {/* Thumbnail Placeholder */}
      <div
        className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        {/* Mini layout preview */}
        <div className="absolute inset-4 opacity-60">
          <MiniLayoutPreview layoutData={template.layoutData} color={categoryColor} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30"
          >
            {t("card.preview")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onFork(template);
            }}
            className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium border border-white/30"
          >
            {t("card.fork")}
          </motion.button>
        </div>

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{
            backgroundColor: `${categoryColor}30`,
            color: categoryColor,
            border: `1px solid ${categoryColor}50`,
          }}
        >
          {t(`categories.${template.category}`)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-1 truncate">
          {template.name}
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
          {template.description}
        </p>

        {/* Author */}
        <div className="text-xs text-[var(--muted-foreground)] mb-3">
          {t("card.by")} {template.author}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike(template);
              }}
              className={`flex items-center gap-1 transition-colors ${
                isLiked
                  ? "text-red-400"
                  : "hover:text-red-400"
              }`}
            >
              <Heart
                className="w-3.5 h-3.5"
                fill={isLiked ? "currentColor" : "none"}
              />
              {template.likes}
            </button>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {template.forks}
            </span>
            <span className="flex items-center gap-1">
              <Grid3x3 className="w-3.5 h-3.5" />
              {template.zones}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Maximize className="w-3 h-3" />
            {template.size.width}x{template.size.height}m
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Mini layout preview component — renders zones as colored blocks
function MiniLayoutPreview({
  layoutData,
  color,
}: {
  layoutData: string;
  color: string;
}) {
  try {
    const layout = JSON.parse(layoutData);
    const zones = layout.zones || [];
    const dims = layout.dimensions || { width: 20, height: 15 };

    return (
      <svg
        viewBox={`0 0 ${dims.width} ${dims.height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {zones.map(
          (
            zone: {
              id: string;
              position: { x: number; y: number };
              size: { width: number; height: number };
              color?: string;
            },
            i: number
          ) => (
            <rect
              key={zone.id || i}
              x={zone.position.x}
              y={zone.position.y}
              width={zone.size.width}
              height={zone.size.height}
              fill={zone.color || color}
              opacity={0.6}
              rx={0.3}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={0.15}
            />
          )
        )}
      </svg>
    );
  } catch {
    return (
      <div
        className="w-16 h-16 rounded-lg opacity-30"
        style={{ backgroundColor: color }}
      />
    );
  }
}
