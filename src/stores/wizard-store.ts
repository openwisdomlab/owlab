/**
 * Wizard Store — manages the 7-step lab design wizard flow.
 */
import { create } from "zustand";
import type { NeedsAssessment } from "@/lib/schemas/needs-assessment";
import { DEFAULT_NEEDS_ASSESSMENT } from "@/lib/schemas/needs-assessment";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { ValidationResult } from "@/lib/rules/rules-engine";
import type { OrchestrateProgress } from "@/lib/ai/agents/orchestrator-agent";

export type WizardStep =
  | "needs"      // 1. Needs assessment
  | "review"     // 2. Requirements review
  | "generate"   // 3. AI generation
  | "design"     // 4. Design review
  | "compare"    // 5. Multi-scheme comparison
  | "refine"     // 6. Refinement
  | "export";    // 7. Export

export const WIZARD_STEPS: WizardStep[] = [
  "needs", "review", "generate", "design", "compare", "refine", "export"
];

export const WIZARD_STEP_LABELS: Record<WizardStep, string> = {
  needs: "需求采集",
  review: "需求确认",
  generate: "AI 生成",
  design: "方案审查",
  compare: "方案对比",
  refine: "精修优化",
  export: "导出交付",
};

interface WizardState {
  // Current state
  isActive: boolean;
  currentStep: WizardStep;

  // Step 1: Needs assessment data
  needs: NeedsAssessment;

  // Step 3: Generation state
  isGenerating: boolean;
  generationProgress: OrchestrateProgress | null;

  // Step 4-6: Layout results
  layouts: LayoutData[];          // Multiple generated layouts
  activeLayoutIndex: number;
  validation: ValidationResult | null;

  // Transfer layout from wizard to editor
  transferLayout: LayoutData | null;

  // Navigation
  startWizard: () => void;
  exitWizard: (layout?: LayoutData) => void;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: () => boolean;
  canGoPrev: () => boolean;

  // Data setters
  updateNeeds: (partial: Partial<NeedsAssessment>) => void;
  setGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: OrchestrateProgress | null) => void;
  addLayout: (layout: LayoutData) => void;
  setActiveLayout: (index: number) => void;
  updateActiveLayout: (layout: LayoutData) => void;
  setValidation: (validation: ValidationResult | null) => void;

  // Transfer
  consumeTransferLayout: () => LayoutData | null;

  // Reset
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  isActive: false,
  currentStep: "needs",
  needs: { ...DEFAULT_NEEDS_ASSESSMENT },
  isGenerating: false,
  generationProgress: null,
  layouts: [],
  activeLayoutIndex: 0,
  validation: null,
  transferLayout: null,

  startWizard: () => set({ isActive: true, currentStep: "needs" }),
  exitWizard: (layout?: LayoutData) => {
    set({ isActive: false });
    if (layout) {
      set({ transferLayout: layout });
    }
  },

  goToStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const { currentStep } = get();
    const idx = WIZARD_STEPS.indexOf(currentStep);
    if (idx < WIZARD_STEPS.length - 1) {
      set({ currentStep: WIZARD_STEPS[idx + 1] });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    const idx = WIZARD_STEPS.indexOf(currentStep);
    if (idx > 0) {
      set({ currentStep: WIZARD_STEPS[idx - 1] });
    }
  },

  canGoNext: () => {
    const { currentStep, needs, layouts, isGenerating } = get();
    switch (currentStep) {
      case "needs": return needs.projectName.length > 0;
      case "review": return true;
      case "generate": return !isGenerating && layouts.length > 0;
      case "design": return layouts.length > 0;
      case "compare": return layouts.length > 0;
      case "refine": return layouts.length > 0;
      case "export": return false; // last step
      default: return false;
    }
  },

  canGoPrev: () => {
    const { currentStep } = get();
    return WIZARD_STEPS.indexOf(currentStep) > 0;
  },

  updateNeeds: (partial) => set((s) => ({
    needs: { ...s.needs, ...partial },
  })),

  setGenerating: (generating) => set({ isGenerating: generating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),

  addLayout: (layout) => set((s) => ({
    layouts: [...s.layouts, layout],
    activeLayoutIndex: s.layouts.length,
  })),

  setActiveLayout: (index) => set({ activeLayoutIndex: index }),

  updateActiveLayout: (layout) => set((s) => ({
    layouts: s.layouts.map((l, i) => i === s.activeLayoutIndex ? layout : l),
  })),

  setValidation: (validation) => set({ validation }),

  consumeTransferLayout: () => {
    const layout = get().transferLayout;
    if (layout) set({ transferLayout: null });
    return layout;
  },

  reset: () => set({
    isActive: false,
    currentStep: "needs",
    needs: { ...DEFAULT_NEEDS_ASSESSMENT },
    isGenerating: false,
    generationProgress: null,
    layouts: [],
    activeLayoutIndex: 0,
    validation: null,
    transferLayout: null,
  }),
}));
