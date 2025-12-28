/**
 * Budget Analysis AI Agent
 * Provides cost forecasting, optimization, and ROI analysis
 */

import { generateText, streamText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import type { LayoutData } from "./layout-agent";
import type { BudgetSummary } from "@/lib/schemas/equipment";
import { calculateBudgetSummary } from "@/lib/utils/budget";

// Budget Analysis Schema
export const BudgetAnalysisSchema = z.object({
  totalCost: z.number(),
  costBreakdown: z.object({
    byCategory: z.record(z.string(), z.number()),
    byZone: z.record(z.string(), z.number()),
  }),
  insights: z.array(
    z.object({
      type: z.enum(["warning", "info", "success", "optimization"]),
      title: z.string(),
      description: z.string(),
      impact: z.enum(["high", "medium", "low"]),
    })
  ),
  optimizations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      potentialSavings: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    })
  ),
  forecast: z
    .object({
      sixMonths: z.number(),
      oneYear: z.number(),
      threeYears: z.number(),
      assumptions: z.array(z.string()),
    })
    .optional(),
  roi: z
    .object({
      paybackPeriod: z.string(),
      returnOnInvestment: z.number(),
      assumptions: z.array(z.string()),
    })
    .optional(),
});

export type BudgetAnalysis = z.infer<typeof BudgetAnalysisSchema>;

const BUDGET_SYSTEM_PROMPT = `You are an expert financial analyst specializing in laboratory and research facility budgeting.
Your role is to analyze equipment costs, identify optimization opportunities, and provide accurate financial forecasting.

Key responsibilities:
- Analyze budget allocations across categories and zones
- Identify cost inefficiencies and optimization opportunities
- Provide realistic cost forecasts based on equipment lifespan and maintenance
- Calculate ROI for equipment investments
- Suggest cost-effective alternatives without compromising quality
- Flag budget risks and overspending areas

Always provide actionable, data-driven insights with clear reasoning.`;

export interface BudgetAgentOptions {
  modelKey?: string;
  layout: LayoutData;
  currency?: "USD" | "CNY" | "EUR";
  includeForecasting?: boolean;
  includeROI?: boolean;
}

/**
 * Analyze budget and provide AI-powered insights
 */
export async function analyzeBudget(
  options: BudgetAgentOptions
): Promise<BudgetAnalysis> {
  const {
    modelKey = "claude-sonnet",
    layout,
    currency = "USD",
    includeForecasting = true,
    includeROI = true,
  } = options;

  const model = getTextModel(modelKey);
  const budgetSummary = calculateBudgetSummary(layout, currency);

  const prompt = `Analyze the following laboratory budget and provide detailed insights:

**Layout Information:**
- Name: ${layout.name}
- Zones: ${layout.zones.length}
- Total Dimensions: ${layout.dimensions.width}x${layout.dimensions.height} ${layout.dimensions.unit}

**Budget Summary:**
- Total Cost: ${currency} ${budgetSummary.totalCost.toLocaleString()}
- Equipment Items: ${budgetSummary.itemCount}
- Categories: ${Object.keys(budgetSummary.costByCategory).join(", ")}

**Cost by Category:**
${Object.entries(budgetSummary.costByCategory)
  .map(([cat, cost]) => `- ${cat}: ${currency} ${cost.toLocaleString()}`)
  .join("\n")}

**Cost by Zone:**
${Object.entries(budgetSummary.costByZone)
  .map(([zone, cost]) => `- ${zone}: ${currency} ${cost.toLocaleString()}`)
  .join("\n")}

**Detailed Equipment List:**
${budgetSummary.items
  .map(
    (item) =>
      `- ${item.equipmentName} (${item.category}) in ${item.zoneName}: ${item.quantity}x ${currency}${item.unitPrice.toLocaleString()} = ${currency}${item.totalPrice.toLocaleString()}`
  )
  .join("\n")}

Please provide:

1. **Insights** (3-5 key observations):
   - Budget allocation efficiency
   - Cost concentrations or imbalances
   - Potential risks or concerns
   - Positive budget decisions

2. **Optimizations** (3-5 actionable suggestions):
   - Cost-saving opportunities
   - Equipment alternatives
   - Bulk purchasing options
   - Phased procurement strategies

${
  includeForecasting
    ? `
3. **Cost Forecasting** (6 months, 1 year, 3 years):
   - Maintenance costs (assume 10-15% annually)
   - Replacement cycles
   - Upgrade paths
   - Operating expenses
`
    : ""
}

${
  includeROI
    ? `
4. **ROI Analysis**:
   - Expected payback period
   - Return on investment percentage
   - Productivity gains assumptions
`
    : ""
}

Respond ONLY with valid JSON matching this structure:
{
  "totalCost": number,
  "costBreakdown": {
    "byCategory": { "category": number },
    "byZone": { "zone": number }
  },
  "insights": [
    {
      "type": "warning" | "info" | "success" | "optimization",
      "title": "string",
      "description": "string",
      "impact": "high" | "medium" | "low"
    }
  ],
  "optimizations": [
    {
      "title": "string",
      "description": "string",
      "potentialSavings": number,
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "forecast": {
    "sixMonths": number,
    "oneYear": number,
    "threeYears": number,
    "assumptions": ["string"]
  },
  "roi": {
    "paybackPeriod": "string",
    "returnOnInvestment": number,
    "assumptions": ["string"]
  }
}`;

  const { text } = await generateText({
    model,
    system: BUDGET_SYSTEM_PROMPT,
    prompt,
    temperature: 0.3, // Lower temperature for more consistent financial analysis
  });

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract budget analysis JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return BudgetAnalysisSchema.parse(parsed);
}

