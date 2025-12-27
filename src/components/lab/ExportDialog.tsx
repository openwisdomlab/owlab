"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  X,
  Download,
  FileImage,
  FileText,
  FileJson,
  Loader2,
  Check,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

interface ExportDialogProps {
  layout: LayoutData;
  onClose: () => void;
}

type ExportFormat = "png" | "pdf" | "json" | "md";

export function ExportDialog({ layout, onClose }: ExportDialogProps) {
  const t = useTranslations("lab.export");
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<ExportFormat | null>(null);
  const [includeDoc, setIncludeDoc] = useState(true);

  const formats: { id: ExportFormat; icon: typeof FileImage; label: string }[] = [
    { id: "png", icon: FileImage, label: "PNG Image" },
    { id: "pdf", icon: FileText, label: "PDF Document" },
    { id: "json", icon: FileJson, label: "JSON Data" },
    { id: "md", icon: FileText, label: "Markdown Doc" },
  ];

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    setExportedFormat(null);

    try {
      switch (format) {
        case "png":
          await exportAsPNG();
          break;
        case "pdf":
          await exportAsPDF();
          break;
        case "json":
          exportAsJSON();
          break;
        case "md":
          await exportAsMarkdown();
          break;
      }
      setExportedFormat(format);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPNG = async () => {
    const canvas = document.querySelector("[data-floor-plan-canvas]") as HTMLElement;
    if (!canvas) {
      // Create a simple representation
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = `
        width: 1200px;
        height: 800px;
        background: #020617;
        padding: 40px;
        position: fixed;
        left: -9999px;
      `;
      tempDiv.innerHTML = generateCanvasHTML(layout);
      document.body.appendChild(tempDiv);

      const canvasEl = await html2canvas(tempDiv, {
        backgroundColor: "#020617",
        scale: 2,
      });

      document.body.removeChild(tempDiv);

      const link = document.createElement("a");
      link.download = `${layout.name.replace(/\s+/g, "-")}-layout.png`;
      link.href = canvasEl.toDataURL("image/png");
      link.click();
    }
  };

  const exportAsPDF = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Title
    pdf.setFontSize(24);
    pdf.setTextColor(34, 211, 238);
    pdf.text(layout.name, 20, 20);

    // Description
    pdf.setFontSize(12);
    pdf.setTextColor(148, 163, 184);
    pdf.text(layout.description, 20, 30);

    // Dimensions
    pdf.setFontSize(10);
    pdf.text(
      `Dimensions: ${layout.dimensions.width} × ${layout.dimensions.height} ${layout.dimensions.unit}`,
      20,
      40
    );

    // Zones Table
    pdf.setFontSize(14);
    pdf.setTextColor(34, 211, 238);
    pdf.text("Zones", 20, 55);

    let y = 65;
    pdf.setFontSize(10);
    pdf.setTextColor(226, 232, 240);

    layout.zones.forEach((zone) => {
      pdf.text(`• ${zone.name} (${zone.type})`, 25, y);
      pdf.text(
        `  Size: ${zone.size.width}×${zone.size.height} | Equipment: ${
          zone.equipment?.join(", ") || "None"
        }`,
        25,
        y + 5
      );
      y += 15;
    });

    // Notes
    if (layout.notes && layout.notes.length > 0) {
      y += 10;
      pdf.setFontSize(14);
      pdf.setTextColor(34, 211, 238);
      pdf.text("Notes", 20, y);
      y += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(226, 232, 240);
      layout.notes.forEach((note) => {
        pdf.text(`• ${note}`, 25, y);
        y += 7;
      });
    }

    pdf.save(`${layout.name.replace(/\s+/g, "-")}-layout.pdf`);
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(layout, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${layout.name.replace(/\s+/g, "-")}-layout.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAsMarkdown = async () => {
    let md = `# ${layout.name}\n\n`;
    md += `${layout.description}\n\n`;
    md += `## Specifications\n\n`;
    md += `- **Dimensions**: ${layout.dimensions.width} × ${layout.dimensions.height} ${layout.dimensions.unit}\n`;
    md += `- **Total Zones**: ${layout.zones.length}\n\n`;

    md += `## Zones\n\n`;
    layout.zones.forEach((zone) => {
      md += `### ${zone.name}\n\n`;
      md += `- **Type**: ${zone.type}\n`;
      md += `- **Size**: ${zone.size.width} × ${zone.size.height}\n`;
      md += `- **Position**: (${zone.position.x}, ${zone.position.y})\n`;
      if (zone.equipment && zone.equipment.length > 0) {
        md += `- **Equipment**: ${zone.equipment.join(", ")}\n`;
      }
      md += "\n";
    });

    if (layout.notes && layout.notes.length > 0) {
      md += `## Notes\n\n`;
      layout.notes.forEach((note) => {
        md += `- ${note}\n`;
      });
    }

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${layout.name.replace(/\s+/g, "-")}-layout.md`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-card p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Download className="w-5 h-5 text-[var(--neon-cyan)]" />
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleExport(format.id)}
              disabled={isExporting}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                {isExporting && exportedFormat === null ? (
                  <Loader2 className="w-5 h-5 text-[var(--neon-cyan)] animate-spin" />
                ) : exportedFormat === format.id ? (
                  <Check className="w-5 h-5 text-[var(--neon-green)]" />
                ) : (
                  <format.icon className="w-5 h-5 text-[var(--neon-cyan)]" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium">{format.label}</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {t(`formats.${format.id}`)}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--glass-border)]">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDoc}
              onChange={(e) => setIncludeDoc(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--glass-border)] bg-[var(--glass-bg)] checked:bg-[var(--neon-cyan)]"
            />
            <span className="text-sm">{t("includeDocumentation")}</span>
          </label>
        </div>
      </motion.div>
    </motion.div>
  );
}

function generateCanvasHTML(layout: LayoutData): string {
  const GRID_SIZE = 30;

  let zonesHTML = layout.zones
    .map(
      (zone) => `
    <div style="
      position: absolute;
      left: ${zone.position.x * GRID_SIZE + 40}px;
      top: ${zone.position.y * GRID_SIZE + 60}px;
      width: ${zone.size.width * GRID_SIZE}px;
      height: ${zone.size.height * GRID_SIZE}px;
      background: ${zone.color}40;
      border-left: 4px solid ${zone.color};
      border-radius: 8px;
      padding: 8px;
    ">
      <div style="color: ${zone.color}; font-weight: 600; font-size: 12px;">${zone.name}</div>
      <div style="color: #94a3b8; font-size: 10px;">${zone.type}</div>
    </div>
  `
    )
    .join("");

  return `
    <div style="color: #e2e8f0; font-family: system-ui, sans-serif;">
      <h1 style="color: #22d3ee; font-size: 24px; margin-bottom: 8px;">${layout.name}</h1>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">${layout.description}</p>
      <div style="position: relative; width: ${layout.dimensions.width * GRID_SIZE + 80}px; height: ${layout.dimensions.height * GRID_SIZE + 80}px;">
        <div style="position: absolute; inset: 40px; border: 2px solid rgba(255,255,255,0.1); border-radius: 8px;"></div>
        ${zonesHTML}
      </div>
    </div>
  `;
}
