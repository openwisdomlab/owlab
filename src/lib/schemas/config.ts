/**
 * Configuration Schemas - App and feature configuration
 */

import { z } from "zod";

// ============================================
// AI Provider Configuration
// ============================================

export const AIProviderSchema = z.enum([
  "anthropic",
  "openai",
  "google",
  "poe",
  "replicate",
  "midjourney",
]);

export type AIProvider = z.infer<typeof AIProviderSchema>;

export const ModelCapabilitySchema = z.enum(["text", "image", "vision", "embedding"]);

export type ModelCapability = z.infer<typeof ModelCapabilitySchema>;

export const ModelConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: AIProviderSchema,
  capabilities: z.array(ModelCapabilitySchema),
  maxTokens: z.number().optional(),
  description: z.string().optional(),
  costPer1kTokens: z.number().optional(), // in USD
  rateLimit: z.number().optional(), // requests per minute
});

export type ModelConfig = z.infer<typeof ModelConfigSchema>;

// ============================================
// Search Configuration
// ============================================

export const SearchConfigSchema = z.object({
  // Pagefind (Layer 1)
  pagefind: z
    .object({
      enabled: z.boolean().default(true),
      bundlePath: z.string().default("/_pagefind"),
      highlightParam: z.string().default("highlight"),
      excerptLength: z.number().default(200),
    })
    .default({
      enabled: true,
      bundlePath: "/_pagefind",
      highlightParam: "highlight",
      excerptLength: 200,
    }),

  // RAG (Layer 2)
  rag: z
    .object({
      enabled: z.boolean().default(true),
      embeddingModel: z.string().default("text-embedding-3-small"),
      vectorStore: z.enum(["memory", "pinecone", "supabase"]).default("memory"),
      topK: z.number().default(5),
      similarityThreshold: z.number().min(0).max(1).default(0.7),
    })
    .default({
      enabled: true,
      embeddingModel: "text-embedding-3-small",
      vectorStore: "memory",
      topK: 5,
      similarityThreshold: 0.7,
    }),

  // Agentic (Layer 3)
  agentic: z
    .object({
      enabled: z.boolean().default(true),
      model: z.string().default("claude-sonnet"),
      maxIterations: z.number().default(5),
      availableTools: z.array(z.string()).default([
        "search_docs",
        "get_document",
        "generate_layout",
        "analyze_layout",
      ]),
    })
    .default({
      enabled: true,
      model: "claude-sonnet",
      maxIterations: 5,
      availableTools: [
        "search_docs",
        "get_document",
        "generate_layout",
        "analyze_layout",
      ],
    }),
});

export type SearchConfig = z.infer<typeof SearchConfigSchema>;

// ============================================
// Theme Configuration
// ============================================

export const ThemeConfigSchema = z.object({
  defaultTheme: z.enum(["dark", "light", "system"]).default("dark"),
  colors: z
    .object({
      primary: z.string().default("#22d3ee"),
      accent: z.string().default("#8b5cf6"),
      success: z.string().default("#10b981"),
      warning: z.string().default("#f59e0b"),
      error: z.string().default("#ef4444"),
    })
    .default({
      primary: "#22d3ee",
      accent: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    }),
  fonts: z
    .object({
      sans: z.string().default("Inter"),
      mono: z.string().default("JetBrains Mono"),
    })
    .default({
      sans: "Inter",
      mono: "JetBrains Mono",
    }),
});

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;

// ============================================
// Internationalization Configuration
// ============================================

export const LocaleConfigSchema = z.object({
  defaultLocale: z.enum(["en", "zh"]).default("en"),
  locales: z.array(z.enum(["en", "zh"])).default(["en", "zh"]),
  localeLabels: z
    .record(z.string(), z.string())
    .default({ en: "English", zh: "中文" }),
});

export type LocaleConfig = z.infer<typeof LocaleConfigSchema>;

// ============================================
// Feature Flags Configuration
// ============================================

export const FeatureFlagsSchema = z.object({
  enableSearch: z.boolean().default(true),
  enableAIChat: z.boolean().default(true),
  enableLabDesigner: z.boolean().default(true),
  enableDashboard: z.boolean().default(true),
  enableThemeSwitcher: z.boolean().default(true),
  enableI18n: z.boolean().default(true),
  enableAnalytics: z.boolean().default(false),
  debugMode: z.boolean().default(false),
});

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;

// ============================================
// Full App Configuration
// ============================================

export const AppConfigSchema = z.object({
  name: z.string().default("AI Space"),
  version: z.string().default("0.1.0"),
  siteUrl: z.string().url().optional(),
  theme: ThemeConfigSchema.default({
    defaultTheme: "dark",
    colors: {
      primary: "#22d3ee",
      accent: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    fonts: {
      sans: "Inter",
      mono: "JetBrains Mono",
    },
  }),
  locale: LocaleConfigSchema.default({
    defaultLocale: "en",
    locales: ["en", "zh"],
    localeLabels: { en: "English", zh: "中文" },
  }),
  search: SearchConfigSchema.default({
    pagefind: {
      enabled: true,
      bundlePath: "/_pagefind",
      highlightParam: "highlight",
      excerptLength: 200,
    },
    rag: {
      enabled: true,
      embeddingModel: "text-embedding-3-small",
      vectorStore: "memory",
      topK: 5,
      similarityThreshold: 0.7,
    },
    agentic: {
      enabled: true,
      model: "claude-sonnet",
      maxIterations: 5,
      availableTools: [
        "search_docs",
        "get_document",
        "generate_layout",
        "analyze_layout",
      ],
    },
  }),
  features: FeatureFlagsSchema.default({
    enableSearch: true,
    enableAIChat: true,
    enableLabDesigner: true,
    enableDashboard: true,
    enableThemeSwitcher: true,
    enableI18n: true,
    enableAnalytics: false,
    debugMode: false,
  }),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

// ============================================
// Environment Variables Schema
// ============================================

export const EnvSchema = z.object({
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  // AI Providers
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional(),
  POE_API_KEY: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  MIDJOURNEY_API_KEY: z.string().optional(),
  MIDJOURNEY_API_URL: z.string().url().optional(),

  // Vector Store
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // Analytics
  ANALYTICS_ID: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

/**
 * Validate environment variables
 */
export function validateEnv(): Env {
  return EnvSchema.parse(process.env);
}
