import { NextRequest, NextResponse } from "next/server";
import {
  generateWithGemini,
  createOWLImageConfig,
  type GeminiImageConfig,
} from "@/lib/ai/providers/gemini-image";

export const runtime = "nodejs";
export const maxDuration = 120;

interface GeminiImageRequest {
  prompt: string;
  aspectRatio?: GeminiImageConfig["aspectRatio"];
  imageSize?: GeminiImageConfig["imageSize"];
  promptType?:
    | "livingModule"
    | "conceptDiagram"
    | "logo"
    | "spaceVisualization"
    | "educationalIllustration"
    | "custom";
  promptArgs?: any[]; // Arguments for OWL preset prompts
  useGoogleSearch?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: GeminiImageRequest = await request.json();
    const {
      prompt,
      aspectRatio = "16:9",
      imageSize = "2K",
      promptType = "custom",
      promptArgs = [],
      useGoogleSearch = false,
    } = body;

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Gemini API is not configured. Please set GEMINI_API_KEY environment variable.",
          message:
            "To use Gemini image generation, you need to:\n" +
            "1. Get API key from https://aistudio.google.com/apikey\n" +
            "2. Set GEMINI_API_KEY in your .env.local file\n" +
            "3. Implement Python bridge service (see GEMINI_INTEGRATION.md)",
          demo: true,
        },
        { status: 503 }
      );
    }

    // Build config based on prompt type
    let config: GeminiImageConfig;

    if (promptType === "custom") {
      config = {
        prompt,
        aspectRatio,
        imageSize,
        useGoogleSearch,
      };
    } else {
      // Use OWL preset prompt
      config = createOWLImageConfig(promptType as any, ...promptArgs);
      config.aspectRatio = aspectRatio;
      config.imageSize = imageSize;
      config.useGoogleSearch = useGoogleSearch;
    }

    // Generate image
    const result = await generateWithGemini(config);

    return NextResponse.json({
      success: true,
      imageData: result.imageData,
      text: result.text,
      model: result.model,
      config: {
        aspectRatio,
        imageSize,
        promptType,
      },
    });
  } catch (error) {
    console.error("Gemini image generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image generation failed",
      },
      { status: 500 }
    );
  }
}
