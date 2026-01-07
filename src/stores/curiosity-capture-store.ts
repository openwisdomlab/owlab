import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScienceQuestion } from "@/data/science-questions";

export interface CapturedQuestion {
  id: string;
  question: ScienceQuestion;
  capturedAt: number;
}

interface CuriosityCaptureState {
  capturedQuestions: CapturedQuestion[];
  // 最近捕获的问题 ID（用于高亮动画）
  recentlyCapturedId: string | null;
  // 是否首次捕获（用于特殊庆祝效果）
  isFirstCapture: boolean;

  // Actions
  captureQuestion: (question: ScienceQuestion) => void;
  removeQuestion: (id: string) => void;
  clearRecentCapture: () => void;
  clearAll: () => void;
}

export const useCuriosityCaptureStore = create<CuriosityCaptureState>()(
  persist(
    (set, get) => ({
      capturedQuestions: [],
      recentlyCapturedId: null,
      isFirstCapture: true,

      captureQuestion: (question) => {
        const newCapture: CapturedQuestion = {
          id: `${question.id}-${Date.now()}`,
          question,
          capturedAt: Date.now(),
        };

        set((state) => ({
          capturedQuestions: [newCapture, ...state.capturedQuestions],
          recentlyCapturedId: newCapture.id,
          isFirstCapture: false,
        }));

        // 3秒后清除高亮状态
        setTimeout(() => {
          if (get().recentlyCapturedId === newCapture.id) {
            set({ recentlyCapturedId: null });
          }
        }, 3000);
      },

      removeQuestion: (id) => {
        set((state) => ({
          capturedQuestions: state.capturedQuestions.filter((q) => q.id !== id),
        }));
      },

      clearRecentCapture: () => {
        set({ recentlyCapturedId: null });
      },

      clearAll: () => {
        set({ capturedQuestions: [], recentlyCapturedId: null });
      },
    }),
    {
      name: "owl-curiosity-capture",
      partialize: (state) => ({
        capturedQuestions: state.capturedQuestions,
        isFirstCapture: state.isFirstCapture,
      }),
    }
  )
);
