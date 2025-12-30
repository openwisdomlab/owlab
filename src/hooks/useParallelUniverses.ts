// src/hooks/useParallelUniverses.ts
import { useState, useCallback } from "react";
import type { LayoutData } from "@/lib/ai/agents/layout-agent";
import type { UniverseVariant } from "@/lib/ai/agents/parallel-universe-agent";
import { useMultiverseStore } from "@/stores/multiverse-store";

interface UseParallelUniversesReturn {
  // 状态
  isGenerating: boolean;
  isFusing: boolean;
  error: string | null;
  variants: UniverseVariant[];

  // 操作
  generateUniverses: (decisionPoint: string, constraints?: string) => Promise<void>;
  fuseSelected: (strategy: "best-of-each" | "compromise" | "innovative") => Promise<void>;
  applyVariant: (variant: UniverseVariant) => void;
  clearVariants: () => void;
}

export function useParallelUniverses(): UseParallelUniversesReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFusing, setIsFusing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variants, setVariants] = useState<UniverseVariant[]>([]);

  const {
    getActiveUniverse,
    createUniverse,
    comparisonIds,
    getUniverse,
  } = useMultiverseStore();

  const generateUniverses = useCallback(
    async (decisionPoint: string, constraints?: string) => {
      const activeUniverse = getActiveUniverse();
      if (!activeUniverse) {
        setError("No active universe");
        return;
      }

      setIsGenerating(true);
      setError(null);

      const controller = new AbortController();

      try {
        const response = await fetch("/api/ai/parallel-universes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "generate",
            currentLayout: activeUniverse.layout,
            decisionPoint,
            constraints,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        setVariants(data.universes);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was cancelled, don't update state
        }
        setError(err instanceof Error ? err.message : "Failed to generate");
      } finally {
        setIsGenerating(false);
      }
    },
    [getActiveUniverse]
  );

  const fuseSelected = useCallback(
    async (strategy: "best-of-each" | "compromise" | "innovative") => {
      if (comparisonIds.length < 2) {
        setError("Select at least 2 universes to fuse");
        return;
      }

      setIsFusing(true);
      setError(null);

      const controller = new AbortController();

      try {
        const layouts = comparisonIds
          .map((id) => getUniverse(id)?.layout)
          .filter(Boolean) as LayoutData[];

        const response = await fetch("/api/ai/parallel-universes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "fuse",
            universes: layouts,
            fusionStrategy: strategy,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        createUniverse(data.layout, `融合宇宙 (${strategy})`);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // Request was cancelled, don't update state
        }
        setError(err instanceof Error ? err.message : "Failed to fuse");
      } finally {
        setIsFusing(false);
      }
    },
    [comparisonIds, getUniverse, createUniverse]
  );

  const applyVariant = useCallback(
    (variant: UniverseVariant) => {
      const layout: LayoutData = {
        name: variant.name,
        description: variant.description,
        dimensions: variant.layout.dimensions,
        zones: variant.layout.zones.map((z) => ({
          ...z,
          equipment: [],
          requirements: [],
        })),
      };
      createUniverse(layout, variant.name);
    },
    [createUniverse]
  );

  const clearVariants = useCallback(() => {
    setVariants([]);
    setError(null);
  }, []);

  return {
    isGenerating,
    isFusing,
    error,
    variants,
    generateUniverses,
    fuseSelected,
    applyVariant,
    clearVariants,
  };
}
