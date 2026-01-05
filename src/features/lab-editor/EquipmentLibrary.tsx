"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Plus,
  Package,
  DollarSign,
  Tag,
  Star,
} from "lucide-react";
import type {
  EquipmentItem,
  EquipmentCategory,
  EquipmentFilter,
} from "@/lib/schemas/equipment";
import { formatCurrency } from "@/lib/utils/budget";
import { getAllEquipment } from "@/data";

interface EquipmentLibraryProps {
  onAddEquipment: (equipment: EquipmentItem) => void;
  onClose: () => void;
}

const CATEGORIES: EquipmentCategory[] = [
  "compute",
  "furniture",
  "tools",
  "safety",
  "utilities",
  "electronics",
  "software",
];

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  compute: "Computing",
  furniture: "Furniture",
  tools: "Tools & Machinery",
  safety: "Safety Equipment",
  utilities: "Utilities & Infrastructure",
  electronics: "Electronics",
  software: "Software Licenses",
};

export function EquipmentLibrary({
  onAddEquipment,
  onClose,
}: EquipmentLibraryProps) {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EquipmentFilter>({
    sortBy: "name",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);

  useEffect(() => {
    // Load equipment catalog from typed data layer
    setEquipment(getAllEquipment());
    setLoading(false);
  }, []);

  const filteredEquipment = useMemo(() => {
    let result = [...equipment];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filter.category) {
      result = result.filter((item) => item.category === filter.category);
    }

    // Price range filter
    if (filter.priceMin !== undefined) {
      result = result.filter((item) => item.price >= filter.priceMin!);
    }
    if (filter.priceMax !== undefined) {
      result = result.filter((item) => item.price <= filter.priceMax!);
    }

    // Featured filter
    if (filter.featured) {
      result = result.filter((item) => item.featured);
    }

    // Sort
    switch (filter.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [equipment, searchQuery, filter]);

  const handleAddEquipment = (item: EquipmentItem) => {
    onAddEquipment(item);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-[var(--muted-foreground)]">Loading equipment...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-semibold">Equipment Library</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close equipment library"
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
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${showFilters
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
                sortBy: e.target.value as EquipmentFilter["sortBy"],
              })
            }
            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="category">Category</option>
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
                    className={`px-3 py-1 text-xs rounded-lg transition-colors ${!filter.category
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
                      className={`px-3 py-1 text-xs rounded-lg transition-colors ${filter.category === cat
                          ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                          : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
                        }`}
                    >
                      {CATEGORY_LABELS[cat]}
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
                  Featured items only
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Equipment Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs text-[var(--muted-foreground)] mb-3">
          {filteredEquipment.length} items
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredEquipment.map((item) => (
            <EquipmentCard
              key={item.id}
              item={item}
              onSelect={() => setSelectedItem(item)}
              onAdd={() => handleAddEquipment(item)}
            />
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            No equipment found
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <EquipmentDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAdd={() => handleAddEquipment(selectedItem)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface EquipmentCardProps {
  item: EquipmentItem;
  onSelect: () => void;
  onAdd: () => void;
}

function EquipmentCard({ item, onSelect, onAdd }: EquipmentCardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={onSelect}
      className="cursor-grab active:cursor-grabbing"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-3 hover:border-[var(--neon-cyan)] transition-colors"
      >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-medium text-sm truncate">{item.name}</h3>
            {item.featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            )}
          </div>

          {item.description && (
            <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 mb-2">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs">
            <span className="px-2 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--muted-foreground)]">
              {CATEGORY_LABELS[item.category]}
            </span>
            <span className="font-semibold text-[var(--neon-cyan)]">
              {formatCurrency(item.price, item.currency)}
            </span>
          </div>

          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          className="p-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity flex-shrink-0"
          aria-label="Add equipment"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      </motion.div>
    </div>
  );
}

interface EquipmentDetailModalProps {
  item: EquipmentItem;
  onClose: () => void;
  onAdd: () => void;
}

function EquipmentDetailModal({
  item,
  onClose,
  onAdd,
}: EquipmentDetailModalProps) {
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
        className="glass-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-2">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            {item.featured && (
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {item.description && (
          <p className="text-[var(--muted-foreground)] mb-4">{item.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-[var(--muted-foreground)] mb-1">
              Price
            </div>
            <div className="text-xl font-bold text-[var(--neon-cyan)]">
              {formatCurrency(item.price, item.currency)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--muted-foreground)] mb-1">
              Category
            </div>
            <div className="text-sm">{CATEGORY_LABELS[item.category]}</div>
          </div>
          {item.vendor && (
            <div>
              <div className="text-xs text-[var(--muted-foreground)] mb-1">
                Vendor
              </div>
              <div className="text-sm">{item.vendor}</div>
            </div>
          )}
        </div>

        {item.specs && Object.keys(item.specs).length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.specs).map(([key, value]) => (
                <div key={key} className="text-sm">
                  <span className="text-[var(--muted-foreground)]">{key}:</span>{" "}
                  {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {item.tags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-lg bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              onAdd();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add to Zone
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
