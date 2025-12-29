"use client";

import { Suspense, useState, useCallback, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Stars,
  Html,
  PointerLockControls,
} from "@react-three/drei";
import { Loader2, Eye, Move3d } from "lucide-react";
import { Scene3DRenderer } from "./Scene3DRenderer";
import type { Zone3D, Camera3DSettings, Light3D } from "@/lib/utils/3d-preview";
import * as THREE from "three";

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

// WASD Walk Controls Component
interface WalkControlsProps {
  enabled: boolean;
  moveSpeed?: number;
  onExit?: () => void;
}

function WalkControls({ enabled, moveSpeed = 0.5, onExit }: WalkControlsProps) {
  const { camera } = useThree();
  const controlsRef = useRef<typeof PointerLockControls>(null);
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
  });
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = true;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = true;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = true;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = true;
          break;
        case "Space":
          moveState.current.up = true;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          moveState.current.down = true;
          break;
        case "Escape":
          onExit?.();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          moveState.current.forward = false;
          break;
        case "KeyS":
        case "ArrowDown":
          moveState.current.backward = false;
          break;
        case "KeyA":
        case "ArrowLeft":
          moveState.current.left = false;
          break;
        case "KeyD":
        case "ArrowRight":
          moveState.current.right = false;
          break;
        case "Space":
          moveState.current.up = false;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          moveState.current.down = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      // Reset move state on cleanup
      moveState.current = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
      };
    };
  }, [enabled, onExit]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed = moveSpeed * delta * 60;
    direction.current.set(0, 0, 0);

    // Get camera's forward direction (ignoring Y for horizontal movement)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    // Right vector
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Apply movement based on key state
    if (moveState.current.forward) {
      direction.current.add(forward);
    }
    if (moveState.current.backward) {
      direction.current.sub(forward);
    }
    if (moveState.current.left) {
      direction.current.sub(right);
    }
    if (moveState.current.right) {
      direction.current.add(right);
    }
    if (moveState.current.up) {
      direction.current.y += 1;
    }
    if (moveState.current.down) {
      direction.current.y -= 1;
    }

    if (direction.current.length() > 0) {
      direction.current.normalize();
      velocity.current.lerp(direction.current.multiplyScalar(speed), 0.2);
      camera.position.add(velocity.current);
    } else {
      velocity.current.multiplyScalar(0.9); // Decelerate
      if (velocity.current.length() > 0.001) {
        camera.position.add(velocity.current);
      }
    }
  });

  if (!enabled) return null;

  return (
    <PointerLockControls
      ref={controlsRef as React.RefObject<never>}
      onUnlock={() => onExit?.()}
    />
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
  const [walkMode, setWalkMode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoneSelect = useCallback(
    (id: string) => {
      setSelectedZoneId((prev) => (prev === id ? null : id));
      onZoneSelect?.(id);
    },
    [onZoneSelect]
  );

  const enterWalkMode = useCallback(() => {
    setWalkMode(true);
    // Request pointer lock on the canvas
    canvasRef.current?.querySelector("canvas")?.requestPointerLock();
  }, []);

  const exitWalkMode = useCallback(() => {
    setWalkMode(false);
    document.exitPointerLock();
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] rounded-lg overflow-hidden"
    >
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={<LoadingFallback />}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[camera.position.x, camera.position.y, camera.position.z]}
            fov={camera.fov}
          />

          {/* Orbit Controls - disabled during walk mode */}
          {!walkMode && (
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
          )}

          {/* Walk Controls - WASD movement with pointer lock */}
          <WalkControls enabled={walkMode} moveSpeed={0.8} onExit={exitWalkMode} />

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

      {/* Mode toggle button */}
      <button
        onClick={walkMode ? exitWalkMode : enterWalkMode}
        className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          walkMode
            ? "bg-[var(--neon-cyan)]/20 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/50"
            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20"
        }`}
        title={walkMode ? "Exit walk mode (ESC)" : "Enter walk mode"}
      >
        {walkMode ? (
          <>
            <Eye className="w-4 h-4" />
            <span>Orbit Mode</span>
          </>
        ) : (
          <>
            <Move3d className="w-4 h-4" />
            <span>Walk Mode</span>
          </>
        )}
      </button>

      {/* Controls hint overlay */}
      <div className="absolute bottom-4 left-4 text-xs text-white/50 space-y-1">
        {walkMode ? (
          <>
            <div className="text-[var(--neon-cyan)] font-medium mb-1">
              Walk Mode
            </div>
            <div>W/S: Forward/Back</div>
            <div>A/D: Strafe Left/Right</div>
            <div>Space: Up</div>
            <div>Shift: Down</div>
            <div>Mouse: Look Around</div>
            <div className="mt-1 text-white/30">ESC: Exit</div>
          </>
        ) : (
          <>
            <div>Drag: Rotate</div>
            <div>Scroll: Zoom</div>
            <div>Shift+Drag: Pan</div>
          </>
        )}
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
