/**
 * Procedural Furniture — R3F components for common lab equipment.
 * Generates 3D meshes from parameters without external model files.
 */

"use client";

import { type ModelConfig, getEquipmentModel } from "./model-catalog";
import { getMaterialForEquipment } from "./material-library";

interface ProceduralModelProps {
  config: ModelConfig;
  position: [number, number, number];
  rotation?: [number, number, number];
}

/** Render a single procedural model */
export function ProceduralModel({ config, position, rotation = [0, 0, 0] }: ProceduralModelProps) {
  const material = getMaterialForEquipment(config.material);

  if (config.type === "cylinder") {
    return (
      <mesh position={position} rotation={rotation}>
        <cylinderGeometry args={[config.width / 2, config.width / 2, config.height, 16]} />
        <meshStandardMaterial
          color={config.color}
          roughness={material.roughness}
          metalness={material.metalness}
        />
      </mesh>
    );
  }

  // Default: box
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[config.width, config.height, config.depth]} />
      <meshStandardMaterial
        color={config.color}
        roughness={material.roughness}
        metalness={material.metalness}
        transparent={material.transparent}
        opacity={material.opacity}
      />
    </mesh>
  );
}

interface EquipmentModelProps {
  equipmentName: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}

/** Render equipment by name with auto-matched model */
export function EquipmentModel({ equipmentName, position, rotation }: EquipmentModelProps) {
  const config = getEquipmentModel(equipmentName);
  // Lift the model so it sits on the floor (y = half height)
  const adjustedPosition: [number, number, number] = [
    position[0],
    position[1] + config.height / 2,
    position[2],
  ];
  return <ProceduralModel config={config} position={adjustedPosition} rotation={rotation} />;
}
