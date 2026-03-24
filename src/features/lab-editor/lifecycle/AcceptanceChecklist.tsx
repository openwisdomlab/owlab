"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ClipboardCheck,
  ChevronRight,
  Circle,
  CheckCircle2,
  XCircle,
  FileText,
  ExternalLink,
  Gauge,
} from "lucide-react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { AcceptanceCheck } from "@/lib/schemas/project-lifecycle";
import { ACCEPTANCE_CATEGORY_LABELS } from "@/lib/schemas/project-lifecycle";
import { validateLayout } from "@/lib/rules/rules-engine";
import { useProjectStore } from "@/stores/project-store";

interface Props {
  layout: LayoutData;
  onClose: () => void;
}

type CheckCategory = AcceptanceCheck["category"];
type CheckStatus = AcceptanceCheck["status"];

const STATUS_ICON: Record<CheckStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4 text-neutral-500" />,
  pass: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  fail: <XCircle className="w-4 h-4 text-red-400" />,
  waived: <Circle className="w-4 h-4 text-yellow-400" />,
};

const NEXT_STATUS: Record<CheckStatus, CheckStatus> = {
  pending: "pass",
  pass: "fail",
  fail: "waived",
  waived: "pending",
};

// Standard safety checks that always apply
const STANDARD_CHECKS: Omit<AcceptanceCheck, "id" | "status">[] = [
  { category: "safety", description: "Emergency exits unobstructed", descriptionZh: "紧急出口通畅无阻", standard: "GB 50016" },
  { category: "safety", description: "Fire extinguishers in place", descriptionZh: "灭火器配置到位", standard: "GB 50140" },
  { category: "safety", description: "Emergency lighting functional", descriptionZh: "应急照明系统正常", standard: "GB 50034" },
  { category: "safety", description: "Safety signage installed", descriptionZh: "安全标识安装完毕", standard: "GB 2894" },
  { category: "compliance", description: "Electrical installation certified", descriptionZh: "电气安装检测合格", standard: "GB 50303" },
  { category: "compliance", description: "HVAC commissioning complete", descriptionZh: "暖通调试完成", standard: "GB 50243" },
  { category: "compliance", description: "Ventilation rates meet standard", descriptionZh: "通风换气率达标", standard: "GB/T 18883" },
  { category: "functionality", description: "Network connectivity verified", descriptionZh: "网络连通性验证通过" },
  { category: "functionality", description: "Power supply stable under load", descriptionZh: "供电系统负载稳定" },
  { category: "functionality", description: "Access control system operational", descriptionZh: "门禁系统运行正常" },
  { category: "quality", description: "Floor finish quality acceptable", descriptionZh: "地面装修质量合格", standard: "GB 50209" },
  { category: "quality", description: "Wall surfaces meet standard", descriptionZh: "墙面施工质量达标", standard: "GB 50210" },
  { category: "quality", description: "Furniture installation stable", descriptionZh: "家具安装稳固" },
  { category: "documentation", description: "As-built drawings submitted", descriptionZh: "竣工图纸已提交" },
  { category: "documentation", description: "Equipment manuals collected", descriptionZh: "设备说明书收集齐全" },
  { category: "documentation", description: "Warranty certificates filed", descriptionZh: "保修证书归档" },
];

export function generateAcceptanceChecks(layout: LayoutData): Omit<AcceptanceCheck, "id" | "status">[] {
  const checks: Omit<AcceptanceCheck, "id" | "status">[] = [...STANDARD_CHECKS];

  // Run rules engine to add violation-based checks
  try {
    const result = validateLayout(layout);
    for (const v of result.violations) {
      checks.push({
        category: v.ruleCategory === "safety" ? "safety" : v.ruleCategory === "capacity" ? "compliance" : "functionality",
        description: v.message,
        descriptionZh: v.messageZh,
        standard: v.standard,
      });
    }
  } catch {
    // Rules engine may not have data files yet
  }

  return checks;
}

