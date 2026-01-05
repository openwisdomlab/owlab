"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Save, AlertCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { Template, TemplateCategory } from "@/lib/schemas/template";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

interface SaveTemplateDialogProps {
  layout: LayoutData;
  onClose: () => void;
  onSave: (template: Template) => void;
}

const CATEGORIES: TemplateCategory[] = [
  "k12",
  "university",
  "corporate",
  "maker-space",
  "research",
  "training",
  "community",
];

const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  "k12": "K-12 Education",
  university: "University",
  corporate: "Corporate",
  "maker-space": "Maker Space",
  research: "Research Lab",
  training: "Training Center",
  community: "Community",
};

export function SaveTemplateDialog({
  layout,
  onClose,
  onSave,
}: SaveTemplateDialogProps) {
  const [formData, setFormData] = useState({
    name: layout.name || "",
    description: "",
    category: "maker-space" as TemplateCategory,
    tags: "",
    estimatedCost: "",
    capacity: "",
    areaSize: "",
    difficulty: "intermediate" as "beginner" | "intermediate" | "advanced",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const tags = formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const template: Template = {
      id: uuidv4(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      tags,
      layout,
      createdAt: new Date(),
      featured: false,
      downloadCount: 0,
      metadata: {
        estimatedCost: formData.estimatedCost
          ? parseFloat(formData.estimatedCost)
          : undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        areaSize: formData.areaSize ? parseFloat(formData.areaSize) : undefined,
        difficulty: formData.difficulty,
      },
    };

    onSave(template);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Save as Template</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Template Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
              placeholder="e.g., Small STEM Lab"
            />
            {errors.name && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                {errors.name}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
              placeholder="Describe the purpose and features of this template..."
            />
            {errors.description && (
              <div className="flex items-center gap-1 mt-1 text-xs text-red-400">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </div>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as TemplateCategory,
                })
              }
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
              placeholder="stem, robotics, ai (comma-separated)"
            />
            <div className="text-xs text-[var(--muted-foreground)] mt-1">
              Separate tags with commas
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Estimated Cost */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Estimated Cost (USD)
              </label>
              <input
                type="number"
                value={formData.estimatedCost}
                onChange={(e) =>
                  setFormData({ ...formData, estimatedCost: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
                placeholder="25000"
                min="0"
              />
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Capacity (people)
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
                placeholder="30"
                min="1"
              />
            </div>

            {/* Area Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Area Size (m²)
              </label>
              <input
                type="number"
                value={formData.areaSize}
                onChange={(e) =>
                  setFormData({ ...formData, areaSize: e.target.value })
                }
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
                placeholder="150"
                min="0"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: e.target.value as
                      | "beginner"
                      | "intermediate"
                      | "advanced",
                  })
                }
                className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Layout Summary */}
          <div className="glass-card p-4 bg-[var(--glass-bg)]">
            <h3 className="text-sm font-semibold mb-2">Layout Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[var(--muted-foreground)]">Dimensions:</span>{" "}
                {layout.dimensions.width} × {layout.dimensions.height}{" "}
                {layout.dimensions.unit}
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Zones:</span>{" "}
                {layout.zones.length}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity font-semibold"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
