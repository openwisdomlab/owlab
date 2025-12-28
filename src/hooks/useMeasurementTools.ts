/**
 * Measurement Tools Hook
 * Manages measurement tool state and calculations
 */

import { useState, useCallback } from "react";
import {
  calculateDistance,
  calculateRectangleArea,
  calculateAngle,
  formatMeasurement,
  type Point,
  type Measurement,
} from "@/lib/utils/measurements";

export type MeasurementMode = "distance" | "area" | "angle" | null;

export interface MeasurementState {
  mode: MeasurementMode;
  points: Point[];
  current: Measurement | null;
  history: Measurement[];
}

export function useMeasurementTools(
  gridSize: number = 30,
  unit: "m" | "ft" = "m"
) {
  const [mode, setMode] = useState<MeasurementMode>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [current, setCurrent] = useState<Measurement | null>(null);
  const [history, setHistory] = useState<Measurement[]>([]);

  /**
   * Start a new measurement
   */
  const startMeasurement = useCallback((newMode: MeasurementMode) => {
    setMode(newMode);
    setPoints([]);
    setCurrent(null);
  }, []);

  /**
   * Add a point to the current measurement
   */
  const addPoint = useCallback(
    (point: Point) => {
      const newPoints = [...points, point];
      setPoints(newPoints);

      // Calculate measurement based on mode
      if (mode === "distance" && newPoints.length === 2) {
        const distance = calculateDistance(newPoints[0], newPoints[1], gridSize, unit);
        const measurement: Measurement = {
          type: "distance",
          value: distance,
          unit,
          points: newPoints,
          label: formatMeasurement(distance, "distance", unit),
        };
        setCurrent(measurement);
        setHistory((prev) => [...prev, measurement]);
        // Reset for next measurement
        setPoints([]);
        setCurrent(null);
      } else if (mode === "area" && newPoints.length === 2) {
        const width = Math.abs(newPoints[1].x - newPoints[0].x);
        const height = Math.abs(newPoints[1].y - newPoints[0].y);
        const area = calculateRectangleArea(width, height, unit);
        const measurement: Measurement = {
          type: "area",
          value: area,
          unit,
          points: newPoints,
          label: formatMeasurement(area, "area", unit),
        };
        setCurrent(measurement);
        setHistory((prev) => [...prev, measurement]);
        // Reset for next measurement
        setPoints([]);
        setCurrent(null);
      } else if (mode === "angle" && newPoints.length === 3) {
        const angle = calculateAngle(newPoints[0], newPoints[1], newPoints[2]);
        const measurement: Measurement = {
          type: "angle",
          value: angle,
          unit: "degrees",
          points: newPoints,
          label: formatMeasurement(angle, "angle", "degrees"),
        };
        setCurrent(measurement);
        setHistory((prev) => [...prev, measurement]);
        // Reset for next measurement
        setPoints([]);
        setCurrent(null);
      }
    },
    [mode, points, gridSize, unit]
  );

  /**
   * Cancel the current measurement
   */
  const cancelMeasurement = useCallback(() => {
    setMode(null);
    setPoints([]);
    setCurrent(null);
  }, []);

  /**
   * Clear all measurements
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  /**
   * Remove a measurement from history
   */
  const removeMeasurement = useCallback((index: number) => {
    setHistory((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Get the required number of points for the current mode
   */
  const getRequiredPoints = useCallback((): number => {
    switch (mode) {
      case "distance":
        return 2;
      case "area":
        return 2;
      case "angle":
        return 3;
      default:
        return 0;
    }
  }, [mode]);

  /**
   * Get help text for the current mode
   */
  const getHelpText = useCallback((): string => {
    if (!mode) return "";

    const required = getRequiredPoints();
    const remaining = required - points.length;

    if (remaining <= 0) return "";

    switch (mode) {
      case "distance":
        return remaining === 2
          ? "Click first point"
          : "Click second point to measure distance";
      case "area":
        return remaining === 2
          ? "Click first corner"
          : "Click opposite corner to measure area";
      case "angle":
        if (remaining === 3) return "Click first point";
        if (remaining === 2) return "Click vertex (angle point)";
        return "Click third point to measure angle";
      default:
        return "";
    }
  }, [mode, points.length, getRequiredPoints]);

  return {
    mode,
    points,
    current,
    history,
    startMeasurement,
    addPoint,
    cancelMeasurement,
    clearHistory,
    removeMeasurement,
    getRequiredPoints,
    getHelpText,
    isActive: mode !== null,
    needsMorePoints: mode !== null && points.length < getRequiredPoints(),
  };
}
