import { generateText, streamText } from "ai";
import { getTextModel } from "../providers";
import { LAYOUT_SYSTEM_PROMPT, LAYOUT_GENERATION_PROMPT } from "../prompts/layout";
import { z } from "zod";

// Layout Zone Schema
const ZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["compute", "workspace", "meeting", "storage", "utility", "entrance"]),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  color: z.string(),
  equipment: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
});

const ConnectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(["door", "passage", "cable"]),
});

export const LayoutSchema = z.object({
  name: z.string(),
  description: z.string(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    unit: z.enum(["m", "ft"]),
  }),
  zones: z.array(ZoneSchema),
  connections: z.array(ConnectionSchema).optional(),
  notes: z.array(z.string()).optional(),
});

export type LayoutData = z.infer<typeof LayoutSchema>;
export type ZoneData = z.infer<typeof ZoneSchema>;

export interface LayoutAgentOptions {
  modelKey?: string;
  requirements: string;
  existingLayout?: LayoutData;
}

// Generate a new layout based on requirements
export async function generateLayout(options: LayoutAgentOptions): Promise<LayoutData> {
  const { modelKey = "claude-sonnet", requirements, existingLayout } = options;

  const model = getTextModel(modelKey);

  const prompt = existingLayout
    ? `${LAYOUT_GENERATION_PROMPT}

Current layout:
${JSON.stringify(existingLayout, null, 2)}

Modification request:
${requirements}`
    : `${LAYOUT_GENERATION_PROMPT}

${requirements}`;

  const { text } = await generateText({
    model,
    system: LAYOUT_SYSTEM_PROMPT,
    prompt,
    temperature: 0.7,
  });

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract layout JSON from response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return LayoutSchema.parse(parsed);
}

// Stream layout suggestions
export async function streamLayoutSuggestions(options: LayoutAgentOptions) {
  const { modelKey = "claude-sonnet", requirements } = options;

  const model = getTextModel(modelKey);

  return streamText({
    model,
    system: LAYOUT_SYSTEM_PROMPT,
    prompt: `Provide design suggestions and considerations for the following lab requirements. Be specific and actionable.

Requirements: ${requirements}`,
    temperature: 0.7,
  });
}

// Analyze and optimize an existing layout
export async function analyzeLayout(
  layout: LayoutData,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: LAYOUT_SYSTEM_PROMPT,
    prompt: `Analyze the following lab layout and provide detailed feedback on:
1. Workflow efficiency
2. Safety considerations
3. Potential improvements
4. Equipment placement optimization
5. Scalability options

Layout:
${JSON.stringify(layout, null, 2)}`,
    temperature: 0.7,
  });

  return text;
}

// Generate zone color based on type
export function getZoneColor(type: ZoneData["type"]): string {
  const colors: Record<ZoneData["type"], string> = {
    compute: "#22d3ee",
    workspace: "#8b5cf6",
    meeting: "#10b981",
    storage: "#f59e0b",
    utility: "#6b7280",
    entrance: "#ec4899",
  };
  return colors[type];
}
