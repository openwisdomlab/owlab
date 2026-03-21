import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the Zod schemas directly rather than the `env` export,
// because `env` is evaluated eagerly at import time and reads process.env.
// Testing the schemas lets us validate the parsing logic in isolation.

describe('env schema validation', () => {
  let envSchema: typeof import('../env').envSchema;
  let serverSchema: typeof import('../env').serverSchema;
  let clientSchema: typeof import('../env').clientSchema;

  beforeEach(async () => {
    // Suppress console warnings from validateEnv()
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Dynamic import to get the schemas
    const mod = await import('../env');
    envSchema = mod.envSchema;
    serverSchema = mod.serverSchema;
    clientSchema = mod.clientSchema;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('accepts valid environment with all optional keys undefined', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.NODE_ENV).toBe('development');
      expect(result.data.NEXT_PUBLIC_SITE_URL).toBe('https://owlab.ai');
    }
  });

  it('accepts valid environment with explicit values', () => {
    const result = envSchema.safeParse({
      ANTHROPIC_API_KEY: 'sk-test-key',
      NODE_ENV: 'production',
      NEXT_PUBLIC_SITE_URL: 'https://example.com',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ANTHROPIC_API_KEY).toBe('sk-test-key');
      expect(result.data.NODE_ENV).toBe('production');
    }
  });

  it('rejects invalid URL for GEMINI_SERVICE_URL', () => {
    const result = serverSchema.safeParse({
      GEMINI_SERVICE_URL: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid URL for NEXT_PUBLIC_SITE_URL', () => {
    const result = clientSchema.safeParse({
      NEXT_PUBLIC_SITE_URL: 'bad-url',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid NODE_ENV value', () => {
    const result = serverSchema.safeParse({
      NODE_ENV: 'staging',
    });
    expect(result.success).toBe(false);
  });

  it('defaults GEMINI_SERVICE_URL to localhost', () => {
    const result = serverSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.GEMINI_SERVICE_URL).toBe('http://localhost:8000');
    }
  });

  it('defaults MIDJOURNEY_API_URL to goapi.ai', () => {
    const result = serverSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.MIDJOURNEY_API_URL).toBe('https://api.goapi.ai/mj/v2');
    }
  });
});
