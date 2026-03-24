import { NextRequest, NextResponse } from "next/server";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";
import {
  orchestrateLayoutGeneration,
  validateExistingLayout,
  type OrchestrateProgress,
} from "@/lib/ai/agents/orchestrator-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { Discipline } from "@/lib/schemas/launcher";
import { applyRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120; // longer timeout for orchestration

interface GenerateRequest {
  requirements: string;
  discipline?: Discipline;
  modelKey?: string;
  maxIterations?: number;
}

interface ValidateRequest {
  layout: LayoutData;
}

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "generate";

    switch (action) {
      case "generate": {
        const { requirements, discipline, modelKey, maxIterations } =
          body as GenerateRequest;

        if (!requirements) {
          return new ApiError(
            ErrorCode.VALIDATION_ERROR,
            "Requirements are required"
          ).toResponse();
        }

        // Check API keys
        if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
          // Return demo result
          return NextResponse.json({
            demoMode: true,
            message: "配置 AI API 密钥后可使用编排生成功能",
            layout: {
              name: "演示布局",
              description: "编排生成演示",
              dimensions: { width: 20, height: 15, unit: "m" },
              zones: [
                {
                  id: "demo-1",
                  name: "工作区",
                  type: "workspace",
                  position: { x: 0, y: 0 },
                  size: { width: 8, height: 6 },
                  color: "#8b5cf6",
                  equipment: [],
                },
                {
                  id: "demo-2",
                  name: "计算区",
                  type: "compute",
                  position: { x: 9, y: 0 },
                  size: { width: 6, height: 5 },
                  color: "#22d3ee",
                  equipment: [],
                },
              ],
            },
            validation: {
              violations: [],
              errors: [],
              warnings: [],
              info: [],
              score: 100,
              isCompliant: true,
            },
            iterations: 0,
            history: [],
          });
        }

        // Stream progress updates
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              const result = await orchestrateLayoutGeneration({
                requirements,
                discipline,
                modelKey,
                maxIterations,
                onProgress: (progress: OrchestrateProgress) => {
                  const line =
                    JSON.stringify({ type: "progress", data: progress }) + "\n";
                  controller.enqueue(encoder.encode(line));
                },
              });

              // Send final result
              const resultLine =
                JSON.stringify({ type: "result", data: result }) + "\n";
              controller.enqueue(encoder.encode(resultLine));
              controller.close();
            } catch (error) {
              const errorLine =
                JSON.stringify({
                  type: "error",
                  data: {
                    message:
                      error instanceof Error ? error.message : "Unknown error",
                  },
                }) + "\n";
              controller.enqueue(encoder.encode(errorLine));
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "application/x-ndjson",
            "Cache-Control": "no-cache",
            "Transfer-Encoding": "chunked",
          },
        });
      }

      case "validate": {
        const { layout } = body as ValidateRequest;

        if (!layout) {
          return new ApiError(
            ErrorCode.VALIDATION_ERROR,
            "Layout is required"
          ).toResponse();
        }

        const validation = validateExistingLayout(layout);
        return NextResponse.json({ validation });
      }

      default:
        return new ApiError(
          ErrorCode.VALIDATION_ERROR,
          `Unknown action: ${action}`
        ).toResponse();
    }
  } catch (error) {
    console.error("Orchestrate error:", error);
    return handleApiError(error);
  }
}
