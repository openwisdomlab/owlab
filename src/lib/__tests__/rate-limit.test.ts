import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit } from "../rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    // Use unique keys per test to avoid cross-test contamination
  });

  it("should allow requests within the limit", () => {
    const key = `test-allow-${Date.now()}`;
    const result = checkRateLimit(key, 5, 60000);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("should block requests exceeding the limit", () => {
    const key = `test-block-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      checkRateLimit(key, 5, 60000);
    }
    const result = checkRateLimit(key, 5, 60000);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("should track remaining count correctly", () => {
    const key = `test-remaining-${Date.now()}`;
    const r1 = checkRateLimit(key, 3, 60000);
    expect(r1.remaining).toBe(2);

    const r2 = checkRateLimit(key, 3, 60000);
    expect(r2.remaining).toBe(1);

    const r3 = checkRateLimit(key, 3, 60000);
    expect(r3.remaining).toBe(0);

    const r4 = checkRateLimit(key, 3, 60000);
    expect(r4.success).toBe(false);
  });

  it("should allow requests after window expires", async () => {
    const key = `test-expire-${Date.now()}`;
    // Use very short window
    for (let i = 0; i < 2; i++) {
      checkRateLimit(key, 2, 50);
    }
    const blocked = checkRateLimit(key, 2, 50);
    expect(blocked.success).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 60));

    const allowed = checkRateLimit(key, 2, 50);
    expect(allowed.success).toBe(true);
  });

  it("should use separate counters for different keys", () => {
    const key1 = `test-sep-a-${Date.now()}`;
    const key2 = `test-sep-b-${Date.now()}`;

    for (let i = 0; i < 3; i++) {
      checkRateLimit(key1, 3, 60000);
    }

    const r1 = checkRateLimit(key1, 3, 60000);
    expect(r1.success).toBe(false);

    const r2 = checkRateLimit(key2, 3, 60000);
    expect(r2.success).toBe(true);
  });
});
