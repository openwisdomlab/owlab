"use client";

import { motion } from "framer-motion";
import {
  Plus,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  MoreHorizontal,
  Save,
  Download,
  Eye,
  Bird,
} from "lucide-react";

interface SimplifiedToolbarProps {
  zoom: number;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddZone: () => void;
  onSave: () => void;
  onExport: () => void;
  onPreview3D: () => void;
  onToggleAI: () => void;
  onMoreOptions: () => void;
}

export function SimplifiedToolbar({
  zoom,
  showGrid,
  canUndo,
  canRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onUndo,
  onRedo,
  onAddZone,
  onSave,
  onExport,
  onPreview3D,
  onToggleAI,
  onMoreOptions,
}: SimplifiedToolbarProps) {
  const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    disabled,
    active,
    highlight,
  }: {
    icon: typeof Plus;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    highlight?: boolean;
  }) => (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors relative group ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : active
            ? "bg-emerald-500/20 text-emerald-400"
            : highlight
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "hover:bg-[var(--glass-bg)]"
      }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        {label}
      </span>
    </motion.button>
  );

  const Divider = () => <div className="w-px h-6 bg-[var(--glass-border)] mx-1" />;

  return (
    <div className="glass-card px-4 py-2 flex items-center gap-1">
      {/* 主要操作 */}
      <ToolButton icon={Plus} label="添加区域" onClick={onAddZone} highlight />

      <Divider />

      {/* 撤销重做 */}
      <ToolButton icon={Undo2} label="撤销 (⌘Z)" onClick={onUndo} disabled={!canUndo} />
      <ToolButton icon={Redo2} label="重做 (⌘⇧Z)" onClick={onRedo} disabled={!canRedo} />

      <Divider />

      {/* 视图控制 */}
      <ToolButton icon={ZoomOut} label="缩小" onClick={onZoomOut} disabled={zoom <= 0.5} />
      <span className="text-xs text-[var(--muted-foreground)] min-w-[3rem] text-center">
        {Math.round(zoom * 100)}%
      </span>
      <ToolButton icon={ZoomIn} label="放大" onClick={onZoomIn} disabled={zoom >= 2} />
      <ToolButton icon={Grid3X3} label="网格" onClick={onToggleGrid} active={showGrid} />

      <Divider />

      {/* 预览和导出 */}
      <ToolButton icon={Eye} label="3D 预览" onClick={onPreview3D} />
      <ToolButton icon={Save} label="保存模板" onClick={onSave} />
      <ToolButton icon={Download} label="导出" onClick={onExport} />

      <Divider />

      {/* AI 助手 */}
      <ToolButton icon={Bird} label="AI 助手" onClick={onToggleAI} />

      {/* 更多选项 */}
      <ToolButton icon={MoreHorizontal} label="更多工具" onClick={onMoreOptions} />
    </div>
  );
}
