"use client";

import { useWizardStore } from "@/stores/wizard-store";
import { Download, FileJson, FileImage, FileText } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { FloorPlanCanvas } from "@/features/lab-editor/FloorPlanCanvas";
import { downloadReport } from "@/lib/utils/report-generator";

type ExportFormat = "json" | "pdf" | "png";

const FORMAT_OPTIONS: { id: ExportFormat; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "json", label: "JSON 数据", icon: FileJson },
  { id: "pdf", label: "PDF 报告", icon: FileText },
  { id: "png", label: "PNG 图片", icon: FileImage },
];

export function ExportStep() {
  const { layouts, activeLayoutIndex, validation, needs } = useWizardStore();
  const layout = layouts[activeLayoutIndex];
  const [selectedFormats, setSelectedFormats] = useState<Set<ExportFormat>>(new Set(["json"]));
  const canvasRef = useRef<HTMLDivElement>(null);

  const toggleFormat = (fmt: ExportFormat) => {
    setSelectedFormats((prev) => {
      const next = new Set(prev);
      if (next.has(fmt)) next.delete(fmt);
      else next.add(fmt);
      return next;
    });
  };

  const handleExportPng = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasRef.current, { backgroundColor: "#0a0a0f", scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${layout?.name || "floor-plan"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      console.error("PNG export failed");
    }
  }, [layout]);

  const handleExport = useCallback(async () => {
    if (!layout) return;

    if (selectedFormats.has("json")) {
      const blob = new Blob([JSON.stringify(layout, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${layout.name || "layout"}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    if (selectedFormats.has("pdf")) {
      let images: Array<{ viewType: string; imageData: string }> | undefined;
      if (canvasRef.current) {
        try {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await html2canvas(canvasRef.current, { backgroundColor: "#0a0a0f", scale: 2 });
          const dataUrl = canvas.toDataURL("image/png");
          const base64 = dataUrl.split(",")[1] || "";
          images = [{ viewType: "平面图", imageData: base64 }];
        } catch { /* ignore capture failure */ }
      }
      await downloadReport({
        layout,
        validation: validation || undefined,
        projectName: needs?.projectName,
        images,
      });
    }

    if (selectedFormats.has("png")) {
      await handleExportPng();
    }
  }, [layout, selectedFormats, validation, needs, handleExportPng]);

  if (!layout) {
    return (
      <div className="p-6 text-center text-white/40">
        <p>暂无方案可导出</p>
      </div>
    );
  }

  const totalArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);

  return (
    <div className="p-6 space-y-5">
      <h3 className="text-base font-medium">导出交付</h3>

      {/* Summary */}
      <div className="px-4 py-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">方案名称</span>
          <span>{layout.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">尺寸</span>
          <span>{layout.dimensions.width}x{layout.dimensions.height} {layout.dimensions.unit}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">功能区</span>
          <span>{layout.zones.length} 个</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-white/50">总面积</span>
          <span>{totalArea.toFixed(1)} {layout.dimensions.unit}²</span>
        </div>
        {validation && (
          <div className="flex justify-between text-sm">
            <span className="text-white/50">合规评分</span>
            <span
              className={
                validation.score >= 80
                  ? "text-emerald-400"
                  : validation.score >= 60
                    ? "text-amber-400"
                    : "text-red-400"
              }
            >
              {validation.score} 分
            </span>
          </div>
        )}
      </div>

      {/* Format selection */}
      <section>
        <h4 className="text-sm text-white/60 mb-2">导出格式</h4>
        <div className="grid gap-2">
          {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = selectedFormats.has(id);
            return (
              <label
                key={id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                  isActive
                    ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5"
                    : "border-[var(--glass-border)] hover:bg-white/5"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => toggleFormat(id)}
                  className="accent-[var(--neon-cyan)]"
                />
                <Icon className="w-5 h-5 text-white/50" />
                <span className="text-sm">{label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Hidden canvas for PNG export */}
      <div ref={canvasRef} className="fixed -left-[9999px] -top-[9999px]" style={{ width: 1200, height: 900 }}>
        {layout && (
          <FloorPlanCanvas
            layout={layout}
            zoom={0.8}
            showGrid={true}
            selectedZone={null}
            onZoneSelect={() => {}}
            onZoneUpdate={() => {}}
            onAddZone={() => {}}
            onDeleteZone={() => {}}
          />
        )}
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={selectedFormats.size === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--neon-cyan)] text-black font-medium disabled:opacity-30 hover:opacity-90"
      >
        <Download className="w-4 h-4" /> 导出
      </button>
    </div>
  );
}
