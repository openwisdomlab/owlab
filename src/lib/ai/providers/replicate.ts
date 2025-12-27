import Replicate from "replicate";

let replicateClient: Replicate | null = null;

export function getReplicateClient(): Replicate {
  if (replicateClient) return replicateClient;

  const apiToken = process.env.REPLICATE_API_TOKEN;

  if (!apiToken) {
    throw new Error("REPLICATE_API_TOKEN is not configured");
  }

  replicateClient = new Replicate({
    auth: apiToken,
  });

  return replicateClient;
}

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  seed?: number;
}

// SDXL Generation
export async function generateWithSDXL(options: ImageGenerationOptions) {
  const client = getReplicateClient();

  const output = await client.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: options.prompt,
        negative_prompt: options.negativePrompt || "blurry, low quality, distorted",
        width: options.width || 1024,
        height: options.height || 1024,
        num_outputs: options.numOutputs || 1,
        guidance_scale: options.guidanceScale || 7.5,
        num_inference_steps: options.numInferenceSteps || 50,
        seed: options.seed,
      },
    }
  );

  return output as string[];
}

// FLUX Schnell Generation (fast)
export async function generateWithFluxSchnell(options: ImageGenerationOptions) {
  const client = getReplicateClient();

  const output = await client.run("black-forest-labs/flux-schnell", {
    input: {
      prompt: options.prompt,
      num_outputs: options.numOutputs || 1,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 90,
    },
  });

  return output as string[];
}

// FLUX Pro Generation (high quality)
export async function generateWithFluxPro(options: ImageGenerationOptions) {
  const client = getReplicateClient();

  const output = await client.run("black-forest-labs/flux-1.1-pro", {
    input: {
      prompt: options.prompt,
      aspect_ratio: `${options.width || 1024}:${options.height || 1024}`,
      output_format: "webp",
      output_quality: 90,
      safety_tolerance: 2,
    },
  });

  return output as unknown as string;
}

// Available Replicate image models
export const REPLICATE_MODELS = {
  sdxl: {
    id: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    name: "Stable Diffusion XL",
    generate: generateWithSDXL,
  },
  "flux-schnell": {
    id: "black-forest-labs/flux-schnell",
    name: "FLUX Schnell",
    generate: generateWithFluxSchnell,
  },
  "flux-pro": {
    id: "black-forest-labs/flux-1.1-pro",
    name: "FLUX 1.1 Pro",
    generate: generateWithFluxPro,
  },
} as const;
