"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
  MessageSquare,
} from "lucide-react";
import { FloorPlanCanvas } from "@/components/lab/FloorPlanCanvas";
import { AIChatPanel } from "@/components/lab/AIChatPanel";
import { ExportDialog } from "@/components/lab/ExportDialog";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";

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
      equipment: ["GPU Cluster", "Cooling System"],
    },
    {
      id: "zone-2",
      name: "Workspace Area",
      type: "workspace",
      position: { x: 7, y: 0 },
      size: { width: 8, height: 7 },
      color: "#8b5cf6",
      equipment: ["Workstations", "Monitors"],
    },
    {
      id: "zone-3",
      name: "Meeting Room",
      type: "meeting",
      position: { x: 16, y: 0 },
      size: { width: 4, height: 5 },
      color: "#10b981",
      equipment: ["Conference Table", "Display"],
    },
  ],
  notes: ["Sample layout - customize as needed"],
};

export default function FloorPlanPage() {
  const t = useTranslations("lab.floorPlan");
  const [layout, setLayout] = useState<LayoutData>(defaultLayout);
  const [showChat, setShowChat] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);

  const handleZoneUpdate = useCallback((zoneId: string, updates: Partial<ZoneData>) => {
    setLayout((prev) => ({
      ...prev,
      zones: prev.zones.map((zone) =>
        zone.id === zoneId ? { ...zone, ...updates } : zone
      ),
    }));
  }, []);

  const handleAddZone = useCallback((zone: ZoneData) => {
    setLayout((prev) => ({
      ...prev,
      zones: [...prev.zones, zone],
    }));
  }, []);

  const handleDeleteZone = useCallback((zoneId: string) => {
    setLayout((prev) => ({
      ...prev,
      zones: prev.zones.filter((z) => z.id !== zoneId),
    }));
    setSelectedZone(null);
  }, []);

  const handleLayoutFromAI = useCallback((newLayout: LayoutData) => {
    setLayout(newLayout);
  }, []);

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
          {/* View Controls */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[var(--glass-bg)]">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
              title={t("zoomOut")}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
              className="p-2 rounded hover:bg-[var(--glass-border)] transition-colors"
              title={t("zoomIn")}
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
            title={t("toggleGrid")}
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-[var(--glass-border)]" />

          {/* Action Buttons */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showChat
                ? "bg-[var(--neon-cyan)] text-[var(--background)]"
                : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span className="text-sm">{t("aiAssist")}</span>
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">{t("export")}</span>
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
        </div>

        {/* AI Chat Panel */}
        {showChat && (
          <motion.div
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
      </div>

      {/* Export Dialog */}
      {showExport && (
        <ExportDialog
          layout={layout}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
