"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { FloorPlanToolbar } from "@/features/lab-editor/FloorPlanToolbar";
import { KeyboardShortcutsDialog } from "@/features/lab-editor/KeyboardShortcutsDialog";
import { AIChatPanel } from "@/features/lab-editor/AIChatPanel";
import { ExportDialog } from "@/features/lab-editor/ExportDialog";
import { EquipmentLibrary } from "@/features/lab-editor/EquipmentLibrary";
import { BudgetDashboard } from "@/features/lab-editor/BudgetDashboard";
import { TemplateGallery } from "@/features/lab-editor/TemplateGallery";
import { TemplatePreviewDialog } from "@/features/lab-editor/TemplatePreviewDialog";
import { SaveTemplateDialog } from "@/features/lab-editor/SaveTemplateDialog";
import { SafetyPanel } from "@/features/lab-editor/SafetyPanel";
import { PsychologicalSafetyPanel } from "@/features/lab-editor/PsychologicalSafetyPanel";
import { Preview3D } from "@/features/lab-editor/Preview3D";
import { AllenCurvePanel } from "@/features/lab-editor/AllenCurvePanel";
import { AllenCurveOverlay } from "@/features/lab-editor/AllenCurveOverlay";
import { assessLayout as assessAllenCurve } from "@/lib/utils/allen-curve-calculator";
import { MeasurementToolbar } from "@/features/lab-editor/MeasurementToolbar";
import { MeasurementOverlay } from "@/features/lab-editor/MeasurementOverlay";
import { ParallelUniverseDialog } from "@/features/lab-editor/ParallelUniverseDialog";
import { EmotionDesignDialog } from "@/features/lab-editor/EmotionDesignDialog";
import { QuickStatsPanel } from "@/features/lab-editor/QuickStatsPanel";
import { SmartLauncher } from "@/features/lab-editor/SmartLauncher";
import { AISidebar } from "@/features/lab-editor/AISidebar";
import { LabWizard } from "@/features/lab-editor/wizard";
import { CopilotPanel } from "@/features/lab-editor/CopilotPanel";
import { ProcurementList, ConstructionChecklist, AcceptanceChecklist, MilestoneTracker } from "@/features/lab-editor/lifecycle";
import { ReportSuiteGenerator } from "@/features/lab-editor/visualization/ReportSuiteGenerator";
import { VisualizationGallery } from "@/features/lab-editor/visualization/VisualizationGallery";
import { useWizardStore } from "@/stores/wizard-store";
import { SimplifiedToolbar } from "@/features/lab-editor/SimplifiedToolbar";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { EquipmentItem } from "@/lib/schemas/equipment";
import type { Template } from "@/lib/schemas/template";
import type { LauncherState } from "@/lib/schemas/launcher";
import { getLayoutFromDiscipline } from "@/lib/data/discipline-templates";
import { useHistory } from "@/hooks/useHistory";
import { useMeasurementTools } from "@/hooks/useMeasurementTools";
import { type ColorScheme, applyColorScheme } from "@/lib/utils/canvas";
import { EMOTION_COLORS } from "@/lib/schemas/emotion-design";
import { useEditorStore } from "@/stores/editor-store";

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

