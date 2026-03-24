"use client";

import { useWizardStore } from "@/stores/wizard-store";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { Plus, Check } from "lucide-react";

export function ComparisonStep() {
  const { layouts, activeLayoutIndex, setActiveLayout } = useWizardStore();

  if (layouts.length === 0) {
    return (
      <div className="p-6 text-center text-white/40">
        <p>暂无方案可对比</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">方案对比</h3>
        <span className="text-xs text-white/40">共 {layouts.length} 个方案</span>
      </div>

      {/* Layout comparison cards */}
      <div className="grid gap-3">
        {layouts.map((layout, i) => {
          const isActive = i === activeLayoutIndex;
          const totalArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);
          return (
            <button
              key={i}
              onClick={() => setActiveLayout(i)}
              className={`text-left w-full rounded-lg border overflow-hidden transition-colors ${
                isActive
                  ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5"
                  : "border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-white/5"
              }`}
            >
              <div className="h-40 border-b border-[var(--glass-border)] overflow-hidden">
                <FloorPlanCanvas
                  layout={layout}
                  zoom={0.3}
                  showGrid={false}
                  selectedZone={null}
                  onZoneSelect={() => {}}
                  onZoneUpdate={() => {}}
                  onAddZone={() => {}}
                  onDeleteZone={() => {}}
                />
              </div>
              <div className="flex items-center justify-between px-4 pt-3">
                <div>
                  <span className="text-sm font-medium">{layout.name}</span>
                  <p className="text-xs text-white/40 mt-0.5">{layout.description}</p>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center">
                    <Check className="w-4 h-4 text-black" />
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-2 px-4 pb-3 text-xs text-white/50">
                <span>功能区: {layout.zones.length}</span>
                <span>面积: {totalArea.toFixed(0)} {layout.dimensions.unit}²</span>
                <span>
                  尺寸: {layout.dimensions.width}x{layout.dimensions.height} {layout.dimensions.unit}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Generate more */}
      <button
        onClick={() => {
          /* Re-trigger generation for another variant is left to parent orchestration */
        }}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[var(--glass-border)] text-white/40 hover:text-white/60 hover:bg-white/5"
      >
        <Plus className="w-4 h-4" /> 生成更多方案
      </button>
    </div>
  );
}
