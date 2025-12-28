/**
 * Measurement Utilities for Floor Plan Canvas
 * Provides distance, area, and angle calculations
 */

export interface Point {
  x: number;
  y: number;
}

export interface Measurement {
  type: "distance" | "area" | "angle";
  value: number;
  unit: "m" | "ft" | "degrees";
  points: Point[];
  label: string;
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  p1: Point,
  p2: Point,
  gridSize: number = 30,
  unit: "m" | "ft" = "m"
): number {
  const dx = Math.abs(p2.x - p1.x);
  const dy = Math.abs(p2.y - p1.y);
  const distanceInGridUnits = Math.sqrt(dx * dx + dy * dy);

  // Convert grid units to real-world units
  // Assuming 1 grid unit = 1 meter or 1 foot
  const distance = distanceInGridUnits * (gridSize / gridSize); // Simplified for now

  return Number(distance.toFixed(2));
}

/**
 * Calculate Manhattan distance (horizontal + vertical)
 */
export function calculateManhattanDistance(
  p1: Point,
  p2: Point,
  gridSize: number = 30,
  unit: "m" | "ft" = "m"
): { horizontal: number; vertical: number; total: number } {
  const horizontal = Math.abs(p2.x - p1.x);
  const vertical = Math.abs(p2.y - p1.y);

  return {
    horizontal: Number(horizontal.toFixed(2)),
    vertical: Number(vertical.toFixed(2)),
    total: Number((horizontal + vertical).toFixed(2)),
  };
}

/**
 * Calculate area of a rectangle
 */
export function calculateRectangleArea(
  width: number,
  height: number,
  unit: "m" | "ft" = "m"
): number {
  const area = width * height;
  return Number(area.toFixed(2));
}

/**
 * Calculate perimeter of a rectangle
 */
export function calculatePerimeter(
  width: number,
  height: number,
  unit: "m" | "ft" = "m"
): number {
  const perimeter = 2 * (width + height);
  return Number(perimeter.toFixed(2));
}

/**
 * Calculate angle between three points (p2 is the vertex)
 */
export function calculateAngle(p1: Point, vertex: Point, p3: Point): number {
  const angle1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const angle2 = Math.atan2(p3.y - vertex.y, p3.x - vertex.x);

  let angle = Math.abs(angle2 - angle1) * (180 / Math.PI);

  // Normalize to 0-180 range
  if (angle > 180) {
    angle = 360 - angle;
  }

  return Number(angle.toFixed(1));
}

/**
 * Format measurement value with unit
 */
export function formatMeasurement(
  value: number,
  type: "distance" | "area" | "angle",
  unit: "m" | "ft" | "degrees" = "m"
): string {
  if (type === "angle") {
    return `${value}°`;
  }

  if (type === "area") {
    return `${value} ${unit}²`;
  }

  // distance
  return `${value} ${unit}`;
}

/**
 * Get midpoint between two points
 */
