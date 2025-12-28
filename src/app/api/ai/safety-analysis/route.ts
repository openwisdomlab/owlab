import { NextRequest, NextResponse } from "next/server";
import {
  analyzeSafety,
  checkRegulationCompliance,
  generateSafetyDocumentation,
  type SafetyAnalysis,
} from "@/lib/ai/agents/safety-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

interface SafetyAnalysisRequest {
  layout: LayoutData;
  focusAreas?: Array<"fire" | "electrical" | "accessibility" | "ergonomics" | "emergency">;
  strictMode?: boolean;
  modelKey?: string;
}

interface RegulationCheckRequest {
  layout: LayoutData;
  regulation: "OSHA" | "ADA" | "NFPA" | "NEC";
  modelKey?: string;
}

interface DocumentationRequest {
  layout: LayoutData;
  analysis: SafetyAnalysis;
  modelKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "analyze";

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      // Return demo safety analysis
      return NextResponse.json({
        analysis: {
          overallScore: 72,
          riskLevel: "moderate",
          issues: [
            {
              id: "demo-1",
              severity: "high",
              category: "fire_safety",
              title: "Demo Mode - Configure API Keys",
              description:
                "Configure ANTHROPIC_API_KEY or POE_API_KEY for real AI safety analysis",
              location: "General",
              recommendation:
                "Set up API keys to enable comprehensive safety analysis",
              regulation: "Demo",
            },
            {
              id: "demo-2",
              severity: "high",
              category: "accessibility",
              title: "Insufficient Aisle Width",
              description:
                "Main aisle appears to be less than 36 inches wide, below ADA requirements",
              location: "Main Workspace",
              recommendation:
                "Widen main aisle to minimum 36 inches for wheelchair accessibility",
              regulation: "ADA 4.3.3",
            },
            {
              id: "demo-3",
              severity: "medium",
              category: "emergency",
              title: "Emergency Exit Signage",
              description:
                "No clear emergency exit paths marked on the layout",
              location: "All zones",
              recommendation:
                "Add illuminated exit signs and mark emergency egress paths",
              regulation: "OSHA 1910.37",
            },
          ],
          compliantRegulations: [
            "OSHA 1910.22 (Walking-Working Surfaces)",
            "NFPA 101 (Minimum Space Requirements)",
          ],
          nonCompliantRegulations: [
            "ADA 4.3.3 (Accessible Routes)",
            "OSHA 1910.37 (Emergency Action Plans)",
          ],
          summary:
            "Demo safety analysis. The layout shows moderate safety compliance with some accessibility and emergency preparedness concerns. Configure API keys for detailed AI-powered analysis.",
          recommendations: [
            "Widen aisles to 36+ inches for ADA compliance",
            "Add emergency exit signage and egress paths",
            "Install emergency equipment (eyewash, fire extinguisher)",
            "Review electrical panel accessibility",
            "Configure AI API keys for comprehensive analysis",
          ],
        } as SafetyAnalysis,
        message:
          "Demo safety analysis generated. Configure API keys for real AI insights.",
      });
    }

    switch (action) {
      case "analyze": {
        const { layout, focusAreas, strictMode, modelKey } =
          body as SafetyAnalysisRequest;

        if (!layout) {
          return NextResponse.json(
            { error: "Layout is required" },
            { status: 400 }
          );
        }

        const analysis = await analyzeSafety({
          layout,
          focusAreas,
          strictMode,
          modelKey,
        });

        return NextResponse.json({ analysis });
      }

      case "check-regulation": {
        const { layout, regulation, modelKey } =
          body as RegulationCheckRequest;

        if (!layout || !regulation) {
          return NextResponse.json(
            { error: "Layout and regulation are required" },
            { status: 400 }
          );
        }

        const result = await checkRegulationCompliance(
          layout,
          regulation,
          modelKey
        );

        return NextResponse.json({ result });
      }

      case "generate-documentation": {
        const { layout, analysis, modelKey } = body as DocumentationRequest;

        if (!layout || !analysis) {
          return NextResponse.json(
            { error: "Layout and analysis are required" },
            { status: 400 }
          );
        }

        const documentation = await generateSafetyDocumentation(
          layout,
          analysis,
          modelKey
        );

        return NextResponse.json({ documentation });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Safety analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Safety analysis failed",
      },
      { status: 500 }
    );
  }
}
