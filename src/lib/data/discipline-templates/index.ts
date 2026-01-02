import type { Discipline } from "@/lib/schemas/launcher";
import type { DisciplineTemplate, TemplateZone } from "@/lib/schemas/discipline-template";
import type { ZoneData, LayoutData } from "@/lib/ai/agents/layout-agent";

import { lifeHealthTemplate } from "./life-health";
import { deepSpaceOceanTemplate } from "./deep-space-ocean";
import { socialInnovationTemplate } from "./social-innovation";
import { microNanoTemplate } from "./micro-nano";
import { digitalInfoTemplate } from "./digital-info";

// 所有学科模板
export const DISCIPLINE_TEMPLATES: Record<Discipline, DisciplineTemplate> = {
  "life-health": lifeHealthTemplate,
  "deep-space-ocean": deepSpaceOceanTemplate,
  "social-innovation": socialInnovationTemplate,
  "micro-nano": microNanoTemplate,
  "digital-info": digitalInfoTemplate,
};

/**
 * 获取学科模板
 */
export function getDisciplineTemplate(discipline: Discipline): DisciplineTemplate {
  return DISCIPLINE_TEMPLATES[discipline];
}

/**
 * 将模板区域转换为 LayoutData 格式
 */
export function templateToLayout(template: DisciplineTemplate): LayoutData {
  const zones: ZoneData[] = template.layout.zones.map((zone: TemplateZone) => ({
    id: zone.id,
    name: zone.name,
    type: zone.type as ZoneData["type"],
    position: zone.position,
    size: zone.size,
    color: zone.color,
    equipment: [],
  }));

  return {
    name: template.name,
    description: template.description,
    dimensions: template.layout.dimensions,
    zones,
  };
}

/**
 * 获取学科模板并转换为可用布局
 */
export function getLayoutFromDiscipline(discipline: Discipline): LayoutData {
  const template = getDisciplineTemplate(discipline);
  return templateToLayout(template);
}

// 导出所有模板
export { lifeHealthTemplate } from "./life-health";
export { deepSpaceOceanTemplate } from "./deep-space-ocean";
export { socialInnovationTemplate } from "./social-innovation";
export { microNanoTemplate } from "./micro-nano";
export { digitalInfoTemplate } from "./digital-info";
