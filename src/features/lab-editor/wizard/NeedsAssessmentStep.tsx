"use client";

import { useWizardStore } from "@/stores/wizard-store";
import { DISCIPLINE_METADATA, DEFAULT_SUB_DISCIPLINES, type Discipline } from "@/lib/schemas/launcher";
import {
  DISCIPLINE_REQUIREMENTS,
  SPECIAL_REQUIREMENT_LABELS,
  type NeedsAssessment,
} from "@/lib/schemas/needs-assessment";
import { Dna, Rocket, Globe, Atom, Cpu } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Dna, Rocket, Globe, Atom, Cpu,
};

export function NeedsAssessmentStep() {
  const { needs, updateNeeds } = useWizardStore();
  const relevantReqs = DISCIPLINE_REQUIREMENTS[needs.discipline] ?? [];
  const subOptions = DEFAULT_SUB_DISCIPLINES[needs.discipline] ?? [];

  const toggleSubDiscipline = (sub: string) => {
    const current = needs.subDisciplines;
    if (current.includes(sub)) {
      updateNeeds({ subDisciplines: current.filter((s) => s !== sub) });
    } else if (current.length < 3) {
      updateNeeds({ subDisciplines: [...current, sub] });
    }
  };

  const toggleBoolReq = (key: keyof NeedsAssessment["specialRequirements"]) => {
    const current = needs.specialRequirements[key];
    if (typeof current === "boolean") {
      updateNeeds({ specialRequirements: { ...needs.specialRequirements, [key]: !current } });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Project Name */}
      <section>
        <label className="block text-sm text-white/60 mb-2">项目名称</label>
        <input
          type="text"
          value={needs.projectName}
          onChange={(e) => updateNeeds({ projectName: e.target.value })}
          placeholder="例如：基因编辑实验室"
          className="w-full px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] outline-none"
        />
      </section>

      {/* Discipline Selector */}
      <section>
        <label className="block text-sm text-white/60 mb-2">研究领域</label>
        <div className="grid grid-cols-5 gap-2">
          {DISCIPLINE_METADATA.map((d) => {
            const Icon = ICON_MAP[d.icon];
            const isActive = needs.discipline === d.id;
            return (
              <button
                key={d.id}
                onClick={() => updateNeeds({ discipline: d.id as Discipline, subDisciplines: [] })}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-colors ${
                  isActive
                    ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10"
                    : "border-[var(--glass-border)] hover:bg-white/5"
                }`}
              >
                {Icon && <Icon className={`w-5 h-5 ${isActive ? "text-[var(--neon-cyan)]" : "text-white/50"}`} />}
                <span className="text-xs">{d.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sub-disciplines */}
      <section>
        <label className="block text-sm text-white/60 mb-2">细分方向 (最多3个)</label>
        <div className="flex flex-wrap gap-2">
          {subOptions.map((sub) => {
            const isActive = needs.subDisciplines.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => toggleSubDiscipline(sub)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  isActive
                    ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]"
                    : "border-[var(--glass-border)] text-white/60 hover:bg-white/5"
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </section>

      {/* Dimensions */}
      <section>
        <label className="block text-sm text-white/60 mb-2">空间尺寸</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={needs.dimensions.width}
            onChange={(e) => updateNeeds({ dimensions: { ...needs.dimensions, width: Number(e.target.value) } })}
            className="w-24 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
            min={3}
            max={100}
          />
          <span className="text-white/40">x</span>
          <input
            type="number"
            value={needs.dimensions.height}
            onChange={(e) => updateNeeds({ dimensions: { ...needs.dimensions, height: Number(e.target.value) } })}
            className="w-24 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
            min={3}
            max={100}
          />
          <select
            value={needs.dimensions.unit}
            onChange={(e) =>
              updateNeeds({ dimensions: { ...needs.dimensions, unit: e.target.value as "m" | "ft" } })
            }
            className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
          >
            <option value="m">米</option>
            <option value="ft">英尺</option>
          </select>
        </div>
      </section>

      {/* Capacity */}
      <section>
        <label className="block text-sm text-white/60 mb-2">容量</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40">学生</span>
            <input
              type="number"
              value={needs.capacity.students}
              onChange={(e) => updateNeeds({ capacity: { ...needs.capacity, students: Number(e.target.value) } })}
              className="w-20 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
              min={0}
              max={200}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40">教职</span>
            <input
              type="number"
              value={needs.capacity.staff}
              onChange={(e) => updateNeeds({ capacity: { ...needs.capacity, staff: Number(e.target.value) } })}
              className="w-20 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
              min={0}
              max={50}
            />
          </div>
        </div>
      </section>

      {/* Budget */}
      <section>
        <label className="block text-sm text-white/60 mb-2">预算范围</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={needs.budget.min}
            onChange={(e) => updateNeeds({ budget: { ...needs.budget, min: Number(e.target.value) } })}
            className="w-32 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
            min={0}
          />
          <span className="text-white/40">-</span>
          <input
            type="number"
            value={needs.budget.max}
            onChange={(e) => updateNeeds({ budget: { ...needs.budget, max: Number(e.target.value) } })}
            className="w-32 px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
            min={0}
          />
          <select
            value={needs.budget.currency}
            onChange={(e) =>
              updateNeeds({ budget: { ...needs.budget, currency: e.target.value as "CNY" | "USD" | "EUR" } })
            }
            className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] outline-none"
          >
            <option value="CNY">CNY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </section>

      {/* Special Requirements */}
      {relevantReqs.length > 0 && (
        <section>
          <label className="block text-sm text-white/60 mb-2">特殊要求</label>
          <div className="grid grid-cols-2 gap-2">
            {relevantReqs.map((key) => {
              const val = needs.specialRequirements[key];
              const isBool = typeof val === "boolean" || val === undefined;
              return (
                <label
                  key={key}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-white/5 cursor-pointer"
                >
                  {isBool ? (
                    <input
                      type="checkbox"
                      checked={!!val}
                      onChange={() => toggleBoolReq(key)}
                      className="accent-[var(--neon-cyan)]"
                    />
                  ) : (
                    <span className="text-xs text-[var(--neon-cyan)]">{val}</span>
                  )}
                  <span className="text-sm">{SPECIAL_REQUIREMENT_LABELS[key] ?? key}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* Notes */}
      <section>
        <label className="block text-sm text-white/60 mb-2">补充说明</label>
        <textarea
          value={needs.notes}
          onChange={(e) => updateNeeds({ notes: e.target.value })}
          placeholder="其他需求或特殊说明..."
          rows={3}
          className="w-full px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] outline-none resize-none"
        />
      </section>
    </div>
  );
}
