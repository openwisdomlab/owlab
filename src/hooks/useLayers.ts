/**
 * Layer Management Hook
 * Manages layer state and operations for floor plan canvas
 */

import { useState, useCallback, useMemo } from "react";
import {
  createDefaultLayers,
  toggleLayerVisibility,
  toggleLayerLock,
  setLayerOpacity,
  reorderLayers,
  createLayer,
  deleteLayer,
  renameLayer,
  duplicateLayer,
  getLayerById,
  getLayerByType,
  isLayerEditable,
  isItemVisible,
  isItemEditable,
  getItemOpacity,
  filterVisibleItems,
  filterEditableItems,
  getLayersForRendering,
  getLayerStats,
  type Layer,
  type LayerType,
} from "@/lib/utils/layers";

export interface UseLayersOptions {
  initialLayers?: Layer[];
  onLayerChange?: (layers: Layer[]) => void;
}

export function useLayers(options: UseLayersOptions = {}) {
  const { initialLayers, onLayerChange } = options;

  const [layers, setLayers] = useState<Layer[]>(
    () => initialLayers || createDefaultLayers()
  );

  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  /**
   * Update layers and notify callback
   */
  const updateLayers = useCallback(
    (newLayers: Layer[] | ((prev: Layer[]) => Layer[])) => {
      setLayers((prev) => {
        const updated = typeof newLayers === "function" ? newLayers(prev) : newLayers;
        onLayerChange?.(updated);
        return updated;
      });
    },
    [onLayerChange]
  );

  /**
   * Toggle layer visibility
   */
  const toggleVisibility = useCallback(
    (layerId: string) => {
      updateLayers((prev) => toggleLayerVisibility(prev, layerId));
    },
    [updateLayers]
  );

  /**
   * Toggle layer lock
   */
  const toggleLock = useCallback(
    (layerId: string) => {
      updateLayers((prev) => toggleLayerLock(prev, layerId));
    },
    [updateLayers]
  );

  /**
   * Set layer opacity
   */
  const changeOpacity = useCallback(
    (layerId: string, opacity: number) => {
      updateLayers((prev) => setLayerOpacity(prev, layerId, opacity));
    },
    [updateLayers]
  );

  /**
   * Reorder layers
   */
  const reorder = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      updateLayers((prev) => reorderLayers(prev, sourceIndex, destinationIndex));
    },
    [updateLayers]
  );

  /**
   * Add new layer
   */
  const addLayer = useCallback(
    (name: string, type: LayerType, options?: Partial<Omit<Layer, "id" | "name" | "type">>) => {
      updateLayers((prev) => {
        const newLayer = createLayer(name, type, {
          ...options,
          order: prev.length,
        });
        return [...prev, newLayer];
      });
    },
    [updateLayers]
  );

  /**
   * Remove layer
   */
  const removeLayer = useCallback(
    (layerId: string) => {
      updateLayers((prev) => deleteLayer(prev, layerId));
    },
    [updateLayers]
  );

  /**
   * Rename layer
   */
  const rename = useCallback(
    (layerId: string, newName: string) => {
      updateLayers((prev) => renameLayer(prev, layerId, newName));
    },
    [updateLayers]
  );

  /**
   * Duplicate layer
   */
  const duplicate = useCallback(
    (layerId: string) => {
      updateLayers((prev) => duplicateLayer(prev, layerId));
    },
    [updateLayers]
  );

  /**
   * Select/activate a layer
   */
  const selectLayer = useCallback((layerId: string | null) => {
    setActiveLayerId(layerId);
  }, []);

  /**
   * Show all layers
   */
  const showAll = useCallback(() => {
    updateLayers((prev) =>
      prev.map((layer) => ({ ...layer, visible: true }))
    );
  }, [updateLayers]);

  /**
   * Hide all layers
   */
  const hideAll = useCallback(() => {
    updateLayers((prev) =>
      prev.map((layer) => ({ ...layer, visible: false }))
    );
  }, [updateLayers]);

  /**
   * Lock all layers
   */
  const lockAll = useCallback(() => {
    updateLayers((prev) =>
      prev.map((layer) => ({ ...layer, locked: true }))
    );
  }, [updateLayers]);

  /**
   * Unlock all layers
   */
  const unlockAll = useCallback(() => {
    updateLayers((prev) =>
      prev.map((layer) => ({ ...layer, locked: false }))
    );
  }, [updateLayers]);

  /**
   * Reset to default layers
   */
  const resetLayers = useCallback(() => {
    updateLayers(createDefaultLayers());
    setActiveLayerId(null);
  }, [updateLayers]);

  /**
   * Get layer by ID
   */
  const getLayer = useCallback(
    (layerId: string) => {
      return getLayerById(layers, layerId);
    },
    [layers]
  );

  /**
   * Get layer by type
   */
  const getLayerForType = useCallback(
    (type: LayerType) => {
      return getLayerByType(layers, type);
    },
    [layers]
  );

  /**
   * Check if layer is editable
   */
  const checkLayerEditable = useCallback(
    (layerId: string) => {
      const layer = getLayerById(layers, layerId);
      return layer ? isLayerEditable(layer) : false;
    },
    [layers]
  );

  /**
   * Check if item is visible
   */
  const checkItemVisible = useCallback(
    (layerId: string) => {
      return isItemVisible(layers, layerId);
    },
    [layers]
  );

  /**
   * Check if item is editable
   */
  const checkItemEditable = useCallback(
    (layerId: string) => {
      return isItemEditable(layers, layerId);
    },
    [layers]
  );

  /**
   * Get item opacity
   */
  const getOpacity = useCallback(
    (layerId: string) => {
      return getItemOpacity(layers, layerId);
    },
    [layers]
  );

  /**
   * Filter items by visibility
   */
  const filterVisible = useCallback(
    <T extends { layerId?: string }>(items: T[]) => {
      return filterVisibleItems(items, layers);
    },
    [layers]
  );

  /**
   * Filter items by editability
   */
  const filterEditable = useCallback(
    <T extends { layerId?: string }>(items: T[]) => {
      return filterEditableItems(items, layers);
    },
    [layers]
  );

  /**
   * Get layers sorted for rendering
   */
  const renderLayers = useMemo(() => {
    return getLayersForRendering(layers);
  }, [layers]);

  /**
   * Get active layer
   */
  const activeLayer = useMemo(() => {
    return activeLayerId ? getLayerById(layers, activeLayerId) : null;
  }, [layers, activeLayerId]);

  /**
   * Get layer statistics
   */
  const stats = useMemo(() => {
    return getLayerStats(layers);
  }, [layers]);

  /**
   * Get visible layers
   */
  const visibleLayers = useMemo(() => {
    return layers.filter((layer) => layer.visible);
  }, [layers]);

  /**
   * Get locked layers
   */
  const lockedLayers = useMemo(() => {
    return layers.filter((layer) => layer.locked);
  }, [layers]);

  /**
   * Get unlocked layers
   */
  const unlockedLayers = useMemo(() => {
    return layers.filter((layer) => !layer.locked);
  }, [layers]);

  return {
    // State
    layers,
    activeLayerId,
    activeLayer,
    renderLayers,
    stats,
    visibleLayers,
    lockedLayers,
    unlockedLayers,

    // Actions
    toggleVisibility,
    toggleLock,
    changeOpacity,
    reorder,
    addLayer,
    removeLayer,
    rename,
    duplicate,
    selectLayer,
    showAll,
    hideAll,
    lockAll,
    unlockAll,
    resetLayers,

    // Utilities
    getLayer,
    getLayerForType,
    checkLayerEditable,
    checkItemVisible,
    checkItemEditable,
    getOpacity,
    filterVisible,
    filterEditable,
  };
}
