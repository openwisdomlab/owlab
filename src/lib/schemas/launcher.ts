/**
 * Launcher Schemas - Types for Smart Launcher component
 * AI-assisted lab designer launch modes and discipline selection
 */

import { z } from "zod";

// ============================================
// Launch Mode Schema
// ============================================

export const LaunchModeSchema = z.enum(["chat", "quick", "template", "blank"]);

export type LaunchMode = z.infer<typeof LaunchModeSchema>;

// ============================================
// Discipline Schema - Five Core Research Domains
// ============================================

export const DisciplineSchema = z.enum([
  "life-health",        // 生命健康
  "deep-space-ocean",   // 深空深海
  "social-innovation",  // 社会创新
  "micro-nano",         // 微纳尺度
  "digital-info",       // 数智信息
]);

export type Discipline = z.infer<typeof DisciplineSchema>;

// ============================================
// Sub-Discipline Map - Each domain has specific sub-directions
// ============================================

export const SubDisciplineMapSchema = z.object({
  "life-health": z.array(z.string()).default([
    "生物医学",
    "基因工程",
    "药物研发",
    "神经科学",
    "公共卫生",
    "再生医学",
  ]),
  "deep-space-ocean": z.array(z.string()).default([
    "航天工程",
    "天体物理",
    "海洋探测",
    "深海生物",
    "地质勘探",
    "极端环境",
  ]),
  "social-innovation": z.array(z.string()).default([
    "教育科技",
    "城市规划",
    "社会治理",
    "可持续发展",
    "文化创意",
    "公共政策",
  ]),
  "micro-nano": z.array(z.string()).default([
    "纳米材料",
    "量子计算",
    "微电子",
    "精密制造",
    "表面工程",
    "微流控",
  ]),
  "digital-info": z.array(z.string()).default([
    "人工智能",
    "大数据",
    "物联网",
    "云计算",
    "区块链",
    "网络安全",
  ]),
});

export type SubDisciplineMap = z.infer<typeof SubDisciplineMapSchema>;

// Default sub-discipline map values
export const DEFAULT_SUB_DISCIPLINES: SubDisciplineMap = {
  "life-health": [
    "生物医学",
    "基因工程",
    "药物研发",
    "神经科学",
    "公共卫生",
    "再生医学",
  ],
  "deep-space-ocean": [
    "航天工程",
    "天体物理",
    "海洋探测",
    "深海生物",
    "地质勘探",
    "极端环境",
  ],
  "social-innovation": [
    "教育科技",
    "城市规划",
    "社会治理",
    "可持续发展",
    "文化创意",
    "公共政策",
  ],
  "micro-nano": [
    "纳米材料",
    "量子计算",
    "微电子",
    "精密制造",
    "表面工程",
    "微流控",
  ],
  "digital-info": [
    "人工智能",
    "大数据",
    "物联网",
    "云计算",
    "区块链",
    "网络安全",
  ],
};

// ============================================
// Discipline Metadata - Display information
// ============================================

export interface DisciplineMetadata {
  id: Discipline;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
}

export const DISCIPLINE_METADATA: DisciplineMetadata[] = [
  {
    id: "life-health",
    name: "生命健康",
    description: "生物医学、基因工程、药物研发",
    icon: "Dna",
  },
  {
    id: "deep-space-ocean",
    name: "深空深海",
    description: "航天探索、海洋研究、地质勘探",
    icon: "Rocket",
  },
  {
    id: "social-innovation",
    name: "社会创新",
    description: "教育科技、城市规划、可持续发展",
    icon: "Globe",
  },
  {
    id: "micro-nano",
    name: "微纳尺度",
    description: "纳米材料、量子计算、精密制造",
    icon: "Atom",
  },
  {
    id: "digital-info",
    name: "数智信息",
    description: "人工智能、大数据、物联网",
    icon: "Cpu",
  },
];

// ============================================
// Launcher State Schema
// ============================================

export const LauncherStateSchema = z.object({
  mode: LaunchModeSchema,
  prompt: z.string().optional(),
  discipline: DisciplineSchema.optional(),
  subDisciplines: z.array(z.string()).max(2).optional(),
  templateId: z.string().uuid().optional(),
});

export type LauncherState = z.infer<typeof LauncherStateSchema>;

// ============================================
// Launcher Input Schema (for form validation)
// ============================================

export const LauncherInputSchema = z.object({
  prompt: z.string().min(1, "请输入您的需求描述").max(500, "描述不能超过500字"),
});

export type LauncherInput = z.infer<typeof LauncherInputSchema>;
