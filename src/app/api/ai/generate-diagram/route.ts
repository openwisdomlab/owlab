import { NextRequest, NextResponse } from "next/server";
import {
  generateWithSDXL,
  generateWithFluxSchnell,
  generateWithFluxPro,
} from "@/lib/ai/providers/replicate";
import { generateWithMidjourney, getMidjourneyStatus } from "@/lib/ai/providers/midjourney";
import {
  LAB_LAYOUT_IMAGE_PROMPT,
  CONCEPT_DIAGRAM_IMAGE_PROMPT,
  ISOMETRIC_LAB_PROMPT,
  NEGATIVE_PROMPTS,
} from "@/lib/ai/prompts/image";

export const runtime = "nodejs";
export const maxDuration = 120;

interface GenerateRequest {
  prompt: string;
  model: "sdxl" | "flux-schnell" | "flux-pro" | "midjourney";
  type: "layout" | "concept" | "isometric";
  width?: number;
  height?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { prompt, model, type, width = 1024, height = 1024 } = body;

    // Check if API key is configured
    if (!process.env.REPLICATE_API_TOKEN && !process.env.MIDJOURNEY_API_KEY) {
      // Return a placeholder for demo
      return NextResponse.json({
        imageUrl: `https://placehold.co/${width}x${height}/0f172a/22d3ee?text=AI+Generated+${type}`,
        message: "Demo mode - configure REPLICATE_API_TOKEN or MIDJOURNEY_API_KEY for real image generation",
      });
    }

    // Build the full prompt based on type
    let fullPrompt: string;
    let negativePrompt: string;

    switch (type) {
      case "layout":
        fullPrompt = LAB_LAYOUT_IMAGE_PROMPT(prompt);
        negativePrompt = NEGATIVE_PROMPTS.architectural;
        break;
      case "concept":
        fullPrompt = CONCEPT_DIAGRAM_IMAGE_PROMPT(prompt);
        negativePrompt = NEGATIVE_PROMPTS.concept;
        break;
      case "isometric":
        fullPrompt = ISOMETRIC_LAB_PROMPT(prompt);
        negativePrompt = NEGATIVE_PROMPTS.isometric;
        break;
      default:
        fullPrompt = prompt;
        negativePrompt = NEGATIVE_PROMPTS.concept;
    }

    let imageUrl: string;

    switch (model) {
      case "sdxl":
        const sdxlResult = await generateWithSDXL({
          prompt: fullPrompt,
          negativePrompt,
          width,
          height,
        });
        imageUrl = Array.isArray(sdxlResult) ? sdxlResult[0] : sdxlResult;
        break;

      case "flux-schnell":
        const fluxResult = await generateWithFluxSchnell({
          prompt: fullPrompt,
        });
        imageUrl = Array.isArray(fluxResult) ? fluxResult[0] : fluxResult;
        break;

      case "flux-pro":
        const fluxProResult = await generateWithFluxPro({
          prompt: fullPrompt,
          width,
          height,
        });
        imageUrl = typeof fluxProResult === "string" ? fluxProResult : fluxProResult[0];
        break;

      case "midjourney":
        const mjResult = await generateWithMidjourney({
          prompt: fullPrompt,
          negativePrompt,
          aspectRatio: width === height ? "1:1" : width > height ? "16:9" : "9:16",
        });

        if (mjResult.status === "failed") {
          throw new Error(mjResult.error || "Midjourney generation failed");
        }

        // Poll for completion
        let attempts = 0;
        let mjStatus = mjResult;

        while (mjStatus.status !== "completed" && attempts < 60) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          mjStatus = await getMidjourneyStatus(mjResult.id);
          attempts++;

          if (mjStatus.status === "failed") {
            throw new Error(mjStatus.error || "Midjourney generation failed");
          }
        }

        if (!mjStatus.imageUrl) {
          throw new Error("Midjourney generation timed out");
        }

        imageUrl = mjStatus.imageUrl;
        break;

      default:
        throw new Error(`Unknown model: ${model}`);
    }

    return NextResponse.json({
      imageUrl,
      prompt: fullPrompt,
      model,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image generation failed",
      },
      { status: 500 }
    );
  }
}