export function AcceptanceChecklist({ layout, onClose }: Props) {
  const store = useProjectStore();
  const [expanded, setExpanded] = useState<Set<CheckCategory>>(new Set(["safety"]));

  const checks = store.project?.acceptanceChecks ?? [];
  const result = store.getAcceptanceResult();

  const grouped = useMemo(() => {
    const map = new Map<CheckCategory, AcceptanceCheck[]>();
    for (const c of checks) {
      const list = map.get(c.category) ?? [];
      list.push(c);
      map.set(c.category, list);
    }
    return map;
  }, [checks]);

  const toggleCategory = (cat: CheckCategory) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  const cycleStatus = (id: string, current: CheckStatus) => {
    store.updateAcceptanceCheck(id, { status: NEXT_STATUS[current] });
  };

  const handleGenerate = () => {
    const newChecks = generateAcceptanceChecks(layout);
    for (const check of newChecks) {
      store.addAcceptanceCheck(check);
    }
  };

  const handleExportReport = () => {
    const lines = ["# 验收报告\n", `生成日期: ${new Date().toLocaleDateString("zh-CN")}\n`, `通过率: ${result.passRate}%\n`];
    const categories = Object.keys(ACCEPTANCE_CATEGORY_LABELS) as CheckCategory[];
    for (const cat of categories) {
      const catChecks = grouped.get(cat) ?? [];
      if (catChecks.length === 0) continue;
      lines.push(`\n## ${ACCEPTANCE_CATEGORY_LABELS[cat]}\n`);
      for (const c of catChecks) {
        const icon = c.status === "pass" ? "[PASS]" : c.status === "fail" ? "[FAIL]" : c.status === "waived" ? "[WAIVED]" : "[PENDING]";
        lines.push(`- ${icon} ${c.descriptionZh}${c.standard ? ` (${c.standard})` : ""}`);
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "acceptance-report.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = Object.keys(ACCEPTANCE_CATEGORY_LABELS) as CheckCategory[];

  // Gauge color
  const gaugeColor = result.passRate >= 80 ? "text-green-400" : result.passRate >= 50 ? "text-yellow-400" : "text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col h-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="text-lg font-semibold">验收检查</h2>
        </div>
        <div className="flex items-center gap-2">
          {checks.length === 0 ? (
            <button onClick={handleGenerate} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors">
              生成验收清单
            </button>
          ) : (
            <button onClick={handleExportReport} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <FileText className="w-4 h-4" /> 生成验收报告
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pass rate gauge */}
      {checks.length > 0 && (
        <div className="flex items-center gap-4 px-4 pt-3 pb-2">
          <Gauge className={`w-6 h-6 ${gaugeColor}`} />
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-neutral-400">通过率</span>
              <span className={`font-bold ${gaugeColor}`}>{result.passRate}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${result.passRate >= 80 ? "bg-green-400" : result.passRate >= 50 ? "bg-yellow-400" : "bg-red-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${result.passRate}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex gap-4 text-xs text-neutral-400 mt-1">
              <span>通过 {result.passed}</span>
              <span>未通过 {result.failed}</span>
              <span>待检 {result.pending}</span>
            </div>
          </div>
        </div>
      )}

      {/* Check groups */}
      <div className="flex-1 overflow-auto px-2 pb-2">
        {categories.map((cat) => {
          const catChecks = grouped.get(cat) ?? [];
          if (catChecks.length === 0 && checks.length > 0) return null;
          const isOpen = expanded.has(cat);

          return (
            <div key={cat} className="mb-1">
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                <span className="font-medium text-sm">{ACCEPTANCE_CATEGORY_LABELS[cat]}</span>
                <span className="text-xs text-neutral-400 ml-auto">{catChecks.length} 项</span>
              </button>
              <AnimatePresence>
                {isOpen && catChecks.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {catChecks.map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center gap-2 px-3 py-1.5 ml-6 text-sm hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                        onClick={() => cycleStatus(check.id, check.status)}
                      >
                        {STATUS_ICON[check.status]}
                        <span className="flex-1">{check.descriptionZh}</span>
                        {check.standard && (
                          <a
                            href="/docs/core/03-space/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-[var(--neon-cyan)] hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            了解更多
                          </a>
                        )}
                        {check.standard && (
                          <span className="text-xs text-neutral-500">{check.standard}</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {checks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <ClipboardCheck className="w-8 h-8 mb-2" />
            <p className="text-sm">点击 &quot;生成验收清单&quot; 自动创建检查项</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
