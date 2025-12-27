// Re-export all providers
export * from "./anthropic";
export * from "./poe";
export * from "./google";
export * from "./replicate";
export * from "./midjourney";

import { getAnthropicModel } from "./anthropic";
import { getPoeModel } from "./poe";
import { getGoogleModel } from "./google";
import { type AIProvider, type ModelConfig, MODELS } from "../config";

// Unified text model getter
export function getTextModel(modelKey: string) {
  const config = MODELS[modelKey];
  if (!config) {
    throw new Error(`Unknown model: ${modelKey}`);
  }

  switch (config.provider) {
    case "anthropic":
      return getAnthropicModel(config.id);
    case "poe":
      return getPoeModel(config.id);
    case "google":
      return getGoogleModel(config.id);
    default:
      throw new Error(`Provider ${config.provider} does not support text generation`);
  }
}

// Get available providers based on configured API keys
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env.ANTHROPIC_API_KEY) providers.push("anthropic");
  if (process.env.POE_API_KEY) providers.push("poe");
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) providers.push("google");
  if (process.env.REPLICATE_API_TOKEN) providers.push("replicate");
  if (process.env.MIDJOURNEY_API_KEY) providers.push("midjourney");

  return providers;
}

// Get available models based on configured providers
export function getAvailableModels(): ModelConfig[] {
  const availableProviders = getAvailableProviders();
  return Object.values(MODELS).filter((model) =>
    availableProviders.includes(model.provider)
  );
}
