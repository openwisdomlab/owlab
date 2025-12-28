/**
 * Equipment Recommendation AI Agent
 * Provides intelligent equipment suggestions based on layout and context
 */

import { generateText } from "ai";
import { getTextModel } from "../providers";
import { z } from "zod";
import type { LayoutData, ZoneData } from "./layout-agent";

// Equipment Recommendation Schema
export const EquipmentRecommendationSchema = z.object({
  equipmentId: z.string().optional(),
  name: z.string(),
  reason: z.string(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.string(),
  estimatedCost: z.number().optional(),
  alternatives: z.array(z.string()).optional(),
});

export const RecommendationResponseSchema = z.object({
  recommendations: z.array(EquipmentRecommendationSchema),
  insights: z.array(z.string()).optional(),
});

export type EquipmentRecommendation = z.infer<
  typeof EquipmentRecommendationSchema
>;
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;

const RECOMMENDATION_SYSTEM_PROMPT = `You are an expert laboratory equipment consultant with deep knowledge of AI/ML research labs, maker spaces, and educational facilities.
Your role is to recommend appropriate equipment based on zone types, existing equipment, and lab requirements.

Key responsibilities:
- Suggest complementary equipment for each zone type
- Identify missing critical equipment
- Recommend equipment that works well together
- Consider budget constraints and priorities
- Flag safety or compliance gaps
- Suggest upgrade paths and alternatives

Always provide practical, well-reasoned recommendations with clear priorities.`;

export interface RecommendationOptions {
  modelKey?: string;
  layout: LayoutData;
  selectedZone?: ZoneData;
  currentEquipment?: string[];
  budgetLimit?: number;
  focusCategory?: string;
}

/**
 * Get equipment recommendations for a layout or specific zone
 */
export async function recommendEquipment(
  options: RecommendationOptions
): Promise<RecommendationResponse> {
  const {
    modelKey = "claude-sonnet",
    layout,
    selectedZone,
    currentEquipment = [],
    budgetLimit,
    focusCategory,
  } = options;

  const model = getTextModel(modelKey);

  let prompt = `Analyze this laboratory layout and recommend appropriate equipment:\n\n`;

  if (selectedZone) {
    // Zone-specific recommendations
    prompt += `**Selected Zone:**
- Name: ${selectedZone.name}
- Type: ${selectedZone.type}
- Size: ${selectedZone.size.width}×${selectedZone.size.height}
- Current Equipment: ${selectedZone.equipment?.join(", ") || "None"}

Recommend 3-5 additional equipment items that would enhance this ${selectedZone.type} zone.`;
  } else {
    // Layout-wide recommendations
    prompt += `**Layout Overview:**
- Name: ${layout.name}
- Total Zones: ${layout.zones.length}
- Dimensions: ${layout.dimensions.width}×${layout.dimensions.height} ${layout.dimensions.unit}

**Zones:**
${layout.zones
  .map(
    (z) =>
      `- ${z.name} (${z.type}): ${z.size.width}×${z.size.height}, Equipment: ${z.equipment?.join(", ") || "None"}`
  )
  .join("\n")}

Analyze this layout and recommend equipment that is missing or would significantly improve functionality.`;
  }

  if (currentEquipment.length > 0) {
    prompt += `\n\n**Current Equipment in Lab:**\n${currentEquipment.join(", ")}`;
  }

  if (budgetLimit) {
    prompt += `\n\n**Budget Constraint:** Maximum ${budgetLimit.toLocaleString()} USD`;
  }

  if (focusCategory) {
    prompt += `\n\n**Focus Category:** ${focusCategory}`;
  }

  prompt += `\n\nProvide recommendations with:
1. Equipment name (specific model/type if possible)
2. Clear reason why it's needed
3. Priority level (high/medium/low)
4. Category
5. Estimated cost (if known)
6. Alternative options

Also provide 2-3 general insights about the equipment setup.

Respond ONLY with valid JSON matching this structure:
{
  "recommendations": [
    {
      "name": "string",
      "reason": "string",
      "priority": "high" | "medium" | "low",
      "category": "string",
      "estimatedCost": number (optional),
      "alternatives": ["string"] (optional)
    }
  ],
  "insights": ["string"]
}`;

  const { text } = await generateText({
    model,
    system: RECOMMENDATION_SYSTEM_PROMPT,
    prompt,
    temperature: 0.6, // Balanced creativity and consistency
  });

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract recommendations JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return RecommendationResponseSchema.parse(parsed);
}

/**
 * Find equipment that pairs well with a specific item
 */
export async function findComplementaryEquipment(
  equipmentName: string,
  category: string,
  zoneType?: string,
  modelKey: string = "claude-sonnet"
): Promise<string[]> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: RECOMMENDATION_SYSTEM_PROMPT,
    prompt: `Equipment: ${equipmentName}
Category: ${category}
${zoneType ? `Zone Type: ${zoneType}` : ""}

List 3-5 equipment items that are frequently used together with this equipment in a laboratory setting.
Focus on practical combinations that enhance functionality.

Respond with a simple numbered list, one item per line:
1. Equipment name
2. Equipment name
...`,
    temperature: 0.5,
  });

  // Parse the numbered list
  const items = text
    .split("\n")
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((item) => item.length > 0);

  return items;
}

