import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScienceQuestion } from "@/data/science-questions";

// 收集问题数量上限（避免信息过载）
export const MAX_CAPTURED_QUESTIONS = 5;

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
  captureQuestion: (question: ScienceQuestion) => boolean; // 返回是否成功
  removeQuestion: (id: string) => void;
  clearRecentCapture: () => void;
  clearAll: () => void;
  canCapture: () => boolean;
}

export const useCuriosityCaptureStore = create<CuriosityCaptureState>()(
  persist(
    (set, get) => ({
      capturedQuestions: [],
      recentlyCapturedId: null,
      isFirstCapture: true,

      canCapture: () => {
        return get().capturedQuestions.length < MAX_CAPTURED_QUESTIONS;
      },

      captureQuestion: (question) => {
        // 检查是否达到上限
        if (get().capturedQuestions.length >= MAX_CAPTURED_QUESTIONS) {
          return false;
        }

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

        return true;
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
