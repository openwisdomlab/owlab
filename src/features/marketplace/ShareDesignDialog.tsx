"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { X, Share2, AlertCircle } from "lucide-react";
import {
  type MarketplaceCategory,
  CATEGORY_COLORS,
  useDesignMarketplaceStore,
} from "@/stores/design-marketplace-store";

const ALL_CATEGORIES: MarketplaceCategory[] = [
  "makerspace",
  "stem-lab",
  "art-studio",
  "science-lab",
  "multi-purpose",
  "outdoor",
];

interface ShareDesignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShared?: (id: string) => void;
}

export function ShareDesignDialog({
  isOpen,
  onClose,
  onShared,
}: ShareDesignDialogProps) {
  const t = useTranslations("marketplace");
  const addTemplate = useDesignMarketplaceStore((s) => s.addTemplate);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    author: "",
    category: "makerspace" as MarketplaceCategory,
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("share.nameRequired");
    if (!formData.description.trim())
      newErrors.description = t("share.descriptionRequired");
    if (!formData.author.trim()) newErrors.author = t("share.authorRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Create a simple demo layout for shared designs
    const sampleLayout = {
      name: formData.name,
      description: formData.description,
      dimensions: { width: 15, height: 12, unit: "m" },
      zones: [
        {
          id: "z1",
          name: "Main Workspace",
          type: "workspace",
          position: { x: 0, y: 0 },
          size: { width: 10, height: 7 },
          color: CATEGORY_COLORS[formData.category],
        },
        {
          id: "z2",
          name: "Storage",
          type: "storage",
          position: { x: 11, y: 0 },
          size: { width: 4, height: 5 },
          color: "#6B7280",
        },
        {
          id: "z3",
          name: "Collaboration Area",
          type: "meeting",
          position: { x: 0, y: 8 },
          size: { width: 15, height: 4 },
          color: "#A855F7",
        },
      ],
    };

    const id = addTemplate({
      name: formData.name.trim(),
      description: formData.description.trim(),
      author: formData.author.trim(),
      thumbnail: "",
      category: formData.category,
      tags,
      zones: sampleLayout.zones.length,
      size: {
        width: sampleLayout.dimensions.width,
        height: sampleLayout.dimensions.height,
      },
      layoutData: JSON.stringify(sampleLayout),
    });

    onShared?.(id);
    setFormData({
      name: "",
      description: "",
      author: "",
      category: "makerspace",
      tags: "",
    });
    setErrors({});
    onClose();
  };

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
            className="glass-card p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[var(--neon-cyan)]" />
                {t("share.title")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("share.name")}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                  placeholder={t("share.namePlaceholder")}
                />
                {errors.name && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("share.description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors resize-none"
                  placeholder={t("share.descriptionPlaceholder")}
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("share.author")}
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                  placeholder={t("share.authorPlaceholder")}
                />
                {errors.author && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.author}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("share.category")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CATEGORIES.map((cat) => {
                    const isActive = formData.category === cat;
                    const color = CATEGORY_COLORS[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, category: cat }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                          isActive
                            ? "border-current"
                            : "border-[var(--glass-border)] hover:border-[var(--muted-foreground)]"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: `${color}20`,
                                borderColor: color,
                                color,
                              }
                            : undefined
                        }
                      >
                        {t(`categories.${cat}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t("share.tags")}
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors"
                  placeholder={t("share.tagsPlaceholder")}
                />
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {t("share.tagsHint")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors text-sm"
              >
                {t("share.cancel")}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-purple)] text-white font-medium text-sm"
              >
                {t("share.submit")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
