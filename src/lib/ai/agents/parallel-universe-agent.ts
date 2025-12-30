// src/lib/ai/agents/parallel-universe-agent.ts
import { generateText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import type { LayoutData } from "./layout-agent";

export const PARALLEL_UNIVERSE_SYSTEM_PROMPT = `你是一个空间设计专家，擅长探索设计的多种可能性。

当用户提供一个设计决策点时，你需要生成2-3个完全不同的设计方向，每个方向都有其独特的优势和权衡。

每个方向应该：
1. 有一个清晰的主题/理念
2. 完整的布局设计
3. 明确的优势和劣势
4. 估算的成本和效率

输出格式为 JSON 数组。`;

export const UniverseVariantSchema = z.object({
  name: z.string(),
  theme: z.string(),
  description: z.string(),
  layout: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      unit: z.enum(["m", "ft"]),
    }),
    zones: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(["compute", "workspace", "meeting", "storage", "utility", "entrance"]),
      position: z.object({ x: z.number(), y: z.number() }),
      size: z.object({ width: z.number(), height: z.number() }),
      color: z.string(),
    })),
  }),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  estimatedCost: z.number(),
  efficiencyScore: z.number(),
});

export type UniverseVariant = z.infer<typeof UniverseVariantSchema>;

export interface GenerateParallelUniversesOptions {
  currentLayout: LayoutData;
  decisionPoint: string; // e.g., "入口位置", "工作区布局"
  constraints?: string;
  modelKey?: string;
}

export async function generateParallelUniverses(
  options: GenerateParallelUniversesOptions
): Promise<UniverseVariant[]> {
  const {
    currentLayout,
    decisionPoint,
    constraints,
    modelKey = "claude-sonnet",
  } = options;

  const model = getTextModel(modelKey);

  const prompt = `基于以下当前设计，针对决策点「${decisionPoint}」生成3个平行宇宙设计方案。

当前设计：
${JSON.stringify(currentLayout, null, 2)}

${constraints ? `约束条件：${constraints}` : ""}

请生成3个完全不同的设计方向，以 JSON 数组格式输出：
[
  {
    "name": "方案名称",
    "theme": "设计主题",
    "description": "详细描述",
    "layout": { /* 完整布局 */ },
    "pros": ["优势1", "优势2"],
    "cons": ["劣势1", "劣势2"],
    "estimatedCost": 500000,
    "efficiencyScore": 0.85
  }
]`;

  const { text } = await generateText({
    model,
    system: PARALLEL_UNIVERSE_SYSTEM_PROMPT,
    prompt,
    temperature: 0.8, // 较高温度以获得更多样化的结果
  });

  // 提取 JSON 数组
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Failed to extract parallel universes from response");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON in AI response: ${e instanceof Error ? e.message : e}`);
  }
  return z.array(UniverseVariantSchema).parse(parsed);
}

export interface FuseUniversesOptions {
  universes: LayoutData[];
  fusionStrategy: "best-of-each" | "compromise" | "innovative";
  modelKey?: string;
}

export async function fuseUniversesWithAI(
  options: FuseUniversesOptions
): Promise<LayoutData> {
  const { universes, fusionStrategy, modelKey = "claude-sonnet" } = options;

  if (universes.length === 0) {
    throw new Error("At least one universe is required for fusion");
  }

  const model = getTextModel(modelKey);

  const strategyPrompts = {
    "best-of-each": "从每个宇宙中选取最佳元素组合",
    "compromise": "在各个宇宙之间寻找平衡点",
    "innovative": "基于各宇宙的启发创造全新设计",
  };

  const prompt = `将以下${universes.length}个设计方案融合成一个新方案。

融合策略：${strategyPrompts[fusionStrategy]}

方案列表：
${universes.map((u, i) => `\n方案${i + 1}：\n${JSON.stringify(u, null, 2)}`).join("\n")}

请输出融合后的单一布局方案（JSON格式）。`;

  const { text } = await generateText({
    model,
    system: PARALLEL_UNIVERSE_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract fused layout from response");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON in fusion response: ${e instanceof Error ? e.message : e}`);
  }
  return parsed as LayoutData;
}
