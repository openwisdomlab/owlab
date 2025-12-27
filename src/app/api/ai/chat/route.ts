import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getTextModel } from "@/lib/ai/providers";
import { LAYOUT_SYSTEM_PROMPT, LAYOUT_GENERATION_PROMPT } from "@/lib/ai/prompts/layout";
import { LayoutSchema, type LayoutData } from "@/lib/ai/agents/layout-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[];
  layout: LayoutData;
  modelKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { messages, layout, modelKey = "claude-sonnet" } = body;

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      return NextResponse.json(
        {
          message:
            "I'm currently in demo mode as no AI API keys are configured. In production, I would help you design and modify your lab layout using natural language. Try adding zones manually or configure an API key to enable AI features.",
          layout: null,
        },
        { status: 200 }
      );
    }

    const model = getTextModel(modelKey);
    const lastMessage = messages[messages.length - 1];

    // Detect if user wants to modify the layout
    const modificationKeywords = [
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
    ];

    const isModificationRequest = modificationKeywords.some((keyword) =>
      lastMessage.content.toLowerCase().includes(keyword)
    );

    let systemPrompt = LAYOUT_SYSTEM_PROMPT;
    let userPrompt = lastMessage.content;

    if (isModificationRequest) {
      systemPrompt += `\n\nCurrent layout state:\n${JSON.stringify(layout, null, 2)}\n\n${LAYOUT_GENERATION_PROMPT}`;
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
        responseText = "I've updated the layout based on your request. The changes have been applied to the canvas.";
      }
    }

    return NextResponse.json({
      message: responseText,
      layout: updatedLayout,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        message: "Sorry, I encountered an error. Please try again.",
        layout: null,
      },
      { status: 500 }
    );
  }
}
