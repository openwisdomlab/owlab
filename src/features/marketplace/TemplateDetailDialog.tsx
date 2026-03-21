"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  X,
  Heart,
  GitFork,
  Grid3x3,
  Maximize,
  Tag,
  User,
  Calendar,
  Download,
} from "lucide-react";
import {
  type DesignTemplate,
  CATEGORY_COLORS,
} from "@/stores/design-marketplace-store";

interface TemplateDetailDialogProps {
  template: DesignTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onFork: (template: DesignTemplate) => void;
  isLiked: boolean;
  onLike: (template: DesignTemplate) => void;
}

export function TemplateDetailDialog({
  template,
  isOpen,
  onClose,
  onFork,
  isLiked,
  onLike,
}: TemplateDetailDialogProps) {
  const t = useTranslations("marketplace");

  if (!template) return null;

  const categoryColor = CATEGORY_COLORS[template.category];
  let zones: Array<{ id: string; name: string; type: string; equipment?: string[] }> = [];
  try {
    const layout = JSON.parse(template.layoutData);
    zones = layout.zones || [];
  } catch {
    // ignore parse errors
  }

  const formattedDate = new Date(template.createdAt).toLocaleDateString();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{template.name}</h2>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${categoryColor}20`,
                      color: categoryColor,
                    }}
                  >
                    {t(`categories.${template.category}`)}
                  </span>
                </div>
                <p className="text-[var(--muted-foreground)]">
                  {template.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Layout Preview */}
            <div className="mb-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] p-4">
              <LayoutPreview layoutData={template.layoutData} />
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
                  <User className="w-3.5 h-3.5" />
                  {t("detail.author")}
                </div>
                <div className="font-medium">{template.author}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
                  <Maximize className="w-3.5 h-3.5" />
                  {t("detail.size")}
                </div>
                <div className="font-medium">
                  {template.size.width} x {template.size.height}m
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
                  <Grid3x3 className="w-3.5 h-3.5" />
                  {t("detail.zones")}
                </div>
                <div className="font-medium">{template.zones}</div>
              </div>
              <div className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {t("detail.created")}
                </div>
                <div className="font-medium">{formattedDate}</div>
              </div>
            </div>

            {/* Zones */}
            {zones.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Grid3x3 className="w-4 h-4 text-[var(--neon-cyan)]" />
                  {t("detail.zoneList")}
                </h3>
                <div className="grid gap-2">
                  {zones.map((zone, i) => (
                    <div
                      key={zone.id || i}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                    >
                      <div>
                        <span className="font-medium">{zone.name}</span>
                        <span className="ml-2 text-xs text-[var(--muted-foreground)] px-2 py-0.5 rounded-full bg-[var(--glass-bg)]">
                          {zone.type}
                        </span>
                      </div>
                      {zone.equipment && zone.equipment.length > 0 && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {zone.equipment.length} {t("detail.items")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {template.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[var(--neon-violet)]" />
                  {t("detail.tags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats + Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5">
                  <Heart
                    className="w-4 h-4"
                    fill={isLiked ? "currentColor" : "none"}
                    style={isLiked ? { color: "#EF4444" } : undefined}
                  />
                  {template.likes} {t("detail.likesLabel")}
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="w-4 h-4" />
                  {template.forks} {t("detail.forksLabel")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onLike(template)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                    isLiked
                      ? "border-red-400/50 bg-red-400/10 text-red-400"
                      : "border-[var(--glass-border)] hover:border-red-400/50 hover:text-red-400"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  {isLiked ? t("detail.liked") : t("detail.like")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFork(template)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/50 hover:border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-medium transition-all"
                >
                  <Download className="w-4 h-4" />
                  {t("detail.forkToDesigns")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Larger layout preview for detail dialog
function LayoutPreview({ layoutData }: { layoutData: string }) {
  try {
    const layout = JSON.parse(layoutData);
    const zones = layout.zones || [];
    const dims = layout.dimensions || { width: 20, height: 15 };

    return (
      <svg
        viewBox={`-0.5 -0.5 ${dims.width + 1} ${dims.height + 1}`}
        className="w-full h-auto"
        style={{ maxHeight: "300px" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid background */}
        <defs>
          <pattern
            id="detail-grid"
            width="1"
            height="1"
            patternUnits="userSpaceOnUse"
          >
            <rect width="1" height="1" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.02" />
          </pattern>
        </defs>
        <rect x="-0.5" y="-0.5" width={dims.width + 1} height={dims.height + 1} fill="url(#detail-grid)" />

        {/* Zones */}
        {zones.map(
          (
            zone: {
              id: string;
              name: string;
              position: { x: number; y: number };
              size: { width: number; height: number };
              color?: string;
            },
            i: number
          ) => (
            <g key={zone.id || i}>
              <rect
                x={zone.position.x}
                y={zone.position.y}
                width={zone.size.width}
                height={zone.size.height}
                fill={zone.color || "#3B82F6"}
                opacity={0.4}
                rx={0.2}
                stroke={zone.color || "#3B82F6"}
                strokeWidth={0.1}
                strokeOpacity={0.8}
              />
              <text
                x={zone.position.x + zone.size.width / 2}
                y={zone.position.y + zone.size.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize={Math.min(zone.size.width, zone.size.height) * 0.2}
                opacity={0.8}
              >
                {zone.name.length > 12 ? zone.name.slice(0, 12) + "..." : zone.name}
              </text>
            </g>
          )
        )}

        {/* Dimension labels */}
        <text x={dims.width / 2} y={dims.height + 0.7} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="0.5">
          {dims.width}m
        </text>
        <text x={-0.3} y={dims.height / 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="0.5" transform={`rotate(-90, -0.3, ${dims.height / 2})`}>
          {dims.height}m
        </text>
      </svg>
    );
  } catch {
    return (
      <div className="h-48 flex items-center justify-center text-[var(--muted-foreground)]">
        Preview unavailable
      </div>
    );
  }
}
