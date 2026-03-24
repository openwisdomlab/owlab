"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizard-store";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { AlertCircle, AlertTriangle, Info, PenTool } from "lucide-react";

const SEVERITY_CONFIG = {
  error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", label: "错误" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", label: "警告" },
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", label: "提示" },
} as const;

export function RefinementStep() {
  const { layouts, activeLayoutIndex, validation } = useWizardStore();
  const layout = layouts[activeLayoutIndex];
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  if (!layout) {
    return (
      <div className="p-6 text-center text-white/40">
        <p>暂无方案可精修</p>
      </div>
    );
  }

  const totalArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-base font-medium">精修优化</h3>

      {/* Interactive Floor Plan */}
      <div className="mx-6 mt-4 rounded-xl border border-[var(--glass-border)] overflow-hidden" style={{ height: 300 }}>
        <FloorPlanCanvas
          layout={layout}
          zoom={0.5}
          showGrid={true}
          selectedZone={selectedZone}
          onZoneSelect={setSelectedZone}
          onZoneUpdate={() => {}}
          onAddZone={() => {}}
          onDeleteZone={() => {}}
        />
      </div>

      {/* Current layout stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center">
          <div className="text-xs text-white/40">功能区</div>
          <div className="text-lg font-semibold mt-1">{layout.zones.length}</div>
        </div>
        <div className="px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center">
          <div className="text-xs text-white/40">总面积</div>
          <div className="text-lg font-semibold mt-1">{totalArea.toFixed(0)} {layout.dimensions.unit}²</div>
        </div>
        <div className="px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-center">
          <div className="text-xs text-white/40">合规评分</div>
          <div
            className={`text-lg font-semibold mt-1 ${
              validation
                ? validation.score >= 80
                  ? "text-emerald-400"
                  : validation.score >= 60
                    ? "text-amber-400"
                    : "text-red-400"
                : ""
            }`}
          >
            {validation?.score ?? "--"}
          </div>
        </div>
      </div>

      {/* Violation list */}
      {validation && validation.violations.length > 0 && (
        <section>
          <h4 className="text-sm text-white/60 mb-2">
            待处理问题 ({validation.violations.length})
          </h4>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {validation.violations.map((v, i) => {
              const cfg = SEVERITY_CONFIG[v.severity as keyof typeof SEVERITY_CONFIG] ?? SEVERITY_CONFIG.info;
              const SevIcon = cfg.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg ${cfg.bg}`}
                >
                  <SevIcon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm">{v.message}</span>
                  </div>
                  <span className={`text-xs shrink-0 ${cfg.color}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {validation && validation.violations.length === 0 && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm text-center">
          所有验证通过，无待处理问题
        </div>
      )}

      {/* Open editor button */}
      <button
        onClick={() => {
          const currentLayout = useWizardStore.getState().layouts[useWizardStore.getState().activeLayoutIndex];
          useWizardStore.getState().exitWizard(currentLayout);
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--neon-cyan)] text-black font-medium hover:opacity-90"
      >
        <PenTool className="w-4 h-4" /> 打开编辑器
      </button>
      <p className="text-xs text-white/30 text-center">
        退出向导后将进入完整编辑器，可手动调整布局
      </p>
    </div>
  );
}
