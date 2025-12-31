"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { LinkAssessment } from "@/lib/schemas/allen-curve";
import {
  STATUS_COLORS,
  STATUS_LINE_WIDTHS,
  STATUS_LABELS,
  INTENSITY_LABELS,
} from "@/lib/schemas/allen-curve";
import {
  DISTANCE_THRESHOLDS,
  getZoneCenter,
} from "@/lib/utils/allen-curve-calculator";

interface AllenCurveOverlayProps {
  layout: LayoutData;
  assessments: LinkAssessment[];
  selectedZoneId: string | null;
  zoom: number;
  gridSize: number;
  hoveredLinkId?: string | null;
  onLinkHover?: (linkId: string | null) => void;
  onLinkClick?: (linkId: string) => void;
}

interface TooltipData {
  x: number;
  y: number;
  sourceName: string;
  targetName: string;
  distance: number;
  efficiency: number;
  status: string;
  intensity: string;
}

/**
 * Calculate a bezier control point for curved lines
 */
function getBezierControlPoint(
  start: { x: number; y: number },
  end: { x: number; y: number },
  curvature: number = 0.2
): { x: number; y: number } {
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Perpendicular offset for curve
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // Normalize and rotate 90 degrees
  const nx = -dy / length;
  const ny = dx / length;

  return {
    x: midX + nx * length * curvature,
    y: midY + ny * length * curvature,
  };
}

/**
 * Generate a bezier path string
 */
function getBezierPath(
  start: { x: number; y: number },
  end: { x: number; y: number },
  controlPoint: { x: number; y: number }
): string {
  return `M ${start.x} ${start.y} Q ${controlPoint.x} ${controlPoint.y} ${end.x} ${end.y}`;
}

