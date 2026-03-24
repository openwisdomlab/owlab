"use client";

import { useWizardStore } from "@/stores/wizard-store";
import { ZONE_LABELS } from "@/lib/constants/zone-types";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { AlertCircle, AlertTriangle, Info, Sparkles } from "lucide-react";

const SEVERITY_STYLES = {
  error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10" },
} as const;

export function DesignReviewStep() {
  const { layouts, activeLayoutIndex, validation, needs } = useWizardStore();
  const layout = layouts[activeLayoutIndex];

  if (!layout) {
    return (
      <div className="p-6 text-center text-white/40">
        <p>暂无布局方案，请返回生成步骤</p>
      </div>
    );
  }

  const totalArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-medium">{layout.name}</h3>
        <p className="text-sm text-white/50 mt-1">{layout.description}</p>
      </div>

      {/* Floor Plan Preview */}
      <div className="mx-6 mt-4 rounded-xl border border-[var(--glass-border)] overflow-hidden" style={{ height: 320 }}>
        <FloorPlanCanvas
          layout={layout}
          zoom={0.5}
          showGrid={true}
          selectedZone={null}
          onZoneSelect={() => {}}
          onZoneUpdate={() => {}}
          onAddZone={() => {}}
          onDeleteZone={() => {}}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="功能区" value={`${layout.zones.length} 个`} />
        <StatCard
          label="总面积"
          value={`${totalArea.toFixed(1)} ${layout.dimensions.unit}²`}
        />
        <StatCard
          label="合规评分"
          value={validation ? `${validation.score}` : "--"}
          highlight={
            validation
              ? validation.score >= 80
                ? "emerald"
                : validation.score >= 60
                  ? "amber"
                  : "red"
              : undefined
          }
        />
      </div>

      {/* Budget Match */}
      {needs.budget && (
        <div className="mx-6 mt-3 p-3 rounded-lg bg-white/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">预算范围</span>
            <span>{needs.budget.min.toLocaleString()} - {needs.budget.max.toLocaleString()} {needs.budget.currency}</span>
          </div>
        </div>
      )}

      {/* Zone list */}
      <section>
        <h4 className="text-sm text-white/60 mb-2">功能区列表</h4>
        <div className="space-y-1">
          {layout.zones.map((zone) => (
            <div
              key={zone.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: zone.color }} />
                <span className="text-sm">{zone.name}</span>
                <span className="text-xs text-white/30">
                  {ZONE_LABELS[zone.type as keyof typeof ZONE_LABELS] ?? zone.type}
                </span>
              </div>
              <span className="text-xs text-white/40">
                {zone.size.width}x{zone.size.height}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Validation violations */}
      {validation && validation.violations.length > 0 && (
        <section>
          <h4 className="text-sm text-white/60 mb-2">验证结果</h4>
          <div className="space-y-1">
            {validation.violations.map((v, i) => {
              const style = SEVERITY_STYLES[v.severity as keyof typeof SEVERITY_STYLES] ?? SEVERITY_STYLES.info;
              const SevIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg ${style.bg}`}
                >
                  <SevIcon className={`w-4 h-4 mt-0.5 shrink-0 ${style.color}`} />
                  <span className="text-sm">{v.message}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* AI suggestions placeholder */}
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] text-white/40 cursor-not-allowed"
      >
        <Sparkles className="w-4 h-4" /> AI 建议 (即将推出)
      </button>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "emerald" | "amber" | "red";
}) {
  const colorMap = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };
  return (
    <div className="px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center">
      <div className="text-xs text-white/40">{label}</div>
      <div className={`text-lg font-semibold mt-1 ${highlight ? colorMap[highlight] : ""}`}>{value}</div>
    </div>
  );
}
