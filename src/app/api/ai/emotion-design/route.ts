// src/app/api/ai/emotion-design/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateEmotionDesign } from "@/lib/ai/agents/emotion-design-agent";
import { EmotionScriptSchema } from "@/lib/schemas/emotion-design";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emotionScript, constraints, modelKey } = body;

    // Validate emotionScript is present and is an object
    if (!emotionScript || typeof emotionScript !== "object") {
      return NextResponse.json(
        { error: "emotionScript is required and must be an object" },
        { status: 400 }
      );
    }

    // Validate emotionScript structure using Zod
    const scriptValidation = EmotionScriptSchema.safeParse(emotionScript);
    if (!scriptValidation.success) {
      return NextResponse.json(
        { error: "Invalid emotionScript format", details: scriptValidation.error.issues },
        { status: 400 }
      );
    }

    // Validate emotionScript has at least one node
    if (!emotionScript.nodes || emotionScript.nodes.length === 0) {
      return NextResponse.json(
        { error: "emotionScript must have at least one emotion node" },
        { status: 400 }
      );
    }

    const result = await generateEmotionDesign({
      emotionScript: scriptValidation.data,
      constraints,
      modelKey,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Emotion design API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
