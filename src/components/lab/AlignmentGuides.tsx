"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { AlignmentGuide } from "@/lib/utils/measurements";

interface AlignmentGuidesProps {
  guides: AlignmentGuide[];
  gridSize: number;
  zoom: number;
  showLabels?: boolean;
}

export function AlignmentGuides({
  guides,
  gridSize,
  zoom,
  showLabels = true,
}: AlignmentGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 90 }}
    >
      <AnimatePresence>
        {guides.map((guide, index) => {
          const key = `guide-${guide.type}-${guide.position}-${index}`;

          if (guide.type === "vertical") {
            const x = guide.position * gridSize * zoom;
            const y1 = guide.snapPoints[0].y * gridSize * zoom;
            const y2 = guide.snapPoints[1].y * gridSize * zoom;

            return (
              <motion.g
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Vertical line */}
                <motion.line
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="#22d3ee"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  className="guide-line"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Label */}
                {showLabels && (
                  <motion.g
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <rect
                      x={x - 60}
                      y={y1 - 20}
                      width={120}
                      height={18}
                      rx={3}
                      fill="#22d3ee"
                      opacity={0.9}
                    />
                    <text
                      x={x}
                      y={y1 - 7}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight="600"
                      className="select-none"
                    >
                      {guide.label}
                    </text>
                  </motion.g>
                )}

                {/* Snap indicators at endpoints */}
                <circle
                  cx={x}
                  cy={y1}
                  r={4}
                  fill="#22d3ee"
                  opacity={0.6}
                />
                <circle
                  cx={x}
                  cy={y2}
                  r={4}
                  fill="#22d3ee"
                  opacity={0.6}
                />
              </motion.g>
            );
          } else {
            // Horizontal guide
            const y = guide.position * gridSize * zoom;
            const x1 = guide.snapPoints[0].x * gridSize * zoom;
            const x2 = guide.snapPoints[1].x * gridSize * zoom;

            return (
              <motion.g
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Horizontal line */}
                <motion.line
                  x1={x1}
                  y1={y}
                  x2={x2}
                  y2={y}
                  stroke="#22d3ee"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  className="guide-line"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.2 }}
                />

                {/* Label */}
                {showLabels && (
                  <motion.g
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <rect
                      x={x1 - 5}
                      y={y - 12}
                      width={120}
                      height={18}
                      rx={3}
                      fill="#22d3ee"
                      opacity={0.9}
                    />
                    <text
                      x={x1 + 55}
                      y={y + 1}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight="600"
                      className="select-none"
                    >
                      {guide.label}
                    </text>
                  </motion.g>
                )}

                {/* Snap indicators at endpoints */}
                <circle
                  cx={x1}
                  cy={y}
                  r={4}
                  fill="#22d3ee"
                  opacity={0.6}
                />
                <circle
                  cx={x2}
                  cy={y}
                  r={4}
                  fill="#22d3ee"
                  opacity={0.6}
                />
              </motion.g>
            );
          }
        })}
      </AnimatePresence>

      {/* Add a subtle glow effect */}
      <defs>
        <filter id="alignment-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style jsx>{`
        .guide-line {
          filter: url(#alignment-glow);
        }
      `}</style>
    </svg>
  );
}
