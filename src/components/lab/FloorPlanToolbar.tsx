"use client";

import {
  Layout,
  Wand2,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Package,
  DollarSign,
  Grid3x3,
  Magnet,
  Shield,
  Box,
  Keyboard,
  Ruler,
  Brain,
} from "lucide-react";
import { COLOR_SCHEMES, ColorScheme } from "@/lib/utils/canvas";

interface FloorPlanToolbarProps {
  // Layout info
  layoutName: string;

  // Undo/Redo
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  // Zoom
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;

  // Grid
  showGrid: boolean;
  onToggleGrid: () => void;
  gridSnap: boolean;
  onToggleGridSnap: () => void;

  // Color scheme
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;

  // Panel toggles
  showTemplates: boolean;
  onToggleTemplates: () => void;
  showEquipment: boolean;
  onToggleEquipment: () => void;
  showBudget: boolean;
  onToggleBudget: () => void;
  showChat: boolean;
  onToggleChat: () => void;
  showSafety: boolean;
  onToggleSafety: () => void;
  showPsychologicalSafety: boolean;
  onTogglePsychologicalSafety: () => void;
  show3DPreview: boolean;
  onToggle3DPreview: () => void;

  // Measurement
  showMeasurement: boolean;
  onToggleMeasurement: () => void;

  // Actions
  onShowShortcuts: () => void;
  onSave: () => void;
  onExport: () => void;

  // Translations
  title: string;
}

export function FloorPlanToolbar({
  layoutName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  showGrid,
  onToggleGrid,
  gridSnap,
  onToggleGridSnap,
  colorScheme,
  onColorSchemeChange,
  showTemplates,
  onToggleTemplates,
  showEquipment,
  onToggleEquipment,
  showBudget,
  onToggleBudget,
  showChat,
  onToggleChat,
  showSafety,
  onToggleSafety,
  showPsychologicalSafety,
  onTogglePsychologicalSafety,
  show3DPreview,
  onToggle3DPreview,
  showMeasurement,
  onToggleMeasurement,
  onShowShortcuts,
  onSave,
  onExport,
  title,
}: FloorPlanToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        <div className="h-6 w-px bg-[var(--glass-border)]" />
        <span className="text-sm text-[var(--muted-foreground)]">
          {layoutName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-[var(--glass-border)]" />

        {/* View Controls */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--glass-bg)]">
          <button
            onClick={onZoomOut}
            className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-sm">{Math.round(zoom * 100)}%</span>
          <button
            onClick={onZoomIn}
            className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onToggleGrid}
          className={`p-2 rounded-lg transition-colors ${
            showGrid
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Toggle Grid (G)"
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleGridSnap}
          className={`p-2 rounded-lg transition-colors ${
            gridSnap
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Toggle Grid Snapping"
        >
          <Magnet className="w-4 h-4" />
        </button>

        {/* Color Scheme Selector */}
        <select
          value={colorScheme}
          onChange={(e) => onColorSchemeChange(e.target.value as ColorScheme)}
          className="px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
          title="Color Scheme"
        >
          {Object.keys(COLOR_SCHEMES).map((scheme) => (
            <option key={scheme} value={scheme}>
              {scheme.charAt(0).toUpperCase() + scheme.slice(1)}
            </option>
          ))}
        </select>

        <div className="h-6 w-px bg-[var(--glass-border)]" />

        {/* Tools */}
        <button
          onClick={onToggleTemplates}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showTemplates
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Templates"
        >
          <Grid3x3 className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleEquipment}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showEquipment
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Equipment"
        >
          <Package className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleBudget}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showBudget
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Budget"
        >
          <DollarSign className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleChat}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showChat
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="AI Assistant"
        >
          <Wand2 className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleSafety}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showSafety
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Safety Analysis"
        >
          <Shield className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePsychologicalSafety}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            showPsychologicalSafety
              ? "bg-[var(--neon-violet)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Psychological Safety Assessment"
        >
          <Brain className="w-4 h-4" />
        </button>

        <button
          onClick={onToggle3DPreview}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
            show3DPreview
              ? "bg-[var(--neon-violet)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="3D Preview"
        >
          <Box className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-[var(--glass-border)]" />

        <button
          onClick={onToggleMeasurement}
          className={`p-2 rounded-lg transition-colors ${
            showMeasurement
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
          }`}
          title="Measurement Tools (M)"
        >
          <Ruler className="w-4 h-4" />
        </button>

        <button
          onClick={onShowShortcuts}
          className="p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-[var(--glass-border)]" />

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          title="Save as Template"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          title="Export"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export</span>
        </button>
      </div>
    </div>
  );
}
