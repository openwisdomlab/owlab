// src/app/api/ai/parallel-universes/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  generateParallelUniverses,
  fuseUniversesWithAI,
} from "@/lib/ai/agents/parallel-universe-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

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

      if (!universes || universes.length < 2) {
        return NextResponse.json(
          { error: "Need at least 2 universes to fuse" },
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
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
