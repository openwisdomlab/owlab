"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Download,
  TrendingUp,
  Package,
  X,
  PieChart,
  Sparkles,
  AlertTriangle,
  Info,
  CheckCircle,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutTemplate,
  Users,
  Building2,
  Warehouse,
} from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { BudgetAnalysis } from "@/lib/ai/agents/budget-agent";
import {
  calculateBudgetSummary,
  formatCurrency,
  exportBudgetToCSV,
  downloadCSV,
} from "@/lib/utils/budget";

interface BudgetDashboardProps {
  layout: LayoutData;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  compute: "#22d3ee",
  furniture: "#8b5cf6",
  tools: "#f59e0b",
  safety: "#ef4444",
  utilities: "#6b7280",
  electronics: "#10b981",
  software: "#ec4899",
};

// Budget Templates for different space sizes
interface BudgetTemplate {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  capacity: string;
  area: string;
  icon: typeof Users;
  budget: {
    min: number;
    max: number;
    recommended: number;
  };
  allocation: {
    category: string;
    percentage: number;
    examples: string[];
  }[];
  zones: string[];
}

const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: "small",
    name: "Small Makerspace",
    nameZh: "小型创客空间",
    description: "Ideal for clubs, after-school programs, or small classrooms",
    descriptionZh: "适合社团、课后项目或小型教室",
    capacity: "10-20 students",
    area: "50-100 m²",
    icon: Users,
    budget: {
      min: 30000,
      max: 80000,
      recommended: 50000,
    },
    allocation: [
      {
        category: "furniture",
        percentage: 25,
        examples: ["Workbenches (3-4)", "Storage cabinets", "Chairs"],
      },
      {
        category: "tools",
        percentage: 30,
        examples: ["Basic hand tools", "3D printer (1)", "Laser cutter (optional)"],
      },
      {
        category: "electronics",
        percentage: 20,
        examples: ["Arduino kits (10)", "Sensors", "Basic components"],
      },
      {
        category: "compute",
        percentage: 15,
        examples: ["Laptops (5-8)", "Display monitor"],
      },
      {
        category: "safety",
        percentage: 10,
        examples: ["Safety glasses", "First aid kit", "Fire extinguisher"],
      },
    ],
    zones: ["Workbench Area", "Electronics Station", "Storage"],
  },
  {
    id: "medium",
    name: "Medium Lab",
    nameZh: "中型实验室",
    description: "Standard school makerspace for regular classes",
    descriptionZh: "标准学校创客空间，适合常规课程",
    capacity: "20-40 students",
    area: "100-200 m²",
    icon: Building2,
    budget: {
      min: 80000,
      max: 200000,
      recommended: 120000,
    },
    allocation: [
      {
        category: "furniture",
        percentage: 20,
        examples: ["Workbenches (6-8)", "Adjustable tables", "Tool walls"],
      },
      {
        category: "tools",
        percentage: 35,
        examples: ["3D printers (2-3)", "Laser cutter", "CNC router (small)"],
      },
      {
        category: "electronics",
        percentage: 20,
        examples: ["Arduino/Raspberry Pi sets (20+)", "Oscilloscope", "Soldering stations"],
      },
      {
        category: "compute",
        percentage: 15,
        examples: ["Workstations (10-15)", "Design software licenses"],
      },
      {
        category: "safety",
        percentage: 10,
        examples: ["Ventilation system", "PPE sets", "Emergency equipment"],
      },
    ],
    zones: ["Fabrication Zone", "Electronics Lab", "Computer Area", "Assembly Space", "Storage Room"],
  },
  {
    id: "large",
    name: "Large Innovation Hub",
    nameZh: "大型创新中心",
    description: "Full-featured facility for multiple programs",
    descriptionZh: "多功能设施，支持多个项目同时进行",
    capacity: "40+ students",
    area: "200+ m²",
    icon: Warehouse,
    budget: {
      min: 200000,
      max: 500000,
      recommended: 300000,
    },
    allocation: [
      {
        category: "furniture",
        percentage: 15,
        examples: ["Modular workstations", "Collaborative tables", "Standing desks"],
      },
      {
        category: "tools",
        percentage: 40,
        examples: ["Industrial 3D printers", "Large-format laser", "CNC machines", "Woodworking tools"],
      },
      {
        category: "electronics",
        percentage: 15,
        examples: ["Advanced robotics kits", "IoT sensors", "Testing equipment"],
      },
      {
        category: "compute",
        percentage: 20,
        examples: ["High-performance workstations", "VR/AR equipment", "Enterprise software"],
      },
      {
        category: "safety",
        percentage: 10,
        examples: ["Dust collection", "Fume extraction", "Safety monitoring system"],
      },
    ],
    zones: [
      "Digital Fabrication",
      "Traditional Workshop",
      "Electronics Lab",
      "Computer Lab",
      "Presentation Area",
      "Material Storage",
      "Tool Library",
    ],
  },
];