export function FloorPlanEditor() {
  const t = useTranslations("lab.floorPlan");

  // Layout state with undo/redo (kept local — layout is the core data, not UI chrome)
  const {
    state: layout,
    setState: setLayout,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<LayoutData>(defaultLayout);

  // Editor UI state from Zustand store
  const panels = useEditorStore((s) => s.panels);
  const openPanel = useEditorStore((s) => s.openPanel);
  const closePanel = useEditorStore((s) => s.closePanel);
  const togglePanel = useEditorStore((s) => s.togglePanel);

  const launcherState = useEditorStore((s) => s.launcherState);
  const setLauncherState = useEditorStore((s) => s.setLauncherState);
  const hoveredLinkId = useEditorStore((s) => s.hoveredLinkId);
  const setHoveredLinkId = useEditorStore((s) => s.setHoveredLinkId);
  const selectedTemplate = useEditorStore((s) => s.selectedTemplate);
  const setSelectedTemplate = useEditorStore((s) => s.setSelectedTemplate);
  const selectedZone = useEditorStore((s) => s.selectedZone);
  const setSelectedZone = useEditorStore((s) => s.setSelectedZone);

  const zoom = useEditorStore((s) => s.zoom);
  const zoomIn = useEditorStore((s) => s.zoomIn);
  const zoomOut = useEditorStore((s) => s.zoomOut);
  const showGrid = useEditorStore((s) => s.showGrid);
  const gridSnap = useEditorStore((s) => s.gridSnap);
  const colorScheme = useEditorStore((s) => s.colorScheme);
  const setColorScheme = useEditorStore((s) => s.setColorScheme);
  const clipboard = useEditorStore((s) => s.clipboard);
  const setClipboard = useEditorStore((s) => s.setClipboard);

  const wizardActive = useWizardStore((s) => s.isActive);
  const consumeTransferLayout = useWizardStore((s) => s.consumeTransferLayout);

  useEffect(() => {
    const transferredLayout = consumeTransferLayout();
    if (transferredLayout) {
      setLayout(transferredLayout);
    }
  }, [wizardActive, consumeTransferLayout, setLayout]);

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
    [setLayout, setSelectedZone]
  );

  const handleLayoutFromAI = useCallback(
    (newLayout: LayoutData) => {
      setLayout(newLayout);
    },
    [setLayout]
  );

  // Launcher handlers
  const handleLauncherStart = useCallback(async (state: LauncherState) => {
    setLauncherState(state);
    closePanel("launcher");

    if (state.mode === "chat" && state.prompt) {
      openPanel("aiSidebar");
      try {
        const response = await fetch("/api/ai/generate-layout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requirements: state.prompt }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.layout) {
            setLayout(data.layout);
          }
        }
      } catch (error) {
        console.error("Failed to generate layout from prompt:", error);
      }
    }

    if (state.mode === "quick" && state.discipline) {
      const newLayout = getLayoutFromDiscipline(state.discipline);
      setLayout(newLayout);
      openPanel("aiSidebar");
    }

    if (state.mode === "template") {
      openPanel("templates");
    }

    // Wizard mode - launch the step-by-step wizard
    if (state.mode === "wizard") {
      useWizardStore.getState().startWizard();
    }
  }, [setLayout, setLauncherState, closePanel, openPanel]);

  const handleLauncherSkip = useCallback(() => {
    closePanel("launcher");
  }, [closePanel]);

  // Copy/Paste operations
  const handleCopyZone = useCallback(() => {
    if (!selectedZone) return;
    const zone = layout.zones.find((z) => z.id === selectedZone);
    if (zone) {
      setClipboard(zone);
    }
  }, [selectedZone, layout.zones, setClipboard]);

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
  }, [clipboard, handleAddZone, setSelectedZone]);

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
  }, [setSelectedTemplate]);

  const handleUseTemplate = useCallback(
    (template: Template) => {
      setLayout(template.layout);
      closePanel("templates");
      setSelectedTemplate(null);
    },
    [setLayout, closePanel, setSelectedTemplate]
  );

  const handleSaveTemplate = useCallback((template: Template) => {
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
    [setLayout, setColorScheme]
  );

  // Toggle measurement mode
  const toggleMeasurement = useCallback(() => {
    if (panels.measurement) {
      measurement.cancelMeasurement();
    }
    togglePanel("measurement");
  }, [measurement, panels.measurement, togglePanel]);

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
            openPanel("saveTemplate");
            return;
        }
      }

      // Single key shortcuts
      switch (e.key) {
        case "?":
        case "/":
          if (e.key === "/" && !e.shiftKey) return;
          e.preventDefault();
          openPanel("shortcuts");
          break;
        case "g":
        case "G":
          e.preventDefault();
          useEditorStore.getState().toggleGrid();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMeasurement();
          break;
        case "p":
        case "P":
          e.preventDefault();
          openPanel("parallelUniverse");
          break;
        case "e":
        case "E":
          e.preventDefault();
          openPanel("emotionDesign");
          break;
        case "q":
        case "Q":
          e.preventDefault();
          togglePanel("quickStats");
          break;
        case "Delete":
        case "Backspace":
          if (selectedZone) {
            e.preventDefault();
            handleDeleteZone(selectedZone);
          }
          break;
        case "Escape":
          closePanel("shortcuts");
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
    openPanel,
    closePanel,
    togglePanel,
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

  // Show wizard if active
  if (wizardActive) {
    return (
      <div className="h-[calc(100vh-4rem)]">
        <LabWizard />
      </div>
    );
  }

  // Show launcher if not dismissed
  if (panels.launcher) {
    return (
      <SmartLauncher
        onStart={handleLauncherStart}
        onSkip={handleLauncherSkip}
      />
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Simplified Toolbar - New minimalist design */}
      <SimplifiedToolbar
        zoom={zoom}
        showGrid={showGrid}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onToggleGrid={() => useEditorStore.getState().toggleGrid()}
        onUndo={undo}
        onRedo={redo}
        onAddZone={() => {
          const newZone: ZoneData = {
            id: uuidv4(),
            name: "New Zone",
            type: "workspace",
            position: { x: 5, y: 5 },
            size: { width: 4, height: 4 },
            color: "#8b5cf6",
            equipment: [],
          };
          handleAddZone(newZone);
        }}
        onSave={() => openPanel("saveTemplate")}
        onExport={() => openPanel("export")}
        onPreview3D={() => togglePanel("preview3D")}
        onToggleAI={() => togglePanel("aiSidebar")}
        onMoreOptions={() => openPanel("shortcuts")}
      />

      {/* Original Toolbar - Keep as backup/advanced mode */}
      <FloorPlanToolbar
        layoutName={layout.name}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        showGrid={showGrid}
        onToggleGrid={() => useEditorStore.getState().toggleGrid()}
        gridSnap={gridSnap}
        onToggleGridSnap={() => useEditorStore.getState().toggleGridSnap()}
        colorScheme={colorScheme}
        onColorSchemeChange={handleChangeColorScheme}
        showTemplates={panels.templates}
        onToggleTemplates={() => togglePanel("templates")}
        showEquipment={panels.equipment}
        onToggleEquipment={() => togglePanel("equipment")}
        showBudget={panels.budget}
        onToggleBudget={() => togglePanel("budget")}
        showChat={panels.chat}
        onToggleChat={() => togglePanel("chat")}
        showSafety={panels.safety}
        onToggleSafety={() => togglePanel("safety")}
        showPsychologicalSafety={panels.psychologicalSafety}
        onTogglePsychologicalSafety={() => togglePanel("psychologicalSafety")}
        showAllenCurve={panels.allenCurve}
        onToggleAllenCurve={() => togglePanel("allenCurve")}
        show3DPreview={panels.preview3D}
        onToggle3DPreview={() => togglePanel("preview3D")}
        onShowParallelUniverse={() => openPanel("parallelUniverse")}
        onShowEmotionDesign={() => openPanel("emotionDesign")}
        showCopilot={panels.copilot}
        onToggleCopilot={() => togglePanel("copilot")}
        onShowProcurement={() => openPanel("procurement")}
        onShowConstruction={() => openPanel("construction")}
        onShowAcceptance={() => openPanel("acceptance")}
        onShowMilestones={() => openPanel("milestones")}
        onShowReportSuite={() => openPanel("reportSuite")}
        showMeasurement={panels.measurement}
        onToggleMeasurement={toggleMeasurement}
        onShowShortcuts={() => openPanel("shortcuts")}
        onSave={() => openPanel("saveTemplate")}
        onExport={() => openPanel("export")}
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

          {/* Allen Curve Overlay */}
          {panels.allenCurve && (
            <AllenCurveOverlay
              layout={layout}
              assessments={assessAllenCurve(layout).links}
              selectedZoneId={selectedZone}
              zoom={zoom}
              gridSize={GRID_SIZE}
              hoveredLinkId={hoveredLinkId}
              onLinkHover={setHoveredLinkId}
            />
          )}

          {/* Measurement Toolbar */}
          {panels.measurement && (
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
          {panels.measurement && measurement.mode && (
            <div
              className="absolute inset-0 z-20"
              style={{ cursor: "crosshair" }}
              onClick={handleMeasurementClick}
            />
          )}

          {/* Measurement Overlay */}
          {panels.measurement && (measurement.points.length > 0 || measurement.history.length > 0) && (
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
            {panels.quickStats && (
              <QuickStatsPanel
                layout={layout}
                onClose={() => closePanel("quickStats")}
              />
            )}
          </AnimatePresence>

          {/* Copilot Panel */}
          <AnimatePresence>
            {panels.copilot && (
              <CopilotPanel
                layout={layout}
                onClose={() => closePanel("copilot")}
                onApplyFix={(zoneId, updates) => handleZoneUpdate(zoneId, updates)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Side Panels */}
        <AnimatePresence mode="wait">
          {panels.templates && (
            <motion.div
              key="templates"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <TemplateGallery
                onSelectTemplate={handleSelectTemplate}
                onClose={() => closePanel("templates")}
              />
            </motion.div>
          )}

          {panels.equipment && (
            <motion.div
              key="equipment"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <EquipmentLibrary
                onAddEquipment={handleAddEquipment}
                onClose={() => closePanel("equipment")}
              />
            </motion.div>
          )}

          {panels.budget && (
            <motion.div
              key="budget"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <BudgetDashboard
                layout={layout}
                onClose={() => closePanel("budget")}
              />
            </motion.div>
          )}

          {panels.chat && (
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
                onClose={() => closePanel("chat")}
              />
            </motion.div>
          )}

          {/* Note: AISidebar is rendered outside AnimatePresence as it manages its own animations */}

          {panels.safety && (
            <motion.div
              key="safety"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <SafetyPanel
                layout={layout}
                onClose={() => closePanel("safety")}
              />
            </motion.div>
          )}

          {panels.psychologicalSafety && (
            <motion.div
              key="psychological-safety"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <PsychologicalSafetyPanel
                layout={layout}
                onClose={() => closePanel("psychologicalSafety")}
                onZoneSelect={(zoneId) => setSelectedZone(zoneId)}
              />
            </motion.div>
          )}

          {panels.allenCurve && (
            <motion.div
              key="allen-curve"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <AllenCurvePanel
                layout={layout}
                onClose={() => closePanel("allenCurve")}
                onZoneSelect={(zoneId) => setSelectedZone(zoneId)}
                onLinkHover={setHoveredLinkId}
              />
            </motion.div>
          )}

          {panels.preview3D && (
            <motion.div
              key="3d-preview"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-[500px] border-l border-[var(--glass-border)] bg-[var(--background)]"
            >
              <Preview3D
                layout={layout}
                onClose={() => closePanel("preview3D")}
              />
            </motion.div>
          )}

          {panels.procurement && (
            <motion.div key="procurement" initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]">
              <ProcurementList layout={layout} onClose={() => closePanel("procurement")} />
            </motion.div>
          )}

          {panels.construction && (
            <motion.div key="construction" initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]">
              <ConstructionChecklist layout={layout} onClose={() => closePanel("construction")} />
            </motion.div>
          )}

          {panels.acceptance && (
            <motion.div key="acceptance" initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]">
              <AcceptanceChecklist layout={layout} onClose={() => closePanel("acceptance")} />
            </motion.div>
          )}

          {panels.milestones && (
            <motion.div key="milestones" initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]">
              <MilestoneTracker onClose={() => closePanel("milestones")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Sidebar - Fixed positioning, manages its own animation */}
      <AISidebar
        layout={layout}
        onLayoutUpdate={handleLayoutFromAI}
        isOpen={panels.aiSidebar}
        onToggle={() => togglePanel("aiSidebar")}
        discipline={launcherState?.discipline}
      />

      {/* Modals/Dialogs */}
      <AnimatePresence>
        {panels.export && (
          <ExportDialog layout={layout} onClose={() => closePanel("export")} />
        )}

        {panels.saveTemplate && (
          <SaveTemplateDialog
            layout={layout}
            onSave={handleSaveTemplate}
            onClose={() => closePanel("saveTemplate")}
          />
        )}

        {selectedTemplate && (
          <TemplatePreviewDialog
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
            onUseTemplate={() => handleUseTemplate(selectedTemplate)}
          />
        )}

        {panels.shortcuts && (
          <KeyboardShortcutsDialog onClose={() => closePanel("shortcuts")} />
        )}

        {panels.parallelUniverse && (
          <ParallelUniverseDialog onClose={() => closePanel("parallelUniverse")} />
        )}

        {panels.emotionDesign && (
          <EmotionDesignDialog
            onClose={() => closePanel("emotionDesign")}
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

      {panels.reportSuite && (
        <ReportSuiteGenerator layout={layout} onClose={() => closePanel("reportSuite")} />
      )}

      {panels.gallery && (
        <VisualizationGallery images={[]} onClose={() => closePanel("gallery")} />
      )}
    </div>
  );
}
