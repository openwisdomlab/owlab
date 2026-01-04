/**
 * Gemini Image Generation Provider
 *
 * Uses Google's Gemini API for image generation and editing.
 * Requires GEMINI_API_KEY environment variable.
 */

export interface GeminiImageConfig {
  prompt: string;
  aspectRatio?: "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "9:16" | "16:9" | "21:9";
  imageSize?: "1K" | "2K" | "4K";
  referenceImages?: string[]; // Base64 encoded images or URLs
  useGoogleSearch?: boolean;
}

export interface GeminiImageResult {
  imageData: string; // Base64 encoded JPEG
  text?: string; // Optional text response
  model: string;
}

/**
 * Generate an image using Gemini API
 *
 * Note: This is a placeholder implementation. The actual implementation
 * requires the google-genai Python package and should be implemented
 * as a separate service or using a Python bridge.
 */
export async function generateWithGemini(
  config: GeminiImageConfig
): Promise<GeminiImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please set it in your environment variables."
    );
  }

  // For now, return a placeholder response
  // TODO: Implement actual Gemini API integration via Python bridge or REST API
  return {
    imageData: "", // Placeholder
    text: "Gemini image generation is configured. Implement Python bridge for actual generation.",
    model: "gemini-3-pro-image-preview",
  };
}

/**
 * OWL-specific image generation prompts
 */
export const OWL_IMAGE_PROMPTS = {
  livingModule: (module: string, description: string) => `
Create a minimalist illustration representing ${module} for OWL Living Modules.
${description}
Style: clean lines, neon pink (#D91A7A) and cyan accents on dark background (#0E0E14),
futuristic yet warm, educational, modern tech aesthetic.
16:9 aspect ratio for documentation header.
`,

  conceptDiagram: (concept: string, elements: string[]) => `
Create a clean infographic showing ${concept} for OWL documentation.
Include these elements: ${elements.join(", ")}.
Color scheme: neon pink (#D91A7A), cyan, dark background (#0E0E14).
Include both Chinese and English labels where appropriate.
Style: modern, tech-inspired, educational, flat design with subtle depth.
`,

  logo: (name: string, description: string) => `
Create a minimalist logo for "${name}".
${description}
Incorporate geometric, futuristic elements.
Color palette: neon pink (#D91A7A) and cyan, on transparent or dark background.
Clean, modern typography. Versatile for web and print.
`,

  spaceVisualization: (description: string) => `
Render a modern innovation makerspace: ${description}
Show modular furniture, collaboration zones, maker tools visible.
Lighting: warm ambient with neon pink and cyan accent lighting.
Style: photorealistic architectural visualization, wide-angle view.
21:9 panoramic aspect ratio.
`,

  educationalIllustration: (topic: string, ageGroup: string) => `
Create an educational illustration about ${topic} for ${ageGroup}.
Style: engaging, colorful but not childish, scientifically accurate.
Use OWL color palette: neon pink (#D91A7A), cyan accents on dark background.
Clear visual hierarchy, suitable for both digital and print.
`,
};

/**
 * Helper to prepare OWL-branded image generation config
 */
export function createOWLImageConfig(
  promptType: keyof typeof OWL_IMAGE_PROMPTS,
  ...args: any[]
): GeminiImageConfig {
  const promptFn = OWL_IMAGE_PROMPTS[promptType];
  const prompt = typeof promptFn === "function" ? promptFn(...args) : String(promptFn);

  // Default to 16:9 for documentation, 2K for quality
  return {
    prompt,
    aspectRatio: "16:9",
    imageSize: "2K",
  };
}
