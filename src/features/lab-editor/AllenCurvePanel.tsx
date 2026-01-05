"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Link2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Lightbulb,
  MapPin,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type {
  LinkAssessment,
  LinkStatus,
  AllenCurveAssessment,
  AllenCurveRecommendation,
} from "@/lib/schemas/allen-curve";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  INTENSITY_LABELS,
} from "@/lib/schemas/allen-curve";
import { assessLayout } from "@/lib/utils/allen-curve-calculator";

/**
 * Status icon component
 */
function StatusIcon({ status, className }: { status: LinkStatus; className?: string }) {
  switch (status) {
    case "optimal":
      return <CheckCircle className={className} style={{ color: STATUS_COLORS.optimal }} />;
    case "acceptable":
      return <Info className={className} style={{ color: STATUS_COLORS.acceptable }} />;
    case "warning":
      return <AlertTriangle className={className} style={{ color: STATUS_COLORS.warning }} />;
    case "critical":
      return <AlertCircle className={className} style={{ color: STATUS_COLORS.critical }} />;
  }
}

/**
 * Safety level labels and colors
 */
const SAFETY_LEVEL_LABELS: Record<AllenCurveAssessment["safetyLevel"], string> = {
  excellent: "优秀",
  good: "良好",
  moderate: "中等",
  needs_improvement: "需改进",
  critical: "需警惕",
};

const SAFETY_LEVEL_COLORS: Record<AllenCurveAssessment["safetyLevel"], string> = {
  excellent: "text-green-400",
  good: "text-cyan-400",
  moderate: "text-yellow-400",
  needs_improvement: "text-orange-400",
  critical: "text-red-400",
};

/**
 * Priority labels and colors
 */
const PRIORITY_LABELS: Record<AllenCurveRecommendation["priority"], string> = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
};

const PRIORITY_COLORS: Record<AllenCurveRecommendation["priority"], string> = {
  high: "bg-red-500/20 border-red-500/50 text-red-400",
  medium: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
  low: "bg-green-500/20 border-green-500/50 text-green-400",
};

const PRIORITY_DOT_COLORS: Record<AllenCurveRecommendation["priority"], string> = {
  high: "bg-red-400",
  medium: "bg-yellow-400",
  low: "bg-green-400",
};

/**
 * Tab type
 */
type TabType = "overview" | "links" | "recommendations";

interface AllenCurvePanelProps {
  layout: LayoutData;
  onClose: () => void;
  onZoneSelect?: (zoneId: string) => void;
  onLinkHover?: (linkId: string | null) => void;
}

