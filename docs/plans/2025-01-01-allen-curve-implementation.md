# Allen Curve 通信距离可视化 - 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 Floor Plan 工具中可视化区域间的沟通效率，基于 Allen Curve 理论评估布局并提供优化建议。

**Architecture:** 创建 Zod schema 定义数据模型，计算器评估区域间通信效率，Canvas 叠加层渲染连接线和同心圆，侧边栏面板展示结果。

**Tech Stack:** React, TypeScript, Zod, Framer Motion, Lucide Icons (Link2)

---

## Task 1: 创建 Allen Curve Schema

**Files:**
- Create: `src/lib/schemas/allen-curve.ts`

**Step 1: 创建 schema 文件**

```typescript
/**
 * Allen Curve Communication Analysis Schemas
 * Based on Thomas Allen's research on communication frequency vs distance
 */

import { z } from "zod";

/**
 * Collaboration intensity levels
 */
export const CollaborationIntensitySchema = z.enum(["high", "medium", "low"]);
export type CollaborationIntensity = z.infer<typeof CollaborationIntensitySchema>;

/**
 * Collaboration link between two zones
 */
export const CollaborationLinkSchema = z.object({
  id: z.string(),
  sourceZoneId: z.string(),
  targetZoneId: z.string(),
  intensity: CollaborationIntensitySchema,
  autoInferred: z.boolean(),
  customWeight: z.number().min(0).max(1).optional(),
});
export type CollaborationLink = z.infer<typeof CollaborationLinkSchema>;

/**
 * Link assessment status
 */
export const LinkStatusSchema = z.enum(["optimal", "acceptable", "warning", "critical"]);
export type LinkStatus = z.infer<typeof LinkStatusSchema>;

/**
 * Assessment result for a single link
 */
export const LinkAssessmentSchema = z.object({
  link: CollaborationLinkSchema,
  distance: z.number(),
  efficiency: z.number().min(0).max(100),
  status: LinkStatusSchema,
});
export type LinkAssessment = z.infer<typeof LinkAssessmentSchema>;

/**
 * Recommendation types
 */
export const RecommendationTypeSchema = z.enum(["move_closer", "move_apart", "cluster"]);
export type RecommendationType = z.infer<typeof RecommendationTypeSchema>;

/**
 * Optimization recommendation
 */
export const AllenCurveRecommendationSchema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  type: RecommendationTypeSchema,
  affectedZones: z.array(z.string()),
  message: z.string(),
  estimatedImprovement: z.number(),
});
export type AllenCurveRecommendation = z.infer<typeof AllenCurveRecommendationSchema>;

/**
 * Overall Allen Curve assessment
 */
export const AllenCurveAssessmentSchema = z.object({
  links: z.array(LinkAssessmentSchema),
  overallScore: z.number().min(0).max(100),
  safetyLevel: z.enum(["excellent", "good", "moderate", "needs_improvement", "critical"]),
  recommendations: z.array(AllenCurveRecommendationSchema),
  assessedAt: z.coerce.date(),
});
export type AllenCurveAssessment = z.infer<typeof AllenCurveAssessmentSchema>;

/**
 * Zone type collaboration matrix
 * Defines default collaboration intensity between zone types
 */
export const ZONE_COLLABORATION_MATRIX: Record<string, Record<string, CollaborationIntensity>> = {
  compute: {
    compute: "medium",
    workspace: "high",
    meeting: "medium",
    storage: "low",
    break: "low",
    entrance: "low",
  },
  workspace: {
    compute: "high",
    workspace: "medium",
    meeting: "high",
    storage: "low",
    break: "medium",
    entrance: "medium",
  },
  meeting: {
    compute: "medium",
    workspace: "high",
    meeting: "low",
    storage: "low",
    break: "medium",
    entrance: "medium",
  },
  storage: {
    compute: "low",
    workspace: "low",
    meeting: "low",
    storage: "low",
    break: "low",
    entrance: "low",
  },
  break: {
    compute: "low",
    workspace: "medium",
    meeting: "medium",
    storage: "low",
    break: "low",
    entrance: "medium",
  },
  entrance: {
    compute: "low",
    workspace: "medium",
    meeting: "medium",
    storage: "low",
    break: "medium",
    entrance: "low",
  },
};

/**
 * Intensity labels in Chinese
 */
export const INTENSITY_LABELS: Record<CollaborationIntensity, string> = {
  high: "高频协作",
  medium: "中等协作",
  low: "低频协作",
};

/**
 * Status labels in Chinese
 */
export const STATUS_LABELS: Record<LinkStatus, string> = {
  optimal: "最佳",
  acceptable: "良好",
  warning: "需注意",
  critical: "需改进",
};

/**
 * Status colors for UI
 */
export const STATUS_COLORS: Record<LinkStatus, string> = {
  optimal: "#10b981",   // green
  acceptable: "#22d3ee", // cyan
  warning: "#eab308",   // yellow
  critical: "#ef4444",  // red
};

/**
 * Status line widths
 */
export const STATUS_LINE_WIDTHS: Record<LinkStatus, number> = {
  optimal: 3,
  acceptable: 2,
  warning: 2,
  critical: 1,
};
```

