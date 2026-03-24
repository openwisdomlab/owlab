/**
 * Visualization Agent — generates creative visualizations from layout data.
 * Converts LayoutData into AI image prompts and manages generation.
 */

import { generateWithGemini, type GeminiImageConfig } from "../providers/gemini-image";
import type { LayoutData } from "./layout-agent";
import {
  buildVisualizationPrompt,
  VIEW_TYPE_CONFIGS,
  SUITE_PRESETS,
  type ViewType,
  type RenderStyle,
  type SuitePreset,
  type ViewCategory,
} from "../prompts/visualization";

export interface VisualizationRequest {
  layout: LayoutData;
  viewType: ViewType;
  style?: RenderStyle;
  aspectRatio?: GeminiImageConfig["aspectRatio"];
  imageSize?: GeminiImageConfig["imageSize"];
}

export interface VisualizationResult {
  viewType: ViewType;
  imageData: string;  // base64
  prompt: string;     // the prompt used (for regeneration)
  style: RenderStyle;
  generatedAt: string;
}

export interface SuiteGenerationProgress {
  total: number;
  completed: number;
  current: ViewType | null;
  results: VisualizationResult[];
}

/**
 * Generate a single visualization.
 */
export async function generateVisualization(
  request: VisualizationRequest
): Promise<VisualizationResult> {
  const { layout, viewType, style = "architectural" } = request;

  const config = VIEW_TYPE_CONFIGS.find(v => v.id === viewType);
  if (!config) throw new Error(`Unknown view type: ${viewType}`);

  // Only AI-generated types go through image generation
  if (config.generationMethod === "programmatic") {
    throw new Error(`View type "${viewType}" is programmatic and should be rendered client-side`);
  }

  const prompt = buildVisualizationPrompt(layout, viewType, style);

  // Map aspect ratio string to Gemini format
  const aspectRatio = request.aspectRatio || (config.defaultAspectRatio.replace(":", ":") as GeminiImageConfig["aspectRatio"]) || "16:9";

  const result = await generateWithGemini({
    prompt,
    aspectRatio: aspectRatio as GeminiImageConfig["aspectRatio"],
    imageSize: request.imageSize || "2K",
    model: "gemini-3-pro-image",
  });

  return {
    viewType,
    imageData: result.imageData,
    prompt,
    style,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate a suite of visualizations.
 * Only generates AI types; programmatic types are skipped.
 */
export async function generateSuite(
  layout: LayoutData,
  preset: SuitePreset,
  style: RenderStyle = "architectural",
  onProgress?: (progress: SuiteGenerationProgress) => void
): Promise<VisualizationResult[]> {
  const suiteConfig = SUITE_PRESETS[preset];
  const aiViews = suiteConfig.views.filter(v => {
    const config = VIEW_TYPE_CONFIGS.find(c => c.id === v);
    return config && config.generationMethod !== "programmatic";
  });

  const results: VisualizationResult[] = [];

  for (let i = 0; i < aiViews.length; i++) {
    const viewType = aiViews[i];

    onProgress?.({
      total: aiViews.length,
      completed: i,
      current: viewType,
      results: [...results],
    });

    try {
      const result = await generateVisualization({ layout, viewType, style });
      results.push(result);
    } catch (error) {
      console.error(`Failed to generate ${viewType}:`, error);
      // Continue with remaining views
    }
  }

  onProgress?.({
    total: aiViews.length,
    completed: aiViews.length,
    current: null,
    results,
  });

  return results;
}

/**
 * Get available view types filtered by category.
 */
export function getViewTypesByCategory(category?: ViewCategory): typeof VIEW_TYPE_CONFIGS {
  if (!category) return VIEW_TYPE_CONFIGS;
  return VIEW_TYPE_CONFIGS.filter(v => v.category === category);
}

/**
 * Get only AI-generatable view types.
 */
export function getAIViewTypes(): typeof VIEW_TYPE_CONFIGS {
  return VIEW_TYPE_CONFIGS.filter(v => v.generationMethod !== "programmatic");
}