export function AllenCurvePanel({
  layout,
  onClose,
  onZoneSelect,
  onLinkHover,
}: AllenCurvePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  // Calculate assessment
  const assessment = useMemo(() => {
    return assessLayout(layout);
  }, [layout]);

  // Get zone name by ID
  const getZoneName = useCallback(
    (zoneId: string) => {
      const zone = layout.zones.find((z) => z.id === zoneId);
      return zone?.name || "未知区域";
    },
    [layout.zones]
  );

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<LinkStatus, number> = {
      optimal: 0,
      acceptable: 0,
      warning: 0,
      critical: 0,
    };
    for (const link of assessment.links) {
      counts[link.status]++;
    }
    return counts;
  }, [assessment.links]);

  // Problem links (warning + critical)
  const problemLinks = useMemo(() => {
    return assessment.links.filter(
      (link) => link.status === "warning" || link.status === "critical"
    );
  }, [assessment.links]);

  // Sorted links by status priority
  const sortedLinks = useMemo(() => {
    const statusPriority: Record<LinkStatus, number> = {
      critical: 0,
      warning: 1,
      acceptable: 2,
      optimal: 3,
    };
    return [...assessment.links].sort(
      (a, b) => statusPriority[a.status] - statusPriority[b.status]
    );
  }, [assessment.links]);

  // Handle link card toggle
  const handleLinkToggle = (linkId: string) => {
    setExpandedLinkId(expandedLinkId === linkId ? null : linkId);
  };

  // Handle link hover
  const handleLinkMouseEnter = (linkId: string) => {
    onLinkHover?.(linkId);
  };

  const handleLinkMouseLeave = () => {
    onLinkHover?.(null);
  };

  // Handle zone selection from link
  const handleSelectZone = (zoneId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onZoneSelect?.(zoneId);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-semibold">Allen Curve 通信分析</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="关闭面板"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="p-4 border-b border-[var(--glass-border)]">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-[var(--muted-foreground)]">通信效率指数</div>
              <div className="text-3xl font-bold text-[var(--neon-cyan)] mt-1">
                {assessment.overallScore}/100
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--muted-foreground)]">评级</div>
              <div className={`text-xl font-bold mt-1 ${SAFETY_LEVEL_COLORS[assessment.safetyLevel]}`}>
                {SAFETY_LEVEL_LABELS[assessment.safetyLevel]}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${assessment.overallScore}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${STATUS_COLORS.critical}, ${STATUS_COLORS.warning}, ${STATUS_COLORS.acceptable}, ${STATUS_COLORS.optimal})`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 mx-4 mt-2 rounded-lg bg-[var(--glass-bg)]">
        {[
          { key: "overview" as TabType, label: "概览" },
          { key: "links" as TabType, label: "连接详情" },
          { key: "recommendations" as TabType, label: "优化建议" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 rounded-md text-sm transition-colors ${
              activeTab === key
                ? "bg-[var(--neon-cyan)] text-black font-medium"
                : "hover:bg-[var(--glass-border)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <OverviewTab
              key="overview"
              statusCounts={statusCounts}
              problemLinks={problemLinks}
              getZoneName={getZoneName}
              onLinkHover={onLinkHover}
              onZoneSelect={onZoneSelect}
            />
          )}
          {activeTab === "links" && (
            <LinksTab
              key="links"
              links={sortedLinks}
              expandedLinkId={expandedLinkId}
              getZoneName={getZoneName}
              onLinkToggle={handleLinkToggle}
              onLinkMouseEnter={handleLinkMouseEnter}
              onLinkMouseLeave={handleLinkMouseLeave}
              onSelectZone={handleSelectZone}
            />
          )}
          {activeTab === "recommendations" && (
            <RecommendationsTab
              key="recommendations"
              recommendations={assessment.recommendations}
              getZoneName={getZoneName}
              onZoneSelect={onZoneSelect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Overview tab component
 */
function OverviewTab({
  statusCounts,
  problemLinks,
  getZoneName,
  onLinkHover,
  onZoneSelect,
}: {
  statusCounts: Record<LinkStatus, number>;
  problemLinks: LinkAssessment[];
  getZoneName: (zoneId: string) => string;
  onLinkHover?: (linkId: string | null) => void;
  onZoneSelect?: (zoneId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Status counts */}
      <div className="glass-card p-4">
        <h3 className="font-medium mb-3">连接状态分布</h3>
        <div className="grid grid-cols-4 gap-2">
          {(["optimal", "acceptable", "warning", "critical"] as LinkStatus[]).map((status) => (
            <div key={status} className="text-center">
              <div
                className="text-2xl font-bold"
                style={{ color: STATUS_COLORS[status] }}
              >
                {statusCounts[status]}
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {STATUS_LABELS[status]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Problem links */}
      {problemLinks.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            需要关注的连接 ({problemLinks.length})
          </h3>
          <ul className="space-y-2">
            {problemLinks.map((link) => (
              <li
                key={link.link.id}
                className="flex items-center justify-between p-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] transition-colors cursor-pointer"
                onMouseEnter={() => onLinkHover?.(link.link.id)}
                onMouseLeave={() => onLinkHover?.(null)}
              >
                <div className="flex items-center gap-2">
                  <StatusIcon status={link.status} className="w-4 h-4" />
                  <span className="text-sm">
                    {getZoneName(link.link.sourceZoneId)}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)]" />
                  <span className="text-sm">
                    {getZoneName(link.link.targetZoneId)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: STATUS_COLORS[link.status] }}
                  >
                    {link.efficiency.toFixed(0)}%
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onZoneSelect?.(link.link.sourceZoneId);
                    }}
                    className="p-1 rounded hover:bg-[var(--glass-border)] transition-colors"
                    title="定位源区域"
                  >
                    <MapPin className="w-3 h-3" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {problemLinks.length === 0 && (
        <div className="glass-card p-4 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
          <p className="text-sm text-[var(--muted-foreground)]">
            所有连接状态良好！
          </p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Links tab component
 */
function LinksTab({
  links,
  expandedLinkId,
  getZoneName,
  onLinkToggle,
  onLinkMouseEnter,
  onLinkMouseLeave,
  onSelectZone,
}: {
  links: LinkAssessment[];
  expandedLinkId: string | null;
  getZoneName: (zoneId: string) => string;
  onLinkToggle: (linkId: string) => void;
  onLinkMouseEnter: (linkId: string) => void;
  onLinkMouseLeave: () => void;
  onSelectZone: (zoneId: string, e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
    >
      {links.map((assessment) => {
        const isExpanded = expandedLinkId === assessment.link.id;

        return (
          <div
            key={assessment.link.id}
            className="glass-card overflow-hidden"
            onMouseEnter={() => onLinkMouseEnter(assessment.link.id)}
            onMouseLeave={onLinkMouseLeave}
          >
            {/* Link header */}
            <button
              onClick={() => onLinkToggle(assessment.link.id)}
              className="w-full p-3 flex items-center justify-between hover:bg-[var(--glass-bg)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <StatusIcon status={assessment.status} className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getZoneName(assessment.link.sourceZoneId)}
                </span>
                <ArrowRight className="w-3 h-3 text-[var(--muted-foreground)]" />
                <span className="text-sm font-medium">
                  {getZoneName(assessment.link.targetZoneId)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: STATUS_COLORS[assessment.status] }}
                >
                  {assessment.efficiency.toFixed(0)}%
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[var(--glass-border)]"
                >
                  <div className="p-3 space-y-3">
                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 rounded bg-[var(--glass-bg)]">
                        <div className="text-xs text-[var(--muted-foreground)]">距离</div>
                        <div className="font-medium">{assessment.distance.toFixed(1)}m</div>
                      </div>
                      <div className="p-2 rounded bg-[var(--glass-bg)]">
                        <div className="text-xs text-[var(--muted-foreground)]">效率</div>
                        <div
                          className="font-medium"
                          style={{ color: STATUS_COLORS[assessment.status] }}
                        >
                          {assessment.efficiency.toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[var(--glass-bg)]">
                        <div className="text-xs text-[var(--muted-foreground)]">协作强度</div>
                        <div className="font-medium">
                          {INTENSITY_LABELS[assessment.link.intensity]}
                        </div>
                      </div>
                      <div className="p-2 rounded bg-[var(--glass-bg)]">
                        <div className="text-xs text-[var(--muted-foreground)]">状态</div>
                        <div
                          className="font-medium"
                          style={{ color: STATUS_COLORS[assessment.status] }}
                        >
                          {STATUS_LABELS[assessment.status]}
                        </div>
                      </div>
                    </div>

                    {/* Zone selection buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => onSelectZone(assessment.link.sourceZoneId, e)}
                        className="flex-1 py-2 px-3 text-sm rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        定位 {getZoneName(assessment.link.sourceZoneId)}
                      </button>
                      <button
                        onClick={(e) => onSelectZone(assessment.link.targetZoneId, e)}
                        className="flex-1 py-2 px-3 text-sm rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        定位 {getZoneName(assessment.link.targetZoneId)}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </motion.div>
  );
}

/**
 * Recommendations tab component
 */
function RecommendationsTab({
  recommendations,
  getZoneName,
  onZoneSelect,
}: {
  recommendations: AllenCurveRecommendation[];
  getZoneName: (zoneId: string) => string;
  onZoneSelect?: (zoneId: string) => void;
}) {
  if (recommendations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-400" />
        <p className="text-sm text-[var(--muted-foreground)]">
          当前布局已优化，暂无改进建议
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {recommendations.map((rec, index) => (
        <div
          key={index}
          className={`glass-card p-4 border ${PRIORITY_COLORS[rec.priority]}`}
        >
          {/* Priority badge */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${PRIORITY_DOT_COLORS[rec.priority]}`}
              />
              <span className="text-xs font-medium">
                {PRIORITY_LABELS[rec.priority]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Lightbulb className="w-3 h-3" />
              <span>预计提升 +{rec.estimatedImprovement.toFixed(0)}%</span>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm mb-3">{rec.message}</p>

          {/* Affected zones buttons */}
          <div className="flex flex-wrap gap-2">
            {rec.affectedZones.map((zoneId) => (
              <button
                key={zoneId}
                onClick={() => onZoneSelect?.(zoneId)}
                className="py-1 px-2 text-xs rounded border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                {getZoneName(zoneId)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
