"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Line } from "@react-three/drei";
import * as THREE from "three";
import type { Zone3D, Light3D, Vector3 } from "@/lib/utils/3d-preview";

interface Zone3DMeshProps {
  zone: Zone3D;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

function Zone3DMesh({ zone, isSelected, onSelect }: Zone3DMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle hover animation
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.position.y =
        zone.position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group>
      {/* Main box */}
      <mesh
        ref={meshRef}
        position={[zone.position.x, zone.position.y, zone.position.z]}
        onClick={() => onSelect?.(zone.id)}
      >
        <boxGeometry args={[zone.size.x, zone.size.y, zone.size.z]} />
        <meshStandardMaterial
          color={zone.color}
          transparent
          opacity={isSelected ? 0.9 : zone.opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe outline */}
      <mesh position={[zone.position.x, zone.position.y, zone.position.z]}>
        <boxGeometry args={[zone.size.x, zone.size.y, zone.size.z]} />
        <meshBasicMaterial
          color={isSelected ? "#22d3ee" : "#ffffff"}
          wireframe
          transparent
          opacity={isSelected ? 0.8 : 0.3}
        />
      </mesh>

      {/* Zone label */}
      <Text
        position={[zone.position.x, zone.position.y + zone.size.y / 2 + 0.5, zone.position.z]}
        fontSize={1.5}
        color={isSelected ? "#22d3ee" : "#ffffff"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {zone.name}
      </Text>
    </group>
  );
}

interface FloorGridProps {
  width: number;
  height: number;
  gridSize: number;
  visible?: boolean;
}

function FloorGrid({ width, height, gridSize, visible = true }: FloorGridProps) {
  if (!visible) return null;

  const widthInUnits = width * gridSize;
  const heightInUnits = height * gridSize;
  const lines: Array<[Vector3, Vector3]> = [];

  // Vertical lines
  for (let x = 0; x <= width; x++) {
    lines.push([
      { x: x * gridSize, y: 0, z: 0 },
      { x: x * gridSize, y: 0, z: heightInUnits },
    ]);
  }

  // Horizontal lines
  for (let z = 0; z <= height; z++) {
    lines.push([
      { x: 0, y: 0, z: z * gridSize },
      { x: widthInUnits, y: 0, z: z * gridSize },
    ]);
  }

  return (
    <group>
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[widthInUnits / 2, -0.01, heightInUnits / 2]}>
        <planeGeometry args={[widthInUnits, heightInUnits]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>

      {/* Grid lines */}
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[
            [line[0].x, line[0].y, line[0].z],
            [line[1].x, line[1].y, line[1].z],
          ]}
          color="#4a5568"
          lineWidth={1}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

interface Scene3DLightingProps {
  lights: Light3D[];
}

function Scene3DLighting({ lights }: Scene3DLightingProps) {
  return (
    <>
      {lights.map((light, index) => {
        if (light.type === "ambient") {
          return (
            <ambientLight
              key={`ambient-${index}`}
              color={light.color}
              intensity={light.intensity}
            />
          );
        }
        if (light.type === "directional" && light.position) {
          return (
            <directionalLight
              key={`directional-${index}`}
              position={[light.position.x, light.position.y, light.position.z]}
              color={light.color}
              intensity={light.intensity}
              castShadow
            />
          );
        }
        if (light.type === "point" && light.position) {
          return (
            <pointLight
              key={`point-${index}`}
              position={[light.position.x, light.position.y, light.position.z]}
              color={light.color}
              intensity={light.intensity}
              distance={100}
            />
          );
        }
        return null;
      })}
    </>
  );
}

export interface Scene3DRendererProps {
  zones: Zone3D[];
  lights: Light3D[];
  layoutWidth: number;
  layoutHeight: number;
  gridSize: number;
  showZones?: boolean;
  showGrid?: boolean;
  selectedZoneId?: string;
  onZoneSelect?: (id: string) => void;
}

export function Scene3DRenderer({
  zones,
  lights,
  layoutWidth,
  layoutHeight,
  gridSize,
  showZones = true,
  showGrid = true,
  selectedZoneId,
  onZoneSelect,
}: Scene3DRendererProps) {
  return (
    <>
      {/* Lighting */}
      <Scene3DLighting lights={lights} />

      {/* Floor Grid */}
      <FloorGrid
        width={layoutWidth}
        height={layoutHeight}
        gridSize={gridSize}
        visible={showGrid}
      />

      {/* Zones */}
      {showZones &&
        zones.map((zone) => (
          <Zone3DMesh
            key={zone.id}
            zone={zone}
            isSelected={zone.id === selectedZoneId}
            onSelect={onZoneSelect}
          />
        ))}
    </>
  );
}
