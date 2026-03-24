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
import { ZONE_TYPES, ZONE_COLORS } from "@/lib/constants/zone-types";
import { validateLayout } from "@/lib/rules/rules-engine";
import type { ValidationResult } from "@/lib/rules/rules-engine";
import {
  buildConstraintBlock,
  buildViolationFeedback,
} from "@/lib/ai/prompts/constraint-aware";

// Layout Zone Schema — zone types sourced from shared constant
const ZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(ZONE_TYPES),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  color: z.string(),
  equipment: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  // Construction-relevant fields (Phase 7 addition)
  ceilingHeight: z.number().optional(),
  floorType: z.enum(["concrete", "epoxy", "tile", "raised", "rubber"]).optional(),
  doors: z.array(z.object({
    position: z.enum(["north", "south", "east", "west"]),
    width: z.number().default(1.0),
    type: z.enum(["single", "double", "sliding", "fire-rated"]).default("single"),
  })).optional(),
  utilities: z.object({
    electrical: z.boolean().default(true),
    water: z.boolean().default(false),
    drain: z.boolean().default(false),
    gas: z.boolean().default(false),
    exhaust: z.boolean().default(false),
    network: z.boolean().default(true),
  }).optional(),
});

const ConnectionSchema = z.object({
  from: z.string(),
  to: z.string(),
  type: z.enum(["door", "passage", "cable"]),
});

export const LAYOUT_SCHEMA_VERSION = 2;

export const LayoutSchema = z.object({
  schemaVersion: z.number().optional(),
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

// Generate zone color based on type — delegates to shared constant
export function getZoneColor(type: ZoneData["type"]): string {
  return ZONE_COLORS[type] ?? "#6b7280";
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

// ============================================
// Constraint-Aware Layout Generation
// ============================================

export interface ConstraintGenerationOptions extends LayoutAgentOptions {
  /** Maximum number of generate-validate-correct iterations (default: 3) */
  maxIterations?: number;
}

export interface ConstraintGenerationResult {
  /** The final generated layout */
  layout: LayoutData;
  /** Validation result from the rules engine */
  validation: ValidationResult;
  /** Number of iterations performed */
  iterations: number;
  /** History of each iteration's score and error count */
  history: Array<{ iteration: number; score: number; errorCount: number }>;
}

/**
 * Generate a layout with constraint validation and iterative correction.
 *
 * This function implements a generate-validate-correct loop:
 * 1. Build a constraint-aware system prompt by serializing design rules
 * 2. Generate an initial layout using the AI model
 * 3. Validate the layout against the rules engine
 * 4. If violations are found, feed them back to the AI for correction
 * 5. Repeat until compliant or maxIterations reached
 *
 * The first iteration uses a higher temperature (0.7) for creative diversity,
 * while correction iterations use a lower temperature (0.3) for precision.
 *
 * @param options - Generation options including requirements and constraints
 * @returns The generated layout with validation results and iteration history
 */
export async function generateLayoutWithConstraints(
  options: ConstraintGenerationOptions,
): Promise<ConstraintGenerationResult> {
  const { maxIterations = 3, discipline, ...baseOptions } = options;
  const history: Array<{ iteration: number; score: number; errorCount: number }> = [];

  // Build constraint block with discipline context
  const zoneTypes = baseOptions.existingLayout?.zones.map((z) => z.type);
  const constraintBlock = buildConstraintBlock({
    zoneTypes,
    discipline,
  });

  // Build the system prompt: base discipline prompt + constraint rules
  const model = getTextModel(baseOptions.modelKey ?? "claude-sonnet");
  const systemPrompt = getLayoutSystemPrompt(discipline) + "\n\n" + constraintBlock;

  let currentLayout: LayoutData | null = null;
  let validation: ValidationResult | null = null;

  for (let i = 0; i < maxIterations; i++) {
    // Build the user prompt
    let prompt: string;

    if (currentLayout && validation && !validation.isCompliant) {
      // Correction iteration: include current layout + violations
      const violationEntries = validation.violations.map((v) => ({
        ruleId: v.ruleId,
        severity: v.severity,
        messageZh: v.messageZh,
        affectedZones: v.affectedZones,
        suggestionZh: v.suggestionZh,
      }));
      prompt =
        `Current layout (needs corrections):\n${JSON.stringify(currentLayout, null, 2)}\n\n` +
        buildViolationFeedback(violationEntries, currentLayout) +
        "\n\nFix the above violations and output the corrected layout JSON.";
    } else if (baseOptions.existingLayout) {
      // Modification of existing layout (first iteration)
      prompt = `${LAYOUT_GENERATION_PROMPT}\n\nCurrent layout:\n${JSON.stringify(baseOptions.existingLayout, null, 2)}\n\nModification request:\n${baseOptions.requirements}`;
    } else {
      // Fresh generation (first iteration)
      prompt = `${LAYOUT_GENERATION_PROMPT}\n\n${baseOptions.requirements}`;
    }

    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt,
      // Lower temperature for correction iterations to improve precision
      temperature: i === 0 ? 0.7 : 0.3,
    });

    // Extract JSON using bracket counting (more robust than regex)
    let jsonStr: string | null = null;
    const startIdx = text.indexOf("{");
    if (startIdx !== -1) {
      let depth = 0;
      let endIdx = startIdx;
      for (let ci = startIdx; ci < text.length; ci++) {
        if (text[ci] === "{") depth++;
        else if (text[ci] === "}") depth--;
        if (depth === 0) {
          endIdx = ci;
          break;
        }
      }
      if (depth === 0) {
        jsonStr = text.substring(startIdx, endIdx + 1);
      }
    }

    if (!jsonStr) {
      throw new Error(`Failed to extract layout JSON from AI response (iteration ${i + 1})`);
    }

    const parseResult = LayoutSchema.safeParse(JSON.parse(jsonStr));
    if (!parseResult.success) {
      // If parse fails on correction iteration, use previous layout
      if (currentLayout && i > 0) {
        console.warn(`Layout parse failed on iteration ${i + 1}:`, parseResult.error.issues.slice(0, 3));
        break;
      }
      throw new Error(`Invalid layout structure: ${parseResult.error.issues[0]?.message || "unknown"}`);
    }
    currentLayout = parseResult.data;
    validation = validateLayout(currentLayout);

    history.push({
      iteration: i + 1,
      score: validation.score,
      errorCount: validation.errors.length,
    });

    // Stop if the layout is compliant (no errors)
    if (validation.isCompliant) break;
  }

  return {
    layout: currentLayout!,
    validation: validation!,
    iterations: history.length,
    history,
  };
}

// Re-export prompt helpers for convenience
export { getDisciplinePrompt, getLayoutSystemPrompt, DISCIPLINE_PROMPTS };
