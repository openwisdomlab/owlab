"use client";

import { useMemo } from "react";
import * as THREE from "three";
import type { Zone3D } from "@/lib/utils/3d-preview";
import { ZONE_LIGHT_SCORES } from "@/lib/constants/zone-types";

interface LightingSimulationProps {
  zones: Zone3D[];
  layoutWidth: number;
  layoutHeight: number;
  gridSize: number;
  visible: boolean;
  opacity: number;
}


/**
 * Lighting coverage visualization.
 * Renders light cone meshes from ceiling above each zone
 * and a dim-spot overlay for coverage gaps.
 */
export function LightingSimulation({
  zones,
  layoutWidth,
  layoutHeight,
  gridSize,
  visible,
  opacity,
}: LightingSimulationProps) {
  const widthUnits = layoutWidth * gridSize;
  const heightUnits = layoutHeight * gridSize;
  const ceilingHeight = 6; // Units above floor

  // Compute light fixtures: one per zone center, size proportional to zone area
  const fixtures = useMemo(() => {
    return zones.map((zone) => {
      const { score, warmth } = (ZONE_LIGHT_SCORES as Record<string, { score: number; warmth: "warm" | "cool" }>)[zone.type] ?? {
        score: 0.5,
        warmth: "cool" as const,
      };
      const color = warmth === "warm" ? "#fbbf24" : "#e0f2fe";
      const radiusTop = 0.3;
      const radiusBottom = Math.min(zone.size.x, zone.size.z) * 0.4;
      const coneHeight = ceilingHeight - 0.1;

      return {
        id: zone.id,
        position: [zone.position.x, ceilingHeight, zone.position.z] as [number, number, number],
        radiusTop,
        radiusBottom,
        coneHeight,
        color,
        score,
        zone,
      };
    });
  }, [zones, ceilingHeight]);

  // Compute coverage gap texture
  const gapTexture = useMemo(() => {
    const RES = 64;
    const canvas = document.createElement("canvas");
    canvas.width = RES;
    canvas.height = RES;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, RES, RES);

    // Build a coverage map: 1 = fully lit, 0 = dark
    const coverage = new Float32Array(RES * RES);

    for (const fixture of fixtures) {
      const cu = fixture.position[0] / widthUnits;
      const cv = fixture.position[2] / heightUnits;
      const radius = (fixture.radiusBottom / Math.max(widthUnits, heightUnits)) * 1.2;

      for (let py = 0; py < RES; py++) {
        for (let px = 0; px < RES; px++) {
          const u = px / RES;
          const v = py / RES;
          const d = Math.hypot(u - cu, v - cv);
          if (d < radius) {
            const falloff = 1 - d / radius;
            coverage[py * RES + px] = Math.min(
              coverage[py * RES + px] + falloff * fixture.score,
              1
            );
          }
        }
      }
    }

    // Render gap areas as dim blue-gray
    const imageData = ctx.createImageData(RES, RES);
    for (let i = 0; i < RES * RES; i++) {
      const lit = coverage[i];
      if (lit < 0.3) {
        // Dim spot
        const alpha = (0.3 - lit) / 0.3;
        imageData.data[i * 4 + 0] = 40;
        imageData.data[i * 4 + 1] = 40;
        imageData.data[i * 4 + 2] = 80;
        imageData.data[i * 4 + 3] = Math.round(alpha * 160);
      }
    }
    ctx.putImageData(imageData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [fixtures, widthUnits, heightUnits]);

  if (!visible) return null;

  return (
    <group>
      {/* Light cones from ceiling */}
      {fixtures.map((f) => (
        <group key={f.id}>
          {/* Cone mesh */}
          <mesh
            position={[
              f.position[0],
              ceilingHeight - f.coneHeight / 2,
              f.position[2],
            ]}
          >
            <cylinderGeometry
              args={[f.radiusTop, f.radiusBottom, f.coneHeight, 16, 1, true]}
            />
            <meshBasicMaterial
              color={f.color}
              transparent
              opacity={opacity * 0.15 * f.score}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Light source indicator (small sphere at ceiling) */}
          <mesh position={f.position}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial
              color={f.color}
              transparent
              opacity={opacity * 0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Coverage gap overlay on floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[widthUnits / 2, 0.03, heightUnits / 2]}
      >
        <planeGeometry args={[widthUnits, heightUnits]} />
        <meshBasicMaterial
          map={gapTexture}
          transparent
          opacity={opacity * 0.6}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