/**
 * Stream budget optimization suggestions
 */
export async function streamBudgetOptimizations(options: BudgetAgentOptions) {
  const { modelKey = "claude-sonnet", layout, currency = "USD" } = options;

  const model = getTextModel(modelKey);
  const budgetSummary = calculateBudgetSummary(layout, currency);

  return streamText({
    model,
    system: BUDGET_SYSTEM_PROMPT,
    prompt: `Analyze this laboratory budget and provide detailed optimization strategies:

Total Cost: ${currency} ${budgetSummary.totalCost.toLocaleString()}
Items: ${budgetSummary.itemCount}

Equipment List:
${budgetSummary.items
  .map(
    (item) =>
      `- ${item.equipmentName}: ${item.quantity}x ${currency}${item.unitPrice.toLocaleString()}`
  )
  .join("\n")}

Provide specific, actionable cost optimization strategies. Focus on:
1. Alternative equipment that maintains quality
2. Bulk purchasing opportunities
3. Phased procurement to spread costs
4. Equipment sharing across zones
5. Lease vs. buy analysis for expensive items`,
    temperature: 0.5,
  });
}

/**
 * Compare budget scenarios
 */
export async function compareBudgetScenarios(
  scenario1: LayoutData,
  scenario2: LayoutData,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const budget1 = calculateBudgetSummary(scenario1);
  const budget2 = calculateBudgetSummary(scenario2);

  const { text } = await generateText({
    model,
    system: BUDGET_SYSTEM_PROMPT,
    prompt: `Compare these two laboratory budget scenarios and recommend which is better:

**Scenario 1: ${scenario1.name}**
- Total Cost: $${budget1.totalCost.toLocaleString()}
- Items: ${budget1.itemCount}
- Categories: ${Object.keys(budget1.costByCategory).join(", ")}

**Scenario 2: ${scenario2.name}**
- Total Cost: $${budget2.totalCost.toLocaleString()}
- Items: ${budget2.itemCount}
- Categories: ${Object.keys(budget2.costByCategory).join(", ")}

Provide:
1. Cost difference analysis
2. Value-for-money assessment
3. Which scenario offers better ROI and why
4. Recommendation with reasoning`,
    temperature: 0.4,
  });

  return text;
}

/**
 * Get equipment alternatives for cost savings
 */
export async function suggestEquipmentAlternatives(
  equipmentName: string,
  currentPrice: number,
  category: string,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: BUDGET_SYSTEM_PROMPT,
    prompt: `Suggest cost-effective alternatives for this laboratory equipment:

Equipment: ${equipmentName}
Current Price: $${currentPrice.toLocaleString()}
Category: ${category}

Provide 3-5 alternative options that:
1. Cost 20-50% less
2. Maintain acceptable quality for the category
3. Are from reputable vendors
4. Explain trade-offs clearly

Format as a clear, numbered list with specific product recommendations where possible.`,
    temperature: 0.6,
  });

  return text;
}
