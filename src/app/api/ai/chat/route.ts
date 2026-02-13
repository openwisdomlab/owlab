import { NextRequest } from "next/server";
import {
  streamText,
  tool,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
} from "ai";
import { z } from "zod/v4";
import { getTextModel } from "@/lib/ai/providers";
import {
  LAYOUT_GENERATION_PROMPT,
  getLayoutSystemPrompt,
} from "@/lib/ai/prompts/layout";
import { LayoutSchema, type LayoutData } from "@/lib/ai/agents/layout-agent";
import type { Discipline } from "@/lib/schemas/launcher";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Build layout context summary for the system prompt.
 * Conversation history is passed directly via messages array.
 */
function buildLayoutContext(layout: LayoutData): string {
  const parts: string[] = [];

  parts.push("**Current Layout State:**");
  parts.push(`- Layout name: ${layout.name}`);
  parts.push(
    `- Dimensions: ${layout.dimensions.width}×${layout.dimensions.height} ${layout.dimensions.unit}`
  );
  parts.push(`- Total zones: ${layout.zones.length}`);

  if (layout.zones.length > 0) {
    const zoneTypes = layout.zones.map((z) => z.type);
    const typeCount = zoneTypes.reduce(
      (acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    parts.push(
      `- Zone distribution: ${Object.entries(typeCount)
        .map(([k, v]) => `${k}(${v})`)
        .join(", ")}`
    );

    const zoneNames = layout.zones.map((z) => z.name).join(", ");
    parts.push(`- Existing zones: ${zoneNames}`);
  }

  return parts.join("\n");
}

/**
 * Create a UIMessage stream response for demo mode (no API keys).
 */
function createDemoStreamResponse(): Response {
  const demoText =
    "您好！我目前处于演示模式，AI API 密钥尚未配置。在演示模式下，您仍可以手动添加和编辑功能区域。配置 ANTHROPIC_API_KEY 或 POE_API_KEY 环境变量后，即可启用 AI 智能布局设计功能，包括生成式 UI 组件。";

  const textPartId = generateId();
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "text-start", id: textPartId });
      writer.write({ type: "text-delta", id: textPartId, delta: demoText });
      writer.write({ type: "text-end", id: textPartId });
      writer.write({ type: "finish", finishReason: "stop" });
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      messages,
      layout,
      modelKey = "claude-sonnet",
      discipline,
    }: {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      layout: LayoutData;
      modelKey?: string;
      discipline?: Discipline;
    } = body;

    // Demo mode: return a valid data stream with a static message
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      return createDemoStreamResponse();
    }

    const model = getTextModel(modelKey);

    // Build system prompt with layout context and GenUI instructions
    let systemPrompt = getLayoutSystemPrompt(discipline);

    const layoutContext = buildLayoutContext(layout);
    systemPrompt += `\n\n---\n\n${layoutContext}`;
    systemPrompt += `\n\nDetailed current layout:\n${JSON.stringify(layout, null, 2)}\n\n${LAYOUT_GENERATION_PROMPT}`;

    systemPrompt += `

---

**Generative UI Tools:**
You have access to special tools that render interactive UI components directly in the chat:

1. **showThinkingModel**: Use when explaining a complex concept, design principle, or framework. This renders an interactive concept visualization card in the chat. Use it to make explanations more visual and engaging.

2. **showDataTrend**: Use when discussing metrics, statistics, growth trends, or numerical comparisons. This renders an interactive chart visualization. Provide realistic data points that illustrate the trend.

3. **modifyLayout**: Use when the user asks to modify, add, remove, resize, or rearrange zones in the lab layout. You MUST output the complete updated layout through this tool.

Guidelines:
- You may combine regular text with tool calls for richer responses.
- After a tool call, continue with explanatory text if appropriate.
- For layout modifications, always use the modifyLayout tool instead of outputting raw JSON.
- Use showThinkingModel when a concept benefits from structured visual explanation.
- Use showDataTrend when data would be clearer as a chart than as text.`;

    const result = streamText({
      model,
      system: systemPrompt,
      messages,
      tools: {
        showThinkingModel: tool({
          description:
            "Render an interactive concept visualization card in the chat. Use when explaining complex ideas, design principles, or frameworks to make the explanation more visual and engaging.",
          inputSchema: z.object({
            title: z
              .string()
              .describe(
                "Short category label, e.g. 'Design Principle', 'Key Concept', 'Safety Framework'"
              ),
            concept: z
              .string()
              .describe("The name of the concept being explained"),
            explanation: z
              .string()
              .describe(
                "Clear, concise explanation of the concept (2-4 sentences)"
              ),
            followUpQuestions: z
              .array(z.string())
              .optional()
              .describe("2-3 follow-up questions for the user to explore further"),
          }),
          execute: async () => ({ rendered: true as const }),
        }),
        showDataTrend: tool({
          description:
            "Render an interactive chart visualization in the chat. Use when discussing metrics, statistics, or trends that would be clearer as a visual chart.",
          inputSchema: z.object({
            title: z.string().describe("Chart title"),
            description: z
              .string()
              .optional()
              .describe("Brief subtitle or description"),
            data: z
              .array(
                z.record(z.string(), z.union([z.string(), z.number()]))
              )
              .describe(
                "Array of data point objects. Each must have a 'label' key (string) and numeric keys matching the series. Example: [{ label: 'Q1', revenue: 100, cost: 60 }]"
              ),
            series: z
              .array(
                z.object({
                  key: z
                    .string()
                    .describe("Key matching the data object property name"),
                  name: z.string().describe("Display name for this series"),
                  color: z
                    .string()
                    .describe(
                      "Hex color. Use neon palette: #00D9FF (cyan), #8B5CF6 (violet), #D91A7A (pink), #10B981 (emerald)"
                    ),
                })
              )
              .describe("Series definitions for the chart"),
          }),
          execute: async () => ({ rendered: true as const }),
        }),
        modifyLayout: tool({
          description:
            "Modify the lab layout. Use when the user asks to add, remove, move, resize, rename, or rearrange zones. Output the COMPLETE updated layout including all zones.",
          inputSchema: LayoutSchema,
          execute: async () => ({
            success: true as const,
            message: "Layout has been updated on the canvas." as const,
          }),
        }),
      },
      stopWhen: stepCountIs(2),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.error("Chat API error:", errorMessage);
    }

    // Return error as a valid UIMessage stream so useChat can handle it
    const errorPartId = generateId();
    const errorStream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({ type: "text-start", id: errorPartId });
        writer.write({
          type: "text-delta",
          id: errorPartId,
          delta:
            "Sorry, I encountered an error processing your request. Please try again.",
        });
        writer.write({ type: "text-end", id: errorPartId });
        writer.write({ type: "finish", finishReason: "error" });
      },
    });

    return createUIMessageStreamResponse({ stream: errorStream });
  }
}
