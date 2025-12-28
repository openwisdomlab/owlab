"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Layer } from "@/lib/utils/layers";

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onChangeOpacity: (opacity: number) => void;
  onSelect: () => void;
  onRemove?: () => void;
  onRename?: (newName: string) => void;
  onDuplicate?: () => void;
}

export function LayerItem({
  layer,
  isActive,
  onToggleVisibility,
  onToggleLock,
  onChangeOpacity,
  onSelect,
  onRemove,
  onRename,
  onDuplicate,
}: LayerItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editName.trim() && editName !== layer.name && onRename) {
      onRename(editName.trim());
    }
    setIsEditing(false);
    setEditName(layer.name);
  };

  const handleCancelRename = () => {
    setIsEditing(false);
    setEditName(layer.name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className={`
        relative glass-card rounded-lg transition-all
        ${
          isActive
            ? "ring-2 ring-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
            : "hover:bg-[var(--glass-bg)]/50"
        }
      `}
    >
      <div className="p-3">
        {/* Main Layer Info */}
        <div className="flex items-center gap-2">
          {/* Layer Color Indicator */}
          {layer.color && (
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: layer.color }}
            />
          )}

          {/* Layer Name */}
          <div className="flex-1 min-w-0" onClick={onSelect}>
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename();
                    if (e.key === "Escape") handleCancelRename();
                  }}
                  onBlur={handleRename}
                  className="flex-1 px-2 py-1 text-sm bg-[var(--background)] border border-[var(--neon-cyan)] rounded focus:outline-none"
                />
                <button
                  onClick={handleRename}
                  className="p-1 hover:bg-[var(--glass-bg)] rounded"
                >
                  <Check className="w-3 h-3 text-[var(--neon-green)]" />
                </button>
                <button
                  onClick={handleCancelRename}
                  className="p-1 hover:bg-[var(--glass-bg)] rounded"
                >
                  <X className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ) : (
              <div className="cursor-pointer">
                <div className="text-sm font-medium truncate">{layer.name}</div>
                <div className="text-[10px] text-[var(--muted-foreground)] capitalize">
                  {layer.type}
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-1">
            {/* Visibility Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility();
              }}
              className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors"
              title={layer.visible ? "Hide layer" : "Show layer"}
            >
              {layer.visible ? (
                <Eye className="w-4 h-4" />
              ) : (
                <EyeOff className="w-4 h-4 opacity-50" />
              )}
            </button>

            {/* Lock Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLock();
              }}
              className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors"
              title={layer.locked ? "Unlock layer" : "Lock layer"}
            >
              {layer.locked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4 opacity-50" />
              )}
            </button>

            {/* More Menu */}
            {(onRemove || onRename || onDuplicate) && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />

                      {/* Menu */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1 z-20 glass-card rounded-lg shadow-lg min-w-[140px]"
                      >
                        {onRename && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditing(true);
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--glass-bg)] transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                            Rename
                          </button>
                        )}
                        {onDuplicate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicate();
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--glass-bg)] transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Duplicate
                          </button>
                        )}
                        {onRemove && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemove();
                              setShowMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-500/20 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-[var(--muted-foreground)] w-12">
            Opacity
          </span>
          <input
            type="range"
            min="0"
            max="100"
            value={layer.opacity}
            onChange={(e) => onChangeOpacity(Number(e.target.value))}
            className="flex-1 h-1 rounded-full bg-[var(--glass-bg)] appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-3
              [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--neon-cyan)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-3
              [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-[var(--neon-cyan)]
              [&::-moz-range-thumb]:border-0
              [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="text-[10px] text-[var(--muted-foreground)] w-8 text-right font-mono">
            {layer.opacity}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
