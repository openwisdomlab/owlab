"use client";

import { useWizardStore } from "@/stores/wizard-store";
import type { NeedsAssessment } from "@/lib/schemas/needs-assessment";
import { DISCIPLINE_METADATA } from "@/lib/schemas/launcher";
import type { OrchestrateProgress } from "@/lib/ai/agents/orchestrator-agent";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { ValidationResult } from "@/lib/rules/rules-engine";
import { motion } from "framer-motion";
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { useCallback } from "react";

const PHASE_LABELS: Record<string, string> = {
  generating: "生成布局中...",
  validating: "验证合规性...",
  correcting: "修正问题...",
  enriching: "丰富细节...",
  complete: "生成完成",
  error: "生成失败",
};

function buildRequirementsText(needs: NeedsAssessment): string {
  const disc = DISCIPLINE_METADATA.find((d) => d.id === needs.discipline);
  const lines: string[] = [];
  lines.push(`项目: ${needs.projectName || "未命名实验室"}`);
  lines.push(`领域: ${disc?.name ?? needs.discipline}`);
  if (needs.subDisciplines.length > 0) {
    lines.push(`方向: ${needs.subDisciplines.join("、")}`);
  }
  lines.push(`尺寸: ${needs.dimensions.width}x${needs.dimensions.height} ${needs.dimensions.unit}`);
  lines.push(`容量: 学生${needs.capacity.students}人, 教职${needs.capacity.staff}人`);
  lines.push(`预算: ${needs.budget.min}-${needs.budget.max} ${needs.budget.currency}`);

  const activeReqs = Object.entries(needs.specialRequirements)
    .filter(([, v]) => v === true || (typeof v === "string" && v.length > 0))
    .map(([k]) => k);
  if (activeReqs.length > 0) {
    lines.push(`特殊要求: ${activeReqs.join("、")}`);
  }
  if (needs.notes) {
    lines.push(`备注: ${needs.notes}`);
  }
  return lines.join("\n");
}

export function AIGenerationStep() {
  const {
    needs,
    isGenerating,
    generationProgress,
    layouts,
    setGenerating,
    setGenerationProgress,
    addLayout,
    setValidation,
    nextStep,
  } = useWizardStore();

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenerationProgress(null);

    try {
      const response = await fetch("/api/ai/orchestrate?action=generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements: buildRequirementsText(needs),
          discipline: needs.discipline,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Generation request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line) as
              | { type: "progress"; data: OrchestrateProgress }
              | { type: "result"; data: { layout: LayoutData; validation: ValidationResult } };
            if (msg.type === "progress") {
              setGenerationProgress(msg.data);
            } else if (msg.type === "result") {
              addLayout(msg.data.layout);
              setValidation(msg.data.validation);
            }
          } catch (parseError) {
            console.warn("Failed to parse NDJSON line:", line, parseError);
            // Don't break the loop — skip malformed lines
          }
        }
      }
    } catch (err) {
      setGenerationProgress({
        phase: "error",
        message: err instanceof Error ? err.message : "Unknown error",
        messageZh: "生成过程中出现错误",
      });
    } finally {
      setGenerating(false);
    }
  }, [needs, setGenerating, setGenerationProgress, addLayout, setValidation]);

  const score = generationProgress?.score;

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-6 min-h-[300px]">
      {/* Not started */}
      {!isGenerating && layouts.length === 0 && !generationProgress && (
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-[var(--neon-cyan)] mx-auto" />
          <p className="text-white/60 text-sm">AI 将根据您的需求自动生成实验室布局方案</p>
          <button
            onClick={handleGenerate}
            className="px-6 py-3 rounded-lg bg-[var(--neon-cyan)] text-black font-medium hover:opacity-90"
          >
            开始生成
          </button>
        </div>
      )}

      {/* Generating */}
      {isGenerating && (
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-[var(--neon-cyan)] mx-auto animate-spin" />
          <div className="space-y-2">
            {generationProgress && (
              <>
                <p className="text-sm font-medium">{PHASE_LABELS[generationProgress.phase] ?? generationProgress.phase}</p>
                <p className="text-xs text-white/40">{generationProgress.messageZh}</p>
                {generationProgress.iteration && (
                  <p className="text-xs text-white/30">迭代 {generationProgress.iteration}</p>
                )}
              </>
            )}
            {/* Phase progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {(["generating", "validating", "correcting", "enriching"] as const).map((phase) => (
                <motion.div
                  key={phase}
                  className={`w-2 h-2 rounded-full ${
                    generationProgress?.phase === phase
                      ? "bg-[var(--neon-cyan)]"
                      : "bg-white/10"
                  }`}
                  animate={generationProgress?.phase === phase ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {!isGenerating && generationProgress?.phase === "error" && (
        <div className="text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
          <p className="text-sm text-red-400">{generationProgress.messageZh}</p>
          <button
            onClick={handleGenerate}
            className="px-5 py-2 rounded-lg border border-[var(--glass-border)] hover:bg-white/5 text-sm"
          >
            重新生成
          </button>
        </div>
      )}

      {/* Complete */}
      {!isGenerating && layouts.length > 0 && generationProgress?.phase !== "error" && (
        <div className="text-center space-y-4">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-sm font-medium">方案生成完成</p>
          {score !== undefined && (
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                score >= 60 ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}
            >
              合规评分: {score}
            </div>
          )}
          <div>
            <button
              onClick={nextStep}
              className="px-5 py-2 rounded-lg bg-[var(--neon-cyan)] text-black font-medium hover:opacity-90"
            >
              查看方案
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
