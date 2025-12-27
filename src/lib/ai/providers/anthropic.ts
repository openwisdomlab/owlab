import { createAnthropic } from "@ai-sdk/anthropic";

export function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  return createAnthropic({
    apiKey,
  });
}

export function getAnthropicModel(modelId: string = "claude-sonnet-4-20250514") {
  const client = getAnthropicClient();
  return client(modelId);
}
