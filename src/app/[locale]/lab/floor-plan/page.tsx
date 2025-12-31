"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
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
  Copy,
  Magnet,
  Palette,
  Shield,
  Box,
  Keyboard,
  X,
  Ruler,
  Brain,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FloorPlanCanvas } from "@/components/lab/FloorPlanCanvas";
import { AIChatPanel } from "@/components/lab/AIChatPanel";
import { ExportDialog } from "@/components/lab/ExportDialog";
import { EquipmentLibrary } from "@/components/lab/EquipmentLibrary";
import { BudgetDashboard } from "@/components/lab/BudgetDashboard";
import { TemplateGallery } from "@/components/lab/TemplateGallery";
import { TemplatePreviewDialog } from "@/components/lab/TemplatePreviewDialog";
import { SaveTemplateDialog } from "@/components/lab/SaveTemplateDialog";
import { SafetyPanel } from "@/components/lab/SafetyPanel";
import { PsychologicalSafetyPanel } from "@/components/lab/PsychologicalSafetyPanel";
import { Preview3D } from "@/components/lab/Preview3D";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { EquipmentItem } from "@/lib/schemas/equipment";
import type { Template } from "@/lib/schemas/template";
import { useHistory } from "@/hooks/useHistory";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMeasurementTools } from "@/hooks/useMeasurementTools";
import { COLOR_SCHEMES, ColorScheme, applyColorScheme } from "@/lib/utils/canvas";
import { MeasurementToolbar } from "@/components/lab/MeasurementToolbar";
import { MeasurementOverlay } from "@/components/lab/MeasurementOverlay";

const defaultLayout: LayoutData = {
  name: "New AI Lab",
  description: "A modern AI research laboratory",
  dimensions: { width: 20, height: 15, unit: "m" },
  zones: [
    {
      id: "zone-1",
      name: "GPU Server Room",
      type: "compute",
      position: { x: 0, y: 0 },
      size: { width: 6, height: 5 },
      color: "#22d3ee",
      equipment: [],
    },
    {
      id: "zone-2",
      name: "Workspace Area",
      type: "workspace",
      position: { x: 7, y: 0 },
      size: { width: 8, height: 7 },
      color: "#8b5cf6",
      equipment: [],
    },
    {
      id: "zone-3",
      name: "Meeting Room",
      type: "meeting",
      position: { x: 16, y: 0 },
      size: { width: 4, height: 5 },
      color: "#10b981",
      equipment: [],
    },
  ],
};