export function getMidpoint(p1: Point, p2: Point): Point {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

/**
 * Check if a point is near a line segment
 */
export function isPointNearLine(
  point: Point,
  lineStart: Point,
  lineEnd: Point,
  threshold: number = 10
): boolean {
  const distance = distanceToLineSegment(point, lineStart, lineEnd);
  return distance <= threshold;
}

/**
 * Calculate distance from point to line segment
 */
export function distanceToLineSegment(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const { x, y } = point;
  const { x: x1, y: y1 } = lineStart;
  const { x: x2, y: y2 } = lineEnd;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Snap point to grid
 */
export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}

/**
 * Check if two points are close enough to snap
 */
export function shouldSnap(
  point: Point,
  target: Point,
  threshold: number = 15
): boolean {
  const distance = calculateDistance(point, target);
  return distance <= threshold;
}

/**
 * Get all snap points for alignment
 */
export interface SnapPoint {
  point: Point;
  type: "corner" | "edge" | "center" | "midpoint";
  label: string;
}

export function getSnapPoints(
  x: number,
  y: number,
  width: number,
  height: number,
  label: string
): SnapPoint[] {
  const snapPoints: SnapPoint[] = [];

  // Corners
  snapPoints.push({
    point: { x, y },
    type: "corner",
    label: `${label} - Top Left`,
  });
  snapPoints.push({
    point: { x: x + width, y },
    type: "corner",
    label: `${label} - Top Right`,
  });
  snapPoints.push({
    point: { x, y: y + height },
    type: "corner",
    label: `${label} - Bottom Left`,
  });
  snapPoints.push({
    point: { x: x + width, y: y + height },
    type: "corner",
    label: `${label} - Bottom Right`,
  });

  // Centers
  snapPoints.push({
    point: { x: x + width / 2, y: y + height / 2 },
    type: "center",
    label: `${label} - Center`,
  });

  // Edge midpoints
  snapPoints.push({
    point: { x: x + width / 2, y },
    type: "midpoint",
    label: `${label} - Top Edge`,
  });
  snapPoints.push({
    point: { x: x + width / 2, y: y + height },
    type: "midpoint",
    label: `${label} - Bottom Edge`,
  });
  snapPoints.push({
    point: { x, y: y + height / 2 },
    type: "midpoint",
    label: `${label} - Left Edge`,
  });
  snapPoints.push({
    point: { x: x + width, y: y + height / 2 },
    type: "midpoint",
    label: `${label} - Right Edge`,
  });

  return snapPoints;
}

/**
 * Find nearest snap point
 */
export function findNearestSnapPoint(
  point: Point,
  snapPoints: SnapPoint[],
  threshold: number = 15
): SnapPoint | null {
  let nearest: SnapPoint | null = null;
  let minDistance = Infinity;

  for (const snapPoint of snapPoints) {
    const distance = calculateDistance(point, snapPoint.point);
    if (distance < minDistance && distance <= threshold) {
      minDistance = distance;
      nearest = snapPoint;
    }
  }

  return nearest;
}

/**
 * Calculate alignment guides for a zone being dragged
 */
export interface AlignmentGuide {
  type: "vertical" | "horizontal";
  position: number; // x for vertical, y for horizontal
  label: string;
  snapPoints: Point[];
}

export function calculateAlignmentGuides(
  draggedZone: { x: number; y: number; width: number; height: number },
  otherZones: Array<{ x: number; y: number; width: number; height: number; name: string }>,
  threshold: number = 5
): AlignmentGuide[] {
  const guides: AlignmentGuide[] = [];

  const draggedPoints = {
    left: draggedZone.x,
    right: draggedZone.x + draggedZone.width,
    centerX: draggedZone.x + draggedZone.width / 2,
    top: draggedZone.y,
    bottom: draggedZone.y + draggedZone.height,
    centerY: draggedZone.y + draggedZone.height / 2,
  };

  for (const zone of otherZones) {
    const zonePoints = {
      left: zone.x,
      right: zone.x + zone.width,
      centerX: zone.x + zone.width / 2,
      top: zone.y,
      bottom: zone.y + zone.height,
      centerY: zone.y + zone.height / 2,
    };

    // Vertical guides (align on x-axis)
    const verticalAlignments = [
      { pos: zonePoints.left, label: `Left edge of ${zone.name}`, dragPos: draggedPoints.left },
      { pos: zonePoints.right, label: `Right edge of ${zone.name}`, dragPos: draggedPoints.right },
      { pos: zonePoints.centerX, label: `Center of ${zone.name}`, dragPos: draggedPoints.centerX },
    ];

    for (const align of verticalAlignments) {
      if (Math.abs(align.dragPos - align.pos) <= threshold) {
        guides.push({
          type: "vertical",
          position: align.pos,
          label: align.label,
          snapPoints: [
            { x: align.pos, y: Math.min(draggedZone.y, zone.y) },
            { x: align.pos, y: Math.max(draggedZone.y + draggedZone.height, zone.y + zone.height) },
          ],
        });
      }
    }

    // Horizontal guides (align on y-axis)
    const horizontalAlignments = [
      { pos: zonePoints.top, label: `Top edge of ${zone.name}`, dragPos: draggedPoints.top },
      { pos: zonePoints.bottom, label: `Bottom edge of ${zone.name}`, dragPos: draggedPoints.bottom },
      { pos: zonePoints.centerY, label: `Center of ${zone.name}`, dragPos: draggedPoints.centerY },
    ];

    for (const align of horizontalAlignments) {
      if (Math.abs(align.dragPos - align.pos) <= threshold) {
        guides.push({
          type: "horizontal",
          position: align.pos,
          label: align.label,
          snapPoints: [
            { x: Math.min(draggedZone.x, zone.x), y: align.pos },
            { x: Math.max(draggedZone.x + draggedZone.width, zone.x + zone.width), y: align.pos },
          ],
        });
      }
    }
  }

  return guides;
}

/**
 * Distribute zones evenly
 */
export function distributeZonesEvenly(
  zones: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  direction: "horizontal" | "vertical",
  spacing: number = 1
): Array<{ id: string; x: number; y: number }> {
  if (zones.length < 2) return zones.map((z) => ({ id: z.id, x: z.x, y: z.y }));

  const sorted = [...zones].sort((a, b) => {
    return direction === "horizontal" ? a.x - b.x : a.y - b.y;
  });

  const positions: Array<{ id: string; x: number; y: number }> = [];

  if (direction === "horizontal") {
    const totalWidth = sorted.reduce((sum, z) => sum + z.width, 0);
    const totalSpacing = (sorted.length - 1) * spacing;
    const startX = sorted[0].x;
    const endX = sorted[sorted.length - 1].x + sorted[sorted.length - 1].width;
    const availableSpace = endX - startX - totalWidth;
    const gap = availableSpace / (sorted.length - 1);

    let currentX = startX;
    for (const zone of sorted) {
      positions.push({ id: zone.id, x: currentX, y: zone.y });
      currentX += zone.width + gap;
    }
  } else {
    const totalHeight = sorted.reduce((sum, z) => sum + z.height, 0);
    const totalSpacing = (sorted.length - 1) * spacing;
    const startY = sorted[0].y;
    const endY = sorted[sorted.length - 1].y + sorted[sorted.length - 1].height;
    const availableSpace = endY - startY - totalHeight;
    const gap = availableSpace / (sorted.length - 1);

    let currentY = startY;
    for (const zone of sorted) {
      positions.push({ id: zone.id, x: zone.x, y: currentY });
      currentY += zone.height + gap;
    }
  }

  return positions;
}

/**
 * Auto-arrange zones in a grid layout
 */
export function autoArrangeZones(
  zones: Array<{ id: string; width: number; height: number }>,
  containerWidth: number,
  containerHeight: number,
  padding: number = 2
): Array<{ id: string; x: number; y: number }> {
  const positions: Array<{ id: string; x: number; y: number }> = [];

  // Sort zones by size (largest first)
  const sorted = [...zones].sort((a, b) => {
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;
    return areaB - areaA;
  });

  let currentX = padding;
  let currentY = padding;
  let rowHeight = 0;

  for (const zone of sorted) {
    // Check if zone fits in current row
    if (currentX + zone.width > containerWidth - padding) {
      // Move to next row
      currentX = padding;
      currentY += rowHeight + padding;
      rowHeight = 0;
    }

    // Check if we're still within container height
    if (currentY + zone.height > containerHeight - padding) {
      // Overflow - just place it anyway (user can adjust)
      currentY = padding;
    }

    positions.push({ id: zone.id, x: currentX, y: currentY });

    currentX += zone.width + padding;
    rowHeight = Math.max(rowHeight, zone.height);
  }

  return positions;
}
