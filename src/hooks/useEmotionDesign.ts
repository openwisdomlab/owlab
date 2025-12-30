// src/hooks/useEmotionDesign.ts
import { useState, useCallback } from "react";
import type {
  EmotionScript,
  EmotionToSpaceResult,
} from "@/lib/schemas/emotion-design";

interface UseEmotionDesignReturn {
  // 状态
  isGenerating: boolean;
  error: string | null;
  result: EmotionToSpaceResult | null;

  // 操作
  generateDesign: (
    emotionScript: EmotionScript,
    constraints?: {
      maxArea?: number;
      maxBudget?: number;
    }
  ) => Promise<void>;
  clearResult: () => void;
}

export function useEmotionDesign(): UseEmotionDesignReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EmotionToSpaceResult | null>(null);

  const generateDesign = useCallback(
    async (
      emotionScript: EmotionScript,
      constraints?: {
        maxArea?: number;
        maxBudget?: number;
      }
    ) => {
      if (!emotionScript.nodes || emotionScript.nodes.length === 0) {
        setError("情绪剧本至少需要一个节点");
        return;
      }

      setIsGenerating(true);
      setError(null);

      const controller = new AbortController();

      try {
        const response = await fetch("/api/ai/emotion-design", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emotionScript,
            constraints,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        setResult(data.result);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was cancelled, don't update state
        }
        setError(err instanceof Error ? err.message : "生成设计失败");
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    error,
    result,
    generateDesign,
    clearResult,
  };
}
