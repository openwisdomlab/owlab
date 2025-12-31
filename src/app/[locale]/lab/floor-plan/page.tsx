"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FloorPlanCanvas } from "@/components/lab/FloorPlanCanvas";
import { FloorPlanToolbar } from "@/components/lab/FloorPlanToolbar";
import { KeyboardShortcutsDialog } from "@/components/lab/KeyboardShortcutsDialog";
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
import { MeasurementToolbar } from "@/components/lab/MeasurementToolbar";
import { MeasurementOverlay } from "@/components/lab/MeasurementOverlay";
import { ParallelUniverseDialog } from "@/components/lab/ParallelUniverseDialog";
import { EmotionDesignDialog } from "@/components/lab/EmotionDesignDialog";
import { QuickStatsPanel } from "@/components/lab/QuickStatsPanel";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { EquipmentItem } from "@/lib/schemas/equipment";
import type { Template } from "@/lib/schemas/template";
import { useHistory } from "@/hooks/useHistory";
import { useMeasurementTools } from "@/hooks/useMeasurementTools";
import { ColorScheme, applyColorScheme } from "@/lib/utils/canvas";
import { EMOTION_COLORS } from "@/lib/schemas/emotion-design";

const GRID_SIZE = 40; // matches FloorPlanCanvas GRID_SIZE

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
  const [showParallelUniverse, setShowParallelUniverse] = useState(false);
  const [showEmotionDesign, setShowEmotionDesign] = useState(false);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSnap, setGridSnap] = useState(true);
  const [colorScheme, setColorScheme] = useState<ColorScheme>("neon");
  const [clipboard, setClipboard] = useState<ZoneData | null>(null);

  // Canvas ref for measurement positioning
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Measurement tools
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
        (e: unknown) => typeof e === "object"
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
        ] as ZoneData["equipment"],
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

  // Toggle measurement mode
  const toggleMeasurement = useCallback(() => {
    setShowMeasurement((prev) => {
      if (prev) {
        measurement.cancelMeasurement();
      }
      return !prev;
    });
  }, [measurement]);

  // Consolidated keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if (isInputFocused) return;

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl shortcuts
      if (cmdKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              if (canRedo) redo();
            } else {
              if (canUndo) undo();
            }
            return;
          case "c":
            if (selectedZone) {
              e.preventDefault();
              handleCopyZone();
            }
            return;
          case "v":
            if (clipboard) {
              e.preventDefault();
              handlePasteZone();
            }
            return;
          case "s":
            e.preventDefault();
            setShowSaveTemplate(true);
            return;
        }
      }

      // Single key shortcuts
      switch (e.key) {
        case "?":
        case "/":
          if (e.key === "/" && !e.shiftKey) return;
          e.preventDefault();
          setShowShortcuts(true);
          break;
        case "g":
        case "G":
          e.preventDefault();
          setShowGrid((prev) => !prev);
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMeasurement();
          break;
        case "p":
        case "P":
          e.preventDefault();
          setShowParallelUniverse(true);
          break;
        case "e":
        case "E":
          e.preventDefault();
          setShowEmotionDesign(true);
          break;
        case "q":
        case "Q":
          e.preventDefault();
          setShowQuickStats((prev) => !prev);
          break;
        case "Delete":
        case "Backspace":
          if (selectedZone) {
            e.preventDefault();
            handleDeleteZone(selectedZone);
          }
          break;
        case "Escape":
          setShowShortcuts(false);
          if (measurement.isActive) {
            measurement.cancelMeasurement();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    selectedZone,
    clipboard,
    handleCopyZone,
    handlePasteZone,
    handleDeleteZone,
    toggleMeasurement,
    measurement,
  ]);

  // Handle measurement click
  const handleMeasurementClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (GRID_SIZE * zoom);
      const y = (e.clientY - rect.top) / (GRID_SIZE * zoom);
      measurement.addPoint({ x, y });
    },
    [zoom, measurement]
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Toolbar */}
      <FloorPlanToolbar
        layoutName={layout.name}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => Math.min(2, z + 0.1))}
        onZoomOut={() => setZoom((z) => Math.max(0.5, z - 0.1))}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        gridSnap={gridSnap}
        onToggleGridSnap={() => setGridSnap(!gridSnap)}
        colorScheme={colorScheme}
        onColorSchemeChange={handleChangeColorScheme}
        showTemplates={showTemplates}
        onToggleTemplates={() => setShowTemplates(!showTemplates)}
        showEquipment={showEquipment}
        onToggleEquipment={() => setShowEquipment(!showEquipment)}
        showBudget={showBudget}
        onToggleBudget={() => setShowBudget(!showBudget)}
        showChat={showChat}
        onToggleChat={() => setShowChat(!showChat)}
        showSafety={showSafety}
        onToggleSafety={() => setShowSafety(!showSafety)}
        showPsychologicalSafety={showPsychologicalSafety}
        onTogglePsychologicalSafety={() => setShowPsychologicalSafety(!showPsychologicalSafety)}
        show3DPreview={show3DPreview}
        onToggle3DPreview={() => setShow3DPreview(!show3DPreview)}
        onShowParallelUniverse={() => setShowParallelUniverse(true)}
        onShowEmotionDesign={() => setShowEmotionDesign(true)}
        showMeasurement={showMeasurement}
        onToggleMeasurement={toggleMeasurement}
        onShowShortcuts={() => setShowShortcuts(true)}
        onSave={() => setShowSaveTemplate(true)}
        onExport={() => setShowExport(true)}
        title={t("title")}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 relative" ref={canvasContainerRef}>
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

          {/* Measurement Toolbar */}
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

          {/* Measurement Click Overlay */}
          {showMeasurement && measurement.mode && (
            <div
              className="absolute inset-0 z-20"
              style={{ cursor: "crosshair" }}
              onClick={handleMeasurementClick}
            />
          )}

          {/* Measurement Overlay */}
          {showMeasurement && (measurement.points.length > 0 || measurement.history.length > 0) && (
            <div className="absolute inset-0 pointer-events-none">
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

          {/* Quick Stats Panel */}
          <AnimatePresence>
            {showQuickStats && (
              <QuickStatsPanel
                layout={layout}
                onClose={() => setShowQuickStats(false)}
              />
            )}
          </AnimatePresence>
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

        {showParallelUniverse && (
          <ParallelUniverseDialog onClose={() => setShowParallelUniverse(false)} />
        )}

        {showEmotionDesign && (
          <EmotionDesignDialog
            onClose={() => setShowEmotionDesign(false)}
            onApplyResult={(result) => {
              // Apply the recommended zones from emotion design
              if (result.suggestedZones && result.suggestedZones.length > 0) {
                setLayout((prev) => ({
                  ...prev,
                  zones: [
                    ...prev.zones,
                    ...result.suggestedZones.map((zone, index) => ({
                      id: uuidv4(),
                      name: zone.name,
                      type: "workspace" as ZoneData["type"],
                      position: { x: index * 6, y: prev.zones.length * 4 },
                      size: { width: zone.suggestedSize.width, height: zone.suggestedSize.height },
                      color: EMOTION_COLORS[zone.targetEmotions[0]] || "#8b5cf6",
                      equipment: [],
                    })),
                  ],
                }));
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
