import { generateText, streamText } from "ai";
import { getTextModel } from "../providers";
import {
  LAYOUT_SYSTEM_PROMPT,
  LAYOUT_GENERATION_PROMPT,
  getDisciplinePrompt,
  getLayoutSystemPrompt,
  DISCIPLINE_PROMPTS,
} from "../prompts/layout";
import { z } from "zod";
import type { Discipline } from "@/lib/schemas/launcher";

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
  discipline?: Discipline;
}

// Generate a new layout based on requirements
export async function generateLayout(options: LayoutAgentOptions): Promise<LayoutData> {
  const { modelKey = "claude-sonnet", requirements, existingLayout, discipline } = options;

  const model = getTextModel(modelKey);

  // Get discipline-aware system prompt
  const systemPrompt = getLayoutSystemPrompt(discipline);

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
    system: systemPrompt,
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
  const { modelKey = "claude-sonnet", requirements, discipline } = options;

  const model = getTextModel(modelKey);

  // Get discipline-aware system prompt
  const systemPrompt = getLayoutSystemPrompt(discipline);

  return streamText({
    model,
    system: systemPrompt,
    prompt: `Provide design suggestions and considerations for the following lab requirements. Be specific and actionable.

Requirements: ${requirements}`,
    temperature: 0.7,
  });
}

export interface AnalyzeLayoutOptions {
  layout: LayoutData;
  modelKey?: string;
  discipline?: Discipline;
}

// Analyze and optimize an existing layout
export async function analyzeLayout(
  layoutOrOptions: LayoutData | AnalyzeLayoutOptions,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  // Support both old and new API signatures for backwards compatibility
  let layout: LayoutData;
  let discipline: Discipline | undefined;
  let actualModelKey = modelKey;

  if ("layout" in layoutOrOptions) {
    // New API: options object
    layout = layoutOrOptions.layout;
    discipline = layoutOrOptions.discipline;
    actualModelKey = layoutOrOptions.modelKey ?? modelKey;
  } else {
    // Old API: direct layout parameter
    layout = layoutOrOptions;
  }

  const model = getTextModel(actualModelKey);

  // Get discipline-aware system prompt
  const systemPrompt = getLayoutSystemPrompt(discipline);

  const { text } = await generateText({
    model,
    system: systemPrompt,
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

// ============================================
// Discipline-Specific Prompt Helpers
// ============================================

/**
 * Get the list of available disciplines
 * @returns Array of discipline IDs
 */
export function getAvailableDisciplines(): Discipline[] {
  return Object.keys(DISCIPLINE_PROMPTS) as Discipline[];
}

/**
 * Check if a discipline has a specific prompt defined
 * @param discipline - The discipline ID to check
 * @returns Whether the discipline has a specific prompt
 */
export function hasDisciplinePrompt(discipline: Discipline | undefined): boolean {
  if (!discipline) return false;
  return discipline in DISCIPLINE_PROMPTS;
}

/**
 * Get discipline-specific prompt merged with base prompt for layout generation
 * This is a convenience function that combines the base layout prompt with
 * discipline-specific expertise, safety requirements, and equipment knowledge.
 *
 * @param discipline - Optional discipline to include specific expertise
 * @returns Combined system prompt ready for AI generation
 */
export function getDisciplineAwareLayoutPrompt(discipline?: Discipline): string {
  return getLayoutSystemPrompt(discipline);
}

/**
 * Get only the discipline-specific prompt without base prompt
 * Useful when you want to append discipline context to an existing prompt
 *
 * @param discipline - The discipline ID
 * @returns Discipline-specific prompt or empty string if not found
 */
export function getDisciplineOnlyPrompt(discipline: Discipline | undefined): string {
  return getDisciplinePrompt(discipline);
}

/**
 * Build a custom prompt combining base layout prompt with discipline context
 * and additional custom instructions
 *
 * @param options - Configuration options for building the prompt
 * @returns Combined prompt string
 */
export interface BuildPromptOptions {
  discipline?: Discipline;
  includeBasePrompt?: boolean;
  additionalContext?: string;
}

export function buildLayoutPrompt(options: BuildPromptOptions = {}): string {
  const { discipline, includeBasePrompt = true, additionalContext } = options;

  const parts: string[] = [];

  if (includeBasePrompt) {
    parts.push(LAYOUT_SYSTEM_PROMPT);
  }

  const disciplinePrompt = getDisciplinePrompt(discipline);
  if (disciplinePrompt) {
    parts.push("---");
    parts.push(disciplinePrompt);
  }

  if (additionalContext) {
    parts.push("---");
    parts.push(additionalContext);
  }

  if (discipline && disciplinePrompt) {
    parts.push("---");
    parts.push(
      "When designing layouts for this discipline, prioritize the domain-specific safety requirements and equipment placement guidelines listed above."
    );
  }

  return parts.join("\n\n");
}

// Re-export prompt helpers for convenience
export { getDisciplinePrompt, getLayoutSystemPrompt, DISCIPLINE_PROMPTS };
