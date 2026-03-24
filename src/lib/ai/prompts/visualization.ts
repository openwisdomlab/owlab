/**
 * Visualization Prompt Templates — 25 types of creative lab visualizations.
 * Each type has a prompt builder that converts LayoutData into an image generation prompt.
 */

import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import { ZONE_LABELS, type ZoneType } from "@/lib/constants/zone-types";

// ============================================
// Visualization Type Definitions
// ============================================

export type ViewCategory = "technical" | "spatial" | "atmosphere" | "analysis" | "infographic";

export type ViewType =
  // A. Technical (programmatic)
  | "floor-plan" | "section-view" | "ceiling-plan" | "equipment-detail" | "evacuation" | "mep-layout"
  // B. Spatial (AI-generated)
  | "axonometric" | "one-point-perspective" | "two-point-perspective" | "birds-eye" | "exploded" | "sectional-perspective" | "worms-eye"
  // C. Atmosphere (AI-generated)
  | "day-rendering" | "night-rendering" | "eye-level" | "activity-scene" | "concept-sketch" | "before-after"
  // D. Analysis (mixed)
  | "zoning-diagram" | "circulation" | "lighting-analysis" | "acoustic-analysis"
  // E. Infographic (programmatic)
  | "budget-infographic" | "compliance-scorecard";

export interface ViewTypeConfig {
  id: ViewType;
  category: ViewCategory;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  generationMethod: "ai" | "programmatic" | "mixed";
  defaultAspectRatio: string;
}

