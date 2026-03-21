"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Zone3D } from "@/lib/utils/3d-preview";

interface HeatmapOverlayProps {
  zones: Zone3D[];
  layoutWidth: number;
  layoutHeight: number;
  gridSize: number;
  visible: boolean;
  opacity: number;
}

/**
 * Foot traffic density visualization rendered as a transparent plane
 * with a CanvasTexture heatmap. Higher density near entrances,
 * collaboration zones, and pathways between zones.
 *
 * Color gradient: blue (low) -> green -> yellow -> red (high)
 */
export function HeatmapOverlay({
  zones,
  layoutWidth,
  layoutHeight,
  gridSize,
  visible,
  opacity,
}: HeatmapOverlayProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const phaseRef = useRef(0);

  const widthUnits = layoutWidth * gridSize;
  const heightUnits = layoutHeight * gridSize;

  // Resolution of the heatmap texture
  const RES = 128;

  // Build the heatmap CanvasTexture (memoized on zone/layout changes)
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = RES;
    canvas.height = RES;
    const ctx = canvas.getContext("2d")!;

    // Clear to transparent
    ctx.clearRect(0, 0, RES, RES);

    // Compute heat sources from zones
    const sources: Array<{ u: number; v: number; weight: number }> = [];

    zones.forEach((zone) => {
      const cx = zone.position.x / widthUnits;
      const cz = zone.position.z / heightUnits;

      // Weight based on zone type
      let weight = 0.4;
      if (zone.type === "entrance") weight = 1.0;
      else if (zone.type === "meeting") weight = 0.8;
      else if (zone.type === "workspace") weight = 0.6;
      else if (zone.type === "compute") weight = 0.5;
      else if (zone.type === "utility") weight = 0.2;
      else if (zone.type === "storage") weight = 0.15;

      sources.push({ u: cx, v: cz, weight });

      // Add corner hotspots (doorways / edges)
      const halfW = (zone.size.x / widthUnits) * 0.5;
      const halfH = (zone.size.z / heightUnits) * 0.5;
      const edgeWeight = weight * 0.5;
      sources.push({ u: cx - halfW, v: cz, weight: edgeWeight });
      sources.push({ u: cx + halfW, v: cz, weight: edgeWeight });
      sources.push({ u: cx, v: cz - halfH, weight: edgeWeight });
      sources.push({ u: cx, v: cz + halfH, weight: edgeWeight });
    });

    // Add pathway heat between nearby zone pairs
    for (let i = 0; i < zones.length; i++) {
      for (let j = i + 1; j < zones.length; j++) {
        const a = zones[i];
        const b = zones[j];
        const dist = Math.hypot(
          a.position.x - b.position.x,
          a.position.z - b.position.z
        );
        // Only connect zones that are reasonably close
        if (dist < widthUnits * 0.5) {
          const steps = 5;
          for (let s = 1; s < steps; s++) {
            const t = s / steps;
            sources.push({
              u:
                (a.position.x + (b.position.x - a.position.x) * t) /
                widthUnits,
              v:
                (a.position.z + (b.position.z - a.position.z) * t) /
                heightUnits,
              weight: 0.25,
            });
          }
        }
      }
    }

    // Rasterize heat to a float buffer
    const heatBuf = new Float32Array(RES * RES);
    const radius = 0.15; // Influence radius in UV space

    for (let py = 0; py < RES; py++) {
      for (let px = 0; px < RES; px++) {
        const u = px / RES;
        const v = py / RES;
        let heat = 0;
        for (const src of sources) {
          const d = Math.hypot(u - src.u, v - src.v);
          if (d < radius) {
            heat += src.weight * (1 - d / radius);
          }
        }
        heatBuf[py * RES + px] = Math.min(heat, 1);
      }
    }

    // Convert heat buffer to RGBA with gradient:
    // blue(0) -> cyan(0.25) -> green(0.5) -> yellow(0.75) -> red(1)
    const imageData = ctx.createImageData(RES, RES);
    for (let i = 0; i < RES * RES; i++) {
      const h = heatBuf[i];
      const [r, g, b] = heatColor(h);
      const alpha = h > 0.02 ? Math.min(h * 1.5, 0.85) * 255 : 0;
      imageData.data[i * 4 + 0] = r;
      imageData.data[i * 4 + 1] = g;
      imageData.data[i * 4 + 2] = b;
      imageData.data[i * 4 + 3] = alpha;
    }
    ctx.putImageData(imageData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [zones, widthUnits, heightUnits]);

  // Animate a gentle pulsing opacity
  useFrame((_, delta) => {
    if (!visible || !materialRef.current) return;
    phaseRef.current += delta * 1.2;
    const pulse = 0.85 + 0.15 * Math.sin(phaseRef.current);
    materialRef.current.opacity = opacity * pulse;
  });

  if (!visible) return null;

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[widthUnits / 2, 0.05, heightUnits / 2]}
    >
      <planeGeometry args={[widthUnits, heightUnits]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Convert a 0-1 heat value to an RGB triplet (0-255). */
function heatColor(t: number): [number, number, number] {
  // 5-stop gradient: blue -> cyan -> green -> yellow -> red
  if (t < 0.25) {
    const s = t / 0.25;
    return [0, Math.round(s * 255), 255];
  } else if (t < 0.5) {
    const s = (t - 0.25) / 0.25;
    return [0, 255, Math.round((1 - s) * 255)];
  } else if (t < 0.75) {
    const s = (t - 0.5) / 0.25;
    return [Math.round(s * 255), 255, 0];
  } else {
    const s = (t - 0.75) / 0.25;
    return [255, Math.round((1 - s) * 255), 0];
  }
}
