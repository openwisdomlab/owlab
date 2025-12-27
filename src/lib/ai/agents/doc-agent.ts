import { generateText, streamText } from "ai";
import { getTextModel } from "../providers";
import type { LayoutData } from "./layout-agent";

const DOC_SYSTEM_PROMPT = `You are an expert technical writer specializing in creating comprehensive documentation for AI research facilities and laboratory spaces.

Your documentation should be:
- Clear and professional
- Well-structured with proper headings
- Detailed yet concise
- Actionable and practical
- Compliant with safety standards

You output documentation in Markdown format with proper formatting.`;

export interface DocGenerationOptions {
  modelKey?: string;
  layout: LayoutData;
  locale?: "en" | "zh";
  sections?: ("overview" | "zones" | "equipment" | "safety" | "maintenance")[];
}

// Generate full documentation for a layout
export async function generateLayoutDocumentation(
  options: DocGenerationOptions
): Promise<string> {
  const {
    modelKey = "claude-sonnet",
    layout,
    locale = "en",
    sections = ["overview", "zones", "equipment", "safety", "maintenance"],
  } = options;

  const model = getTextModel(modelKey);

  const languageInstruction =
    locale === "zh"
      ? "Please write the documentation in Chinese (Simplified)."
      : "Please write the documentation in English.";

  const sectionsList = sections.join(", ");

  const { text } = await generateText({
    model,
    system: DOC_SYSTEM_PROMPT,
    prompt: `Generate comprehensive documentation for the following AI lab layout.

${languageInstruction}

Include the following sections: ${sectionsList}

Layout Details:
${JSON.stringify(layout, null, 2)}

Generate professional documentation in Markdown format.`,
    temperature: 0.7,
  });

  return text;
}

// Stream documentation generation
export function streamLayoutDocumentation(options: DocGenerationOptions) {
  const { modelKey = "claude-sonnet", layout, locale = "en" } = options;

  const model = getTextModel(modelKey);

  const languageInstruction =
    locale === "zh"
      ? "Please write in Chinese (Simplified)."
      : "Please write in English.";

  return streamText({
    model,
    system: DOC_SYSTEM_PROMPT,
    prompt: `Generate comprehensive documentation for this AI lab layout.

${languageInstruction}

Layout: ${JSON.stringify(layout, null, 2)}

Include:
1. Executive Summary
2. Zone Descriptions
3. Equipment List
4. Safety Guidelines
5. Maintenance Schedule`,
    temperature: 0.7,
  });
}

// Generate equipment list
export async function generateEquipmentList(
  layout: LayoutData,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: DOC_SYSTEM_PROMPT,
    prompt: `Based on this lab layout, generate a comprehensive equipment list with specifications and estimated costs.

Layout:
${JSON.stringify(layout, null, 2)}

Output as a Markdown table with columns: Item, Quantity, Specifications, Estimated Cost, Priority`,
    temperature: 0.7,
  });

  return text;
}

// Generate safety checklist
export async function generateSafetyChecklist(
  layout: LayoutData,
  modelKey: string = "claude-sonnet"
): Promise<string> {
  const model = getTextModel(modelKey);

  const { text } = await generateText({
    model,
    system: DOC_SYSTEM_PROMPT,
    prompt: `Based on this lab layout, generate a comprehensive safety checklist.

Layout:
${JSON.stringify(layout, null, 2)}

Include:
- Fire safety
- Electrical safety
- Ergonomics
- Emergency procedures
- Equipment handling
- Environmental controls

Output as a Markdown checklist format.`,
    temperature: 0.7,
  });

  return text;
}
