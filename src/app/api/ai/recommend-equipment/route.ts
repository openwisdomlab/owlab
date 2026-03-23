import { NextRequest, NextResponse } from "next/server";
import { ApiError, ErrorCode, handleApiError } from "@/lib/api-error";
import {
  recommendEquipment,
  findComplementaryEquipment,
  suggestUpgrades,
  recommendByBudget,
  type RecommendationResponse,
} from "@/lib/ai/agents/recommendation-agent";
import type { LayoutData, ZoneData } from "@/lib/ai/agents/layout-agent";
import { applyRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

interface RecommendEquipmentRequest {
  layout: LayoutData;
  selectedZone?: ZoneData;
  currentEquipment?: string[];
  budgetLimit?: number;
  focusCategory?: string;
  modelKey?: string;
}

interface ComplementaryRequest {
  equipmentName: string;
  category: string;
  zoneType?: string;
  modelKey?: string;
}

interface UpgradeRequest {
  currentEquipment: Array<{
    name: string;
    category: string;
    price?: number;
  }>;
  modelKey?: string;
}

interface BudgetTierRequest {
  zoneType: string;
  budgetTier: "low" | "medium" | "high";
  modelKey?: string;
}

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get("action") || "recommend";

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY && !process.env.POE_API_KEY) {
      // Return demo recommendations
      return NextResponse.json({
        recommendations: {
          recommendations: [
            {
              name: "GPU Server RTX 4090",
              reason:
                "Essential for AI/ML workloads. Demo mode - configure API keys for real recommendations.",
              priority: "high",
              category: "compute",
              estimatedCost: 25000,
              alternatives: ["RTX 4080", "A100", "H100"],
            },
            {
              name: "Ergonomic Workstations",
              reason:
                "Improve researcher productivity and reduce fatigue for long coding sessions.",
              priority: "medium",
              category: "furniture",
              estimatedCost: 3000,
            },
            {
              name: "UPS Battery Backup",
              reason:
                "Protect expensive equipment from power outages and surges.",
              priority: "high",
              category: "utilities",
              estimatedCost: 2000,
            },
          ],
          insights: [
            "Configure ANTHROPIC_API_KEY or POE_API_KEY for AI-powered recommendations",
            "Your compute zone would benefit from additional cooling equipment",
            "Consider adding collaborative furniture to the workspace zone",
          ],
        } as RecommendationResponse,
        message:
          "Demo recommendations generated. Configure API keys for real AI insights.",
      });
    }

    switch (action) {
      case "recommend": {
        const {
          layout,
          selectedZone,
          currentEquipment,
          budgetLimit,
          focusCategory,
          modelKey,
        } = body as RecommendEquipmentRequest;

        if (!layout) {
          return new ApiError(ErrorCode.VALIDATION_ERROR, "Layout is required").toResponse();
        }

        const recommendations = await recommendEquipment({
          layout,
          selectedZone,
          currentEquipment,
          budgetLimit,
          focusCategory,
          modelKey,
        });

        return NextResponse.json({ recommendations });
      }

      case "complementary": {
        const { equipmentName, category, zoneType, modelKey } =
          body as ComplementaryRequest;

        if (!equipmentName || !category) {
          return new ApiError(ErrorCode.VALIDATION_ERROR, "equipmentName and category are required").toResponse();
        }

        const complementary = await findComplementaryEquipment(
          equipmentName,
          category,
          zoneType,
          modelKey
        );

        return NextResponse.json({ complementary });
      }

      case "upgrades": {
        const { currentEquipment, modelKey } = body as UpgradeRequest;

        if (!currentEquipment || currentEquipment.length === 0) {
          return new ApiError(ErrorCode.VALIDATION_ERROR, "currentEquipment array is required").toResponse();
        }

        const upgrades = await suggestUpgrades(currentEquipment, modelKey);

        return NextResponse.json({ upgrades });
      }

      case "budget-tier": {
        const { zoneType, budgetTier, modelKey } = body as BudgetTierRequest;

        if (!zoneType || !budgetTier) {
          return new ApiError(ErrorCode.VALIDATION_ERROR, "zoneType and budgetTier are required").toResponse();
        }

        const recommendations = await recommendByBudget(
          zoneType,
          budgetTier,
          modelKey
        );

        return NextResponse.json({ recommendations });
      }

      default:
        return new ApiError(ErrorCode.VALIDATION_ERROR, `Unknown action: ${action}`).toResponse();
    }
  } catch (error) {
    console.error("Equipment recommendation error:", error);
    return handleApiError(error);
  }
}
