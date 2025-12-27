import { NextRequest, NextResponse } from "next/server";
import { generateLayout, analyzeLayout, type LayoutData } from "@/lib/ai/agents/layout-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

interface GenerateLayoutRequest {
  requirements: string;
  existingLayout?: LayoutData;
  modelKey?: string;
}

interface AnalyzeLayoutRequest {
  layout: LayoutData;
  modelKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "generate";

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      // Return a demo layout
      return NextResponse.json({
        layout: {
          name: "Demo AI Lab",
          description: "This is a demo layout. Configure an AI API key for real generation.",
          dimensions: { width: 20, height: 15, unit: "m" },
          zones: [
            {
              id: "demo-1",
              name: "GPU Server Room",
              type: "compute",
              position: { x: 0, y: 0 },
              size: { width: 6, height: 5 },
              color: "#22d3ee",
              equipment: ["GPU Cluster", "Cooling"],
            },
            {
              id: "demo-2",
              name: "Workspace",
              type: "workspace",
              position: { x: 7, y: 0 },
              size: { width: 8, height: 7 },
              color: "#8b5cf6",
              equipment: ["Workstations"],
            },
          ],
          notes: ["Demo mode - configure API keys for AI generation"],
        },
        message: "Demo layout generated. Configure ANTHROPIC_API_KEY for real AI generation.",
      });
    }

    switch (action) {
      case "generate": {
        const { requirements, existingLayout, modelKey } = body as GenerateLayoutRequest;

        if (!requirements) {
          return NextResponse.json(
            { error: "Requirements are required" },
            { status: 400 }
          );
        }

        const layout = await generateLayout({
          requirements,
          existingLayout,
          modelKey,
        });

        return NextResponse.json({ layout });
      }

      case "analyze": {
        const { layout, modelKey } = body as AnalyzeLayoutRequest;

        if (!layout) {
          return NextResponse.json(
            { error: "Layout is required" },
            { status: 400 }
          );
        }

        const analysis = await analyzeLayout(layout, modelKey);

        return NextResponse.json({ analysis });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Layout generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Layout generation failed",
      },
      { status: 500 }
    );
  }
}