export const VIEW_TYPE_CONFIGS: ViewTypeConfig[] = [
  // A. Technical
  { id: "floor-plan", category: "technical", name: "Floor Plan", nameZh: "标准平面图", description: "Architectural floor plan with walls, doors, equipment", descriptionZh: "建筑级平面图，墙线/门窗/设备/标注", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "section-view", category: "technical", name: "Section View", nameZh: "剖面图", description: "Cross-section showing heights and MEP", descriptionZh: "纵向/横向切面，展示层高、管线", generationMethod: "programmatic", defaultAspectRatio: "16:9" },
  { id: "ceiling-plan", category: "technical", name: "Reflected Ceiling Plan", nameZh: "天花板反射图", description: "Lighting fixtures, vents, ceiling zones", descriptionZh: "灯具位置、通风口、吊顶分区", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "equipment-detail", category: "technical", name: "Equipment Detail", nameZh: "设备布局详图", description: "Zoomed view of a single zone with equipment", descriptionZh: "单个区域放大，设备精确位置", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "evacuation", category: "technical", name: "Emergency Evacuation", nameZh: "安全疏散图", description: "Escape routes, fire equipment, assembly points", descriptionZh: "逃生路线、消防设备、集合点", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "mep-layout", category: "technical", name: "MEP Layout", nameZh: "管线综合图", description: "Power, network, HVAC, plumbing routes", descriptionZh: "电力/网络/通风/给排水管线走向", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  // B. Spatial
  { id: "axonometric", category: "spatial", name: "Axonometric View", nameZh: "轴测图", description: "Isometric view showing spatial relationships", descriptionZh: "等距视角展示空间整体关系", generationMethod: "ai", defaultAspectRatio: "4:3" },
  { id: "one-point-perspective", category: "spatial", name: "One-Point Perspective", nameZh: "一点透视图", description: "Corridor view with depth", descriptionZh: "走廊视角，强调纵深感", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "two-point-perspective", category: "spatial", name: "Two-Point Perspective", nameZh: "两点透视图", description: "Corner view showing two walls", descriptionZh: "转角视角，展示两面墙关系", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "birds-eye", category: "spatial", name: "Bird's Eye View", nameZh: "鸟瞰图", description: "45° overhead view of entire layout", descriptionZh: "45° 俯视全局，展示布局全貌", generationMethod: "ai", defaultAspectRatio: "4:3" },
  { id: "exploded", category: "spatial", name: "Exploded View", nameZh: "爆炸图", description: "Layered breakdown: roof->ceiling->walls->equipment->floor", descriptionZh: "分层拆解：屋顶->天花板->墙体->设备->地面", generationMethod: "ai", defaultAspectRatio: "3:4" },
  { id: "sectional-perspective", category: "spatial", name: "Sectional Perspective", nameZh: "剖透视图", description: "Cut-away wall showing interior", descriptionZh: "切开一面墙展示内部空间", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "worms-eye", category: "spatial", name: "Worm's Eye View", nameZh: "虫眼视角", description: "Looking up at ceiling and high equipment", descriptionZh: "从下往上仰视，展示天花板", generationMethod: "ai", defaultAspectRatio: "4:3" },
  // C. Atmosphere
  { id: "day-rendering", category: "atmosphere", name: "Day Rendering", nameZh: "日间效果图", description: "Natural lighting, daytime atmosphere", descriptionZh: "自然光下的空间感", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "night-rendering", category: "atmosphere", name: "Night Rendering", nameZh: "夜间效果图", description: "Artificial lighting atmosphere", descriptionZh: "人工照明氛围", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "eye-level", category: "atmosphere", name: "Eye-Level View", nameZh: "人视点效果图", description: "1.6m height first-person view", descriptionZh: "1.6m 高度第一人称感受", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "activity-scene", category: "atmosphere", name: "Activity Scene", nameZh: "活动场景图", description: "People using the space", descriptionZh: "有人在使用空间的场景", generationMethod: "ai", defaultAspectRatio: "16:9" },
  { id: "concept-sketch", category: "atmosphere", name: "Concept Sketch", nameZh: "概念草图", description: "Hand-drawn/watercolor style concept", descriptionZh: "手绘/水彩风格概念表达", generationMethod: "ai", defaultAspectRatio: "4:3" },
  { id: "before-after", category: "atmosphere", name: "Before/After", nameZh: "改造前后对比", description: "Split-screen renovation comparison", descriptionZh: "左右分屏展示改造效果", generationMethod: "ai", defaultAspectRatio: "16:9" },
  // D. Analysis
  { id: "zoning-diagram", category: "analysis", name: "Zoning Diagram", nameZh: "功能分区图", description: "Color-coded zones with area labels", descriptionZh: "彩色区域分区 + 面积标注", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "circulation", category: "analysis", name: "Circulation Diagram", nameZh: "流线分析图", description: "People/material flow paths", descriptionZh: "人流/物流路径和交叉点", generationMethod: "mixed", defaultAspectRatio: "4:3" },
  { id: "lighting-analysis", category: "analysis", name: "Lighting Analysis", nameZh: "光照分析图", description: "Light distribution heatmap", descriptionZh: "自然光/人工光照度分布", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "acoustic-analysis", category: "analysis", name: "Acoustic Analysis", nameZh: "声学分析图", description: "Noise propagation zones", descriptionZh: "噪声传播、隔音分区", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  // E. Infographic
  { id: "budget-infographic", category: "infographic", name: "Budget Infographic", nameZh: "预算分配图", description: "Cost breakdown charts", descriptionZh: "成本饼图/条图/面积占比", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
  { id: "compliance-scorecard", category: "infographic", name: "Compliance Scorecard", nameZh: "合规评分卡", description: "Radar chart of compliance scores", descriptionZh: "各维度通过率雷达图", generationMethod: "programmatic", defaultAspectRatio: "4:3" },
];

// ============================================
// Style Options
// ============================================

export type RenderStyle = "photorealistic" | "architectural" | "sketch" | "watercolor" | "technical" | "minimal";

export const RENDER_STYLES: Record<RenderStyle, { name: string; nameZh: string; promptModifier: string }> = {
  photorealistic: { name: "Photorealistic", nameZh: "写实渲染", promptModifier: "photorealistic rendering, ray-traced lighting, physically based materials, high detail, 8K quality" },
  architectural: { name: "Architectural", nameZh: "建筑可视化", promptModifier: "professional architectural visualization, clean lines, neutral palette, studio lighting, presentation quality" },
  sketch: { name: "Hand Sketch", nameZh: "手绘风格", promptModifier: "hand-drawn architectural sketch, pen and ink, loose lines, artistic, concept drawing style" },
  watercolor: { name: "Watercolor", nameZh: "水彩风格", promptModifier: "watercolor painting style, soft colors, artistic brushstrokes, ethereal atmosphere" },
  technical: { name: "Technical", nameZh: "技术线稿", promptModifier: "technical drawing, precise lines, orthographic projection, engineering diagram style, white background" },
  minimal: { name: "Minimal", nameZh: "极简风格", promptModifier: "minimalist design, clean white space, subtle shadows, simple geometric forms, modern aesthetic" },
};

// ============================================
// Report Suite Presets
// ============================================

export type SuitePreset = "quick" | "standard" | "full";

export const SUITE_PRESETS: Record<SuitePreset, { name: string; nameZh: string; views: ViewType[] }> = {
  quick: {
    name: "Quick Suite",
    nameZh: "快速套图（5张）",
    views: ["birds-eye", "eye-level", "zoning-diagram", "exploded", "budget-infographic"],
  },
  standard: {
    name: "Standard Suite",
    nameZh: "标准套图（10张）",
    views: ["birds-eye", "eye-level", "zoning-diagram", "exploded", "budget-infographic", "axonometric", "sectional-perspective", "activity-scene", "day-rendering", "compliance-scorecard"],
  },
  full: {
    name: "Full Suite",
    nameZh: "完整套图（20张）",
    views: ["birds-eye", "eye-level", "zoning-diagram", "exploded", "budget-infographic", "axonometric", "sectional-perspective", "activity-scene", "day-rendering", "compliance-scorecard", "floor-plan", "section-view", "ceiling-plan", "evacuation", "mep-layout", "circulation", "lighting-analysis", "night-rendering", "concept-sketch", "before-after"],
  },
};

// ============================================
// Prompt Builder
// ============================================

/** Convert layout data to a scene description for AI image generation */
export function buildSceneDescription(layout: LayoutData): string {
  const { dimensions, zones } = layout;
  const lines: string[] = [];

  lines.push(`A ${dimensions.width}m \u00d7 ${dimensions.height}m laboratory space called "${layout.name}".`);
  lines.push(`${layout.description}`);
  lines.push("");
  lines.push("Zones:");

  for (const zone of zones) {
    const label = ZONE_LABELS[zone.type as ZoneType] || zone.type;
    const area = zone.size.width * zone.size.height;
    lines.push(`- ${zone.name} (${label}): ${zone.size.width}\u00d7${zone.size.height}m = ${area}m\u00b2, located at position (${zone.position.x}, ${zone.position.y})`);
    if (zone.equipment && zone.equipment.length > 0) {
      lines.push(`  Equipment: ${zone.equipment.join(", ")}`);
    }
  }

  return lines.join("\n");
}

/** Build the full prompt for a specific view type */
export function buildVisualizationPrompt(
  layout: LayoutData,
  viewType: ViewType,
  style: RenderStyle = "architectural"
): string {
  const config = VIEW_TYPE_CONFIGS.find(v => v.id === viewType);
  if (!config) throw new Error(`Unknown view type: ${viewType}`);

  const scene = buildSceneDescription(layout);
  const styleModifier = RENDER_STYLES[style].promptModifier;

  // View-specific prompt construction
  const viewPrompts: Partial<Record<ViewType, string>> = {
    "axonometric": `Isometric/axonometric architectural visualization of a laboratory. View from above at 30\u00b0 angle, no perspective distortion. Show all zones with distinct areas, furniture, and equipment visible from above. Clean architectural rendering.`,
    "birds-eye": `Bird's eye view of a laboratory from 45\u00b0 above. Show the entire floor plan layout with all zones visible, walls with proper height, furniture and equipment placed in each zone. Architectural model style.`,
    "exploded": `Exploded axonometric diagram of a laboratory building. Separate layers floating above each other: 1) roof/ceiling with lighting fixtures, 2) walls with windows and doors, 3) furniture and equipment, 4) floor with zone markings. Technical illustration style with clean white background.`,
    "one-point-perspective": `One-point perspective interior view looking down the main corridor of a laboratory. Vanishing point centered. Show zones on both sides through glass partitions and open doorways. Interior architectural photography style.`,
    "two-point-perspective": `Two-point perspective interior view from a corner of a laboratory. Show two walls converging with zones visible on both sides. Modern laboratory interior with equipment and workstations visible.`,
    "sectional-perspective": `Architectural section perspective of a laboratory. One wall cut away to reveal the interior. Show ceiling structure, MEP systems above, furniture and equipment at floor level, floor construction below. Technical architectural illustration.`,
    "worms-eye": `Looking up from floor level inside a laboratory. Show ceiling systems, overhead lighting, ventilation ducts, cable trays. Equipment and furniture visible at eye periphery. Wide-angle lens effect.`,
    "day-rendering": `Interior photograph of a modern laboratory during daytime. Large windows letting in natural sunlight. Warm, inviting atmosphere. People working at various stations. Contemporary lab design with clean aesthetics.`,
    "night-rendering": `Interior photograph of a modern laboratory at night. Artificial lighting creating a focused, productive atmosphere. LED strip lights, task lighting at workstations, accent lighting highlighting features. Warm and cool light contrast.`,
    "eye-level": `Eye-level interior photograph (camera at 1.6m height) standing inside a modern laboratory. First-person view showing the space as you would experience it. Natural perspective, depth of field, architectural interior photography.`,
    "activity-scene": `Photograph of researchers and students actively working in a modern laboratory. People collaborating at workstations, conducting experiments, discussing at whiteboards. Lively, productive atmosphere. Diverse team of scientists.`,
    "concept-sketch": `Architectural concept sketch of a laboratory. Hand-drawn with pen and ink, loose gestural lines, quick shading. Annotated with handwritten notes pointing to key features. Architect's sketchbook style on white paper.`,
    "before-after": `Split image showing laboratory renovation: left side shows an empty/outdated room, right side shows the same space transformed into a modern, well-equipped laboratory. Clear dividing line in the middle. Before and after comparison.`,
  };

  const viewPrompt = viewPrompts[viewType] || `${config.description} of a laboratory space.`;

  return `${viewPrompt}\n\nScene details:\n${scene}\n\nStyle: ${styleModifier}`;
}
