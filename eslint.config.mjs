import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // ── Custom rules ──────────────────────────────────────────────────────
  {
    name: "owlab/custom-rules",
    rules: {
      // Warn on explicit `any` to encourage proper typing
      "@typescript-eslint/no-explicit-any": "warn",

      // Warn on console.log but allow console.warn and console.error
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
