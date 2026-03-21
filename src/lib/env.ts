import { z } from "zod";

// =============================================================================
// Server-only environment variables (never exposed to browser)
// =============================================================================
const serverSchema = z.object({
  // --- AI Text Providers ---
  /** Anthropic Claude API key (primary text/vision provider) */
  ANTHROPIC_API_KEY: z.string().optional(),

  /** OpenAI API key (used for Poe compatibility layer) */
  OPENAI_API_KEY: z.string().optional(),

  /** Poe API key (alternative gateway to multiple models) */
  POE_API_KEY: z.string().optional(),

  /** Google Generative AI (Gemini) API key */
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),

  /** Gemini dedicated image service API key */
  GEMINI_API_KEY: z.string().optional(),

  /** Gemini image service URL (defaults to http://localhost:8000) */
  GEMINI_SERVICE_URL: z
    .string()
    .url()
    .optional()
    .default("http://localhost:8000"),

  // --- Image Generation Providers ---
  /** Replicate API token (SDXL, Flux, etc.) */
  REPLICATE_API_TOKEN: z.string().optional(),

  /** Midjourney API key (via proxy services like GoAPI) */
  MIDJOURNEY_API_KEY: z.string().optional(),

  /** Midjourney API URL (defaults to https://api.goapi.ai/mj/v2) */
  MIDJOURNEY_API_URL: z
    .string()
    .url()
    .optional()
    .default("https://api.goapi.ai/mj/v2"),

  // --- Runtime ---
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),
});

// =============================================================================
// Client-safe environment variables (NEXT_PUBLIC_* prefix)
// =============================================================================
const clientSchema = z.object({
  /** Public site URL used for SEO, meta tags, and OG images */
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .optional()
    .default("https://owlab.ai"),
});

// =============================================================================
// Combined schema
// =============================================================================
const envSchema = serverSchema.merge(clientSchema);

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;
export type Env = z.infer<typeof envSchema>;

// =============================================================================
// Validation & export
// =============================================================================

function validateEnv(): Env {
  const raw = {
    // Server
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    POE_API_KEY: process.env.POE_API_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_SERVICE_URL: process.env.GEMINI_SERVICE_URL,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    MIDJOURNEY_API_KEY: process.env.MIDJOURNEY_API_KEY,
    MIDJOURNEY_API_URL: process.env.MIDJOURNEY_API_URL,
    NODE_ENV: process.env.NODE_ENV,
    // Client
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  };

  const result = envSchema.safeParse(raw);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    console.error(
      `[env] Environment variable validation failed:\n${formatted}`
    );
    throw new Error(
      `Invalid environment variables. See console output for details.`
    );
  }

  const env = result.data;

  // -------------------------------------------------------------------------
  // Warn about missing optional keys that affect functionality
  // -------------------------------------------------------------------------
  const hasTextProvider =
    env.ANTHROPIC_API_KEY || env.POE_API_KEY || env.OPENAI_API_KEY;
  const hasImageProvider = env.REPLICATE_API_TOKEN || env.MIDJOURNEY_API_KEY;

  if (!hasTextProvider) {
    console.warn(
      "[env] No text AI provider configured (ANTHROPIC_API_KEY, POE_API_KEY, or OPENAI_API_KEY). " +
        "AI features will return demo data."
    );
  }

  if (!hasImageProvider) {
    console.warn(
      "[env] No image generation provider configured (REPLICATE_API_TOKEN or MIDJOURNEY_API_KEY). " +
        "Image generation will be unavailable."
    );
  }

  if (!env.GOOGLE_GENERATIVE_AI_API_KEY && !env.GEMINI_API_KEY) {
    console.warn(
      "[env] No Google AI key configured (GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY). " +
        "Gemini models will be unavailable."
    );
  }

  return env;
}

/**
 * Validated, typed environment variables.
 *
 * - All keys are validated at import time via Zod.
 * - Optional keys fall back to `undefined` (or their documented defaults).
 * - Import this instead of reading `process.env` directly.
 */
export const env = validateEnv();

// Re-export schemas for use in other modules (e.g. src/lib/ai/config.ts)
export { serverSchema, clientSchema, envSchema };
