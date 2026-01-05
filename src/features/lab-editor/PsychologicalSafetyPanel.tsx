"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Brain,
  Loader2,
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  MessageSquare,
  Lightbulb,
  Heart,
  Lock,
  BarChart3,
  Map,
  Eye,
  RefreshCw,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type {
  LayoutPsychologicalSafety,
  ZonePsychologicalSafety,
  PsychologicalSafetyDimension,
} from "@/lib/schemas/psychological-safety";
import {
  DIMENSION_LABELS,
  DIMENSION_DESCRIPTIONS,
  SAFETY_LEVEL_LABELS,
  SAFETY_LEVEL_COLORS,
} from "@/lib/schemas/psychological-safety";
import { assessLayout } from "@/lib/utils/psychological-safety-calculator";

// Dimension icons mapping
const DIMENSION_ICONS: Record<PsychologicalSafetyDimension, React.ComponentType<{ className?: string }>> = {
  inclusion: Users,
  learner: BookOpen,
  contributor: MessageSquare,
  challenger: Lightbulb,
  restorative: Heart,
  privacy: Lock,
};

interface PsychologicalSafetyPanelProps {
  layout: LayoutData;
  onClose: () => void;
  onZoneSelect?: (zoneId: string) => void;
}

export function PsychologicalSafetyPanel({
  layout,
  onClose,
  onZoneSelect,
}: PsychologicalSafetyPanelProps) {
  const [assessment, setAssessment] = useState<LayoutPsychologicalSafety | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [viewMode, setViewMode] = useState<"overview" | "zones">("overview");
  const [expandedZone, setExpandedZone] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // Perform assessment
  const handleAssess = useCallback(() => {
    setIsAssessing(true);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      try {
        const result = assessLayout(layout);
        setAssessment({
          layoutId: layout.name,
          ...result,
          assessedAt: new Date(),
        });
      } catch (error) {
        console.error("Failed to assess psychological safety:", error);
      } finally {
        setIsAssessing(false);
      }
    }, 100);
  }, [layout]);

  // Get selected zone assessment
  const selectedZoneAssessment = useMemo(() => {
    if (!assessment || !selectedZoneId) return null;
    return assessment.zoneAssessments.find((z) => z.zoneId === selectedZoneId);
  }, [assessment, selectedZoneId]);

  const handleZoneClick = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setExpandedZone(expandedZone === zoneId ? null : zoneId);
    onZoneSelect?.(zoneId);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[var(--neon-purple)]" />
          <h2 className="font-semibold">心理安全感评估</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="关闭面板"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!assessment ? (
          <InitialState onAssess={handleAssess} isAssessing={isAssessing} />
        ) : (
          <>
            {/* View Mode Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--glass-bg)]">
              {[
                { key: "overview", label: "总览", icon: BarChart3 },
                { key: "zones", label: "分区", icon: Map },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as typeof viewMode)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                    viewMode === key
                      ? "bg-[var(--neon-purple)] text-white"
                      : "hover:bg-[var(--glass-border)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>

            {/* Overall Score Card */}
            <OverallScoreCard assessment={assessment} />

            {/* View Content */}
            <AnimatePresence mode="wait">
              {viewMode === "overview" && (
                <OverviewView key="overview" assessment={assessment} />
              )}
              {viewMode === "zones" && (
                <ZonesView
                  key="zones"
                  assessment={assessment}
                  layout={layout}
                  expandedZone={expandedZone}
                  onZoneClick={handleZoneClick}
                />
              )}
            </AnimatePresence>

            {/* Recommendations */}
            {assessment.topRecommendations.length > 0 && (
              <div className="glass-card p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  优先改进建议
                </h3>
                <ul className="space-y-2 text-sm">
                  {assessment.topRecommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--muted-foreground)]">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Re-assess Button */}
            <button
              onClick={handleAssess}
              disabled={isAssessing}
              className="w-full py-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-purple)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAssessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>重新评估中...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>重新评估</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Initial state component
function InitialState({
  onAssess,
  isAssessing,
}: {
  onAssess: () => void;
  isAssessing: boolean;
}) {
  return (
    <div className="text-center py-12">
      <Brain className="w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
      <h3 className="text-lg font-medium mb-2">心理安全感分区评估</h3>
      <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-xs mx-auto">
        基于 Edmondson 心理安全理论，分析每个区域对心理安全感的支持程度
      </p>
      <div className="space-y-3 text-sm text-[var(--muted-foreground)] mb-8">
        {(Object.keys(DIMENSION_LABELS) as PsychologicalSafetyDimension[]).slice(0, 4).map((dim) => {
          const Icon = DIMENSION_ICONS[dim];
          return (
            <div key={dim} className="flex items-center gap-2 justify-center">
              <Icon className="w-4 h-4" />
              <span>{DIMENSION_LABELS[dim]} - {DIMENSION_DESCRIPTIONS[dim]}</span>
            </div>
          );
        })}
      </div>
      <button
        onClick={onAssess}
        disabled={isAssessing}
        className="flex items-center justify-center gap-2 px-6 py-3 mx-auto rounded-lg bg-[var(--neon-purple)] text-white hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {isAssessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>评估中...</span>
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            <span>开始评估</span>
          </>
        )}
      </button>
    </div>
  );
}

