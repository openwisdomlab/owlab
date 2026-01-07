"use client";

import { motion } from "framer-motion";
import { withAlpha } from "@/lib/brand/colors";

interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
  colorRgb: string;
  isActive: boolean;
  isHighlighted: boolean;
  id: string;
}

export default function ConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  color,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  colorRgb: _colorRgb,
  isActive,
  isHighlighted,
  id,
}: ConnectionLineProps) {
  // Calculate bezier curve control points for smooth path
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  // Determine curve direction based on relative positions
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control point offset for curve
  const curveOffset = Math.min(distance * 0.3, 80);

  // Path for connection line with curve
  let pathD: string;
  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal dominant - curve vertically
    pathD = `M ${fromX} ${fromY} Q ${midX} ${fromY} ${midX} ${midY} Q ${midX} ${toY} ${toX} ${toY}`;
  } else {
    // Vertical dominant - curve horizontally
    const controlX = fromX < toX ? fromX + curveOffset : fromX - curveOffset;
    pathD = `M ${fromX} ${fromY} Q ${controlX} ${midY} ${toX} ${toY}`;
  }

  const lineOpacity = isHighlighted ? 1 : isActive ? 0.6 : 0.25;
  const lineWidth = isHighlighted ? 3 : isActive ? 2 : 1.5;
  const particleCount = isHighlighted ? 3 : isActive ? 2 : 1;

  return (
    <g id={`connection-${id}`}>
      {/* Gradient definition */}
      <defs>
        <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={withAlpha(color, 0.3)} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={withAlpha(color, 0.3)} />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow line (when highlighted) */}
      {isHighlighted && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.15}
          filter={`url(#glow-${id})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Main connection line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={`url(#gradient-${id})`}
        strokeWidth={lineWidth}
        strokeLinecap="round"
        strokeDasharray={isHighlighted ? "none" : "8 4"}
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{
          opacity: lineOpacity,
          pathLength: 1,
          strokeDashoffset: isHighlighted ? 0 : [0, -24],
        }}
        transition={{
          opacity: { duration: 0.3 },
          pathLength: { duration: 0.8, delay: 0.2 },
          strokeDashoffset: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      />

      {/* Energy particles flowing along the path */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.circle
          key={`particle-${id}-${i}`}
          r={isHighlighted ? 5 : 3}
          fill={color}
          filter={`url(#glow-${id})`}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            offsetDistance: ["0%", "100%"],
          }}
          transition={{
            duration: isHighlighted ? 1.5 : 3,
            repeat: Infinity,
            ease: "linear",
            delay: i * (isHighlighted ? 0.5 : 1),
          }}
          style={{
            offsetPath: `path('${pathD}')`,
          }}
        />
      ))}

      {/* Pulse at source when highlighted */}
      {isHighlighted && (
        <motion.circle
          cx={fromX}
          cy={fromY}
          r={6}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </g>
  );
}

// Component for rendering all connections from L modules to M modules
interface ConnectionsLayerProps {
  connections: {
    lId: string;
    mId: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    color: string;
    colorRgb: string;
  }[];
  hoveredModule: string | null;
  selectedModule: string | null;
}

export function ConnectionsLayer({
  connections,
  hoveredModule,
  selectedModule,
}: ConnectionsLayerProps) {
  return (
    <g id="connections-layer">
      {connections.map((conn) => {
        // Determine if this connection should be highlighted
        const isHighlighted =
          hoveredModule === conn.lId ||
          hoveredModule === conn.mId ||
          selectedModule === conn.lId ||
          selectedModule === conn.mId;

        // Determine if this connection is "active" (related to hovered module)
        const isActive =
          !hoveredModule ||
          hoveredModule === conn.lId ||
          hoveredModule === conn.mId;

        return (
          <ConnectionLine
            key={`${conn.lId}-${conn.mId}`}
            id={`${conn.lId}-${conn.mId}`}
            fromX={conn.fromX}
            fromY={conn.fromY}
            toX={conn.toX}
            toY={conn.toY}
            color={conn.color}
            colorRgb={conn.colorRgb}
            isActive={isActive}
            isHighlighted={isHighlighted}
          />
        );
      })}
    </g>
  );
}
