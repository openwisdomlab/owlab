"use client";

import { motion, AnimatePresence } from "framer-motion";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { moduleConnections, deckLayers, getDeckForModule } from "./module-connections";

interface StationHUDProps {
  locale: string;
  activeSystem: string | null;
  hoveredSystem: string | null;
  selectedModule: string | null;
  isDark?: boolean;
  onSystemClick: (systemId: string) => void;
}

// System status labels
const systemLabels: Record<string, { zh: string; en: string }> = {
  L01: { zh: "生命核心", en: "Life Core" },
  L02: { zh: "神经链路", en: "Neural Link" },
  L03: { zh: "通讯枢纽", en: "Comm Hub" },
  L04: { zh: "创新坞", en: "Innovation" },
};

export default function StationHUD({
  locale,
  activeSystem,
  hoveredSystem,
  selectedModule,
  isDark = true,
  onSystemClick,
}: StationHUDProps) {
  // Theme-aware colors
  const bgColor = isDark ? "#0a0a0f" : "#ffffff";
  const bgSecondary = isDark ? "#0f1419" : "#f8fafc";
  const textMuted = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(15, 23, 42, 0.5)";
  const textSubtle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(15, 23, 42, 0.4)";
  const opacityMult = isDark ? 1 : 0.7;
  // Get current deck based on selected M module
  const currentDeck = selectedModule?.startsWith("M")
    ? getDeckForModule(selectedModule)
    : null;
  const deckInfo = currentDeck ? deckLayers[currentDeck] : null;

  // Generate station time (cycles through)
  const getStationTime = () => {
    const now = new Date();
    const cycle = Math.floor((now.getHours() * 60 + now.getMinutes()) / 15) % 96;
    return `T+${String(Math.floor(cycle / 4)).padStart(2, "0")}:${String((cycle % 4) * 15).padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      {/* Main HUD container */}
      <motion.div
        className="relative px-6 py-3 rounded-lg backdrop-blur-md transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${withAlpha(bgColor, 0.9)}, ${withAlpha(bgSecondary, 0.85)})`,
          border: `1px solid ${withAlpha(isDark ? brandColors.neonCyan : brandColors.blue, 0.3 * opacityMult)}`,
          boxShadow: isDark
            ? `0 4px 20px ${withAlpha("#000", 0.5)}, inset 0 1px 0 ${withAlpha(brandColors.neonCyan, 0.1)}`
            : `0 4px 20px ${withAlpha("#000", 0.1)}, inset 0 1px 0 ${withAlpha(brandColors.blue, 0.08)}`,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-8 right-8 h-px transition-colors duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${isDark ? brandColors.neonCyan : brandColors.blue}, transparent)`,
            opacity: opacityMult,
          }}
        />

        <div className="flex items-center gap-6">
          {/* Station Time */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: brandColors.emerald }}
            />
            <span
              className="text-xs font-mono tracking-wider transition-colors duration-500"
              style={{ color: withAlpha(isDark ? brandColors.neonCyan : brandColors.blue, 0.7) }}
            >
              {getStationTime()}
            </span>
          </div>

          {/* Separator */}
          <div
            className="w-px h-6 transition-colors duration-500"
            style={{ background: withAlpha(isDark ? brandColors.neonCyan : brandColors.blue, 0.3 * opacityMult) }}
          />

          {/* System Status Indicators */}
          <div className="flex items-center gap-3">
            {Object.entries(moduleConnections).map(([systemId, data]) => {
              const isActive = activeSystem === systemId;
              const isHovered = hoveredSystem === systemId;
              const isRelated = selectedModule && data.targets.includes(selectedModule);
              const shouldHighlight = isActive || isHovered || isRelated;

              return (
                <motion.button
                  key={systemId}
                  className="flex items-center gap-1.5 px-2 py-1 rounded transition-all"
                  style={{
                    background: shouldHighlight
                      ? withAlpha(data.color, 0.2)
                      : "transparent",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSystemClick(systemId)}
                >
                  {/* Indicator light */}
                  <motion.div
                    className="relative w-2.5 h-2.5 rounded-full"
                    style={{
                      background: data.color,
                      boxShadow: shouldHighlight
                        ? `0 0 8px ${data.color}`
                        : "none",
                    }}
                    animate={
                      isActive
                        ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
                        : isHovered
                        ? { scale: [1, 1.15, 1] }
                        : { opacity: [0.4, 0.7, 0.4] }
                    }
                    transition={{
                      duration: isActive ? 0.8 : isHovered ? 0.5 : 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* System label */}
                  <span
                    className="text-[10px] font-mono uppercase tracking-wide transition-colors"
                    style={{
                      color: shouldHighlight ? data.color : textMuted,
                    }}
                  >
                    {locale === "zh" ? systemLabels[systemId].zh : systemLabels[systemId].en}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Separator */}
          <div
            className="w-px h-6 transition-colors duration-500"
            style={{ background: withAlpha(isDark ? brandColors.neonCyan : brandColors.blue, 0.3 * opacityMult) }}
          />

          {/* Current Deck Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDeck || "none"}
              className="flex items-center gap-2 min-w-[120px]"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {deckInfo ? (
                <>
                  <div
                    className="w-1.5 h-4 rounded-full"
                    style={{ background: deckInfo.color }}
                  />
                  <span
                    className="text-xs font-medium"
                    style={{ color: deckInfo.color }}
                  >
                    {locale === "zh" ? deckInfo.label.zh : deckInfo.label.en}
                  </span>
                </>
              ) : (
                <span
                  className="text-xs"
                  style={{ color: textSubtle }}
                >
                  {locale === "zh" ? "选择模块..." : "Select module..."}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom accent dots */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-colors duration-500"
              style={{
                background: withAlpha(isDark ? brandColors.neonCyan : brandColors.blue, (i === 1 ? 0.6 : 0.3) * opacityMult),
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Connection hint tooltip */}
      <AnimatePresence>
        {hoveredSystem && hoveredSystem.startsWith("L") && (
          <motion.div
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-xs transition-colors duration-500"
            style={{
              background: withAlpha(bgColor, 0.95),
              border: `1px solid ${withAlpha(moduleConnections[hoveredSystem as keyof typeof moduleConnections]?.color || "#fff", 0.3)}`,
            }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <span style={{ color: textMuted }}>
              {hoveredSystem} →{" "}
            </span>
            <span
              style={{
                color: moduleConnections[hoveredSystem as keyof typeof moduleConnections]?.color,
              }}
            >
              {moduleConnections[hoveredSystem as keyof typeof moduleConnections]?.targets.join(", ")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
