"use client";

import { motion } from "framer-motion";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { moduleConnections } from "./module-connections";

interface StationFrameProps {
  activeSystem: string | null;
  hoveredSystem: string | null;
}

// Corner airlock positions (matching L module positions)
const airlockCorners = [
  { id: "L01", position: "top-left", x: 0, y: 0 },
  { id: "L02", position: "top-right", x: 100, y: 0 },
  { id: "L03", position: "bottom-left", x: 0, y: 100 },
  { id: "L04", position: "bottom-right", x: 100, y: 100 },
];

// Rivet positions along the frame
const rivetPositions = {
  top: [10, 25, 40, 55, 70, 85],
  bottom: [10, 25, 40, 55, 70, 85],
  left: [15, 35, 55, 75],
  right: [15, 35, 55, 75],
};

export default function StationFrame({ activeSystem, hoveredSystem }: StationFrameProps) {
  const getSystemColor = (systemId: string) => {
    const conn = moduleConnections[systemId as keyof typeof moduleConnections];
    return conn?.color || brandColors.neonCyan;
  };

  const isSystemActive = (systemId: string) => {
    return activeSystem === systemId || hoveredSystem === systemId;
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Main frame border with glow */}
      <div
        className="absolute inset-4 rounded-2xl border-2 transition-all duration-500"
        style={{
          borderColor: withAlpha(brandColors.neonCyan, activeSystem ? 0.4 : 0.2),
          boxShadow: activeSystem
            ? `inset 0 0 60px ${withAlpha(getSystemColor(activeSystem), 0.1)}, 0 0 30px ${withAlpha(getSystemColor(activeSystem), 0.15)}`
            : `inset 0 0 40px ${withAlpha(brandColors.neonCyan, 0.05)}`,
        }}
      >
        {/* Inner glow line */}
        <div
          className="absolute inset-2 rounded-xl border transition-all duration-500"
          style={{
            borderColor: withAlpha(brandColors.neonCyan, 0.1),
          }}
        />

        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${withAlpha(brandColors.neonCyan, 0.5)}, transparent)`,
          }}
          animate={{
            top: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Corner Airlocks */}
      {airlockCorners.map((corner) => {
        const color = getSystemColor(corner.id);
        const isActive = isSystemActive(corner.id);

        return (
          <div
            key={corner.id}
            className={`absolute w-24 h-24 ${
              corner.position === "top-left" ? "top-0 left-0" :
              corner.position === "top-right" ? "top-0 right-0" :
              corner.position === "bottom-left" ? "bottom-0 left-0" :
              "bottom-0 right-0"
            }`}
          >
            {/* Airlock frame */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Corner bracket */}
              <path
                d={
                  corner.position === "top-left" ? "M 5 40 L 5 5 L 40 5" :
                  corner.position === "top-right" ? "M 60 5 L 95 5 L 95 40" :
                  corner.position === "bottom-left" ? "M 5 60 L 5 95 L 40 95" :
                  "M 60 95 L 95 95 L 95 60"
                }
                fill="none"
                stroke={color}
                strokeWidth={isActive ? 3 : 2}
                strokeLinecap="round"
                opacity={isActive ? 1 : 0.4}
                className="transition-all duration-300"
              />

              {/* Inner arc */}
              <path
                d={
                  corner.position === "top-left" ? "M 15 35 Q 15 15 35 15" :
                  corner.position === "top-right" ? "M 65 15 Q 85 15 85 35" :
                  corner.position === "bottom-left" ? "M 15 65 Q 15 85 35 85" :
                  "M 65 85 Q 85 85 85 65"
                }
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeDasharray={isActive ? "none" : "4 2"}
                opacity={isActive ? 0.8 : 0.2}
                className="transition-all duration-300"
              />

              {/* Airlock indicator light */}
              <motion.circle
                cx={corner.position.includes("left") ? 20 : 80}
                cy={corner.position.includes("top") ? 20 : 80}
                r={isActive ? 4 : 3}
                fill={color}
                opacity={isActive ? 1 : 0.3}
                animate={isActive ? {
                  opacity: [1, 0.5, 1],
                  r: [4, 5, 4],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Corner rivets */}
              {[0, 1, 2].map((i) => {
                const offset = i * 12 + 8;
                const cx = corner.position.includes("left") ? offset : 100 - offset;
                const cy = corner.position.includes("top") ? 8 : 92;
                return (
                  <circle
                    key={`h-${i}`}
                    cx={cx}
                    cy={cy}
                    r={1.5}
                    fill={withAlpha(color, 0.4)}
                  />
                );
              })}
              {[0, 1, 2].map((i) => {
                const offset = i * 12 + 8;
                const cx = corner.position.includes("left") ? 8 : 92;
                const cy = corner.position.includes("top") ? offset : 100 - offset;
                return (
                  <circle
                    key={`v-${i}`}
                    cx={cx}
                    cy={cy}
                    r={1.5}
                    fill={withAlpha(color, 0.4)}
                  />
                );
              })}
            </svg>

            {/* Active glow effect */}
            {isActive && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${
                    corner.position.includes("left") ? "0%" : "100%"
                  } ${
                    corner.position.includes("top") ? "0%" : "100%"
                  }, ${withAlpha(color, 0.3)}, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </div>
        );
      })}

      {/* Top edge rivets */}
      <div className="absolute top-4 left-28 right-28 h-2 flex justify-between items-center">
        {rivetPositions.top.map((pos, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: withAlpha(brandColors.neonCyan, activeSystem ? 0.5 : 0.3),
            }}
            animate={activeSystem ? {
              opacity: [0.3, 0.8, 0.3],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Bottom edge rivets */}
      <div className="absolute bottom-4 left-28 right-28 h-2 flex justify-between items-center">
        {rivetPositions.bottom.map((pos, i) => (
          <motion.div
            key={`bottom-${i}`}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: withAlpha(brandColors.neonCyan, activeSystem ? 0.5 : 0.3),
            }}
            animate={activeSystem ? {
              opacity: [0.3, 0.8, 0.3],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1 + 0.5,
            }}
          />
        ))}
      </div>

      {/* Side pipe decorations */}
      <div className="absolute left-4 top-28 bottom-28 w-2">
        <div
          className="h-full w-px mx-auto transition-all duration-500"
          style={{
            background: `linear-gradient(to bottom, transparent, ${withAlpha(brandColors.neonCyan, activeSystem ? 0.4 : 0.2)}, transparent)`,
          }}
        />
      </div>
      <div className="absolute right-4 top-28 bottom-28 w-2">
        <div
          className="h-full w-px mx-auto transition-all duration-500"
          style={{
            background: `linear-gradient(to bottom, transparent, ${withAlpha(brandColors.neonCyan, activeSystem ? 0.4 : 0.2)}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}
