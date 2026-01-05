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
      // Return a demo layout with Chinese content
      return NextResponse.json({
        layout: {
          name: "演示实验室",
          description: "这是一个演示布局。配置 AI API 密钥后可以使用 AI 智能生成功能。",
          dimensions: { width: 20, height: 15, unit: "m" },
          zones: [
            {
              id: "demo-1",
              name: "GPU 服务器区",
              type: "compute",
              position: { x: 0, y: 0 },
              size: { width: 6, height: 5 },
              color: "#22d3ee",
              equipment: ["GPU 集群", "冷却系统"],
            },
            {
              id: "demo-2",
              name: "工作区域",
              type: "workspace",
              position: { x: 7, y: 0 },
              size: { width: 8, height: 7 },
              color: "#8b5cf6",
              equipment: ["工作站"],
            },
            {
              id: "demo-3",
              name: "会议室",
              type: "meeting",
              position: { x: 16, y: 0 },
              size: { width: 4, height: 5 },
              color: "#10b981",
              equipment: ["会议桌", "投影仪"],
            },
          ],
          notes: ["演示模式 - 配置 API 密钥以启用 AI 生成功能"],
        },
        message: "已生成演示布局。配置 ANTHROPIC_API_KEY 或 POE_API_KEY 环境变量后可使用 AI 智能生成。",
        demoMode: true,
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
