"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Download,
  Users,
  DollarSign,
  Maximize,
  Star,
  Grid3x3,
} from "lucide-react";
import type { Template, TemplateCategory, TemplateFilter } from "@/lib/schemas/template";
import { formatCurrency } from "@/lib/utils/budget";

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void;
  onClose: () => void;
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

export function TemplateGallery({
  onSelectTemplate,
  onClose,
}: TemplateGalleryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TemplateFilter>({ sortBy: "recent" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load templates
    fetch("/data/templates.json")
      .then((res) => res.json())
      .then((data) => {
        setTemplates(data.templates);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load templates:", error);
        setLoading(false);
      });
  }, []);

  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filter.category) {
      result = result.filter((template) => template.category === filter.category);
    }

    // Featured filter
    if (filter.featured) {
      result = result.filter((template) => template.featured);
    }

    // Cost range filter
    if (filter.costMin !== undefined) {
      result = result.filter(
        (template) =>
          template.metadata?.estimatedCost !== undefined &&
          template.metadata.estimatedCost >= filter.costMin!
      );
    }
    if (filter.costMax !== undefined) {
      result = result.filter(
        (template) =>
          template.metadata?.estimatedCost !== undefined &&
          template.metadata.estimatedCost <= filter.costMax!
      );
    }

    // Capacity range filter
    if (filter.capacityMin !== undefined) {
      result = result.filter(
        (template) =>
          template.metadata?.capacity !== undefined &&
          template.metadata.capacity >= filter.capacityMin!
      );
    }
    if (filter.capacityMax !== undefined) {
      result = result.filter(
        (template) =>
          template.metadata?.capacity !== undefined &&
          template.metadata.capacity <= filter.capacityMax!
      );
    }

    // Difficulty filter
    if (filter.difficulty) {
      result = result.filter(
        (template) => template.metadata?.difficulty === filter.difficulty
      );
    }

    // Sort
    switch (filter.sortBy) {
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popular":
        result.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "cost":
        result.sort(
          (a, b) =>
            (a.metadata?.estimatedCost || 0) - (b.metadata?.estimatedCost || 0)
        );
        break;
      case "capacity":
        result.sort(
          (a, b) => (a.metadata?.capacity || 0) - (b.metadata?.capacity || 0)
        );
        break;
    }

    return result;
  }, [templates, searchQuery, filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--muted-foreground)]">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-semibold">Template Gallery</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close template gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 space-y-3 border-b border-[var(--glass-border)]">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
          />
        </div>

        {/* Filter Toggle and Sort */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              showFilters
                ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <select
            value={filter.sortBy}
            onChange={(e) =>
              setFilter({
                ...filter,
                sortBy: e.target.value as TemplateFilter["sortBy"],
              })
            }
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
          >
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="name">Name</option>
            <option value="cost">Cost</option>
            <option value="capacity">Capacity</option>
          </select>
        </div>

        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              {/* Category Filter */}
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilter({ ...filter, category: undefined })}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      !filter.category
                        ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                        : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                    }`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter({ ...filter, category: cat })}
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                        filter.category === cat
                          ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                          : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                      }`}
                    >
                      {CATEGORY_LABELS[cat]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter({ ...filter, difficulty: undefined })}
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                      !filter.difficulty
                        ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                        : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                    }`}
                  >
                    All
                  </button>
                  {["beginner", "intermediate", "advanced"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() =>
                        setFilter({
                          ...filter,
                          difficulty: diff as "beginner" | "intermediate" | "advanced",
                        })
                      }
                      className={`px-3 py-1 text-xs rounded-lg transition-colors capitalize ${
                        filter.difficulty === diff
                          ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                          : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Only */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-only"
                  checked={filter.featured || false}
                  onChange={(e) =>
                    setFilter({ ...filter, featured: e.target.checked || undefined })
                  }
                  className="w-4 h-4 rounded border-[var(--glass-border)] text-[var(--neon-cyan)] focus:ring-[var(--neon-cyan)]"
                />
                <label
                  htmlFor="featured-only"
                  className="text-sm text-[var(--muted-foreground)]"
                >
                  Featured templates only
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-[var(--muted-foreground)] mb-3">
          {filteredTemplates.length} templates
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            No templates found
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: Template;
  onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 cursor-pointer hover:border-[var(--neon-cyan)] transition-colors"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="font-semibold text-base">{template.name}</h3>
            {template.featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            )}
          </div>

          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
            {template.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
            <span className="px-2 py-1 rounded bg-[var(--glass-bg)] text-[var(--muted-foreground)] capitalize">
              {CATEGORY_LABELS[template.category]}
            </span>

            {template.metadata?.estimatedCost && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>{formatCurrency(template.metadata.estimatedCost)}</span>
              </div>
            )}

            {template.metadata?.capacity && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{template.metadata.capacity} people</span>
              </div>
            )}

            {template.metadata?.areaSize && (
              <div className="flex items-center gap-1">
                <Maximize className="w-3 h-3" />
                <span>{template.metadata.areaSize}m²</span>
              </div>
            )}

            {template.metadata?.difficulty && (
              <span className="px-2 py-1 rounded bg-[var(--glass-bg)] text-[var(--muted-foreground)] capitalize">
                {template.metadata.difficulty}
              </span>
            )}
          </div>

          {/* Tags */}
          {template.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {template.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Author */}
          {template.author && (
            <div className="text-xs text-[var(--muted-foreground)] mt-3">
              by {template.author}
              {template.organization && ` • ${template.organization}`}
            </div>
          )}
        </div>

        {/* Download Count */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Download className="w-3 h-3" />
            <span>{template.downloadCount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
