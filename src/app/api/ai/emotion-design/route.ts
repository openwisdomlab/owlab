// src/app/api/ai/emotion-design/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";
import { generateEmotionDesign } from "@/lib/ai/agents/emotion-design-agent";
import { EmotionScriptSchema } from "@/lib/schemas/emotion-design";
import { applyRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { emotionScript, constraints, modelKey } = body;

    // Validate emotionScript is present and is an object
    if (!emotionScript || typeof emotionScript !== "object") {
      return new ApiError(ErrorCode.VALIDATION_ERROR, "emotionScript is required and must be an object").toResponse();
    }

    // Validate emotionScript structure using Zod
    const scriptValidation = EmotionScriptSchema.safeParse(emotionScript);
    if (!scriptValidation.success) {
      return new ApiError(
        ErrorCode.VALIDATION_ERROR,
        "Invalid emotionScript format",
        { issues: scriptValidation.error.issues }
      ).toResponse();
    }

    // Validate emotionScript has at least one node
    if (!emotionScript.nodes || emotionScript.nodes.length === 0) {
      return new ApiError(ErrorCode.VALIDATION_ERROR, "emotionScript must have at least one emotion node").toResponse();
    }

    const result = await generateEmotionDesign({
      emotionScript: scriptValidation.data,
      constraints,
      modelKey,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Emotion design API error:", error);
    return handleApiError(error);
  }
}