export default function FloorPlanPageEnhanced() {
  const t = useTranslations("lab.floorPlan");

  // Layout state with undo/redo
  const {
    state: layout,
    setState: setLayout,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<LayoutData>(defaultLayout);

  // UI state
  const [showChat, setShowChat] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showEquipment, setShowEquipment] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showPsychologicalSafety, setShowPsychologicalSafety] = useState(false);
  const [show3DPreview, setShow3DPreview] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSnap, setGridSnap] = useState(true);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("neon");
  const [clipboard, setClipboard] = useState<ZoneData | null>(null);

  // Measurement tools - for measuring distances, areas, and angles on the canvas
  const GRID_SIZE = 40; // matches FloorPlanCanvas GRID_SIZE
  const measurement = useMeasurementTools(
    GRID_SIZE,
    layout.dimensions.unit === "ft" ? "ft" : "m"
  );

  // Zone operations
  const handleZoneUpdate = useCallback(
    (zoneId: string, updates: Partial<ZoneData>) => {
      setLayout((prev) => ({
        ...prev,
        zones: prev.zones.map((zone) =>
          zone.id === zoneId ? { ...zone, ...updates } : zone
        ),
      }));
    },
    [setLayout]
  );

  const handleAddZone = useCallback(
    (zone: ZoneData) => {
      setLayout((prev) => ({
        ...prev,
        zones: [...prev.zones, zone],
      }));
    },
    [setLayout]
  );

  const handleDeleteZone = useCallback(
    (zoneId: string) => {
      setLayout((prev) => ({
        ...prev,
        zones: prev.zones.filter((z) => z.id !== zoneId),
      }));
      setSelectedZone(null);
    },
    [setLayout]
  );

  const handleLayoutFromAI = useCallback(
    (newLayout: LayoutData) => {
      setLayout(newLayout);
    },
    [setLayout]
  );

  // Copy/Paste operations
  const handleCopyZone = useCallback(() => {
    if (!selectedZone) return;
    const zone = layout.zones.find((z) => z.id === selectedZone);
    if (zone) {
      setClipboard(zone);
    }
  }, [selectedZone, layout.zones]);

  const handlePasteZone = useCallback(() => {
    if (!clipboard) return;
    const newZone: ZoneData = {
      ...clipboard,
      id: uuidv4(),
      name: `${clipboard.name} (Copy)`,
      position: {
        x: clipboard.position.x + 2,
        y: clipboard.position.y + 2,
      },
    };
    handleAddZone(newZone);
    setSelectedZone(newZone.id);
  }, [clipboard, handleAddZone]);

  // Equipment operations
  const handleAddEquipment = useCallback(
    (equipment: EquipmentItem) => {
      if (!selectedZone) return;

      const zone = layout.zones.find((z) => z.id === selectedZone);
      const existingEquipment = zone?.equipment || [];

      // Filter to only include object-type equipment (new format)
      const equipmentObjects = existingEquipment.filter(
        (e: any) => typeof e === "object"
      );

      handleZoneUpdate(selectedZone, {
        equipment: [
          ...equipmentObjects,
          {
            equipmentId: equipment.id,
            name: equipment.name,
            quantity: 1,
            price: equipment.price,
            category: equipment.category,
          },
        ] as any,
      });
    },
    [selectedZone, layout.zones, handleZoneUpdate]
  );

  // Template operations
  const handleSelectTemplate = useCallback((template: Template) => {
    setSelectedTemplate(template);
  }, []);

  const handleUseTemplate = useCallback(
    (template: Template) => {
      setLayout(template.layout);
      setShowTemplates(false);
      setSelectedTemplate(null);
    },
    [setLayout]
  );

  const handleSaveTemplate = useCallback((template: Template) => {
    // In a real app, this would save to backend or localStorage
    console.log("Template saved:", template);
    const blob = new Blob([JSON.stringify(template, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  // Color scheme operations
  const handleChangeColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setColorScheme(scheme);
      setLayout((prev) => ({
        ...prev,
        zones: applyColorScheme(prev.zones, scheme),
      }));
    },
    [setLayout]
  );

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: canUndo ? undo : undefined,
    onRedo: canRedo ? redo : undefined,
    onCopy: selectedZone ? handleCopyZone : undefined,
    onPaste: clipboard ? handlePasteZone : undefined,
    onDelete: selectedZone ? () => handleDeleteZone(selectedZone) : undefined,
    onSave: () => setShowSaveTemplate(true),
  });

  // Additional keyboard shortcuts for "?" to show shortcuts dialog
  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";
      if (isInputFocused) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowShortcuts(true);
      } else if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        setShowGrid((prev) => !prev);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setShowMeasurement((prev) => !prev);
        if (showMeasurement) {
          measurement.cancelMeasurement();
        }
      } else if (e.key === "Escape") {
        setShowShortcuts(false);
        if (measurement.isActive) {
          measurement.cancelMeasurement();
        }
      }
    },
    [showMeasurement, measurement]
  );

  // Register the global keyboard handler
  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h1 className="text-lg font-semibold">{t("title")}</h1>
          </div>
          <div className="h-6 w-px bg-[var(--glass-border)]" />
          <span className="text-sm text-[var(--muted-foreground)]">
            {layout.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
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
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setGridSnap(!gridSnap)}
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
            onChange={(e) =>
              handleChangeColorScheme(e.target.value as ColorScheme)
            }
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
            onClick={() => setShowTemplates(!showTemplates)}
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
            onClick={() => setShowEquipment(!showEquipment)}
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
            onClick={() => setShowBudget(!showBudget)}
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
            onClick={() => setShowChat(!showChat)}
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
            onClick={() => setShowSafety(!showSafety)}
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
            onClick={() => setShowPsychologicalSafety(!showPsychologicalSafety)}
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
            onClick={() => setShow3DPreview(!show3DPreview)}
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
            onClick={() => {
              setShowMeasurement(!showMeasurement);
              if (showMeasurement) {
                measurement.cancelMeasurement();
              }
            }}
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
            onClick={() => setShowShortcuts(true)}
            className="p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-[var(--glass-border)]" />

          <button
            onClick={() => setShowSaveTemplate(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
            title="Save as Template"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative">
          <FloorPlanCanvas
            layout={layout}
            zoom={zoom}
            showGrid={showGrid}
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
            onZoneUpdate={handleZoneUpdate}
            onAddZone={handleAddZone}
            onDeleteZone={handleDeleteZone}
          />

          {/* Measurement Toolbar - shown when measurement mode is active */}
          {showMeasurement && (
            <MeasurementToolbar
              mode={measurement.mode}
              onModeChange={measurement.startMeasurement}
              helpText={measurement.getHelpText()}
              history={measurement.history}
              onClearHistory={measurement.clearHistory}
              onRemoveMeasurement={measurement.removeMeasurement}
            />
          )}

          {/* Measurement Click Overlay - captures clicks when in measurement mode */}
          {showMeasurement && measurement.mode && (
            <div
              className="absolute inset-0 z-20"
              style={{ cursor: "crosshair", margin: "32px" }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / (GRID_SIZE * zoom);
                const y = (e.clientY - rect.top) / (GRID_SIZE * zoom);
                measurement.addPoint({ x, y });
              }}
            />
          )}

          {/* Measurement Overlay - renders measurement visualizations */}
          {showMeasurement && (measurement.points.length > 0 || measurement.history.length > 0) && (
            <div className="absolute inset-0 pointer-events-none" style={{ margin: "32px" }}>
              <MeasurementOverlay
                currentPoints={measurement.points}
                measurements={measurement.history}
                gridSize={GRID_SIZE}
                zoom={zoom}
              />
            </div>
          )}

          {/* Copy/Paste Indicator */}
          {clipboard && (
            <div className="absolute bottom-4 left-4 glass-card p-2 flex items-center gap-2 text-sm">
              <Copy className="w-4 h-4 text-[var(--neon-cyan)]" />
              <span>
                Copied: {clipboard.name} (Press Ctrl+V to paste)
              </span>
            </div>
          )}
        </div>

        {/* Side Panels */}
        <AnimatePresence mode="wait">
          {showTemplates && (
            <motion.div
              key="templates"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <TemplateGallery
                onSelectTemplate={handleSelectTemplate}
                onClose={() => setShowTemplates(false)}
              />
            </motion.div>
          )}

          {showEquipment && (
            <motion.div
              key="equipment"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <EquipmentLibrary
                onAddEquipment={handleAddEquipment}
                onClose={() => setShowEquipment(false)}
              />
            </motion.div>
          )}

          {showBudget && (
            <motion.div
              key="budget"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <BudgetDashboard
                layout={layout}
                onClose={() => setShowBudget(false)}
              />
            </motion.div>
          )}

          {showChat && (
            <motion.div
              key="chat"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <AIChatPanel
                layout={layout}
                onLayoutUpdate={handleLayoutFromAI}
                onClose={() => setShowChat(false)}
              />
            </motion.div>
          )}

          {showSafety && (
            <motion.div
              key="safety"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <SafetyPanel
                layout={layout}
                onClose={() => setShowSafety(false)}
              />
            </motion.div>
          )}

          {showPsychologicalSafety && (
            <motion.div
              key="psychological-safety"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <PsychologicalSafetyPanel
                layout={layout}
                onClose={() => setShowPsychologicalSafety(false)}
                onZoneSelect={(zoneId) => setSelectedZone(zoneId)}
              />
            </motion.div>
          )}

          {show3DPreview && (
            <motion.div
              key="3d-preview"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[500px] border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <Preview3D
                layout={layout}
                onClose={() => setShow3DPreview(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals/Dialogs */}
      <AnimatePresence>
        {showExport && (
          <ExportDialog layout={layout} onClose={() => setShowExport(false)} />
        )}

        {showSaveTemplate && (
          <SaveTemplateDialog
            layout={layout}
            onSave={handleSaveTemplate}
            onClose={() => setShowSaveTemplate(false)}
          />
        )}

        {selectedTemplate && (
          <TemplatePreviewDialog
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onUseTemplate={() => handleUseTemplate(selectedTemplate)}
          />
        )}

        {showShortcuts && (
          <KeyboardShortcutsDialog onClose={() => setShowShortcuts(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Keyboard Shortcuts Dialog Component
function KeyboardShortcutsDialog({ onClose }: { onClose: () => void }) {
  const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const cmdKey = isMac ? "⌘" : "Ctrl";

  const shortcuts = [
    { category: "General", items: [
      { keys: [`${cmdKey}`, "Z"], action: "Undo" },
      { keys: [`${cmdKey}`, "Shift", "Z"], action: "Redo" },
      { keys: [`${cmdKey}`, "S"], action: "Save template" },
    ]},
    { category: "Zone Operations", items: [
      { keys: [`${cmdKey}`, "C"], action: "Copy selected zone" },
      { keys: [`${cmdKey}`, "V"], action: "Paste zone" },
      { keys: ["Delete"], action: "Delete selected zone" },
      { keys: ["Backspace"], action: "Delete selected zone" },
    ]},
    { category: "View Controls", items: [
      { keys: ["+", "/-"], action: "Zoom in/out" },
      { keys: ["G"], action: "Toggle grid" },
      { keys: ["M"], action: "Toggle measurement tools" },
      { keys: ["?"], action: "Show shortcuts" },
    ]},
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-card w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[var(--neon-cyan)]" />
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--glass-bg)]"
                  >
                    <span className="text-sm">{shortcut.action}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="flex items-center">
                          <kbd className="px-2 py-1 text-xs font-mono rounded bg-[var(--background)] border border-[var(--glass-border)]">
                            {key}
                          </kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="mx-1 text-[var(--muted-foreground)]">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
          <p className="text-xs text-[var(--muted-foreground)] text-center">
            Press <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-[var(--background)] border border-[var(--glass-border)]">?</kbd> anytime to show this dialog
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