export function BudgetDashboard({ layout, onClose }: BudgetDashboardProps) {
  const summary = useMemo(() => calculateBudgetSummary(layout), [layout]);
  const [aiInsights, setAiInsights] = useState<BudgetAnalysis | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BudgetTemplate | null>(null);

  const categoryData = useMemo(() => {
    return Object.entries(summary.costByCategory).map(([category, cost]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: cost,
      percentage: ((cost / summary.totalCost) * 100).toFixed(1),
    }));
  }, [summary]);

  const zoneData = useMemo(() => {
    return Object.entries(summary.costByZone)
      .map(([zone, cost]) => ({
        name: zone,
        value: cost,
        percentage: ((cost / summary.totalCost) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);
  }, [summary]);

  const handleExportCSV = () => {
    const csv = exportBudgetToCSV(summary);
    downloadCSV(csv, `${layout.name || "layout"}-budget.csv`);
  };

  const handleGetAIInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const response = await fetch("/api/ai/budget-analysis?action=analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layout,
          currency: summary.currency,
          includeForecasting: true,
          includeROI: true,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setAiInsights(data.analysis);
      }
    } catch (error) {
      console.error("Failed to get AI insights:", error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      case "success":
        return <CheckCircle className="w-4 h-4" />;
      case "optimization":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "info":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "success":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "optimization":
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="font-semibold">Budget Summary</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          aria-label="Close budget dashboard"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Total Cost Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[var(--muted-foreground)]">Total Cost</div>
            <TrendingUp className="w-4 h-4 text-[var(--neon-cyan)]" />
          </div>
          <div className="text-3xl font-bold text-[var(--neon-cyan)]">
            {formatCurrency(summary.totalCost, summary.currency)}
          </div>
          <div className="mt-2 text-xs text-[var(--muted-foreground)]">
            {summary.itemCount} items across {layout.zones.length} zones
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-[var(--muted-foreground)]" />
              <div className="text-xs text-[var(--muted-foreground)]">Items</div>
            </div>
            <div className="text-xl font-semibold">{summary.itemCount}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-[var(--muted-foreground)]" />
              <div className="text-xs text-[var(--muted-foreground)]">Categories</div>
            </div>
            <div className="text-xl font-semibold">{categoryData.length}</div>
          </motion.div>
        </div>

        {/* Budget Templates Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="glass-card overflow-hidden"
        >
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--glass-bg)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-[var(--neon-purple)]" />
              <span className="font-semibold">Budget Templates</span>
            </div>
            {showTemplates ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-3">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Compare your budget with recommended allocations for different space sizes
                  </p>

                  {/* Template Cards */}
                  <div className="space-y-2">
                    {BUDGET_TEMPLATES.map((template) => {
                      const IconComponent = template.icon;
                      const isSelected = selectedTemplate?.id === template.id;

                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(isSelected ? null : template)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/10"
                              : "border-[var(--glass-border)] hover:border-[var(--neon-purple)]/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isSelected
                                  ? "bg-[var(--neon-purple)]/20"
                                  : "bg-[var(--glass-bg)]"
                              }`}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${
                                  isSelected
                                    ? "text-[var(--neon-purple)]"
                                    : "text-[var(--muted-foreground)]"
                                }`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-sm">
                                  {template.nameZh}
                                </div>
                                <div className="text-xs text-[var(--neon-purple)]">
                                  {formatCurrency(template.budget.recommended, summary.currency)}
                                </div>
                              </div>
                              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">
                                {template.capacity} · {template.area}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Template Details */}
                  <AnimatePresence>
                    {selectedTemplate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] space-y-4">
                          {/* Budget Range */}
                          <div>
                            <div className="text-xs text-[var(--muted-foreground)] mb-2">
                              Recommended Budget Range
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>{formatCurrency(selectedTemplate.budget.min, summary.currency)}</span>
                              <div className="flex-1 mx-3 h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[var(--neon-purple)]/50 to-[var(--neon-purple)]"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      ((summary.totalCost - selectedTemplate.budget.min) /
                                        (selectedTemplate.budget.max - selectedTemplate.budget.min)) *
                                        100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <span>{formatCurrency(selectedTemplate.budget.max, summary.currency)}</span>
                            </div>
                            <div className="text-center mt-2">
                              <span className="text-xs text-[var(--muted-foreground)]">
                                Your budget:{" "}
                              </span>
                              <span
                                className={`text-sm font-semibold ${
                                  summary.totalCost < selectedTemplate.budget.min
                                    ? "text-yellow-400"
                                    : summary.totalCost > selectedTemplate.budget.max
                                    ? "text-red-400"
                                    : "text-[var(--neon-green)]"
                                }`}
                              >
                                {formatCurrency(summary.totalCost, summary.currency)}
                              </span>
                            </div>
                          </div>

                          {/* Allocation Comparison */}
                          <div>
                            <div className="text-xs text-[var(--muted-foreground)] mb-2">
                              Recommended Allocation
                            </div>
                            <div className="space-y-2">
                              {selectedTemplate.allocation.map((alloc) => {
                                const actualPercentage =
                                  summary.totalCost > 0
                                    ? ((summary.costByCategory[alloc.category] || 0) /
                                        summary.totalCost) *
                                      100
                                    : 0;
                                const diff = actualPercentage - alloc.percentage;

                                return (
                                  <div key={alloc.category} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-2 h-2 rounded"
                                          style={{
                                            backgroundColor:
                                              CATEGORY_COLORS[alloc.category] || "#6b7280",
                                          }}
                                        />
                                        <span className="capitalize">{alloc.category}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[var(--muted-foreground)]">
                                          Target: {alloc.percentage}%
                                        </span>
                                        <span
                                          className={`font-medium ${
                                            Math.abs(diff) < 5
                                              ? "text-[var(--neon-green)]"
                                              : Math.abs(diff) < 10
                                              ? "text-yellow-400"
                                              : "text-red-400"
                                          }`}
                                        >
                                          Actual: {actualPercentage.toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>
                                    <div className="relative h-1.5 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                      <div
                                        className="absolute inset-y-0 left-0 rounded-full opacity-30"
                                        style={{
                                          width: `${alloc.percentage}%`,
                                          backgroundColor:
                                            CATEGORY_COLORS[alloc.category] || "#6b7280",
                                        }}
                                      />
                                      <div
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                          width: `${Math.min(100, actualPercentage)}%`,
                                          backgroundColor:
                                            CATEGORY_COLORS[alloc.category] || "#6b7280",
                                        }}
                                      />
                                    </div>
                                    <div className="text-xs text-[var(--muted-foreground)]">
                                      {alloc.examples.join(", ")}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Recommended Zones */}
                          <div>
                            <div className="text-xs text-[var(--muted-foreground)] mb-2">
                              Typical Zones
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {selectedTemplate.zones.map((zone) => (
                                <span
                                  key={zone}
                                  className="px-2 py-1 text-xs rounded bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                                >
                                  {zone}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* AI Insights Button */}
        {summary.items.length > 0 && !aiInsights && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleGetAIInsights}
            disabled={isLoadingInsights}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg glass-card border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all disabled:opacity-50"
          >
            {isLoadingInsights ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[var(--neon-cyan)]" />
                <span>Analyzing Budget...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
                <span>Get AI Budget Insights</span>
              </>
            )}
          </motion.button>
        )}

        {/* AI Insights Panel */}
        {aiInsights && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            {/* Header */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--neon-cyan)]" />
                <h3 className="font-semibold">AI Budget Analysis</h3>
              </div>

              {/* Insights */}
              {aiInsights.insights && aiInsights.insights.length > 0 && (
                <div className="space-y-2">
                  {aiInsights.insights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{insight.title}</div>
                          <div className="text-xs opacity-80 mt-1">
                            {insight.description}
                          </div>
                          <div className="text-xs mt-2 opacity-60">
                            Impact: <span className="capitalize">{insight.impact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Optimizations */}
              {aiInsights.optimizations && aiInsights.optimizations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-[var(--neon-cyan)]" />
                    Cost Optimization Opportunities
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.optimizations.map((opt, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{opt.title}</div>
                            <div className="text-xs text-[var(--muted-foreground)] mt-1">
                              {opt.description}
                            </div>
                            <div className="text-xs mt-2">
                              <span className="text-[var(--muted-foreground)]">
                                Difficulty:
                              </span>{" "}
                              <span className="capitalize">{opt.difficulty}</span>
                            </div>
                          </div>
                          {opt.potentialSavings > 0 && (
                            <div className="text-right">
                              <div className="text-xs text-[var(--muted-foreground)]">
                                Potential Savings
                              </div>
                              <div className="font-semibold text-[var(--neon-green)]">
                                {formatCurrency(opt.potentialSavings, summary.currency)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Forecast Accordion */}
              {aiInsights.forecast && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowForecast(!showForecast)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[var(--neon-cyan)]" />
                      <span className="text-sm font-semibold">Cost Forecast</span>
                    </div>
                    {showForecast ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showForecast && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 space-y-2 bg-[var(--glass-bg)]/50 rounded-b-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">
                              6 Months:
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                aiInsights.forecast.sixMonths,
                                summary.currency
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">
                              1 Year:
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                aiInsights.forecast.oneYear,
                                summary.currency
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--muted-foreground)]">
                              3 Years:
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(
                                aiInsights.forecast.threeYears,
                                summary.currency
                              )}
                            </span>
                          </div>
                          {aiInsights.forecast.assumptions && (
                            <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                              <div className="text-xs text-[var(--muted-foreground)] mb-2">
                                Assumptions:
                              </div>
                              <ul className="text-xs space-y-1">
                                {aiInsights.forecast.assumptions.map((assumption, i) => (
                                  <li key={i} className="text-[var(--muted-foreground)]">
                                    • {assumption}
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
              )}

              {/* ROI */}
              {aiInsights.roi && (
                <div className="mt-4 p-3 rounded-lg bg-[var(--neon-green)]/10 border border-[var(--neon-green)]/20">
                  <div className="text-sm font-semibold text-[var(--neon-green)] mb-2">
                    ROI Analysis
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-[var(--muted-foreground)]">
                        Payback Period
                      </div>
                      <div className="font-semibold mt-1">
                        {aiInsights.roi.paybackPeriod}
                      </div>
                    </div>
                    <div>
                      <div className="text-[var(--muted-foreground)]">ROI</div>
                      <div className="font-semibold mt-1">
                        {aiInsights.roi.returnOnInvestment}%
                      </div>
                    </div>
                  </div>
                  {aiInsights.roi.assumptions && (
                    <div className="mt-3 pt-3 border-t border-[var(--neon-green)]/20">
                      <div className="text-xs text-[var(--muted-foreground)] mb-1">
                        Based on:
                      </div>
                      <ul className="text-xs space-y-1">
                        {aiInsights.roi.assumptions.map((assumption, i) => (
                          <li key={i} className="text-[var(--muted-foreground)]">
                            • {assumption}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Refresh Button */}
              <button
                onClick={handleGetAIInsights}
                disabled={isLoadingInsights}
                className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors disabled:opacity-50"
              >
                {isLoadingInsights ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Refresh Insights</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Cost by Category Chart */}
        {categoryData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4"
          >
            <h3 className="text-sm font-semibold mb-4">Cost by Category</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name} ${entry.percentage}%`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[entry.name.toLowerCase()] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      value !== undefined ? formatCurrency(value, summary.currency) : ""
                    }
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor: CATEGORY_COLORS[cat.name.toLowerCase()] || "#6b7280",
                      }}
                    />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(cat.value, summary.currency)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Cost by Zone */}
        {zoneData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass-card p-4"
          >
            <h3 className="text-sm font-semibold mb-4">Cost by Zone</h3>
            <div className="space-y-3">
              {zoneData.map((zone, index) => (
                <div key={zone.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate">{zone.name}</span>
                    <span className="font-semibold">
                      {formatCurrency(zone.value, summary.currency)}
                    </span>
                  </div>
                  <div className="relative h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.percentage}%` }}
                      transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-[var(--neon-cyan)] rounded-full"
                    />
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">
                    {zone.percentage}% of total
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Items List */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-4"
        >
          <h3 className="text-sm font-semibold mb-4">All Items</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {summary.items.map((item, index) => (
              <div
                key={`${item.equipmentId}-${index}`}
                className="flex items-start justify-between text-sm p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.equipmentName}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {item.zoneName} • {item.quantity}x {formatCurrency(item.unitPrice, summary.currency)}
                  </div>
                </div>
                <div className="text-right ml-2">
                  <div className="font-semibold">
                    {formatCurrency(item.totalPrice, summary.currency)}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] capitalize">
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Empty State */}
        {summary.items.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No equipment added yet</p>
            <p className="text-sm mt-1">Add equipment to zones to see budget breakdown</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {summary.items.length > 0 && (
        <div className="p-4 border-t border-[var(--glass-border)]">
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] hover:opacity-80 transition-opacity"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      )}
    </div>
  );
}
