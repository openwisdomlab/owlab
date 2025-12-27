"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Move, Square } from "lucide-react";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import { v4 as uuidv4 } from "uuid";

interface FloorPlanCanvasProps {
  layout: LayoutData;
  zoom: number;
  showGrid: boolean;
  selectedZone: string | null;
  onZoneSelect: (id: string | null) => void;
  onZoneUpdate: (id: string, updates: Partial<ZoneData>) => void;
  onAddZone: (zone: ZoneData) => void;
  onDeleteZone: (id: string) => void;
}

const GRID_SIZE = 40; // pixels per unit
const ZONE_TYPES: ZoneData["type"][] = [
  "compute",
  "workspace",
  "meeting",
  "storage",
  "utility",
  "entrance",
];

const ZONE_COLORS: Record<ZoneData["type"], string> = {
  compute: "#22d3ee",
  workspace: "#8b5cf6",
  meeting: "#10b981",
  storage: "#f59e0b",
  utility: "#6b7280",
  entrance: "#ec4899",
};

export function FloorPlanCanvas({
  layout,
  zoom,
  showGrid,
  selectedZone,
  onZoneSelect,
  onZoneUpdate,
  onAddZone,
  onDeleteZone,
}: FloorPlanCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZoneType, setNewZoneType] = useState<ZoneData["type"]>("workspace");

  const canvasWidth = layout.dimensions.width * GRID_SIZE * zoom;
  const canvasHeight = layout.dimensions.height * GRID_SIZE * zoom;

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isAddingZone) {
        onZoneSelect(null);
        return;
      }

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.floor((e.clientX - rect.left) / (GRID_SIZE * zoom));
      const y = Math.floor((e.clientY - rect.top) / (GRID_SIZE * zoom));

      const newZone: ZoneData = {
        id: uuidv4(),
        name: `New ${newZoneType}`,
        type: newZoneType,
        position: { x, y },
        size: { width: 4, height: 3 },
        color: ZONE_COLORS[newZoneType],
        equipment: [],
      };

      onAddZone(newZone);
      setIsAddingZone(false);
    },
    [isAddingZone, newZoneType, zoom, onAddZone, onZoneSelect]
  );

  const handleZoneMouseDown = useCallback(
    (e: React.MouseEvent, zoneId: string) => {
      e.stopPropagation();
      onZoneSelect(zoneId);
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [onZoneSelect]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !selectedZone) return;

      const zone = layout.zones.find((z) => z.id === selectedZone);
      if (!zone) return;

      const dx = Math.round((e.clientX - dragStart.x) / (GRID_SIZE * zoom));
      const dy = Math.round((e.clientY - dragStart.y) / (GRID_SIZE * zoom));

      if (dx !== 0 || dy !== 0) {
        onZoneUpdate(selectedZone, {
          position: {
            x: Math.max(0, zone.position.x + dx),
            y: Math.max(0, zone.position.y + dy),
          },
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, selectedZone, layout.zones, dragStart, zoom, onZoneUpdate]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="relative h-full overflow-auto bg-[var(--background)]">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 rounded-lg glass-card">
        <button
          onClick={() => setIsAddingZone(!isAddingZone)}
          className={`p-2 rounded-lg transition-colors ${
            isAddingZone
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "hover:bg-[var(--glass-bg)]"
          }`}
          title="Add Zone"
        >
          <Plus className="w-5 h-5" />
        </button>

        {isAddingZone && (
          <div className="flex gap-1 pl-2 border-l border-[var(--glass-border)]">
            {ZONE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setNewZoneType(type)}
                className={`p-2 rounded-lg transition-colors ${
                  newZoneType === type ? "ring-2 ring-white" : ""
                }`}
                style={{ backgroundColor: ZONE_COLORS[type] }}
                title={type}
              >
                <Square className="w-4 h-4 text-white" />
              </button>
            ))}
          </div>
        )}

        {selectedZone && (
          <>
            <div className="w-px h-6 bg-[var(--glass-border)]" />
            <button
              onClick={() => onDeleteZone(selectedZone)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              title="Delete Zone"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative m-8"
        style={{
          width: canvasWidth,
          height: canvasHeight,
          cursor: isAddingZone ? "crosshair" : "default",
        }}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid */}
        {showGrid && (
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasWidth}
            height={canvasHeight}
          >
            <defs>
              <pattern
                id="grid"
                width={GRID_SIZE * zoom}
                height={GRID_SIZE * zoom}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${GRID_SIZE * zoom} 0 L 0 0 0 ${GRID_SIZE * zoom}`}
                  fill="none"
                  stroke="rgba(34, 211, 238, 0.1)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        )}

        {/* Border */}
        <div
          className="absolute inset-0 border-2 border-[var(--glass-border)] rounded-lg pointer-events-none"
          style={{ boxShadow: "0 0 20px rgba(34, 211, 238, 0.1)" }}
        />

        {/* Zones */}
        {layout.zones.map((zone) => (
          <motion.div
            key={zone.id}
            className={`absolute rounded-lg cursor-move transition-shadow ${
              selectedZone === zone.id
                ? "ring-2 ring-white shadow-lg"
                : "hover:ring-1 hover:ring-white/50"
            }`}
            style={{
              left: zone.position.x * GRID_SIZE * zoom,
              top: zone.position.y * GRID_SIZE * zoom,
              width: zone.size.width * GRID_SIZE * zoom,
              height: zone.size.height * GRID_SIZE * zoom,
              backgroundColor: `${zone.color}40`,
              borderLeft: `4px solid ${zone.color}`,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseDown={(e) => handleZoneMouseDown(e, zone.id)}
          >
            <div className="p-2 h-full flex flex-col">
              <div
                className="text-sm font-medium truncate"
                style={{ color: zone.color }}
              >
                {zone.name}
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">
                {zone.type}
              </div>
              {zone.equipment && zone.equipment.length > 0 && (
                <div className="mt-auto text-xs text-[var(--muted-foreground)]">
                  {zone.equipment.length} items
                </div>
              )}
            </div>

            {/* Resize Handle */}
            {selectedZone === zone.id && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                style={{ backgroundColor: zone.color }}
              />
            )}
          </motion.div>
        ))}

        {/* Dimensions Label */}
        <div className="absolute -bottom-8 left-0 right-0 text-center text-sm text-[var(--muted-foreground)]">
          {layout.dimensions.width} × {layout.dimensions.height}{" "}
          {layout.dimensions.unit}
        </div>
      </div>

      {/* Zone Properties Panel */}
      {selectedZone && (
        <ZonePropertiesPanel
          zone={layout.zones.find((z) => z.id === selectedZone)!}
          onUpdate={(updates) => onZoneUpdate(selectedZone, updates)}
        />
      )}
    </div>
  );
}

interface ZonePropertiesPanelProps {
  zone: ZoneData;
  onUpdate: (updates: Partial<ZoneData>) => void;
}

function ZonePropertiesPanel({ zone, onUpdate }: ZonePropertiesPanelProps) {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-4 right-4 w-64 glass-card p-4 space-y-4"
    >
      <h3 className="font-semibold text-sm">Zone Properties</h3>

      <div>
        <label className="text-xs text-[var(--muted-foreground)]">Name</label>
        <input
          type="text"
          value={zone.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
        />
      </div>

      <div>
        <label className="text-xs text-[var(--muted-foreground)]">Type</label>
        <select
          value={zone.type}
          onChange={(e) =>
            onUpdate({
              type: e.target.value as ZoneData["type"],
              color: ZONE_COLORS[e.target.value as ZoneData["type"]],
            })
          }
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
        >
          {ZONE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--muted-foreground)]">Width</label>
          <input
            type="number"
            value={zone.size.width}
            onChange={(e) =>
              onUpdate({
                size: { ...zone.size, width: parseInt(e.target.value) || 1 },
              })
            }
            min={1}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)]">Height</label>
          <input
            type="number"
            value={zone.size.height}
            onChange={(e) =>
              onUpdate({
                size: { ...zone.size, height: parseInt(e.target.value) || 1 },
              })
            }
            min={1}
            className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
