"use client";

import { motion } from "framer-motion";
import {
  X,
  Download,
  DollarSign,
  Users,
  Maximize,
  Package,
  Star,
  Calendar,
} from "lucide-react";
import type { Template } from "@/lib/schemas/template";
import { formatCurrency, calculateBudgetSummary } from "@/lib/utils/budget";

interface TemplatePreviewDialogProps {
  template: Template;
  onClose: () => void;
  onUseTemplate: () => void;
}

export function TemplatePreviewDialog({
  template,
  onClose,
  onUseTemplate,
}: TemplatePreviewDialogProps) {
  const budget = calculateBudgetSummary(template.layout);

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
        className="glass-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{template.name}</h2>
              {template.featured && (
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              )}
            </div>
            <p className="text-[var(--muted-foreground)]">{template.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {budget.totalCost > 0 && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Estimated Cost</span>
              </div>
              <div className="text-lg font-semibold text-[var(--neon-cyan)]">
                {formatCurrency(budget.totalCost, budget.currency)}
              </div>
            </div>
          )}

          {template.metadata?.capacity && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs">Capacity</span>
              </div>
              <div className="text-lg font-semibold">
                {template.metadata.capacity} people
              </div>
            </div>
          )}

          {template.metadata?.areaSize && (
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                <Maximize className="w-4 h-4" />
                <span className="text-xs">Area</span>
              </div>
              <div className="text-lg font-semibold">
                {template.metadata.areaSize}m²
              </div>
            </div>
          )}

          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs">Zones</span>
            </div>
            <div className="text-lg font-semibold">{template.layout.zones.length}</div>
          </div>
        </div>

        {/* Layout Details */}
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">Layout Overview</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[var(--muted-foreground)]">Dimensions:</span>{" "}
                {template.layout.dimensions.width} × {template.layout.dimensions.height}{" "}
                {template.layout.dimensions.unit}
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Equipment Items:</span>{" "}
                {budget.itemCount}
              </div>
            </div>
          </div>

          {/* Zones */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Zones ({template.layout.zones.length})</h3>
            <div className="space-y-2">
              {template.layout.zones.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg)]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">{zone.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)] capitalize">
                        {zone.type} • {zone.size.width} × {zone.size.height}
                      </div>
                    </div>
                  </div>
                  {Array.isArray(zone.equipment) && zone.equipment.length > 0 && (
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {zone.equipment.length} items
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          {template.metadata && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Additional Information</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {template.metadata.difficulty && (
                  <div>
                    <span className="text-[var(--muted-foreground)]">Difficulty:</span>{" "}
                    <span className="capitalize">{template.metadata.difficulty}</span>
                  </div>
                )}
                <div>
                  <span className="text-[var(--muted-foreground)]">Category:</span>{" "}
                  <span className="capitalize">{template.category.replace("-", " ")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {template.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
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

          {/* Author Info */}
          {(template.author || template.organization) && (
            <div className="text-sm text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Created by {template.author || "Unknown"}
                  {template.organization && ` • ${template.organization}`}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Download className="w-4 h-4" />
                <span>{template.downloadCount} downloads</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              onUseTemplate();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity font-semibold"
          >
            <Download className="w-5 h-5" />
            Use This Template
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
