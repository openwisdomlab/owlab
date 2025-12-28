import { NextRequest, NextResponse } from "next/server";
import {
  analyzeBudget,
  suggestEquipmentAlternatives,
  compareBudgetScenarios,
  type BudgetAnalysis,
} from "@/lib/ai/agents/budget-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";

export const runtime = "nodejs";
export const maxDuration = 60;

interface BudgetAnalysisRequest {
  layout: LayoutData;
  modelKey?: string;
  currency?: "USD" | "CNY" | "EUR";
  includeForecasting?: boolean;
  includeROI?: boolean;
}

interface EquipmentAlternativesRequest {
  equipmentName: string;
  currentPrice: number;
  category: string;
  modelKey?: string;
}

interface CompareScenariosRequest {
  scenario1: LayoutData;
  scenario2: LayoutData;
  modelKey?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "analyze";

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      // Return demo budget analysis
      return NextResponse.json({
        analysis: {
          totalCost: 125000,
          costBreakdown: {
            byCategory: {
              compute: 75000,
              furniture: 25000,
              tools: 15000,
              utilities: 10000,
            },
            byZone: {
              "Server Room": 80000,
              Workspace: 30000,
              "Meeting Room": 15000,
            },
          },
          insights: [
            {
              type: "info",
              title: "Demo Mode Active",
              description:
                "Configure ANTHROPIC_API_KEY or POE_API_KEY for real AI budget analysis",
              impact: "high",
            },
            {
              type: "warning",
              title: "High Compute Costs",
              description:
                "60% of budget allocated to compute equipment. Consider phased procurement.",
              impact: "medium",
            },
            {
              type: "optimization",
              title: "Bulk Purchase Opportunity",
              description:
                "Purchasing workstations in bulk could save 15-20%",
              impact: "medium",
            },
          ],
          optimizations: [
            {
              title: "Phased GPU Procurement",
              description:
                "Purchase GPU servers in 2 phases over 6 months to spread costs",
              potentialSavings: 0,
              difficulty: "easy",
            },
            {
              title: "Consider Refurbished Workstations",
              description:
                "Certified refurbished workstations can save 30-40%",
              potentialSavings: 9000,
              difficulty: "easy",
            },
          ],
          forecast: {
            sixMonths: 137500,
            oneYear: 150000,
            threeYears: 200000,
            assumptions: [
              "10% annual maintenance costs",
              "Equipment refresh every 3 years",
              "No major technology disruptions",
            ],
          },
          roi: {
            paybackPeriod: "18-24 months",
            returnOnInvestment: 150,
            assumptions: [
              "3x productivity improvement",
              "Reduced cloud compute costs",
              "Faster research iteration",
            ],
          },
        } as BudgetAnalysis,
        message:
          "Demo budget analysis generated. Configure API keys for real AI insights.",
      });
    }

    switch (action) {
      case "analyze": {
        const {
          layout,
          modelKey,
          currency,
          includeForecasting,
          includeROI,
        } = body as BudgetAnalysisRequest;

        if (!layout) {
          return NextResponse.json(
            { error: "Layout is required" },
            { status: 400 }
          );
        }

        const analysis = await analyzeBudget({
          layout,
          modelKey,
          currency,
          includeForecasting,
          includeROI,
        });

        return NextResponse.json({ analysis });
      }

      case "alternatives": {
        const { equipmentName, currentPrice, category, modelKey } =
          body as EquipmentAlternativesRequest;

        if (!equipmentName || !currentPrice || !category) {
          return NextResponse.json(
            {
              error: "equipmentName, currentPrice, and category are required",
            },
            { status: 400 }
          );
        }

        const alternatives = await suggestEquipmentAlternatives(
          equipmentName,
          currentPrice,
          category,
          modelKey
        );

        return NextResponse.json({ alternatives });
      }

      case "compare": {
        const { scenario1, scenario2, modelKey } =
          body as CompareScenariosRequest;

        if (!scenario1 || !scenario2) {
          return NextResponse.json(
            { error: "Both scenarios are required" },
            { status: 400 }
          );
        }

        const comparison = await compareBudgetScenarios(
          scenario1,
          scenario2,
          modelKey
        );

        return NextResponse.json({ comparison });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Budget analysis error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Budget analysis failed",
      },
      { status: 500 }
    );
  }
}
