"use client";

import { useWizardStore } from "@/stores/wizard-store";
import { DISCIPLINE_METADATA } from "@/lib/schemas/launcher";
import { SPECIAL_REQUIREMENT_LABELS } from "@/lib/schemas/needs-assessment";
import { Pencil } from "lucide-react";

export function RequirementsReviewStep() {
  const { needs, goToStep } = useWizardStore();
  const discipline = DISCIPLINE_METADATA.find((d) => d.id === needs.discipline);

  const activeReqs = Object.entries(needs.specialRequirements).filter(
    ([, v]) => v === true || (typeof v === "string" && v.length > 0),
  );

  const formatBudget = (val: number, currency: string) => {
    if (currency === "CNY") return `¥${val.toLocaleString()}`;
    if (currency === "USD") return `$${val.toLocaleString()}`;
    return `€${val.toLocaleString()}`;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-medium">需求确认</h3>
        <button
          onClick={() => goToStep("needs")}
          className="flex items-center gap-1 text-sm text-[var(--neon-cyan)] hover:underline"
        >
          <Pencil className="w-3 h-3" /> 修改
        </button>
      </div>

      <div className="grid gap-3">
        {/* Project name */}
        <Card label="项目名称" value={needs.projectName || "未命名"} />

        {/* Discipline */}
        <Card
          label="研究领域"
          value={
            <div>
              <span className="font-medium">{discipline?.name ?? needs.discipline}</span>
              {needs.subDisciplines.length > 0 && (
                <div className="flex gap-1 mt-1 flex-wrap">
                  {needs.subDisciplines.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-xs bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          }
        />

        {/* Dimensions */}
        <Card
          label="空间尺寸"
          value={`${needs.dimensions.width} x ${needs.dimensions.height} ${needs.dimensions.unit}`}
        />

        {/* Capacity */}
        <Card label="容量" value={`学生 ${needs.capacity.students} 人 / 教职 ${needs.capacity.staff} 人`} />

        {/* Budget */}
        <Card
          label="预算范围"
          value={`${formatBudget(needs.budget.min, needs.budget.currency)} - ${formatBudget(needs.budget.max, needs.budget.currency)}`}
        />

        {/* Special Requirements */}
        {activeReqs.length > 0 && (
          <Card
            label="特殊要求"
            value={
              <div className="flex gap-1 flex-wrap">
                {activeReqs.map(([key, val]) => (
                  <span
                    key={key}
                    className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-400"
                  >
                    {SPECIAL_REQUIREMENT_LABELS[key] ?? key}
                    {typeof val === "string" ? `: ${val}` : ""}
                  </span>
                ))}
              </div>
            }
          />
        )}

        {/* Notes */}
        {needs.notes && <Card label="补充说明" value={needs.notes} />}
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="px-4 py-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