**Step 2: 验证文件创建**

Run: `cat src/lib/schemas/allen-curve.ts | head -20`

**Step 3: Commit**

```bash
git add src/lib/schemas/allen-curve.ts
git commit -m "feat(allen-curve): add schema definitions for communication analysis"
```

---

## Task 2: 创建 Allen Curve Calculator

**Files:**
- Create: `src/lib/utils/allen-curve-calculator.ts`

**Step 1: 创建计算器文件**

```typescript
/**
 * Allen Curve Calculator
 * Calculates communication efficiency based on physical distance
 */

import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type {
  CollaborationLink,
  CollaborationIntensity,
  LinkAssessment,
  LinkStatus,
  AllenCurveRecommendation,
  AllenCurveAssessment,
} from "@/lib/schemas/allen-curve";
import { ZONE_COLLABORATION_MATRIX } from "@/lib/schemas/allen-curve";

/**
 * Allen Curve decay coefficient
 * Based on Thomas Allen's research: communication drops exponentially with distance
 */
const DECAY_ALPHA = 0.1;

/**
 * Distance thresholds (in meters)
 */
export const DISTANCE_THRESHOLDS = {
  optimal: 10,    // Within 10m: high efficiency
  warning: 30,    // Beyond 30m: significant drop
};

/**
 * Intensity weight multipliers
 */
const INTENSITY_WEIGHTS: Record<CollaborationIntensity, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
};

/**
 * Get zone center point
 */
export function getZoneCenter(zone: ZoneData): { x: number; y: number } {
  return {
    x: zone.position.x + zone.size.width / 2,
    y: zone.position.y + zone.size.height / 2,
  };
}

/**
 * Calculate Euclidean distance between two zones (in layout units)
 */
export function calculateDistance(zoneA: ZoneData, zoneB: ZoneData): number {
  const centerA = getZoneCenter(zoneA);
  const centerB = getZoneCenter(zoneB);
  return Math.sqrt(
    Math.pow(centerB.x - centerA.x, 2) + Math.pow(centerB.y - centerA.y, 2)
  );
}

/**
 * Calculate communication efficiency using Allen Curve formula
 * P(d) = e^(-αd) * 100
 */
export function calculateEfficiency(distance: number): number {
  const rawEfficiency = Math.exp(-DECAY_ALPHA * distance) * 100;
  return Math.round(rawEfficiency);
}

/**
 * Get efficiency status based on score
 */
export function getEfficiencyStatus(efficiency: number): LinkStatus {
  if (efficiency >= 80) return "optimal";
  if (efficiency >= 60) return "acceptable";
  if (efficiency >= 40) return "warning";
  return "critical";
}

/**
 * Infer collaboration intensity between two zone types
 */
export function inferCollaborationIntensity(
  sourceType: string,
  targetType: string
): CollaborationIntensity {
  const sourceMatrix = ZONE_COLLABORATION_MATRIX[sourceType];
  if (sourceMatrix && sourceMatrix[targetType]) {
    return sourceMatrix[targetType];
  }
  return "low"; // Default to low if not defined
}

/**
 * Generate collaboration links for a layout
 * Auto-infers intensity based on zone types
 */
export function generateCollaborationLinks(
  layout: LayoutData,
  existingLinks?: CollaborationLink[]
): CollaborationLink[] {
  const links: CollaborationLink[] = [];
  const zones = layout.zones;
  const existingLinkMap = new Map<string, CollaborationLink>();

  // Index existing links by zone pair
  if (existingLinks) {
    for (const link of existingLinks) {
      const key = [link.sourceZoneId, link.targetZoneId].sort().join("-");
      existingLinkMap.set(key, link);
    }
  }

  // Generate links for all zone pairs
  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const zoneA = zones[i];
      const zoneB = zones[j];
      const key = [zoneA.id, zoneB.id].sort().join("-");

      // Check if user has custom link
      const existingLink = existingLinkMap.get(key);
      if (existingLink && !existingLink.autoInferred) {
        links.push(existingLink);
        continue;
      }

      // Auto-infer intensity
      const intensity = inferCollaborationIntensity(zoneA.type, zoneB.type);

      // Skip low intensity links unless they were previously defined
      if (intensity === "low" && !existingLink) {
        continue;
      }

      links.push({
        id: `link-${zoneA.id}-${zoneB.id}`,
        sourceZoneId: zoneA.id,
        targetZoneId: zoneB.id,
        intensity,
        autoInferred: true,
        customWeight: existingLink?.customWeight,
      });
    }
  }

  return links;
}

/**
 * Assess a single collaboration link
 */
export function assessLink(
  link: CollaborationLink,
  zones: ZoneData[]
): LinkAssessment | null {
  const sourceZone = zones.find((z) => z.id === link.sourceZoneId);
  const targetZone = zones.find((z) => z.id === link.targetZoneId);

  if (!sourceZone || !targetZone) {
    return null;
  }

  const distance = calculateDistance(sourceZone, targetZone);
  const efficiency = calculateEfficiency(distance);
  const status = getEfficiencyStatus(efficiency);

  return {
    link,
    distance: Math.round(distance * 10) / 10, // Round to 1 decimal
    efficiency,
    status,
  };
}

/**
 * Generate recommendations based on assessments
 */
export function generateRecommendations(
  assessments: LinkAssessment[],
  zones: ZoneData[]
): AllenCurveRecommendation[] {
  const recommendations: AllenCurveRecommendation[] = [];

  // Find critical and warning links
  const problemLinks = assessments.filter(
    (a) => a.status === "critical" || a.status === "warning"
  );

  for (const assessment of problemLinks) {
    const sourceZone = zones.find((z) => z.id === assessment.link.sourceZoneId);
    const targetZone = zones.find((z) => z.id === assessment.link.targetZoneId);

    if (!sourceZone || !targetZone) continue;

    // High collaboration needs but far apart
    if (assessment.link.intensity === "high" && assessment.distance > DISTANCE_THRESHOLDS.optimal) {
      const improvement = Math.min(30, Math.round((100 - assessment.efficiency) * 0.6));
      recommendations.push({
        priority: assessment.status === "critical" ? "high" : "medium",
        type: "move_closer",
        affectedZones: [sourceZone.id, targetZone.id],
        message: `将「${sourceZone.name}」移近「${targetZone.name}」，当前距离 ${assessment.distance}m 超出最佳沟通范围（10m）`,
        estimatedImprovement: improvement,
      });
    }
  }

  // Look for clustering opportunities
  const highCollabZones = new Set<string>();
  for (const assessment of assessments) {
    if (assessment.link.intensity === "high") {
      highCollabZones.add(assessment.link.sourceZoneId);
      highCollabZones.add(assessment.link.targetZoneId);
    }
  }

  if (highCollabZones.size >= 3) {
    const zoneNames = Array.from(highCollabZones)
      .map((id) => zones.find((z) => z.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3);

    const avgEfficiency =
      assessments
        .filter((a) => a.link.intensity === "high")
        .reduce((sum, a) => sum + a.efficiency, 0) /
      assessments.filter((a) => a.link.intensity === "high").length;

    if (avgEfficiency < 70) {
      recommendations.push({
        priority: "medium",
        type: "cluster",
        affectedZones: Array.from(highCollabZones),
        message: `建议将 ${zoneNames.join("、")} 等高协作区域形成集群布局`,
        estimatedImprovement: 15,
      });
    }
  }

  // Sort by priority and improvement potential
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.estimatedImprovement - a.estimatedImprovement;
  });

  return recommendations.slice(0, 5);
}

/**
 * Get safety level from overall score
 */
export function getSafetyLevel(
  score: number
): AllenCurveAssessment["safetyLevel"] {
  if (score >= 85) return "excellent";
  if (score >= 70) return "good";
  if (score >= 55) return "moderate";
  if (score >= 40) return "needs_improvement";
  return "critical";
}

/**
 * Assess entire layout for Allen Curve communication efficiency
 */
export function assessLayout(
  layout: LayoutData,
  customLinks?: CollaborationLink[]
): AllenCurveAssessment {
  // Generate or use existing links
  const links = generateCollaborationLinks(layout, customLinks);

  // Assess each link
  const assessments: LinkAssessment[] = [];
  for (const link of links) {
    const assessment = assessLink(link, layout.zones);
    if (assessment) {
      assessments.push(assessment);
    }
  }

  // Calculate overall score (weighted by intensity)
  let totalWeight = 0;
  let weightedScore = 0;

  for (const assessment of assessments) {
    const weight = INTENSITY_WEIGHTS[assessment.link.intensity];
    totalWeight += weight;
    weightedScore += assessment.efficiency * weight;
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 100;
  const safetyLevel = getSafetyLevel(overallScore);

  // Generate recommendations
  const recommendations = generateRecommendations(assessments, layout.zones);

  return {
    links: assessments,
    overallScore,
    safetyLevel,
    recommendations,
    assessedAt: new Date(),
  };
}
```