/**
 * Suggest equipment upgrades for existing items
 */
export async function suggestUpgrades(
  currentEquipment: Array<{ name: string; category: string; price?: number }>,
  modelKey: string = "claude-sonnet"
): Promise<RecommendationResponse> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: RECOMMENDATION_SYSTEM_PROMPT,
    prompt: `Analyze this existing equipment and suggest upgrades or replacements that would provide significant improvements:

**Current Equipment:**
${currentEquipment
  .map(
    (eq) =>
      `- ${eq.name} (${eq.category})${eq.price ? ` - $${eq.price.toLocaleString()}` : ""}`
  )
  .join("\n")}

For each upgrade suggestion, explain:
1. What to upgrade/replace
2. Recommended upgrade option
3. Why this upgrade matters
4. Priority level

Respond ONLY with valid JSON matching this structure:
{
  "recommendations": [
    {
      "name": "Upgraded Equipment Name",
      "reason": "Why this upgrade is beneficial",
      "priority": "high" | "medium" | "low",
      "category": "string",
      "estimatedCost": number (optional)
    }
  ],
  "insights": ["string"]
}`,
    temperature: 0.5,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract upgrade suggestions JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return RecommendationResponseSchema.parse(parsed);
}

/**
 * Get equipment recommendations by budget tier
 */
export async function recommendByBudget(
  zoneType: string,
  budgetTier: "low" | "medium" | "high",
  modelKey: string = "claude-sonnet"
): Promise<RecommendationResponse> {
  const model = getTextModel(modelKey);

  const budgetRanges = {
    low: "Under $10,000",
    medium: "$10,000 - $50,000",
    high: "Above $50,000",
  };

  const { text } = await generateText({
    model,
    system: RECOMMENDATION_SYSTEM_PROMPT,
    prompt: `Recommend essential equipment for a ${zoneType} zone with a ${budgetRanges[budgetTier]} budget.

Provide 5-8 equipment recommendations prioritized by importance.
Focus on best value-for-money options at this budget tier.

Respond ONLY with valid JSON matching this structure:
{
  "recommendations": [
    {
      "name": "Equipment Name",
      "reason": "Why it's needed",
      "priority": "high" | "medium" | "low",
      "category": "string",
      "estimatedCost": number
    }
  ],
  "insights": ["Budget strategy insight 1", "Budget strategy insight 2"]
}`,
    temperature: 0.6,
  });

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract budget recommendations JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return RecommendationResponseSchema.parse(parsed);
}