export function AllenCurveOverlay({
  layout,
  assessments,
  selectedZoneId,
  zoom,
  gridSize,
  hoveredLinkId,
  onLinkHover,
  onLinkClick,
}: AllenCurveOverlayProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Create a map of zone IDs to zone data for quick lookup
  const zoneMap = useMemo(() => {
    const map = new Map<string, ZoneData>();
    for (const zone of layout.zones) {
      map.set(zone.id, zone);
    }
    return map;
  }, [layout.zones]);

  // Get selected zone data
  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return zoneMap.get(selectedZoneId) || null;
  }, [selectedZoneId, zoneMap]);

  // Calculate screen coordinates for a zone center
  const getScreenCoords = useCallback(
    (zone: ZoneData) => {
      const center = getZoneCenter(zone);
      return {
        x: center.x * gridSize * zoom,
        y: center.y * gridSize * zoom,
      };
    },
    [gridSize, zoom]
  );

  // Handle link hover
  const handleLinkMouseEnter = useCallback(
    (assessment: LinkAssessment, event: React.MouseEvent) => {
      const sourceZone = zoneMap.get(assessment.link.sourceZoneId);
      const targetZone = zoneMap.get(assessment.link.targetZoneId);

      if (!sourceZone || !targetZone) return;

      const sourceCoords = getScreenCoords(sourceZone);
      const targetCoords = getScreenCoords(targetZone);

      setTooltip({
        x: (sourceCoords.x + targetCoords.x) / 2,
        y: (sourceCoords.y + targetCoords.y) / 2 - 20,
        sourceName: sourceZone.name,
        targetName: targetZone.name,
        distance: assessment.distance,
        efficiency: assessment.efficiency,
        status: STATUS_LABELS[assessment.status],
        intensity: INTENSITY_LABELS[assessment.link.intensity],
      });

      onLinkHover?.(assessment.link.id);
    },
    [zoneMap, getScreenCoords, onLinkHover]
  );

  const handleLinkMouseLeave = useCallback(() => {
    setTooltip(null);
    onLinkHover?.(null);
  }, [onLinkHover]);

  const handleLinkClick = useCallback(
    (linkId: string) => {
      onLinkClick?.(linkId);
    },
    [onLinkClick]
  );

  // Render a connection line between two zones
  const renderConnectionLine = useCallback(
    (assessment: LinkAssessment, index: number) => {
      const sourceZone = zoneMap.get(assessment.link.sourceZoneId);
      const targetZone = zoneMap.get(assessment.link.targetZoneId);

      if (!sourceZone || !targetZone) return null;

      const start = getScreenCoords(sourceZone);
      const end = getScreenCoords(targetZone);
      const controlPoint = getBezierControlPoint(start, end, 0.15);
      const path = getBezierPath(start, end, controlPoint);

      const color = STATUS_COLORS[assessment.status];
      const lineWidth = STATUS_LINE_WIDTHS[assessment.status];
      const isCritical = assessment.status === "critical";
      const isHovered = hoveredLinkId === assessment.link.id;
      const isRelatedToSelected =
        selectedZoneId &&
        (assessment.link.sourceZoneId === selectedZoneId ||
          assessment.link.targetZoneId === selectedZoneId);

      // Dim unrelated links when a zone is selected
      const opacity =
        selectedZoneId && !isRelatedToSelected ? 0.2 : isHovered ? 1 : 0.7;

      return (
        <g key={`connection-${assessment.link.id}`}>
          {/* Invisible wider hit area for easier hover */}
          <path
            d={path}
            stroke="transparent"
            strokeWidth={20}
            fill="none"
            className="cursor-pointer"
            onMouseEnter={(e) => handleLinkMouseEnter(assessment, e)}
            onMouseLeave={handleLinkMouseLeave}
            onClick={() => handleLinkClick(assessment.link.id)}
          />

          {/* Visible connection line */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity,
              strokeWidth: isHovered ? lineWidth + 1 : lineWidth,
            }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            d={path}
            stroke={color}
            strokeWidth={lineWidth}
            strokeDasharray={isCritical ? "8,4" : "none"}
            fill="none"
            className="pointer-events-none"
          />

          {/* Source endpoint circle */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1.3 : 1, opacity }}
            cx={start.x}
            cy={start.y}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={1.5}
            className="pointer-events-none"
          />

          {/* Target endpoint circle */}
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1.3 : 1, opacity }}
            cx={end.x}
            cy={end.y}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={1.5}
            className="pointer-events-none"
          />
        </g>
      );
    },
    [
      zoneMap,
      getScreenCoords,
      hoveredLinkId,
      selectedZoneId,
      handleLinkMouseEnter,
      handleLinkMouseLeave,
      handleLinkClick,
    ]
  );

  // Render distance threshold circles around selected zone
  const renderDistanceCircles = useCallback(() => {
    if (!selectedZone) return null;

    const center = getScreenCoords(selectedZone);
    const optimalRadius = DISTANCE_THRESHOLDS.optimal * gridSize * zoom;
    const warningRadius = DISTANCE_THRESHOLDS.warning * gridSize * zoom;

    return (
      <g>
        {/* 10m optimal zone circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          exit={{ scale: 0, opacity: 0 }}
          cx={center.x}
          cy={center.y}
          r={optimalRadius}
          fill="none"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="8,4"
          className="pointer-events-none"
        />

        {/* 10m label */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <rect
            x={center.x + optimalRadius - 20}
            y={center.y - 10}
            width={40}
            height={20}
            rx={4}
            fill="rgba(16, 185, 129, 0.9)"
          />
          <text
            x={center.x + optimalRadius}
            y={center.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            10m
          </text>
        </motion.g>

        {/* 30m warning zone circle */}
        <motion.circle
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          exit={{ scale: 0, opacity: 0 }}
          cx={center.x}
          cy={center.y}
          r={warningRadius}
          fill="none"
          stroke="#f97316"
          strokeWidth={2}
          strokeDasharray="8,4"
          className="pointer-events-none"
        />

        {/* 30m label */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <rect
            x={center.x + warningRadius - 20}
            y={center.y - 10}
            width={40}
            height={20}
            rx={4}
            fill="rgba(249, 115, 22, 0.9)"
          />
          <text
            x={center.x + warningRadius}
            y={center.y + 5}
            textAnchor="middle"
            fill="white"
            fontSize={12}
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            30m
          </text>
        </motion.g>

        {/* Selected zone center marker */}
        <motion.circle
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          cx={center.x}
          cy={center.y}
          r={8}
          fill="var(--neon-cyan)"
          stroke="white"
          strokeWidth={2}
          className="pointer-events-none"
        />
      </g>
    );
  }, [selectedZone, getScreenCoords, gridSize, zoom]);

  // Render tooltip
  const renderTooltip = useCallback(() => {
    if (!tooltip) return null;

    const tooltipWidth = 180;
    const tooltipHeight = 90;

    return (
      <motion.g
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Tooltip background */}
        <rect
          x={tooltip.x - tooltipWidth / 2}
          y={tooltip.y - tooltipHeight - 10}
          width={tooltipWidth}
          height={tooltipHeight}
          rx={8}
          fill="rgba(15, 23, 42, 0.95)"
          stroke="var(--glass-border)"
          strokeWidth={1}
        />

        {/* Tooltip arrow */}
        <polygon
          points={`${tooltip.x - 6},${tooltip.y - 10} ${tooltip.x + 6},${tooltip.y - 10} ${tooltip.x},${tooltip.y}`}
          fill="rgba(15, 23, 42, 0.95)"
        />

        {/* Zone names */}
        <text
          x={tooltip.x}
          y={tooltip.y - tooltipHeight + 10}
          textAnchor="middle"
          fill="white"
          fontSize={12}
          fontWeight="bold"
          className="select-none"
        >
          {tooltip.sourceName}
        </text>
        <text
          x={tooltip.x}
          y={tooltip.y - tooltipHeight + 26}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={11}
          className="select-none"
        >
          ↔ {tooltip.targetName}
        </text>

        {/* Distance and efficiency */}
        <text
          x={tooltip.x}
          y={tooltip.y - tooltipHeight + 48}
          textAnchor="middle"
          fill="var(--neon-cyan)"
          fontSize={13}
          fontWeight="bold"
          className="select-none"
        >
          {tooltip.distance.toFixed(1)}m | {tooltip.efficiency.toFixed(0)}%
        </text>

        {/* Status and intensity */}
        <text
          x={tooltip.x}
          y={tooltip.y - tooltipHeight + 68}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={10}
          className="select-none"
        >
          {tooltip.status} - {tooltip.intensity}
        </text>
      </motion.g>
    );
  }, [tooltip]);

  return (
    <svg
      className="absolute inset-0"
      style={{ zIndex: 90, pointerEvents: "none" }}
    >
      {/* Enable pointer events only on interactive elements */}
      <g style={{ pointerEvents: "auto" }}>
        {/* Render all connection lines */}
        {assessments.map((assessment, index) =>
          renderConnectionLine(assessment, index)
        )}
      </g>

      {/* Distance circles when zone is selected */}
      <AnimatePresence>{selectedZoneId && renderDistanceCircles()}</AnimatePresence>

      {/* Hover tooltip */}
      <AnimatePresence>{renderTooltip()}</AnimatePresence>
    </svg>
  );
}
