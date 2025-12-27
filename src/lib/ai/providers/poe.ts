import { createOpenAI } from "@ai-sdk/openai";

// Poe API is OpenAI-compatible
// Docs: https://creator.poe.com/docs/external-applications/openai-compatible-api
export function getPoeClient() {
  const apiKey = process.env.POE_API_KEY;

  if (!apiKey) {
    throw new Error("POE_API_KEY is not configured");
  }

  return createOpenAI({
    apiKey,
    baseURL: "https://api.poe.com/v1",
  });
}

export function getPoeModel(modelId: string = "gpt-4o") {
  const client = getPoeClient();
  return client(modelId);
}

// Available Poe models (subset - many more available)
export const POE_MODELS = {
  // OpenAI Models
  "gpt-4o": "GPT-4o",
  "gpt-4o-mini": "GPT-4o Mini",
  "o1-preview": "O1 Preview",
  "o1-mini": "O1 Mini",

  // Anthropic Models
  "claude-3-5-sonnet": "Claude 3.5 Sonnet",
  "claude-3-opus": "Claude 3 Opus",
  "claude-3-haiku": "Claude 3 Haiku",

  // Google Models
  "gemini-1.5-pro": "Gemini 1.5 Pro",
  "gemini-1.5-flash": "Gemini 1.5 Flash",

  // Meta Models
  "llama-3.1-405b": "Llama 3.1 405B",
  "llama-3.1-70b": "Llama 3.1 70B",

  // Other
  "mixtral-8x7b": "Mixtral 8x7B",
  "qwen-2-72b": "Qwen 2 72B",
} as const;
