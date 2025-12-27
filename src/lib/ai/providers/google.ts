import { createGoogleGenerativeAI } from "@ai-sdk/google";

export function getGoogleClient() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  return createGoogleGenerativeAI({
    apiKey,
  });
}

export function getGoogleModel(modelId: string = "gemini-2.0-flash") {
  const client = getGoogleClient();
  return client(modelId);
}

// Available Google models
export const GOOGLE_MODELS = {
  "gemini-2.0-flash": "Gemini 2.0 Flash",
  "gemini-1.5-pro": "Gemini 1.5 Pro",
  "gemini-1.5-flash": "Gemini 1.5 Flash",
} as const;