**Step 2: 验证文件创建**

Run: `cat src/lib/utils/allen-curve-calculator.ts | head -30`

**Step 3: Commit**

```bash
git add src/lib/utils/allen-curve-calculator.ts
git commit -m "feat(allen-curve): add calculator for communication efficiency analysis"
```

---

## Task 3: 创建 AllenCurveOverlay 组件

**Files:**
- Create: `src/components/lab/AllenCurveOverlay.tsx`

**Step 1: 创建叠加层组件**

```typescript
/**
 * Allen Curve Overlay
 * Renders connection lines and concentric circles on the canvas
 */

"use client";

import { useMemo } from "react";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import type { LinkAssessment } from "@/lib/schemas/allen-curve";
import { STATUS_COLORS, STATUS_LINE_WIDTHS } from "@/lib/schemas/allen-curve";
import { getZoneCenter, DISTANCE_THRESHOLDS } from "@/lib/utils/allen-curve-calculator";

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
  // Calculate SVG dimensions
  const svgWidth = layout.dimensions.width * gridSize * zoom;
  const svgHeight = layout.dimensions.height * gridSize * zoom;

  // Get selected zone for concentric circles
  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return layout.zones.find((z) => z.id === selectedZoneId) || null;
  }, [selectedZoneId, layout.zones]);

  // Convert zone position to SVG coordinates
  const toSvgCoord = (value: number) => value * gridSize * zoom;

  // Generate bezier curve path between two zones
  const generateCurvePath = (zoneA: ZoneData, zoneB: ZoneData): string => {
    const centerA = getZoneCenter(zoneA);
    const centerB = getZoneCenter(zoneB);

    const x1 = toSvgCoord(centerA.x);
    const y1 = toSvgCoord(centerA.y);
    const x2 = toSvgCoord(centerB.x);
    const y2 = toSvgCoord(centerB.y);

    // Calculate control points for smooth curve
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Offset control point perpendicular to the line
    const offset = Math.min(Math.sqrt(dx * dx + dy * dy) * 0.2, 50);
    const cx = midX - (dy / Math.sqrt(dx * dx + dy * dy)) * offset;
    const cy = midY + (dx / Math.sqrt(dx * dx + dy * dy)) * offset;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ margin: "32px" }} // Match canvas padding
    >
      {/* Connection lines */}
      <g className="connection-lines">
        {assessments.map((assessment) => {
          const sourceZone = layout.zones.find(
            (z) => z.id === assessment.link.sourceZoneId
          );
          const targetZone = layout.zones.find(
            (z) => z.id === assessment.link.targetZoneId
          );

          if (!sourceZone || !targetZone) return null;

          const isHovered = hoveredLinkId === assessment.link.id;
          const isRelatedToSelected =
            selectedZoneId &&
            (assessment.link.sourceZoneId === selectedZoneId ||
              assessment.link.targetZoneId === selectedZoneId);

          const color = STATUS_COLORS[assessment.status];
          const width = STATUS_LINE_WIDTHS[assessment.status];
          const opacity = isHovered ? 1 : isRelatedToSelected ? 0.9 : 0.6;

          return (
            <g key={assessment.link.id}>
              {/* Invisible wider path for easier hover */}
              <path
                d={generateCurvePath(sourceZone, targetZone)}
                fill="none"
                stroke="transparent"
                strokeWidth={20}
                className="pointer-events-auto cursor-pointer"
                onMouseEnter={() => onLinkHover?.(assessment.link.id)}
                onMouseLeave={() => onLinkHover?.(null)}
                onClick={() => onLinkClick?.(assessment.link.id)}
              />
              {/* Visible path */}
              <path
                d={generateCurvePath(sourceZone, targetZone)}
                fill="none"
                stroke={color}
                strokeWidth={isHovered ? width + 1 : width}
                strokeOpacity={opacity}
                strokeDasharray={assessment.status === "critical" ? "5,5" : undefined}
                className="transition-all duration-200"
              />
              {/* Endpoint circles */}
              <circle
                cx={toSvgCoord(getZoneCenter(sourceZone).x)}
                cy={toSvgCoord(getZoneCenter(sourceZone).y)}
                r={4}
                fill={color}
                opacity={opacity}
              />
              <circle
                cx={toSvgCoord(getZoneCenter(targetZone).x)}
                cy={toSvgCoord(getZoneCenter(targetZone).y)}
                r={4}
                fill={color}
                opacity={opacity}
              />
            </g>
          );
        })}
      </g>

      {/* Concentric circles for selected zone */}
      {selectedZone && (
        <g className="concentric-circles">
          {/* 10m circle - optimal range */}
          <circle
            cx={toSvgCoord(getZoneCenter(selectedZone).x)}
            cy={toSvgCoord(getZoneCenter(selectedZone).y)}
            r={toSvgCoord(DISTANCE_THRESHOLDS.optimal)}
            fill="none"
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="8,4"
            opacity={0.7}
          />
          <text
            x={toSvgCoord(getZoneCenter(selectedZone).x) + toSvgCoord(DISTANCE_THRESHOLDS.optimal) + 5}
            y={toSvgCoord(getZoneCenter(selectedZone).y)}
            fill="#10b981"
            fontSize={12}
            opacity={0.8}
          >
            10m
          </text>

          {/* 30m circle - warning range */}
          <circle
            cx={toSvgCoord(getZoneCenter(selectedZone).x)}
            cy={toSvgCoord(getZoneCenter(selectedZone).y)}
            r={toSvgCoord(DISTANCE_THRESHOLDS.warning)}
            fill="none"
            stroke="#f97316"
            strokeWidth={1.5}
            strokeDasharray="8,4"
            opacity={0.5}
          />
          <text
            x={toSvgCoord(getZoneCenter(selectedZone).x) + toSvgCoord(DISTANCE_THRESHOLDS.warning) + 5}
            y={toSvgCoord(getZoneCenter(selectedZone).y)}
            fill="#f97316"
            fontSize={12}
            opacity={0.6}
          >
            30m
          </text>
        </g>
      )}

      {/* Hover tooltip */}
      {hoveredLinkId && (
        <HoverTooltip
          assessment={assessments.find((a) => a.link.id === hoveredLinkId)}
          zones={layout.zones}
          toSvgCoord={toSvgCoord}
        />
      )}
    </svg>
  );
}

/**
 * Tooltip component for hovered links
 */
function HoverTooltip({
  assessment,
  zones,
  toSvgCoord,
}: {
  assessment?: LinkAssessment;
  zones: ZoneData[];
  toSvgCoord: (v: number) => number;
}) {
  if (!assessment) return null;

  const sourceZone = zones.find((z) => z.id === assessment.link.sourceZoneId);
  const targetZone = zones.find((z) => z.id === assessment.link.targetZoneId);

  if (!sourceZone || !targetZone) return null;

  const centerA = getZoneCenter(sourceZone);
  const centerB = getZoneCenter(targetZone);
  const midX = toSvgCoord((centerA.x + centerB.x) / 2);
  const midY = toSvgCoord((centerA.y + centerB.y) / 2) - 30;

  return (
    <g className="tooltip">
      <rect
        x={midX - 80}
        y={midY - 25}
        width={160}
        height={50}
        rx={6}
        fill="rgba(15, 23, 42, 0.95)"
        stroke="rgba(100, 116, 139, 0.3)"
      />
      <text x={midX} y={midY - 5} textAnchor="middle" fill="white" fontSize={12}>
        {sourceZone.name} ↔ {targetZone.name}
      </text>
      <text x={midX} y={midY + 15} textAnchor="middle" fill="#94a3b8" fontSize={11}>
        距离: {assessment.distance}m | 效率: {assessment.efficiency}%
      </text>
    </g>
  );
}
```

