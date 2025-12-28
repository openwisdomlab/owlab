"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Move, Square, Package, X as XIcon } from "lucide-react";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/lib/utils/budget";

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
      <div
        className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 rounded-lg glass-card"
        role="toolbar"
        aria-label="Floor plan editing tools"
      >
        <button
          onClick={() => setIsAddingZone(!isAddingZone)}
          className={`p-2 rounded-lg transition-colors ${
            isAddingZone
              ? "bg-[var(--neon-cyan)] text-[var(--background)]"
              : "hover:bg-[var(--glass-bg)]"
          }`}
          aria-label={isAddingZone ? "Cancel adding zone" : "Add new zone"}
          aria-pressed={isAddingZone}
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
        </button>

        {isAddingZone && (
          <div
            className="flex gap-1 pl-2 border-l border-[var(--glass-border)]"
            role="radiogroup"
            aria-label="Select zone type"
          >
            {ZONE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setNewZoneType(type)}
                className={`p-2 rounded-lg transition-colors ${
                  newZoneType === type ? "ring-2 ring-white" : ""
                }`}
                style={{ backgroundColor: ZONE_COLORS[type] }}
                role="radio"
                aria-checked={newZoneType === type}
                aria-label={`${type} zone`}
              >
                <Square className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        {selectedZone && (
          <>
            <div className="w-px h-6 bg-[var(--glass-border)]" aria-hidden="true" />
            <button
              onClick={() => onDeleteZone(selectedZone)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
              aria-label="Delete selected zone"
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Canvas */}
      <div className="relative m-8">
        {/* Horizontal Ruler */}
        <div
          className="absolute -top-6 left-0 flex text-xs text-[var(--muted-foreground)]"
          style={{ width: canvasWidth }}
        >
          {Array.from({ length: layout.dimensions.width + 1 }).map((_, i) => (
            <div
              key={`h-ruler-${i}`}
              className="relative"
              style={{ width: GRID_SIZE * zoom }}
            >
              <span className="absolute -left-1">{i}</span>
              {i < layout.dimensions.width && (
                <div className="absolute top-4 left-0 w-px h-2 bg-[var(--glass-border)]" />
              )}
            </div>
          ))}
        </div>

        {/* Vertical Ruler */}
        <div
          className="absolute -left-8 top-0 flex flex-col text-xs text-[var(--muted-foreground)]"
          style={{ height: canvasHeight }}
        >
          {Array.from({ length: layout.dimensions.height + 1 }).map((_, i) => (
            <div
              key={`v-ruler-${i}`}
              className="relative"
              style={{ height: GRID_SIZE * zoom }}
            >
              <span className="absolute -top-2 right-2">{i}</span>
              {i < layout.dimensions.height && (
                <div className="absolute top-0 right-0 h-px w-2 bg-[var(--glass-border)]" />
              )}
            </div>
          ))}
        </div>

        <div
          ref={canvasRef}
          className="relative"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            cursor: isAddingZone ? "crosshair" : "default",
          }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          role="application"
          aria-label={`Floor plan canvas, ${layout.zones.length} zones`}
          tabIndex={0}
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
        {layout.zones.map((zone, index) => (
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
            role="button"
            tabIndex={0}
            aria-label={`${zone.name}, ${zone.type} zone, position ${zone.position.x},${zone.position.y}, size ${zone.size.width}x${zone.size.height}`}
            aria-selected={selectedZone === zone.id}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onZoneSelect(zone.id);
              } else if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                if (selectedZone === zone.id) {
                  onDeleteZone(zone.id);
                }
              }
            }}
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
  const nameId = `zone-name-${zone.id}`;
  const typeId = `zone-type-${zone.id}`;
  const widthId = `zone-width-${zone.id}`;
  const heightId = `zone-height-${zone.id}`;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute top-4 right-4 w-64 glass-card p-4 space-y-4"
      role="dialog"
      aria-label="Zone properties panel"
    >
      <h3 className="font-semibold text-sm" id="zone-properties-title">
        Zone Properties
      </h3>

      <div>
        <label
          htmlFor={nameId}
          className="text-xs text-[var(--muted-foreground)]"
        >
          Name
        </label>
        <input
          id={nameId}
          type="text"
          value={zone.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
          aria-describedby={`${nameId}-desc`}
        />
      </div>

      <div>
        <label
          htmlFor={typeId}
          className="text-xs text-[var(--muted-foreground)]"
        >
          Type
        </label>
        <select
          id={typeId}
          value={zone.type}
          onChange={(e) =>
            onUpdate({
              type: e.target.value as ZoneData["type"],
              color: ZONE_COLORS[e.target.value as ZoneData["type"]],
            })
          }
          className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
        >
          {ZONE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-xs text-[var(--muted-foreground)] mb-2">
          Dimensions
        </legend>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor={widthId}
              className="text-xs text-[var(--muted-foreground)]"
            >
              Width
            </label>
            <input
              id={widthId}
              type="number"
              value={zone.size.width}
              onChange={(e) =>
                onUpdate({
                  size: { ...zone.size, width: parseInt(e.target.value) || 1 },
                })
              }
              min={1}
              aria-label="Zone width in units"
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
            />
          </div>
          <div>
            <label
              htmlFor={heightId}
              className="text-xs text-[var(--muted-foreground)]"
            >
              Height
            </label>
            <input
              id={heightId}
              type="number"
              value={zone.size.height}
              onChange={(e) =>
                onUpdate({
                  size: { ...zone.size, height: parseInt(e.target.value) || 1 },
                })
              }
              min={1}
              aria-label="Zone height in units"
              className="w-full mt-1 px-3 py-2 text-sm rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)]/20"
            />
          </div>
        </div>
      </fieldset>

      {/* Equipment Section */}
      {zone.equipment && Array.isArray(zone.equipment) && zone.equipment.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-[var(--neon-cyan)]" />
            <h4 className="text-xs font-semibold">Equipment</h4>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {zone.equipment.map((equip: any, index: number) => {
              // Handle both old string format and new object format
              if (typeof equip === "string") {
                return (
                  <div
                    key={`equip-${index}`}
                    className="text-xs p-2 rounded bg-[var(--glass-bg)]"
                  >
                    {equip}
                  </div>
                );
              }

              return (
                <div
                  key={`equip-${index}`}
                  className="flex items-start justify-between gap-2 p-2 rounded bg-[var(--glass-bg)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{equip.name}</div>
                    {equip.price && (
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {formatCurrency(equip.price)} × {equip.quantity || 1}
                        {equip.price && equip.quantity && equip.quantity > 1 && (
                          <span className="ml-1">
                            = {formatCurrency(equip.price * equip.quantity)}
                          </span>
                        )}
                      </div>
                    )}
                    {equip.category && (
                      <div className="text-xs text-[var(--muted-foreground)] capitalize">
                        {equip.category}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const newEquipment = zone.equipment?.filter(
                        (_: any, i: number) => i !== index
                      );
                      onUpdate({ equipment: newEquipment as any });
                    }}
                    className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
                    aria-label="Remove equipment"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
