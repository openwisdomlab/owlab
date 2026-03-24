"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Flag,
  Plus,
  Circle,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import type { Milestone } from "@/lib/schemas/project-lifecycle";
import { PROJECT_PHASE_LABELS, type ProjectPhase, PROJECT_PHASES } from "@/lib/schemas/project-lifecycle";
import { useProjectStore } from "@/stores/project-store";

interface Props {
  onClose: () => void;
}

type MilestoneStatus = Milestone["status"];

const STATUS_ICON: Record<MilestoneStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4 text-neutral-500" />,
  "in-progress": <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />,
  completed: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  overdue: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

const NEXT_STATUS: Record<MilestoneStatus, MilestoneStatus> = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: "pending",
  overdue: "in-progress",
};

const PHASE_COLORS: Record<ProjectPhase, string> = {
  research: "bg-purple-400/10 text-purple-400",
  design: "bg-blue-400/10 text-blue-400",
  procurement: "bg-yellow-400/10 text-yellow-400",
  construction: "bg-orange-400/10 text-orange-400",
  acceptance: "bg-green-400/10 text-green-400",
};

export function MilestoneTracker({ onClose }: Props) {
  const store = useProjectStore();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", phase: "research" as ProjectPhase, dueDate: "" });

  const milestones = store.project?.milestones ?? [];

  const cycleStatus = (id: string, current: MilestoneStatus) => {
    const next = NEXT_STATUS[current];
    store.updateMilestone(id, {
      status: next,
      ...(next === "completed" ? { completedDate: new Date().toISOString() } : {}),
    });
  };

  const handleAdd = () => {
    if (!form.title) return;
    store.addMilestone({
      title: form.title,
      phase: form.phase,
      dueDate: form.dueDate || undefined,
    });
    setForm({ title: "", phase: "research", dueDate: "" });
    setShowAdd(false);
  };

  // Group milestones by phase
  const grouped = PROJECT_PHASES.reduce(
    (acc, phase) => {
      acc[phase] = milestones.filter((m) => m.phase === phase);
      return acc;
    },
    {} as Record<ProjectPhase, Milestone[]>,
  );

  const totalCompleted = milestones.filter((m) => m.status === "completed").length;

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
          <Flag className="w-5 h-5 text-[var(--neon-cyan)]" />
          <h2 className="text-lg font-semibold">里程碑追踪</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/20 transition-colors">
            <Plus className="w-4 h-4" /> 添加里程碑
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-b border-[var(--glass-border)]">
            <div className="flex flex-col gap-2 p-3">
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="里程碑名称"
                className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none focus:border-[var(--neon-cyan)]"
              />
              <div className="flex gap-2">
                <select
                  value={form.phase}
                  onChange={(e) => setForm((p) => ({ ...p, phase: e.target.value as ProjectPhase }))}
                  className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none"
                >
                  {PROJECT_PHASES.map((p) => (
                    <option key={p} value={p}>{PROJECT_PHASE_LABELS[p]}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="px-3 py-1.5 text-sm rounded-lg bg-white/5 border border-[var(--glass-border)] focus:outline-none"
                />
                <button onClick={handleAdd} className="px-3 py-1.5 text-sm rounded-lg bg-[var(--neon-cyan)] text-[var(--background)] font-medium hover:opacity-90 transition-opacity">添加</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      <div className="px-4 pt-3 pb-2 text-sm text-neutral-400">
        共 {milestones.length} 个里程碑，已完成 {totalCompleted} 个
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        {PROJECT_PHASES.map((phase) => {
          const phaseMilestones = grouped[phase];
          if (phaseMilestones.length === 0) return null;

          return (
            <div key={phase} className="mb-4">
              {/* Phase header */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PHASE_COLORS[phase]}`}>
                  {PROJECT_PHASE_LABELS[phase]}
                </span>
              </div>

              {/* Vertical timeline */}
              <div className="relative ml-2 pl-4 border-l-2 border-[var(--glass-border)]">
                {phaseMilestones.map((ms, idx) => (
                  <div key={ms.id} className={`relative pb-4 ${idx === phaseMilestones.length - 1 ? "pb-0" : ""}`}>
                    {/* Timeline dot */}
                    <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full border-2 border-[var(--glass-border)] bg-[var(--background)]">
                      <div className={`w-full h-full rounded-full ${ms.status === "completed" ? "bg-green-400" : ms.status === "in-progress" ? "bg-blue-400" : ms.status === "overdue" ? "bg-red-400" : "bg-neutral-600"}`} />
                    </div>

                    {/* Card */}
                    <div
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => cycleStatus(ms.id, ms.status)}
                    >
                      {STATUS_ICON[ms.status]}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${ms.status === "completed" ? "line-through text-neutral-500" : ""}`}>
                          {ms.title}
                        </p>
                        {ms.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{ms.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {milestones.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <Flag className="w-8 h-8 mb-2" />
            <p className="text-sm">点击 &quot;添加里程碑&quot; 开始追踪项目进度</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
