import { NextRequest, NextResponse } from "next/server";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";
import {
  generateVisualization,
  type VisualizationRequest,
} from "@/lib/ai/agents/visualization-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { ViewType, RenderStyle } from "@/lib/ai/prompts/visualization";
import { applyRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 120;

interface VisualizeRequest {
  layout: LayoutData;
  viewType: ViewType;
  style?: RenderStyle;
  aspectRatio?: string;
  imageSize?: string;
}

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body: VisualizeRequest = await request.json();
    const { layout, viewType, style, aspectRatio, imageSize } = body;

    if (!layout || !viewType) {
      return new ApiError(ErrorCode.VALIDATION_ERROR, "layout and viewType are required").toResponse();
    }

    // Check for image generation API key
    if (!process.env.GEMINI_API_KEY && !process.env.GEMINI_SERVICE_URL) {
      return NextResponse.json({
        demoMode: true,
        message: "\u914d\u7f6e GEMINI_API_KEY \u6216 GEMINI_SERVICE_URL \u4ee5\u542f\u7528 AI \u53ef\u89c6\u5316",
        viewType,
      }, { status: 200 });
    }

    const result = await generateVisualization({
      layout,
      viewType,
      style: style || "architectural",
      aspectRatio: aspectRatio as VisualizationRequest["aspectRatio"],
      imageSize: imageSize as VisualizationRequest["imageSize"],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Visualization error:", error);
    return handleApiError(error);
  }
}
