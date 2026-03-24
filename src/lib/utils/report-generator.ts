/**
 * Report Generator — creates professional PDF reports from layout data.
 * Uses jsPDF for PDF creation (already in project dependencies).
 */

import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { ValidationResult } from "@/lib/rules/rules-engine";
import { ZONE_LABELS, type ZoneType } from "@/lib/constants/zone-types";

export interface ReportConfig {
  layout: LayoutData;
  validation?: ValidationResult;
  projectName?: string;
  date?: string;
  images?: Array<{ viewType: string; imageData: string }>;
  includeEquipmentList?: boolean;
  includeSafetyReport?: boolean;
  includeBudget?: boolean;
}

export interface ReportSection {
  title: string;
  content: string;
}

/**
 * Generate report data structure (platform-agnostic).
 * Can be consumed by a PDF renderer or displayed in HTML.
 */
export function generateReportData(config: ReportConfig): ReportSection[] {
  const { layout, validation, projectName, date } = config;
  const sections: ReportSection[] = [];

  // Cover
  sections.push({
    title: "封面",
    content: [
      projectName || layout.name,
      layout.description,
      `日期: ${date || new Date().toLocaleDateString("zh-CN")}`,
      `面积: ${layout.dimensions.width} × ${layout.dimensions.height} ${layout.dimensions.unit}`,
    ].join("\n"),
  });

  // Summary
  const totalArea = layout.dimensions.width * layout.dimensions.height;
  const zoneArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);
  sections.push({
    title: "设计概述",
    content: [
      `项目名称: ${layout.name}`,
      `项目描述: ${layout.description}`,
      `总面积: ${totalArea} m²`,
      `功能区面积: ${zoneArea.toFixed(1)} m²`,
      `空间利用率: ${((zoneArea / totalArea) * 100).toFixed(1)}%`,
      `区域数量: ${layout.zones.length}`,
    ].join("\n"),
  });

  // Zone specifications
  const zoneLines = layout.zones.map(z => {
    const label = ZONE_LABELS[z.type as ZoneType] || z.type;
    const area = z.size.width * z.size.height;
    return `${z.name} (${label}): ${z.size.width}×${z.size.height}m = ${area}m²`;
  });
  sections.push({
    title: "区域规格表",
    content: zoneLines.join("\n"),
  });

  // Equipment list
  if (config.includeEquipmentList !== false) {
    const equipLines: string[] = [];
    for (const zone of layout.zones) {
      if (zone.equipment && zone.equipment.length > 0) {
        equipLines.push(`[${zone.name}]`);
        for (const eq of zone.equipment) {
          const name = typeof eq === "string" ? eq :
            (eq && typeof eq === "object" && "name" in eq) ? (eq as { name: string }).name :
            String(eq);
          equipLines.push(`  - ${name}`);
        }
      }
    }
    sections.push({
      title: "设备清单",
      content: equipLines.length > 0 ? equipLines.join("\n") : "暂无设备配置",
    });
  }

  // Safety analysis
  if (config.includeSafetyReport !== false && validation) {
    const safetyLines = [
      `合规评分: ${validation.score}/100`,
      `状态: ${validation.isCompliant ? "✅ 合规" : "⚠️ 需改进"}`,
      `错误: ${validation.errors.length}`,
      `警告: ${validation.warnings.length}`,
      `建议: ${validation.info.length}`,
    ];

    if (validation.errors.length > 0) {
      safetyLines.push("\n错误详情:");
      for (const e of validation.errors) {
        safetyLines.push(`  - [${e.ruleId}] ${e.messageZh}${e.standard ? ` (${e.standard})` : ""}`);
      }
    }

    sections.push({
      title: "安全分析报告",
      content: safetyLines.join("\n"),
    });
  }

  // Notes
  if (layout.notes && layout.notes.length > 0) {
    sections.push({
      title: "备注",
      content: layout.notes.join("\n"),
    });
  }

  return sections;
}

/**
 * Generate a PDF blob from report data.
 * Must be called client-side (dynamically imports jsPDF).
 */
export async function generatePDF(config: ReportConfig): Promise<Blob> {
  const { jsPDF } = await import("jspdf");

  const sections = generateReportData(config);
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    // Add new page for each section (except first)
    if (i > 0) {
      doc.addPage();
      y = margin;
    }

    // Section title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, y);
    y += 12;

    // Separator line
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;

    // Content
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(section.content, contentWidth);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 6;
    }
  }

  // Add images if available
  if (config.images && config.images.length > 0) {
    for (const img of config.images) {
      doc.addPage();
      y = margin;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(img.viewType, margin, y);
      y += 10;

      try {
        const imgWidth = contentWidth;
        const imgHeight = imgWidth * 0.75; // 4:3 aspect ratio
        doc.addImage(`data:image/jpeg;base64,${img.imageData}`, "JPEG", margin, y, imgWidth, imgHeight);
      } catch {
        doc.text("[图片加载失败]", margin, y);
      }
    }
  }

  return doc.output("blob");
}

/**
 * Download a PDF report.
 */
export async function downloadReport(config: ReportConfig): Promise<void> {
  const blob = await generatePDF(config);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${config.projectName || config.layout.name}-report.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
