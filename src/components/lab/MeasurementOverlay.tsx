"use client";

import { motion } from "framer-motion";
import type { Point, Measurement } from "@/lib/utils/measurements";
import { getMidpoint } from "@/lib/utils/measurements";

interface MeasurementOverlayProps {
  currentPoints: Point[];
  measurements: Measurement[];
  gridSize: number;
  zoom: number;
}

export function MeasurementOverlay({
  currentPoints,
  measurements,
  gridSize,
  zoom,
}: MeasurementOverlayProps) {
  const renderPoint = (point: Point, index: number | string, isActive: boolean = false) => (
    <motion.circle
      key={`point-${index}`}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      cx={point.x * gridSize * zoom}
      cy={point.y * gridSize * zoom}
      r={6}
      fill={isActive ? "var(--neon-cyan)" : "var(--neon-violet)"}
      stroke="white"
      strokeWidth={2}
      className="cursor-pointer"
    />
  );

  const renderLine = (
    start: Point,
    end: Point,
    isActive: boolean = false,
    key: string = "line"
  ) => (
    <motion.line
      key={key}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      exit={{ pathLength: 0 }}
      x1={start.x * gridSize * zoom}
      y1={start.y * gridSize * zoom}
      x2={end.x * gridSize * zoom}
      y2={end.y * gridSize * zoom}
      stroke={isActive ? "var(--neon-cyan)" : "var(--neon-violet)"}
      strokeWidth={2}
      strokeDasharray={isActive ? "5,5" : "none"}
      className="pointer-events-none"
    />
  );

  const renderLabel = (
    point: Point,
    label: string,
    isActive: boolean = false,
    key: string = "label"
  ) => (
    <motion.g
      key={key}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <rect
        x={point.x * gridSize * zoom - 30}
        y={point.y * gridSize * zoom - 25}
        width={60}
        height={20}
        rx={4}
        fill={isActive ? "var(--neon-cyan)" : "var(--neon-violet)"}
        opacity={0.9}
      />
      <text
        x={point.x * gridSize * zoom}
        y={point.y * gridSize * zoom - 10}
        textAnchor="middle"
        fill="white"
        fontSize={12}
        fontWeight="bold"
        className="select-none"
      >
        {label}
      </text>
    </motion.g>
  );

  const renderAngleArc = (
    p1: Point,
    vertex: Point,
    p3: Point,
    isActive: boolean = false
  ) => {
    const angle1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
    const angle2 = Math.atan2(p3.y - vertex.y, p3.x - vertex.x);

    const radius = 30;
    const startAngle = Math.min(angle1, angle2) * (180 / Math.PI);
    const endAngle = Math.max(angle1, angle2) * (180 / Math.PI);

    const centerX = vertex.x * gridSize * zoom;
    const centerY = vertex.y * gridSize * zoom;

    // Create arc path
    const start = {
      x: centerX + radius * Math.cos(angle1),
      y: centerY + radius * Math.sin(angle1),
    };
    const end = {
      x: centerX + radius * Math.cos(angle2),
      y: centerY + radius * Math.sin(angle2),
    };

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;

    return (
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
        stroke={isActive ? "var(--neon-cyan)" : "var(--neon-violet)"}
        strokeWidth={2}
        fill="none"
        className="pointer-events-none"
      />
    );
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    >
      {/* Render current measurement in progress */}
      {currentPoints.length > 0 && (
        <g>
          {/* Render points */}
          {currentPoints.map((point, index) => renderPoint(point, index, true))}

          {/* Render lines */}
          {currentPoints.length >= 2 && (
            <>
              {currentPoints.slice(0, -1).map((point, index) => (
                renderLine(
                  point,
                  currentPoints[index + 1],
                  true,
                  `current-line-${index}`
                )
              ))}
            </>
          )}

          {/* Render angle arc for angle measurements */}
          {currentPoints.length === 3 &&
            renderAngleArc(
              currentPoints[0],
              currentPoints[1],
              currentPoints[2],
              true
            )}
        </g>
      )}

      {/* Render completed measurements */}
      {measurements.map((measurement, mIndex) => {
        const points = measurement.points;

        return (
          <g key={`measurement-${mIndex}`}>
            {/* Render points */}
            {points.map((point, pIndex) =>
              renderPoint(point, `${mIndex}-${pIndex}`, false)
            )}

            {/* Render lines for distance and area */}
            {(measurement.type === "distance" ||
              measurement.type === "area") &&
              points.length >= 2 && (
                <>
                  {points.slice(0, -1).map((point, index) =>
                    renderLine(
                      point,
                      points[index + 1],
                      false,
                      `measurement-line-${mIndex}-${index}`
                    )
                  )}

                  {/* For area, close the rectangle */}
                  {measurement.type === "area" && points.length === 2 && (
                    <>
                      {renderLine(
                        { x: points[0].x, y: points[1].y },
                        points[1],
                        false,
                        `area-line-${mIndex}-2`
                      )}
                      {renderLine(
                        points[0],
                        { x: points[0].x, y: points[1].y },
                        false,
                        `area-line-${mIndex}-3`
                      )}
                      {renderLine(
                        points[0],
                        { x: points[1].x, y: points[0].y },
                        false,
                        `area-line-${mIndex}-4`
                      )}
                      {renderLine(
                        { x: points[1].x, y: points[0].y },
                        points[1],
                        false,
                        `area-line-${mIndex}-5`
                      )}
                    </>
                  )}
                </>
              )}

            {/* Render angle arc and lines */}
            {measurement.type === "angle" && points.length === 3 && (
              <>
                {renderLine(points[1], points[0], false, `angle-line-${mIndex}-0`)}
                {renderLine(points[1], points[2], false, `angle-line-${mIndex}-1`)}
                {renderAngleArc(points[0], points[1], points[2], false)}
              </>
            )}

            {/* Render label */}
            {points.length >= 2 &&
              renderLabel(
                measurement.type === "angle"
                  ? points[1]
                  : getMidpoint(points[0], points[1]),
                measurement.label,
                false,
                `label-${mIndex}`
              )}
          </g>
        );
      })}
    </svg>
  );
}
