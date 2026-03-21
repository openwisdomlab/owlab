"use client";

import { useState, useCallback } from "react";
import { Html } from "@react-three/drei";
import type { Zone3D } from "@/lib/utils/3d-preview";
import type { ZoneData } from "@/lib/ai/agents/layout-agent";

interface ZoneInfoOverlayProps {
  zones: Zone3D[];
  /** Original ZoneData for equipment lists */
  zoneData?: ZoneData[];
  visible: boolean;
  onZoneSelect?: (id: string) => void;
}

/**
 * Interactive zone information overlay.
 * Shows a floating glass-card popup on hover with zone details.
 */
export function ZoneInfoOverlay({
  zones,
  zoneData,
  visible,
  onZoneSelect,
}: ZoneInfoOverlayProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handlePointerEnter = useCallback((id: string) => {
    setHoveredId(id);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      onZoneSelect?.(id);
    },
    [onZoneSelect]
  );

  if (!visible) return null;

  return (
    <group>
      {zones.map((zone) => {
        const isHovered = hoveredId === zone.id;
        const sourceZone = zoneData?.find((z) => z.id === zone.id);
        const areaX = zone.size.x;
        const areaZ = zone.size.z;

        return (
          <group key={zone.id}>
            {/* Invisible interaction mesh covering the zone */}
            <mesh
              position={[zone.position.x, zone.position.y, zone.position.z]}
              onPointerEnter={() => handlePointerEnter(zone.id)}
              onPointerLeave={handlePointerLeave}
              onClick={() => handleClick(zone.id)}
            >
              <boxGeometry
                args={[zone.size.x + 0.2, zone.size.y + 0.2, zone.size.z + 0.2]}
              />
              <meshBasicMaterial transparent opacity={0} />
            </mesh>

            {/* Floating info label */}
            {isHovered && (
              <Html
                position={[
                  zone.position.x,
                  zone.position.y + zone.size.y / 2 + 2,
                  zone.position.z,
                ]}
                center
                distanceFactor={80}
                style={{ pointerEvents: "none" }}
              >
                <div
                  style={{
                    background: "rgba(10, 10, 30, 0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(34, 211, 238, 0.3)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    minWidth: "180px",
                    maxWidth: "260px",
                    color: "white",
                    fontFamily:
                      "system-ui, -apple-system, sans-serif",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* Zone name */}
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#22d3ee",
                      marginBottom: "6px",
                    }}
                  >
                    {zone.name}
                  </div>

                  {/* Type badge */}
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "10px",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: "rgba(139, 92, 246, 0.25)",
                      border: "1px solid rgba(139, 92, 246, 0.4)",
                      color: "#c4b5fd",
                      marginBottom: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {zone.type}
                  </div>

                  {/* Size info */}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: "4px",
                    }}
                  >
                    Size: {areaX.toFixed(1)} x {areaZ.toFixed(1)} units
                  </div>

                  {/* Equipment list */}
                  {sourceZone?.equipment && sourceZone.equipment.length > 0 && (
                    <div style={{ marginTop: "6px" }}>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.5)",
                          marginBottom: "3px",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        Equipment
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        {sourceZone.equipment.slice(0, 6).map((eq, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "10px",
                              padding: "1px 6px",
                              borderRadius: "4px",
                              background: "rgba(255,255,255,0.1)",
                              color: "rgba(255,255,255,0.8)",
                            }}
                          >
                            {eq}
                          </span>
                        ))}
                        {sourceZone.equipment.length > 6 && (
                          <span
                            style={{
                              fontSize: "10px",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            +{sourceZone.equipment.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Click hint */}
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.35)",
                      marginTop: "8px",
                      textAlign: "center",
                    }}
                  >
                    Click to select
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