**Step 2: 验证文件创建**

Run: `cat src/components/lab/AllenCurveOverlay.tsx | head -30`

**Step 3: Commit**

```bash
git add src/components/lab/AllenCurveOverlay.tsx
git commit -m "feat(allen-curve): add overlay component for connection visualization"
```

---

## Task 4: 创建 AllenCurvePanel 组件

**Files:**
- Create: `src/components/lab/AllenCurvePanel.tsx`

**Step 1: 创建面板组件**

```typescript
/**
 * Allen Curve Panel
 * Side panel for viewing communication analysis and recommendations
 */

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  Link2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Settings2,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { AllenCurveAssessment, LinkAssessment, CollaborationIntensity } from "@/lib/schemas/allen-curve";
import {
  INTENSITY_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from "@/lib/schemas/allen-curve";
import { assessLayout } from "@/lib/utils/allen-curve-calculator";

interface AllenCurvePanelProps {
  layout: LayoutData;
  onClose: () => void;
  onZoneSelect?: (zoneId: string) => void;
  onLinkHover?: (linkId: string | null) => void;
}

type ViewTab = "overview" | "links" | "recommendations";

export function AllenCurvePanel({
  layout,
  onClose,
  onZoneSelect,
  onLinkHover,
}: AllenCurvePanelProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  // Calculate assessment
  const assessment = useMemo(() => assessLayout(layout), [layout]);

  // Get zone name by ID
  const getZoneName = (zoneId: string) => {
    return layout.zones.find((z) => z.id === zoneId)?.name || "未知区域";
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: LinkAssessment["status"] }) => {
    switch (status) {
      case "optimal":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "acceptable":
        return <CheckCircle className="w-4 h-4 text-cyan-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[var(--neon-violet)]" />
          <h2 className="font-semibold">Allen Curve 通信分析</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Score */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted-foreground)]">
              整体沟通效率
            </span>
            <span
              className="text-lg font-bold"
              style={{ color: getScoreColor(assessment.overallScore) }}
            >
              {assessment.overallScore}
            </span>
          </div>
          <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${assessment.overallScore}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${getScoreColor(assessment.overallScore)}, ${getScoreColor(assessment.overallScore)}88)`,
              }}
            />
          </div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">
            共 {assessment.links.length} 个协作连接
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--glass-border)]">
        {(["overview", "links", "recommendations"] as ViewTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-[var(--neon-violet)] border-b-2 border-[var(--neon-violet)]"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab === "overview" && "概览"}
            {tab === "links" && "连接详情"}
            {tab === "recommendations" && "优化建议"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <OverviewTab assessment={assessment} getZoneName={getZoneName} />
        )}

        {activeTab === "links" && (
          <LinksTab
            assessment={assessment}
            getZoneName={getZoneName}
            expandedLinkId={expandedLinkId}
            onExpandLink={setExpandedLinkId}
            onZoneSelect={onZoneSelect}
            onLinkHover={onLinkHover}
          />
        )}

        {activeTab === "recommendations" && (
          <RecommendationsTab
            assessment={assessment}
            getZoneName={getZoneName}
            onZoneSelect={onZoneSelect}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Overview Tab
 */
function OverviewTab({
  assessment,
  getZoneName,
}: {
  assessment: AllenCurveAssessment;
  getZoneName: (id: string) => string;
}) {
  // Count by status
  const statusCounts = assessment.links.reduce(
    (acc, link) => {
      acc[link.status]++;
      return acc;
    },
    { optimal: 0, acceptable: 0, warning: 0, critical: 0 }
  );

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className="glass-card p-3 flex items-center justify-between"
          >
            <span className="text-sm">{STATUS_LABELS[status as keyof typeof STATUS_LABELS]}</span>
            <span
              className="text-lg font-bold"
              style={{ color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Problem Links */}
      {(statusCounts.warning > 0 || statusCounts.critical > 0) && (
        <div className="glass-card p-4">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            需关注的连接
          </h3>
          <div className="space-y-2">
            {assessment.links
              .filter((l) => l.status === "critical" || l.status === "warning")
              .slice(0, 5)
              .map((link) => (
                <div
                  key={link.link.id}
                  className="flex items-center justify-between text-sm py-2 border-b border-[var(--glass-border)] last:border-0"
                >
                  <span>
                    {getZoneName(link.link.sourceZoneId)} ↔{" "}
                    {getZoneName(link.link.targetZoneId)}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: `${STATUS_COLORS[link.status]}20`,
                      color: STATUS_COLORS[link.status],
                    }}
                  >
                    {link.efficiency}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Links Tab
 */
function LinksTab({
  assessment,
  getZoneName,
  expandedLinkId,
  onExpandLink,
  onZoneSelect,
  onLinkHover,
}: {
  assessment: AllenCurveAssessment;
  getZoneName: (id: string) => string;
  expandedLinkId: string | null;
  onExpandLink: (id: string | null) => void;
  onZoneSelect?: (id: string) => void;
  onLinkHover?: (id: string | null) => void;
}) {
  // Sort by status priority (critical first)
  const sortedLinks = [...assessment.links].sort((a, b) => {
    const statusOrder = { critical: 0, warning: 1, acceptable: 2, optimal: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-2">
      {sortedLinks.map((link) => (
        <motion.div
          key={link.link.id}
          className="glass-card overflow-hidden"
          onMouseEnter={() => onLinkHover?.(link.link.id)}
          onMouseLeave={() => onLinkHover?.(null)}
        >
          <div
            className="p-3 flex items-center justify-between cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
            onClick={() =>
              onExpandLink(expandedLinkId === link.link.id ? null : link.link.id)
            }
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: STATUS_COLORS[link.status] }}
              />
              <span className="text-sm font-medium">
                {getZoneName(link.link.sourceZoneId)} ↔{" "}
                {getZoneName(link.link.targetZoneId)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)]">
                {link.distance}m
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: STATUS_COLORS[link.status] }}
              >
                {link.efficiency}%
              </span>
              {expandedLinkId === link.link.id ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {expandedLinkId === link.link.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3 border-t border-[var(--glass-border)]"
            >
              <div className="pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">协作强度</span>
                  <span>{INTENSITY_LABELS[link.link.intensity]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">状态</span>
                  <span style={{ color: STATUS_COLORS[link.status] }}>
                    {STATUS_LABELS[link.status]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">推断方式</span>
                  <span>{link.link.autoInferred ? "自动推断" : "手动设置"}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => onZoneSelect?.(link.link.sourceZoneId)}
                    className="flex-1 py-1.5 text-xs rounded bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
                  >
                    选中 {getZoneName(link.link.sourceZoneId)}
                  </button>
                  <button
                    onClick={() => onZoneSelect?.(link.link.targetZoneId)}
                    className="flex-1 py-1.5 text-xs rounded bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
                  >
                    选中 {getZoneName(link.link.targetZoneId)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Recommendations Tab
 */
function RecommendationsTab({
  assessment,
  getZoneName,
  onZoneSelect,
}: {
  assessment: AllenCurveAssessment;
  getZoneName: (id: string) => string;
  onZoneSelect?: (id: string) => void;
}) {
  if (assessment.recommendations.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--muted-foreground)]">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
        <p>布局沟通效率良好，无需优化</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {assessment.recommendations.map((rec, index) => (
        <div key={index} className="glass-card p-4">
          <div className="flex items-start gap-3">
            <div
              className={`mt-1 w-2 h-2 rounded-full ${
                rec.priority === "high"
                  ? "bg-red-400"
                  : rec.priority === "medium"
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
            />
            <div className="flex-1">
              <p className="text-sm">{rec.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">
                  预计提升 +{rec.estimatedImprovement} 分
                </span>
              </div>
              {rec.affectedZones.length <= 2 && (
                <div className="flex gap-2 mt-3">
                  {rec.affectedZones.map((zoneId) => (
                    <button
                      key={zoneId}
                      onClick={() => onZoneSelect?.(zoneId)}
                      className="text-xs px-2 py-1 rounded bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors"
                    >
                      {getZoneName(zoneId)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Get color based on score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#22d3ee";
  if (score >= 40) return "#eab308";
  return "#ef4444";
}
```

**Step 2: 验证文件创建**

Run: `cat src/components/lab/AllenCurvePanel.tsx | head -30`

**Step 3: Commit**

```bash
git add src/components/lab/AllenCurvePanel.tsx
git commit -m "feat(allen-curve): add side panel component for analysis display"
```

---

## Task 5: 集成到 Floor Plan 页面

**Files:**
- Modify: `src/app/[locale]/lab/floor-plan/page.tsx`

**Step 1: 添加导入语句**

在文件顶部添加：

```typescript
import { Link2 } from "lucide-react"; // 添加到现有 lucide-react 导入
import { AllenCurvePanel } from "@/components/lab/AllenCurvePanel";
import { AllenCurveOverlay } from "@/components/lab/AllenCurveOverlay";
import { assessLayout as assessAllenCurve } from "@/lib/utils/allen-curve-calculator";
```

**Step 2: 添加状态变量**

在其他 `useState` 声明附近添加：

```typescript
const [showAllenCurve, setShowAllenCurve] = useState(false);
const [hoveredLinkId, setHoveredLinkId] = useState<string | null>(null);
```

**Step 3: 添加工具栏按钮**

在 `showPsychologicalSafety` 按钮后添加：

```typescript
<button
  onClick={() => setShowAllenCurve(!showAllenCurve)}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
    showAllenCurve
      ? "bg-[var(--neon-violet)] text-[var(--background)]"
      : "bg-[var(--glass-bg)] hover:bg-[var(--glass-border)]"
  }`}
  title="Allen Curve 通信分析"
>
  <Link2 className="w-4 h-4" />
</button>
```

**Step 4: 添加 Overlay 渲染**

在 `FloorPlanCanvas` 组件后、`{showMeasurement &&` 之前添加：

```typescript
{/* Allen Curve Overlay */}
{showAllenCurve && (
  <AllenCurveOverlay
    layout={layout}
    assessments={assessAllenCurve(layout).links}
    selectedZoneId={selectedZone}
    zoom={zoom}
    gridSize={GRID_SIZE}
    hoveredLinkId={hoveredLinkId}
    onLinkHover={setHoveredLinkId}
  />
)}
```

**Step 5: 添加侧边栏面板**

在 `{showPsychologicalSafety && (...)}` 块后添加：

```typescript
{showAllenCurve && (
  <motion.div
    key="allen-curve"
    initial={{ x: 400, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 400, opacity: 0 }}
    className="w-[420px] border-l border-[var(--glass-border)] bg-[var(--background)]"
  >
    <AllenCurvePanel
      layout={layout}
      onClose={() => setShowAllenCurve(false)}
      onZoneSelect={(zoneId) => setSelectedZone(zoneId)}
      onLinkHover={setHoveredLinkId}
    />
  </motion.div>
)}
```

**Step 6: 验证集成**

Run: `npx tsc --noEmit`
Expected: Exit code 0

**Step 7: Commit**

```bash
git add src/app/[locale]/lab/floor-plan/page.tsx
git commit -m "feat(allen-curve): integrate Allen Curve analysis into Floor Plan"
```

---

## Task 6: 最终验证与清理

**Step 1: 运行类型检查**

Run: `npx tsc --noEmit`
Expected: Exit code 0

**Step 2: 运行构建（可选，如果 MDX 错误已修复）**

Run: `pnpm run build`

**Step 3: 最终 Commit**

```bash
git add -A
git commit -m "feat(floor-plan): complete Allen Curve communication analysis feature

- Add Allen Curve theory-based communication efficiency visualization
- Auto-infer collaboration relationships from zone types
- Show connection lines with efficiency status colors
- Display concentric circles for selected zones (10m/30m thresholds)
- Provide optimization recommendations for layout improvements
- Support hover interactions and zone selection from panel"
```

---

## 完成标准

- [ ] Schema 文件创建并导出正确类型
- [ ] Calculator 实现 Allen Curve 效率计算
- [ ] Overlay 正确渲染连接线和同心圆
- [ ] Panel 显示评估结果和建议
- [ ] 集成到 Floor Plan 页面
- [ ] TypeScript 编译通过
- [ ] 所有代码已提交
