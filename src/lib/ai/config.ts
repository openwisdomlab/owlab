import { z } from "zod";

// Environment variable schema
export const envSchema = z.object({
  // Anthropic
  ANTHROPIC_API_KEY: z.string().optional(),

  // OpenAI (for Poe compatibility)
  OPENAI_API_KEY: z.string().optional(),
  POE_API_KEY: z.string().optional(),

  // Google
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),

  // Replicate
  REPLICATE_API_TOKEN: z.string().optional(),

  // Midjourney (via proxy services)
  MIDJOURNEY_API_KEY: z.string().optional(),
  MIDJOURNEY_API_URL: z.string().optional(),
});

export type AIProvider =
  | "anthropic"
  | "openai"
  | "poe"
  | "google"
  | "replicate"
  | "midjourney";

export type ModelCapability = "text" | "image" | "vision" | "embedding";

export interface ModelConfig {
  id: string;
  name: string;
  provider: AIProvider;
  capabilities: ModelCapability[];
  maxTokens?: number;
  description?: string;
}

// Available models configuration
export const MODELS: Record<string, ModelConfig> = {
  // Anthropic Models
  "claude-sonnet": {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "anthropic",
    capabilities: ["text", "vision"],
    maxTokens: 8192,
    description: "Best for complex reasoning and analysis",
  },
  "claude-haiku": {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "anthropic",
    capabilities: ["text", "vision"],
    maxTokens: 8192,
    description: "Fast and efficient for simpler tasks",
  },

  // Poe Models (OpenAI Compatible)
  "poe-gpt4o": {
    id: "gpt-4o",
    name: "GPT-4o (via Poe)",
    provider: "poe",
    capabilities: ["text", "vision"],
    maxTokens: 4096,
    description: "OpenAI GPT-4o through Poe API",
  },
  "poe-claude": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet (via Poe)",
    provider: "poe",
    capabilities: ["text", "vision"],
    maxTokens: 4096,
    description: "Anthropic Claude through Poe API",
  },
  "poe-gemini": {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro (via Poe)",
    provider: "poe",
    capabilities: ["text", "vision"],
    maxTokens: 4096,
    description: "Google Gemini through Poe API",
  },

  // Google Models
  "gemini-pro": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "google",
    capabilities: ["text", "vision"],
    maxTokens: 8192,
    description: "Google's latest multimodal model",
  },

  // Image Generation Models
  "sdxl": {
    id: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    name: "Stable Diffusion XL",
    provider: "replicate",
    capabilities: ["image"],
    description: "High-quality image generation",
  },
  "flux-schnell": {
    id: "black-forest-labs/flux-schnell",
    name: "FLUX Schnell",
    provider: "replicate",
    capabilities: ["image"],
    description: "Fast, high-quality image generation",
  },
  "flux-pro": {
    id: "black-forest-labs/flux-1.1-pro",
    name: "FLUX 1.1 Pro",
    provider: "replicate",
    capabilities: ["image"],
    description: "Professional quality image generation",
  },
  "midjourney": {
    id: "midjourney-v6",
    name: "Midjourney V6",
    provider: "midjourney",
    capabilities: ["image"],
    description: "Artistic, stylized image generation",
  },
};

// Get models by capability
export function getModelsByCapability(capability: ModelCapability): ModelConfig[] {
  return Object.values(MODELS).filter((model) =>
    model.capabilities.includes(capability)
  );
}

// Get models by provider
export function getModelsByProvider(provider: AIProvider): ModelConfig[] {
  return Object.values(MODELS).filter((model) => model.provider === provider);
}
