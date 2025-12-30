// src/app/api/ai/parallel-universes/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  generateParallelUniverses,
  fuseUniversesWithAI,
} from "@/lib/ai/agents/parallel-universe-agent";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    if (typeof action !== "string") {
      return NextResponse.json(
        { error: "action must be a string" },
        { status: 400 }
      );
    }

    if (action === "generate") {
      const { currentLayout, decisionPoint, constraints, modelKey } = params;

      if (!currentLayout || !decisionPoint) {
        return NextResponse.json(
          { error: "Missing required fields: currentLayout, decisionPoint" },
          { status: 400 }
        );
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
        return NextResponse.json(
          { error: "universes must be an array with at least 2 items" },
          { status: 400 }
        );
      }

      const fusedLayout = await fuseUniversesWithAI({
        universes,
        fusionStrategy: fusionStrategy || "best-of-each",
        modelKey,
      });

      return NextResponse.json({ layout: fusedLayout });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'generate' or 'fuse'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Parallel universe API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
