"use client";

import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stars,
  Html,
} from "@react-three/drei";
import { Loader2 } from "lucide-react";
import { Scene3DRenderer } from "./Scene3DRenderer";
import type { Zone3D, Camera3DSettings, Light3D } from "@/lib/utils/3d-preview";

interface Canvas3DProps {
  zones: Zone3D[];
  camera: Camera3DSettings;
  lights: Light3D[];
  layoutWidth: number;
  layoutHeight: number;
  gridSize: number;
  showZones?: boolean;
  showGrid?: boolean;
  onZoneSelect?: (id: string) => void;
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--neon-cyan)]" />
        <span className="text-sm">Loading 3D Scene...</span>
      </div>
    </Html>
  );
}

export function Canvas3D({
  zones,
  camera,
  lights,
  layoutWidth,
  layoutHeight,
  gridSize,
  showZones = true,
  showGrid = true,
  onZoneSelect,
}: Canvas3DProps) {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const handleZoneSelect = useCallback(
    (id: string) => {
      setSelectedZoneId((prev) => (prev === id ? null : id));
      onZoneSelect?.(id);
    },
    [onZoneSelect]
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] rounded-lg overflow-hidden">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[camera.position.x, camera.position.y, camera.position.z]}
            fov={camera.fov}
          />

          {/* Controls */}
          <OrbitControls
            target={[camera.target.x, camera.target.y, camera.target.z]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={500}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2 - 0.1}
          />

          {/* Environment */}
          <Environment preset="night" />
          <Stars
            radius={300}
            depth={60}
            count={1000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Fog for depth */}
          <fog attach="fog" args={["#0a0a1a", 100, 500]} />

          {/* Scene Content */}
          <Scene3DRenderer
            zones={zones}
            lights={lights}
            layoutWidth={layoutWidth}
            layoutHeight={layoutHeight}
            gridSize={gridSize}
            showZones={showZones}
            showGrid={showGrid}
            selectedZoneId={selectedZoneId || undefined}
            onZoneSelect={handleZoneSelect}
          />
        </Suspense>
      </Canvas>

      {/* Controls hint overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-white/50 space-y-1">
        <div>🖱️ Drag: Rotate</div>
        <div>⚙️ Scroll: Zoom</div>
        <div>⇧ Shift+Drag: Pan</div>
      </div>

      {/* Selected zone info */}
      {selectedZoneId && (
        <div className="absolute top-4 right-4 bg-black/70 rounded-lg p-3 text-white text-sm">
          <div className="font-semibold text-[var(--neon-cyan)]">
            {zones.find((z) => z.id === selectedZoneId)?.name}
          </div>
          <div className="text-xs text-white/70 mt-1">
            {zones.find((z) => z.id === selectedZoneId)?.type}
          </div>
        </div>
      )}
    </div>
  );
}