// Overall score card component
function OverallScoreCard({ assessment }: { assessment: LayoutPsychologicalSafety }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm text-[var(--muted-foreground)]">整体心理安全指数</div>
          <div className="text-4xl font-bold text-[var(--neon-purple)] mt-1">
            {assessment.overallScore}/100
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-[var(--muted-foreground)]">安全等级</div>
          <div className={`text-2xl font-bold mt-1 ${SAFETY_LEVEL_COLORS[assessment.safetyLevel]}`}>
            {SAFETY_LEVEL_LABELS[assessment.safetyLevel]}
          </div>
        </div>
      </div>
      <p className="text-sm text-[var(--muted-foreground)]">{assessment.summary}</p>
    </motion.div>
  );
}

// Overview view with radar chart representation
function OverviewView({ assessment }: { assessment: LayoutPsychologicalSafety }) {
  // Calculate average scores for each dimension across all zones
  const dimensionAverages = useMemo(() => {
    const dimensions = Object.keys(DIMENSION_LABELS) as PsychologicalSafetyDimension[];
    const averages: Record<PsychologicalSafetyDimension, number> = {} as Record<PsychologicalSafetyDimension, number>;

    dimensions.forEach((dim) => {
      const scores = assessment.zoneAssessments.map((zone) => {
        const dimScore = zone.dimensions.find((d) => d.dimension === dim);
        return dimScore?.score ?? 50;
      });
      averages[dim] = Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    });

    return averages;
  }, [assessment]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Dimension scores */}
      <div className="glass-card p-4">
        <h3 className="font-medium mb-4">六维度平均分</h3>
        <div className="space-y-3">
          {(Object.keys(DIMENSION_LABELS) as PsychologicalSafetyDimension[]).map((dim) => {
            const Icon = DIMENSION_ICONS[dim];
            const score = dimensionAverages[dim];
            const barWidth = `${score}%`;
            const barColor =
              score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";

            return (
              <div key={dim} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span>{DIMENSION_LABELS[dim]}</span>
                  </div>
                  <span className="font-medium">{score}</span>
                </div>
                <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: barWidth }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className={`h-full ${barColor} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone summary */}
      <div className="glass-card p-4">
        <h3 className="font-medium mb-3">区域分布</h3>
        <div className="grid grid-cols-5 gap-2">
          {["excellent", "good", "moderate", "needs_improvement", "critical"].map((level) => {
            const count = assessment.zoneAssessments.filter((z) => z.safetyLevel === level).length;
            return (
              <div key={level} className="text-center">
                <div className={`text-2xl font-bold ${SAFETY_LEVEL_COLORS[level]}`}>{count}</div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {SAFETY_LEVEL_LABELS[level]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Zones view with expandable zone cards
function ZonesView({
  assessment,
  layout,
  expandedZone,
  onZoneClick,
}: {
  assessment: LayoutPsychologicalSafety;
  layout: LayoutData;
  expandedZone: string | null;
  onZoneClick: (zoneId: string) => void;
}) {
  // Sort zones by score (lowest first for priority)
  const sortedAssessments = useMemo(() => {
    return [...assessment.zoneAssessments].sort((a, b) => a.overallScore - b.overallScore);
  }, [assessment]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {sortedAssessments.map((zoneAssessment) => {
        const zone = layout.zones.find((z) => z.id === zoneAssessment.zoneId);
        const isExpanded = expandedZone === zoneAssessment.zoneId;

        return (
          <div key={zoneAssessment.zoneId} className="glass-card overflow-hidden">
            <button
              onClick={() => onZoneClick(zoneAssessment.zoneId)}
              className="w-full p-4 flex items-center justify-between hover:bg-[var(--glass-bg)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: zone?.color || "#666" }}
                />
                <div className="text-left">
                  <div className="font-medium">{zone?.name || "未知区域"}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {zone?.type || "未知类型"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className={`font-bold ${SAFETY_LEVEL_COLORS[zoneAssessment.safetyLevel]}`}>
                    {zoneAssessment.overallScore}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {SAFETY_LEVEL_LABELS[zoneAssessment.safetyLevel]}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-[var(--glass-border)]"
                >
                  <div className="p-4 space-y-4">
                    {/* Dimension scores */}
                    <div className="grid grid-cols-2 gap-2">
                      {zoneAssessment.dimensions.map((dim) => {
                        const Icon = DIMENSION_ICONS[dim.dimension];
                        return (
                          <div
                            key={dim.dimension}
                            className="flex items-center gap-2 p-2 rounded bg-[var(--glass-bg)]"
                          >
                            <Icon className="w-4 h-4 text-[var(--muted-foreground)]" />
                            <span className="text-sm flex-1">{DIMENSION_LABELS[dim.dimension]}</span>
                            <span
                              className={`font-medium ${
                                dim.score >= 70
                                  ? "text-green-400"
                                  : dim.score >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {dim.score}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recommendations */}
                    {zoneAssessment.recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">改进建议</h4>
                        <ul className="space-y-1 text-sm text-[var(--muted-foreground)]">
                          {zoneAssessment.recommendations.slice(0, 3).map((rec, i) => (
                            <li key={i} className="flex gap-2">
                              <span
                                className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  rec.priority === "high"
                                    ? "bg-red-400"
                                    : rec.priority === "medium"
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                }`}
                              />
                              <span>{rec.action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
