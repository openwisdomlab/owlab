"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import type { Layer } from "@/lib/utils/layers";
import { LayerItem } from "./LayerItem";

interface LayerPanelProps {
  layers: Layer[];
  activeLayerId: string | null;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onChangeOpacity: (layerId: string, opacity: number) => void;
  onReorder: (sourceIndex: number, destinationIndex: number) => void;
  onSelectLayer: (layerId: string | null) => void;
  onAddLayer?: () => void;
  onRemoveLayer?: (layerId: string) => void;
  onRenameLayer?: (layerId: string, newName: string) => void;
  onDuplicateLayer?: (layerId: string) => void;
  onShowAll?: () => void;
  onHideAll?: () => void;
  onLockAll?: () => void;
  onUnlockAll?: () => void;
  onResetLayers?: () => void;
  onClose: () => void;
}

export function LayerPanel({
  layers,
  activeLayerId,
  onToggleVisibility,
  onToggleLock,
  onChangeOpacity,
  onReorder,
  onSelectLayer,
  onAddLayer,
  onRemoveLayer,
  onRenameLayer,
  onDuplicateLayer,
  onShowAll,
  onHideAll,
  onLockAll,
  onUnlockAll,
  onResetLayers,
  onClose,
}: LayerPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const visibleCount = layers.filter((l) => l.visible).length;
  const lockedCount = layers.filter((l) => l.locked).length;

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div>
          <h2 className="font-semibold">Layers</h2>
          <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">
            {visibleCount}/{layers.length} visible • {lockedCount} locked
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close layer panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-[var(--glass-border)]">
        <button
          onClick={() => setShowActions(!showActions)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg glass-card hover:bg-[var(--glass-bg)]/50 transition-colors"
        >
          <span className="text-sm font-medium">Quick Actions</span>
          {showActions ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                {onShowAll && (
                  <button
                    onClick={onShowAll}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Show All
                  </button>
                )}
                {onHideAll && (
                  <button
                    onClick={onHideAll}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                  >
                    <EyeOff className="w-3 h-3" />
                    Hide All
                  </button>
                )}
                {onLockAll && (
                  <button
                    onClick={onLockAll}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                  >
                    <Lock className="w-3 h-3" />
                    Lock All
                  </button>
                )}
                {onUnlockAll && (
                  <button
                    onClick={onUnlockAll}
                    className="flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                  >
                    <Unlock className="w-3 h-3" />
                    Unlock All
                  </button>
                )}
                {onResetLayers && (
                  <button
                    onClick={onResetLayers}
                    className="col-span-2 flex items-center justify-center gap-1 px-2 py-1.5 text-xs rounded-lg border border-[var(--glass-border)] hover:border-red-500 hover:text-red-500 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to Default
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {layers.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <p className="text-sm">No layers yet</p>
            {onAddLayer && (
              <button
                onClick={onAddLayer}
                className="mt-3 text-xs text-[var(--neon-cyan)] hover:underline"
              >
                Create your first layer
              </button>
            )}
          </div>
        ) : (
          layers.map((layer, index) => (
            <div
              key={layer.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                ${draggedIndex === index ? "opacity-50" : ""}
                transition-opacity
              `}
            >
              <LayerItem
                layer={layer}
                isActive={activeLayerId === layer.id}
                onToggleVisibility={() => onToggleVisibility(layer.id)}
                onToggleLock={() => onToggleLock(layer.id)}
                onChangeOpacity={(opacity) => onChangeOpacity(layer.id, opacity)}
                onSelect={() =>
                  onSelectLayer(activeLayerId === layer.id ? null : layer.id)
                }
                onRemove={onRemoveLayer ? () => onRemoveLayer(layer.id) : undefined}
                onRename={
                  onRenameLayer
                    ? (newName) => onRenameLayer(layer.id, newName)
                    : undefined
                }
                onDuplicate={
                  onDuplicateLayer ? () => onDuplicateLayer(layer.id) : undefined
                }
              />
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      {onAddLayer && (
        <div className="p-3 border-t border-[var(--glass-border)]">
          <button
            onClick={onAddLayer}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Add Layer
          </button>
        </div>
      )}
    </div>
  );
}
