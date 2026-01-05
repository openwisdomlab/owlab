import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getTextModel } from "@/lib/ai/providers";
import {
  LAYOUT_GENERATION_PROMPT,
  getLayoutSystemPrompt,
} from "@/lib/ai/prompts/layout";
import { LayoutSchema, type LayoutData } from "@/lib/ai/agents/layout-agent";
import type { Discipline } from "@/lib/schemas/launcher";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  layout: LayoutData;
  modelKey?: string;
  discipline?: Discipline;
}

// Modification detection keywords in English
const MODIFICATION_KEYWORDS_EN = [
  "add",
  "create",
  "remove",
  "delete",
  "move",
  "resize",
  "change",
  "modify",
  "optimize",
  "generate",
  "design",
  "place",
  "put",
  "insert",
  "update",
  "adjust",
  "expand",
  "shrink",
  "rotate",
  "rename",
];

// Modification detection keywords in Chinese (Chinese lab designer)
const MODIFICATION_KEYWORDS_ZH = [
  "添加",
  "新增",
  "加入",
  "创建",
  "删除",
  "移除",
  "去掉",
  "移动",
  "挪动",
  "调整",
  "修改",
  "更改",
  "改变",
  "优化",
  "生成",
  "设计",
  "放置",
  "摆放",
  "插入",
  "更新",
  "扩大",
  "缩小",
  "旋转",
  "重命名",
  "命名",
  "布局",
  "规划",
  "安排",
  "配置",
  "设置",
];

// All modification keywords combined
const MODIFICATION_KEYWORDS = [...MODIFICATION_KEYWORDS_EN, ...MODIFICATION_KEYWORDS_ZH];

/**
 * Build conversation context summary for the system prompt
 * This helps the AI maintain context across multi-turn conversations
 */
function buildConversationContext(
  messages: ChatRequest["messages"],
  layout: LayoutData
): string {
  const contextParts: string[] = [];

  // Add conversation summary if there's history
  if (messages.length > 1) {
    const previousMessages = messages.slice(0, -1);
    const userMessages = previousMessages.filter((m) => m.role === "user");
    const assistantMessages = previousMessages.filter((m) => m.role === "assistant");

    if (userMessages.length > 0 || assistantMessages.length > 0) {
      contextParts.push("**Conversation Context:**");
      contextParts.push(`- Previous exchanges: ${Math.floor(messages.length / 2)}`);

      // Extract key topics from recent messages
      const recentTopics = userMessages
        .slice(-3)
        .map((m) => m.content.slice(0, 50))
        .join("; ");
      if (recentTopics) {
        contextParts.push(`- Recent user requests: ${recentTopics}`);
      }
    }
  }

  // Add current layout summary
  contextParts.push("\n**Current Layout State:**");
  contextParts.push(`- Layout name: ${layout.name}`);
  contextParts.push(`- Dimensions: ${layout.dimensions.width}×${layout.dimensions.height} ${layout.dimensions.unit}`);
  contextParts.push(`- Total zones: ${layout.zones.length}`);

  if (layout.zones.length > 0) {
    const zoneTypes = layout.zones.map((z) => z.type);
    const typeCount = zoneTypes.reduce(
      (acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    contextParts.push(
      `- Zone distribution: ${Object.entries(typeCount)
        .map(([k, v]) => `${k}(${v})`)
        .join(", ")}`
    );

    // List zone names for context
    const zoneNames = layout.zones.map((z) => z.name).join(", ");
    contextParts.push(`- Existing zones: ${zoneNames}`);
  }

  return contextParts.join("\n");
}

/**
 * Check if message content contains modification intent
 */
function isModificationIntent(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return MODIFICATION_KEYWORDS.some((keyword) => {
    // For Chinese keywords, check as-is (Chinese is not case-sensitive)
    // For English keywords, check lowercase
    if (/[\u4e00-\u9fa5]/.test(keyword)) {
      return content.includes(keyword);
    }
    return lowerContent.includes(keyword);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, layout, modelKey = "claude-sonnet", discipline } = body;

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      return NextResponse.json(
        {
          message:
            "您好！我目前处于演示模式，AI API 密钥尚未配置。在演示模式下，您仍可以手动添加和编辑功能区域。配置 ANTHROPIC_API_KEY 或 POE_API_KEY 环境变量后，即可启用 AI 智能布局设计功能。",
          layout: null,
          demoMode: true,
        },
        { status: 200 }
      );
    }

    const model = getTextModel(modelKey);
    const lastMessage = messages[messages.length - 1];

    // Detect if user wants to modify the layout
    const isModificationRequest = isModificationIntent(lastMessage.content);

    // Get discipline-aware system prompt
    let systemPrompt = getLayoutSystemPrompt(discipline);

    // Add conversation context for better multi-turn understanding
    const conversationContext = buildConversationContext(messages, layout);
    systemPrompt += `\n\n---\n\n${conversationContext}`;

    let userPrompt = lastMessage.content;

    if (isModificationRequest) {
      systemPrompt += `\n\nDetailed current layout:\n${JSON.stringify(layout, null, 2)}\n\n${LAYOUT_GENERATION_PROMPT}`;
      userPrompt = `Based on the current layout, please process this request: ${lastMessage.content}

If this requires modifying the layout, output the complete updated layout as JSON. Otherwise, provide helpful advice.`;
    }

    // Build messages array with conversation history and current user prompt
    const conversationMessages = [
      ...messages.slice(0, -1).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: userPrompt },
    ];

    const { text } = await generateText({
      model,
      system: systemPrompt,
      messages: conversationMessages,
      temperature: 0.7,
    });

    // Try to extract layout JSON if present
    let updatedLayout: LayoutData | null = null;
    const jsonMatch = text.match(/\{[\s\S]*"zones"[\s\S]*\}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        updatedLayout = LayoutSchema.parse(parsed);
      } catch {
        // Not a valid layout, continue without it
      }
    }

    // Clean up the response text (remove JSON if we extracted it)
    let responseText = text;
    if (updatedLayout && jsonMatch) {
      responseText = text.replace(jsonMatch[0], "").trim();
      if (!responseText) {
        responseText =
          "I've updated the layout based on your request. The changes have been applied to the canvas.";
      }
    }

    return NextResponse.json({
      message: responseText,
      layout: updatedLayout,
    });
  } catch (error) {
    // Log error for debugging (server-side only)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Chat API error:", errorMessage);
    }
    return NextResponse.json(
      {
        message: "Sorry, I encountered an error. Please try again.",
        layout: null,
      },
      { status: 500 }
    );
  }
}
