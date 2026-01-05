"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Shield,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Download,
  Loader2,
  ChevronDown,
  ChevronUp,
  Flame,
  Zap,
  Accessibility,
  Heart,
  AlertOctagon,
} from "lucide-react";
import type { SafetyAnalysis, SafetyIssue } from "@/lib/ai/agents/safety-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

interface SafetyPanelProps {
  layout: LayoutData;
  onClose: () => void;
}

export function SafetyPanel({ layout, onClose }: SafetyPanelProps) {
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/safety-analysis?action=analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout,
          focusAreas: ["fire", "electrical", "accessibility", "ergonomics", "emergency"],
          strictMode: false,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error("Failed to analyze safety:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertOctagon className="w-4 h-4" />;
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <AlertCircle className="w-4 h-4" />;
      case "low":
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fire_safety":
        return <Flame className="w-4 h-4" />;
      case "electrical":
        return <Zap className="w-4 h-4" />;
      case "accessibility":
        return <Accessibility className="w-4 h-4" />;
      case "ergonomics":
        return <Heart className="w-4 h-4" />;
      case "emergency":
        return <AlertOctagon className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "moderate":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const groupedIssues = analysis?.issues.reduce((acc, issue) => {
    if (!acc[issue.category]) {
      acc[issue.category] = [];
    }
    acc[issue.category].push(issue);
    return acc;
  }, {} as Record<string, SafetyIssue[]>);

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-semibold">Safety & Compliance</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close safety panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!analysis ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-[var(--muted-foreground)] opacity-50" />
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Run a safety analysis to identify potential hazards and compliance issues
            </p>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 px-6 py-3 mx-auto rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing Safety...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Run Safety Analysis</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Safety Score
                  </div>
                  <div className="text-4xl font-bold text-[var(--neon-cyan)] mt-1">
                    {analysis.overallScore}/100
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Risk Level
                  </div>
                  <div
                    className={`text-2xl font-bold capitalize mt-1 ${getRiskLevelColor(
                      analysis.riskLevel
                    )}`}
                  >
                    {analysis.riskLevel}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-[var(--muted-foreground)]">
                {analysis.summary}
              </div>
            </motion.div>

            {/* Issue Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-4 gap-2"
            >
              {["critical", "high", "medium", "low"].map((severity) => {
                const count = analysis.issues.filter((i) => i.severity === severity).length;
                return (
                  <div key={severity} className={`glass-card p-3 ${getSeverityColor(severity)}`}>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {getSeverityIcon(severity)}
                    </div>
                    <div className="text-center text-lg font-bold">{count}</div>
                    <div className="text-center text-[10px] capitalize opacity-80">
                      {severity}
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Issues by Category */}
            {groupedIssues && Object.keys(groupedIssues).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold px-2">Issues by Category</h3>
                {Object.entries(groupedIssues).map(([category, issues], index) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className="glass-card"
                  >
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 hover:bg-[var(--glass-bg)]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="text-sm font-medium capitalize">
                          {category.replace("_", " ")}
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          ({issues.length})
                        </span>
                      </div>
                      {expandedCategories.has(category) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedCategories.has(category) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 pt-0 space-y-2">
                            {issues.map((issue) => (
                              <div
                                key={issue.id}
                                className={`p-3 rounded-lg border ${getSeverityColor(
                                  issue.severity
                                )}`}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  {getSeverityIcon(issue.severity)}
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">{issue.title}</div>
                                    {issue.location && (
                                      <div className="text-xs opacity-60 mt-0.5">
                                        Location: {issue.location}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="text-xs opacity-80 mb-2">
                                  {issue.description}
                                </div>

                                <div className="text-xs bg-[var(--background)]/50 p-2 rounded">
                                  <div className="font-semibold mb-1">
                                    Recommendation:
                                  </div>
                                  {issue.recommendation}
                                </div>

                                {issue.regulation && (
                                  <div className="text-[10px] mt-2 opacity-60">
                                    Regulation: {issue.regulation}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-4"
              >
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--neon-green)]" />
                  Top Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm flex gap-2">
                      <span className="text-[var(--neon-green)] font-mono">
                        {index + 1}.
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Refresh Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Re-analyze Safety</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
