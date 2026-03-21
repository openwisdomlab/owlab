// src/app/api/ai/parallel-universes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";
import {
  generateParallelUniverses,
  fuseUniversesWithAI,
} from "@/lib/ai/agents/parallel-universe-agent";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (typeof action !== "string") {
      return new ApiError(ErrorCode.VALIDATION_ERROR, "action must be a string").toResponse();
    }

    if (action === "generate") {
      const { currentLayout, decisionPoint, constraints, modelKey } = params;

      if (!currentLayout || !decisionPoint) {
        return new ApiError(ErrorCode.VALIDATION_ERROR, "Missing required fields: currentLayout, decisionPoint").toResponse();
      }

      const universes = await generateParallelUniverses({
        currentLayout,
        decisionPoint,
        constraints,
        modelKey,
      });

      return NextResponse.json({ universes });
    }

    if (action === "fuse") {
      const { universes, fusionStrategy, modelKey } = params;

      if (!Array.isArray(universes) || universes.length < 2) {
        return new ApiError(ErrorCode.VALIDATION_ERROR, "universes must be an array with at least 2 items").toResponse();
      }

      const fusedLayout = await fuseUniversesWithAI({
        universes,
        fusionStrategy: fusionStrategy || "best-of-each",
        modelKey,
      });

      return NextResponse.json({ layout: fusedLayout });
    }

    return new ApiError(ErrorCode.VALIDATION_ERROR, "Invalid action. Use 'generate' or 'fuse'").toResponse();
  } catch (error) {
    console.error("Parallel universe API error:", error);
    return handleApiError(error);
  }
}
