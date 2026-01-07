"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { moduleConnections } from "./module-connections";

interface EnvironmentEffectsProps {
  activeSystem: string | null;
  isDark?: boolean;
}

// Floating debris configuration
const debrisConfig = [
  { id: 1, size: 3, duration: 25, startX: -5, endX: 105, y: 20 },
  { id: 2, size: 2, duration: 30, startX: 105, endX: -5, y: 45 },
  { id: 3, size: 4, duration: 35, startX: -5, endX: 105, y: 70 },
  { id: 4, size: 2, duration: 28, startX: 105, endX: -5, y: 85 },
];

export default function EnvironmentEffects({ activeSystem, isDark = true }: EnvironmentEffectsProps) {
  const [breathPhase, setBreathPhase] = useState(0);

  // Theme-aware opacity
  const opacityMult = isDark ? 1 : 0.5;

  // Compute ambient color based on active system
  const ambientColor = useMemo(() => {
    if (activeSystem && moduleConnections[activeSystem as keyof typeof moduleConnections]) {
      return moduleConnections[activeSystem as keyof typeof moduleConnections].color;
    }
    return isDark ? brandColors.neonCyan : brandColors.blue;
  }, [activeSystem, isDark]);

  // Breathing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const breathIntensity = 0.3 + Math.sin(breathPhase * 0.0628) * 0.1;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Ambient edge glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={ambientColor}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top edge glow */}
          <div
            className="absolute top-0 left-0 right-0 h-32 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to bottom, ${withAlpha(ambientColor, breathIntensity * 0.15 * opacityMult)}, transparent)`,
              opacity: activeSystem ? 1 : 0.5,
            }}
          />
          {/* Bottom edge glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to top, ${withAlpha(ambientColor, breathIntensity * 0.15 * opacityMult)}, transparent)`,
              opacity: activeSystem ? 1 : 0.5,
            }}
          />
          {/* Left edge glow */}
          <div
            className="absolute top-0 bottom-0 left-0 w-32 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to right, ${withAlpha(ambientColor, breathIntensity * 0.1 * opacityMult)}, transparent)`,
              opacity: activeSystem ? 1 : 0.5,
            }}
          />
          {/* Right edge glow */}
          <div
            className="absolute top-0 bottom-0 right-0 w-32 transition-opacity duration-500"
            style={{
              background: `linear-gradient(to left, ${withAlpha(ambientColor, breathIntensity * 0.1 * opacityMult)}, transparent)`,
              opacity: activeSystem ? 1 : 0.5,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Corner energy nodes */}
      {Object.entries(moduleConnections).map(([systemId, data]) => {
        const isActive = activeSystem === systemId;
        const positions: Record<string, { x: string; y: string }> = {
          L01: { x: "5%", y: "5%" },
          L02: { x: "95%", y: "5%" },
          L03: { x: "5%", y: "95%" },
          L04: { x: "95%", y: "95%" },
        };
        const pos = positions[systemId];

        return (
          <div
            key={systemId}
            className="absolute"
            style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)" }}
          >
            {/* Energy pulse rings */}
            {isActive && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border"
                    style={{
                      borderColor: data.color,
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ width: 0, height: 0, opacity: 0.8, x: "-50%", y: "-50%" }}
                    animate={{
                      width: [0, 100, 150],
                      height: [0, 100, 150],
                      opacity: [0.8, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}

            {/* Static glow */}
            <div
              className="w-8 h-8 rounded-full transition-all duration-500"
              style={{
                background: `radial-gradient(circle, ${withAlpha(data.color, isActive ? 0.5 : 0.2)}, transparent)`,
                boxShadow: isActive ? `0 0 30px ${withAlpha(data.color, 0.5)}` : "none",
              }}
            />
          </div>
        );
      })}

      {/* SVG Pipe decorations */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          {Object.entries(moduleConnections).map(([systemId, data]) => (
            <linearGradient
              key={`pipe-grad-${systemId}`}
              id={`pipe-gradient-${systemId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={withAlpha(data.color, 0.1)} />
              <stop offset="50%" stopColor={withAlpha(data.color, 0.3)} />
              <stop offset="100%" stopColor={withAlpha(data.color, 0.1)} />
            </linearGradient>
          ))}
        </defs>

        {/* Corner to center pipes */}
        {[
          { id: "L01", d: "M 60 60 Q 120 60 120 120 L 120 200", x1: 60, y1: 60, x2: 120, y2: 200 },
          { id: "L02", d: "M 100% 60 Q calc(100% - 60) 60 calc(100% - 60) 120 L calc(100% - 60) 200", x1: "calc(100% - 60px)", y1: 60 },
          { id: "L03", d: "M 60 100% Q 120 calc(100% - 60) 120 calc(100% - 120) L 120 calc(100% - 200)", x1: 60, y1: "calc(100% - 60px)" },
          { id: "L04", d: "M 100% 100% Q calc(100% - 60) calc(100% - 60) calc(100% - 60) calc(100% - 120)", x1: "calc(100% - 60px)", y1: "calc(100% - 60px)" },
        ].map((pipe) => {
          const data = moduleConnections[pipe.id as keyof typeof moduleConnections];
          const isActive = activeSystem === pipe.id;

          return (
            <g key={pipe.id}>
              {/* Pipe path - using fixed coordinates */}
              <motion.path
                d={
                  pipe.id === "L01" ? "M 60 60 Q 120 60 120 120 L 120 280" :
                  pipe.id === "L02" ? "M 1140 60 Q 1080 60 1080 120 L 1080 280" :
                  pipe.id === "L03" ? "M 60 740 Q 120 740 120 680 L 120 520" :
                  "M 1140 740 Q 1080 740 1080 680 L 1080 520"
                }
                fill="none"
                stroke={data.color}
                strokeWidth={isActive ? 3 : 1.5}
                strokeDasharray={isActive ? "none" : "8 4"}
                opacity={isActive ? 0.6 : 0.15}
                className="transition-all duration-500"
              />

              {/* Energy flow particles */}
              {isActive && (
                <motion.circle
                  r={4}
                  fill={data.color}
                  filter="url(#glow)"
                  animate={{
                    offsetDistance: ["0%", "100%"],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    offsetPath: `path('${
                      pipe.id === "L01" ? "M 60 60 Q 120 60 120 120 L 120 280" :
                      pipe.id === "L02" ? "M 1140 60 Q 1080 60 1080 120 L 1080 280" :
                      pipe.id === "L03" ? "M 60 740 Q 120 740 120 680 L 120 520" :
                      "M 1140 740 Q 1080 740 1080 680 L 1080 520"
                    }')`,
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating debris */}
      {debrisConfig.map((debris) => (
        <motion.div
          key={debris.id}
          className="absolute rounded-full"
          style={{
            width: debris.size,
            height: debris.size,
            background: withAlpha("#fff", 0.3),
            top: `${debris.y}%`,
            boxShadow: `0 0 ${debris.size * 2}px ${withAlpha("#fff", 0.2)}`,
          }}
          animate={{
            left: [`${debris.startX}%`, `${debris.endX}%`],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: debris.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Distant planet/earth arc (bottom right) */}
      <div
        className="absolute -bottom-[400px] -right-[400px] w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${withAlpha(brandColors.neonCyan, 0.3)}, ${withAlpha(brandColors.violet, 0.1)}, transparent 70%)`,
          filter: "blur(2px)",
        }}
      />

      {/* Atmosphere glow on planet */}
      <div
        className="absolute -bottom-[380px] -right-[380px] w-[760px] h-[760px] rounded-full opacity-30"
        style={{
          border: `2px solid ${withAlpha(brandColors.neonCyan, 0.2)}`,
          boxShadow: `inset 0 0 100px ${withAlpha(brandColors.neonCyan, 0.1)}`,
        }}
      />
    </div>
  );
}
