// src/lib/ai/agents/emotion-design-agent.ts
import { generateText } from "ai";
import { getTextModel } from "../providers";
import {
  type EmotionScript,
  type EmotionToSpaceResult,
  EmotionToSpaceResultSchema,
} from "@/lib/schemas/emotion-design";

const EMOTION_DESIGN_SYSTEM_PROMPT = `你是一位结合环境心理学和空间设计的专家。你的任务是根据用户期望的情绪体验，反向推导出空间设计要素。

你的知识基础包括：
1. 环境心理学研究（Kaplan注意力恢复理论、Ulrich压力恢复理论）
2. 建筑现象学（空间如何影响人的感受）
3. 神经建筑学（大脑对空间的反应）
4. 色彩心理学
5. 声学设计对情绪的影响

关键的情绪-空间映射规则：
- 敬畏感 → 高挑空间（>4m）、大尺度、对称、深色调、回响声学
- 好奇心 → 隐藏角落、层次空间、视觉遮挡、多样材质
- 专注力 → 适中高度（2.4-3m）、均匀光线、中性色调、静音
- 兴奋感 → 动态光线、明亮色彩、开放空间
- 平静感 → 自然元素、温暖色调、柔软材质
- 协作感 → 环形布局、透明隔断、可移动家具
- 创造力 → 可变空间、多样刺激、允许混乱
- 安全感 → 封闭感、温暖照明、熟悉材质

请始终以 JSON 格式输出结果。`;

export interface GenerateEmotionDesignOptions {
  emotionScript: EmotionScript;
  constraints?: {
    maxArea?: number;
    maxBudget?: number;
    existingLayout?: unknown;
  };
  modelKey?: string;
}

export async function generateEmotionDesign(
  options: GenerateEmotionDesignOptions
): Promise<EmotionToSpaceResult> {
  const { emotionScript, constraints, modelKey = "claude-sonnet" } = options;

  if (!emotionScript.nodes || emotionScript.nodes.length === 0) {
    throw new Error("Emotion script must have at least one node");
  }

  const model = getTextModel(modelKey);

  const prompt = `根据以下情绪剧本，生成空间设计建议。

情绪剧本：
${JSON.stringify(emotionScript, null, 2)}

${constraints ? `约束条件：${JSON.stringify(constraints)}` : ""}

请输出完整的设计建议，JSON 格式：
{
  "emotionScript": { /* 原始剧本 */ },
  "spatialElements": [
    {
      "category": "height|lighting|color|acoustics|material|layout|furniture",
      "recommendation": "具体建议",
      "rationale": "科学依据",
      "priority": "high|medium|low"
    }
  ],
  "suggestedZones": [
    {
      "name": "区域名称",
      "purpose": "用途",
      "targetEmotions": ["emotion1", "emotion2"],
      "suggestedSize": { "width": 5, "height": 4 },
      "keyFeatures": ["特征1", "特征2"]
    }
  ],
  "designNarrative": "设计叙事，描述用户进入空间后的完整情绪旅程"
}`;

  const { text } = await generateText({
    model,
    system: EMOTION_DESIGN_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract emotion design result from AI response");
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error(`Invalid JSON in emotion design response: ${e instanceof Error ? e.message : e}`);
  }

  return EmotionToSpaceResultSchema.parse(parsed);
}

// Export system prompt for testing
export { EMOTION_DESIGN_SYSTEM_PROMPT };
