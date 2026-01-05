"use client";

import { useState, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Box,
  Download,
  Eye,
  EyeOff,
  Camera,
  Sun,
  Grid3x3,
  Loader2,
  Info,
  Maximize2,
  RotateCcw,
  Cuboid,
} from "lucide-react";

// Lazy load Canvas3D to reduce initial bundle size
const Canvas3D = lazy(() =>
  import("./Canvas3D").then((mod) => ({ default: mod.Canvas3D }))
);
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import {
  convertLayoutTo3D,
  calculateCameraPosition,
  getDefaultLighting,
  generateFloorGrid,
  exportScene3D,
  exportToOBJ,
  downloadOBJ,
  calculateBoundingBox,
  type Zone3D,
  type Camera3DSettings,
  type Light3D,
} from "@/lib/utils/3d-preview";

interface Preview3DProps {
  layout: LayoutData;
  onClose: () => void;
}

export function Preview3D({ layout, onClose }: Preview3DProps) {
  const [showZones, setShowZones] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLights, setShowLights] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [gridSize] = useState(30);
  const [wallHeight] = useState(3);

  // Convert layout to 3D
  const zones3D = useMemo(
    () => convertLayoutTo3D(layout.zones, gridSize, wallHeight),
    [layout.zones, gridSize, wallHeight]
  );

  const camera = useMemo(
    () =>
      calculateCameraPosition(
        zones3D,
        layout.dimensions.width,
        layout.dimensions.height
      ),
    [zones3D, layout.dimensions]
  );

  const lighting = useMemo(() => getDefaultLighting(), []);

  const grid = useMemo(
    () =>
      generateFloorGrid(
        layout.dimensions.width,
        layout.dimensions.height,
        gridSize
      ),
    [layout.dimensions, gridSize]
  );

  const boundingBox = useMemo(
    () => calculateBoundingBox(zones3D),
    [zones3D]
  );

  const handleExportOBJ = () => {
    const objContent = exportToOBJ(zones3D, layout.name);
    downloadOBJ(objContent, `${layout.name}_3d`);
  };

  const handleExportScene = () => {
    const scene = exportScene3D(
      layout.zones,
      layout.dimensions.width,
      layout.dimensions.height,
      gridSize,
      wallHeight,
      layout.dimensions.unit
    );

    const blob = new Blob([JSON.stringify(scene, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${layout.name}_scene3d.json`;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-[var(--neon-violet)]" />
          <h2 className="font-semibold">3D Preview</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close 3D preview"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 border-b border-[var(--glass-border)] space-y-3">
        {/* Visibility Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showZones
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
            }`}
          >
            {showZones ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
            <span className="text-sm">Zones</span>
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showGrid
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
            <span className="text-sm">Grid</span>
          </button>

          <button
            onClick={() => setShowLights(!showLights)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showLights
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm">Lights</span>
          </button>

          <button
            onClick={() => setShowCamera(!showCamera)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
              showCamera
                ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                : "border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="text-sm">Camera Info</span>
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportOBJ}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-violet)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export OBJ</span>
          </button>

          <button
            onClick={handleExportScene}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-violet)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Export Scene JSON</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 3D Preview Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden aspect-video relative"
        >
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--glass-bg)] to-[var(--background)]">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-[var(--neon-cyan)] animate-spin" />
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Loading 3D Engine...
                  </p>
                </div>
              </div>
            }
          >
            <Canvas3D
              zones={zones3D}
              camera={camera}
              lights={lighting}
              layoutWidth={layout.dimensions.width}
              layoutHeight={layout.dimensions.height}
              gridSize={gridSize}
              showZones={showZones}
              showGrid={showGrid}
            />
          </Suspense>
        </motion.div>

        {/* Scene Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-[var(--neon-cyan)]" />
            Scene Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Total Zones
              </div>
              <div className="text-lg font-bold text-[var(--neon-cyan)]">
                {zones3D.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Grid Lines
              </div>
              <div className="text-lg font-bold text-[var(--neon-cyan)]">
                {grid.lines.length}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Wall Height
              </div>
              <div className="text-lg font-bold text-[var(--neon-cyan)]">
                {wallHeight} {layout.dimensions.unit}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Grid Size
              </div>
              <div className="text-lg font-bold text-[var(--neon-cyan)]">
                {gridSize} units
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bounding Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-[var(--neon-green)]" />
            Bounding Box
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Center:</span>
              <span>
                ({boundingBox.center.x.toFixed(1)},{" "}
                {boundingBox.center.y.toFixed(1)},{" "}
                {boundingBox.center.z.toFixed(1)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Size:</span>
              <span>
                ({boundingBox.size.x.toFixed(1)},{" "}
                {boundingBox.size.y.toFixed(1)}, {boundingBox.size.z.toFixed(1)}
                )
              </span>
            </div>
          </div>
        </motion.div>

        {/* Camera Settings */}
        <AnimatePresence>
          {showCamera && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[var(--neon-violet)]" />
                Camera Settings
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    Position:
                  </span>
                  <span>
                    ({camera.position.x.toFixed(1)},{" "}
                    {camera.position.y.toFixed(1)},{" "}
                    {camera.position.z.toFixed(1)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    Target:
                  </span>
                  <span>
                    ({camera.target.x.toFixed(1)}, {camera.target.y.toFixed(1)}
                    , {camera.target.z.toFixed(1)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">FOV:</span>
                  <span>{camera.fov}°</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lighting Setup */}
        <AnimatePresence>
          {showLights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sun className="w-4 h-4 text-[var(--neon-orange)]" />
                Lighting Setup
              </h3>
              <div className="space-y-2">
                {lighting.map((light, index) => (
                  <div
                    key={index}
                    className="p-2 rounded bg-[var(--background)]/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold capitalize">
                        {light.type}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {(light.intensity * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: light.color }}
                      />
                      <span className="text-xs font-mono">{light.color}</span>
                      {light.position && (
                        <span className="text-[10px] text-[var(--muted-foreground)] ml-auto">
                          ({light.position.x}, {light.position.y},{" "}
                          {light.position.z})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zones List */}
        <AnimatePresence>
          {showZones && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4"
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Box className="w-4 h-4 text-[var(--neon-violet)]" />
                3D Zones ({zones3D.length})
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {zones3D.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-2 rounded bg-[var(--background)]/50 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">{zone.name}</span>
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          backgroundColor: zone.color,
                          opacity: zone.opacity,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-[var(--muted-foreground)] space-y-0.5">
                      <div>Type: {zone.type}</div>
                      <div className="font-mono">
                        Position: ({zone.position.x.toFixed(1)},{" "}
                        {zone.position.y.toFixed(1)},{" "}
                        {zone.position.z.toFixed(1)})
                      </div>
                      <div className="font-mono">
                        Size: ({zone.size.x.toFixed(1)},{" "}
                        {zone.size.y.toFixed(1)}, {zone.size.z.toFixed(1)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Controls Guide */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 border border-[var(--neon-cyan)]/20"
        >
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Cuboid className="w-4 h-4 text-[var(--neon-cyan)]" />
            3D Controls
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-[var(--muted-foreground)]">
            <div className="flex items-center gap-2">
              <span className="text-lg">🖱️</span>
              <span>Left Click + Drag: Rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <span>Scroll: Zoom In/Out</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">⇧</span>
              <span>Right Click + Drag: Pan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👆</span>
              <span>Click Zone: Select</span>
            </div>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-3 pt-3 border-t border-[var(--glass-border)]">
            Export formats: OBJ (3D models), JSON (scene data)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
