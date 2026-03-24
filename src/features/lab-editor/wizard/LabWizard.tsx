"use client";

import { useWizardStore, WIZARD_STEPS, WIZARD_STEP_LABELS, type WizardStep } from "@/stores/wizard-store";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { NeedsAssessmentStep } from "./NeedsAssessmentStep";
import { RequirementsReviewStep } from "./RequirementsReviewStep";
import { AIGenerationStep } from "./AIGenerationStep";
import { DesignReviewStep } from "./DesignReviewStep";
import { ComparisonStep } from "./ComparisonStep";
import { RefinementStep } from "./RefinementStep";
import { ExportStep } from "./ExportStep";

const STEP_COMPONENTS: Record<WizardStep, React.ComponentType> = {
  needs: NeedsAssessmentStep,
  review: RequirementsReviewStep,
  generate: AIGenerationStep,
  design: DesignReviewStep,
  compare: ComparisonStep,
  refine: RefinementStep,
  export: ExportStep,
};

export function LabWizard() {
  const { currentStep, nextStep, prevStep, canGoNext, canGoPrev, exitWizard } = useWizardStore();
  const stepIndex = WIZARD_STEPS.indexOf(currentStep);
  const StepComponent = STEP_COMPONENTS[currentStep];

  return (
    <div className="h-full flex flex-col">
      {/* Header with progress */}
      <div className="border-b border-[var(--glass-border)] px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">实验室设计向导</h2>
          <button onClick={() => exitWizard()} className="p-1 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Step indicators */}
        <div className="flex gap-1">
          {WIZARD_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`h-1 w-full rounded-full transition-colors ${
                  i < stepIndex
                    ? "bg-[var(--neon-cyan)]"
                    : i === stepIndex
                      ? "bg-[var(--neon-cyan)] animate-pulse"
                      : "bg-white/10"
                }`}
              />
              <span
                className={`text-xs ${i === stepIndex ? "text-[var(--neon-cyan)]" : "text-white/40"}`}
              >
                {WIZARD_STEP_LABELS[step]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full"
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation footer */}
      <div className="border-t border-[var(--glass-border)] px-6 py-4 flex justify-between">
        <button
          onClick={prevStep}
          disabled={!canGoPrev()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--glass-border)] disabled:opacity-30 hover:bg-white/5"
        >
          <ChevronLeft className="w-4 h-4" /> 上一步
        </button>
        <button
          onClick={nextStep}
          disabled={!canGoNext()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--neon-cyan)] text-black font-medium disabled:opacity-30 hover:opacity-90"
        >
          {currentStep === "export" ? "完成" : "下一步"} <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
