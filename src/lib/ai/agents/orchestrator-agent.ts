/**
 * Orchestrator Agent — coordinates layout generation with constraint validation
 * and enrichment from safety/budget agents.
 *
 * Flow: generate → validate → correct (up to 3x) → enrich with analysis
 */

import { generateLayoutWithConstraints } from "./layout-agent";
import { validateLayout, type ValidationResult } from "@/lib/rules/rules-engine";
import type { LayoutData } from "./layout-agent";
import type { Discipline } from "@/lib/schemas/launcher";

export type OrchestratePhase =
  | "generating"
  | "validating"
  | "correcting"
  | "enriching"
  | "complete"
  | "error";

export interface OrchestrateProgress {
  phase: OrchestratePhase;
  message: string;
  messageZh: string;
  iteration?: number;
  score?: number;
}

export interface OrchestratedResult {
  layout: LayoutData;
  validation: ValidationResult;
  iterations: number;
  history: Array<{ iteration: number; score: number; errorCount: number }>;
  enrichment?: {
    safetyNotes?: string;
    budgetEstimate?: string;
  };
}

export interface OrchestrateOptions {
  requirements: string;
  discipline?: Discipline;
  modelKey?: string;
  maxIterations?: number;
  /** Callback for progress updates */
  onProgress?: (progress: OrchestrateProgress) => void;
}

/**
 * Run the full orchestrated layout generation pipeline.
 */
export async function orchestrateLayoutGeneration(
  options: OrchestrateOptions
): Promise<OrchestratedResult> {
  const {
    requirements,
    discipline,
    modelKey = "claude-sonnet",
    maxIterations = 3,
    onProgress,
  } = options;

  // Phase 1: Generate with constraints
  onProgress?.({
    phase: "generating",
    message: "Generating initial layout with constraints...",
    messageZh: "正在生成符合约束的初始布局...",
  });

  const genResult = await generateLayoutWithConstraints({
    requirements,
    discipline,
    modelKey,
    maxIterations,
  });

  // Phase 2: Report validation result
  onProgress?.({
    phase: "validating",
    message: `Validation complete: score ${genResult.validation.score}/100`,
    messageZh: `验证完成: 得分 ${genResult.validation.score}/100`,
    score: genResult.validation.score,
    iteration: genResult.iterations,
  });

  // Phase 3: Enrichment (lightweight — just run validation summary as text)
  onProgress?.({
    phase: "enriching",
    message: "Generating safety and budget analysis...",
    messageZh: "正在生成安全和预算分析...",
  });

  let enrichment: OrchestratedResult["enrichment"];
  try {
    enrichment = await generateEnrichment(genResult.layout, genResult.validation);
  } catch (error) {
    onProgress?.({
      phase: "error",
      message: error instanceof Error ? error.message : "Unknown error during enrichment",
      messageZh: error instanceof Error ? `分析失败: ${error.message}` : "分析过程中发生未知错误",
    });
    // Enrichment is optional — don't fail the whole pipeline
    enrichment = undefined;
  }

  onProgress?.({
    phase: "complete",
    message: "Layout generation complete",
    messageZh: "布局生成完成",
    score: genResult.validation.score,
  });

  return {
    layout: genResult.layout,
    validation: genResult.validation,
    iterations: genResult.iterations,
    history: genResult.history,
    enrichment,
  };
}

/**
 * Generate enrichment analysis (safety notes + budget estimate)
 * from the validated layout. Lightweight — no AI call, just rule-based.
 */
async function generateEnrichment(
  layout: LayoutData,
  validation: ValidationResult
): Promise<OrchestratedResult["enrichment"]> {
  const safetyNotes: string[] = [];
  const budgetLines: string[] = [];

  // Safety summary from violations
  if (validation.errors.length > 0) {
    safetyNotes.push(`⚠️ ${validation.errors.length} 项安全违规需要修复`);
    for (const e of validation.errors.slice(0, 5)) {
      safetyNotes.push(`  - ${e.messageZh}`);
    }
  }
  if (validation.warnings.length > 0) {
    safetyNotes.push(`⚡ ${validation.warnings.length} 项建议需要关注`);
  }
  if (validation.isCompliant) {
    safetyNotes.push("✅ 布局符合所有安全规范");
  }

  // Basic area-based budget estimate
  const totalArea = layout.dimensions.width * layout.dimensions.height;
  const zoneArea = layout.zones.reduce((sum, z) => sum + z.size.width * z.size.height, 0);
  budgetLines.push(`总面积: ${totalArea}m², 功能区面积: ${zoneArea}m² (利用率 ${Math.round(zoneArea / totalArea * 100)}%)`);
  budgetLines.push(`区域数量: ${layout.zones.length}`);

  return {
    safetyNotes: safetyNotes.join("\n"),
    budgetEstimate: budgetLines.join("\n"),
  };
}

/**
 * Validate an existing layout and return the result.
 * Convenience wrapper for use by the API route.
 */
export function validateExistingLayout(layout: LayoutData): ValidationResult {
  return validateLayout(layout);
}
