/**
 * Layer Management Utilities
 * Provides layer-based organization for floor plan elements
 */

export type LayerType = "zones" | "equipment" | "annotations" | "measurements" | "guides";

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0-100
  order: number; // Lower = rendered first (bottom)
  color?: string; // Optional color identifier
}

export interface LayerItem {
  id: string;
  layerId: string;
  type: "zone" | "equipment" | "annotation" | "measurement" | "guide";
  data: any;
}

/**
 * Default layer configuration
 */
export const DEFAULT_LAYERS: Omit<Layer, "id">[] = [
  {
    name: "Guides & Grid",
    type: "guides",
    visible: true,
    locked: false,
    opacity: 30,
    order: 0,
    color: "#6b7280",
  },
  {
    name: "Zones",
    type: "zones",
    visible: true,
    locked: false,
    opacity: 100,
    order: 1,
    color: "#22d3ee",
  },
  {
    name: "Equipment",
    type: "equipment",
    visible: true,
    locked: false,
    opacity: 100,
    order: 2,
    color: "#8b5cf6",
  },
  {
    name: "Annotations",
    type: "annotations",
    visible: true,
    locked: false,
    opacity: 100,
    order: 3,
    color: "#f59e0b",
  },
  {
    name: "Measurements",
    type: "measurements",
    visible: true,
    locked: false,
    opacity: 100,
    order: 4,
    color: "#10b981",
  },
];

/**
 * Create default layers with unique IDs
 */
export function createDefaultLayers(): Layer[] {
  return DEFAULT_LAYERS.map((layer, index) => ({
    ...layer,
    id: `layer-${layer.type}-${Date.now()}-${index}`,
  }));
}

/**
 * Toggle layer visibility
 */
export function toggleLayerVisibility(layers: Layer[], layerId: string): Layer[] {
  return layers.map((layer) =>
    layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
  );
}

/**
 * Toggle layer lock
 */
export function toggleLayerLock(layers: Layer[], layerId: string): Layer[] {
  return layers.map((layer) =>
    layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
  );
}

/**
 * Set layer opacity
 */
export function setLayerOpacity(
  layers: Layer[],
  layerId: string,
  opacity: number
): Layer[] {
  // Clamp opacity to 0-100
  const clampedOpacity = Math.max(0, Math.min(100, opacity));

  return layers.map((layer) =>
    layer.id === layerId ? { ...layer, opacity: clampedOpacity } : layer
  );
}

/**
 * Reorder layers
 */
export function reorderLayers(
  layers: Layer[],
  sourceIndex: number,
  destinationIndex: number
): Layer[] {
  const result = [...layers];
  const [removed] = result.splice(sourceIndex, 1);
  result.splice(destinationIndex, 0, removed);

  // Update order values
  return result.map((layer, index) => ({
    ...layer,
    order: index,
  }));
}

/**
 * Get layer by ID
 */
export function getLayerById(layers: Layer[], layerId: string): Layer | undefined {
  return layers.find((layer) => layer.id === layerId);
}

/**
 * Get layer by type
 */
export function getLayerByType(layers: Layer[], type: LayerType): Layer | undefined {
  return layers.find((layer) => layer.type === type);
}

/**
 * Check if a layer is visible and unlocked
 */
export function isLayerEditable(layer: Layer): boolean {
  return layer.visible && !layer.locked;
}

/**
 * Check if an item should be visible based on its layer
 */
export function isItemVisible(layers: Layer[], layerId: string): boolean {
  const layer = getLayerById(layers, layerId);
  return layer ? layer.visible : true;
}

/**
 * Check if an item is editable based on its layer
 */
export function isItemEditable(layers: Layer[], layerId: string): boolean {
  const layer = getLayerById(layers, layerId);
  return layer ? isLayerEditable(layer) : true;
}

/**
 * Get opacity for an item based on its layer
 */
export function getItemOpacity(layers: Layer[], layerId: string): number {
  const layer = getLayerById(layers, layerId);
  return layer ? layer.opacity / 100 : 1;
}

/**
 * Filter items by layer visibility
 */
export function filterVisibleItems<T extends { layerId?: string }>(
  items: T[],
  layers: Layer[]
): T[] {
  return items.filter((item) => {
    if (!item.layerId) return true;
    return isItemVisible(layers, item.layerId);
  });
}

/**
 * Filter items by layer editability
 */
export function filterEditableItems<T extends { layerId?: string }>(
  items: T[],
  layers: Layer[]
): T[] {
  return items.filter((item) => {
    if (!item.layerId) return true;
    return isItemEditable(layers, item.layerId);
  });
}

/**
 * Sort layers by order (for rendering)
 */
export function sortLayersByOrder(layers: Layer[]): Layer[] {
  return [...layers].sort((a, b) => a.order - b.order);
}

/**
 * Get layers sorted for rendering (bottom to top)
 */
export function getLayersForRendering(layers: Layer[]): Layer[] {
  return sortLayersByOrder(layers);
}

/**
 * Create a new layer
 */
export function createLayer(
  name: string,
  type: LayerType,
  options: Partial<Omit<Layer, "id" | "name" | "type">> = {}
): Layer {
  return {
    id: `layer-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    type,
    visible: options.visible ?? true,
    locked: options.locked ?? false,
    opacity: options.opacity ?? 100,
    order: options.order ?? 0,
    color: options.color,
  };
}

/**
 * Delete a layer
 */
export function deleteLayer(layers: Layer[], layerId: string): Layer[] {
  return layers.filter((layer) => layer.id !== layerId);
}

/**
 * Rename a layer
 */
export function renameLayer(layers: Layer[], layerId: string, newName: string): Layer[] {
  return layers.map((layer) =>
    layer.id === layerId ? { ...layer, name: newName } : layer
  );
}

/**
 * Duplicate a layer
 */
export function duplicateLayer(layers: Layer[], layerId: string): Layer[] {
  const layer = getLayerById(layers, layerId);
  if (!layer) return layers;

  const newLayer = createLayer(`${layer.name} Copy`, layer.type, {
    visible: layer.visible,
    locked: layer.locked,
    opacity: layer.opacity,
    order: layer.order + 1,
    color: layer.color,
  });

  // Insert after the original layer
  const index = layers.findIndex((l) => l.id === layerId);
  const result = [...layers];
  result.splice(index + 1, 0, newLayer);

  // Update order values
  return result.map((layer, i) => ({
    ...layer,
    order: i,
  }));
}

/**
 * Merge two layers
 */
export function mergeLayers(
  layers: Layer[],
  sourceLayerId: string,
  targetLayerId: string
): Layer[] {
  return deleteLayer(layers, sourceLayerId);
}

/**
 * Get layer statistics
 */
export function getLayerStats(layers: Layer[]): {
  total: number;
  visible: number;
  locked: number;
  unlocked: number;
} {
  return {
    total: layers.length,
    visible: layers.filter((l) => l.visible).length,
    locked: layers.filter((l) => l.locked).length,
    unlocked: layers.filter((l) => !l.locked).length,
  };
}

/**
 * Validate layer structure
 */
export function validateLayers(layers: Layer[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for duplicate IDs
  const ids = layers.map((l) => l.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push("Duplicate layer IDs found");
  }

  // Check for duplicate orders
  const orders = layers.map((l) => l.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    errors.push("Duplicate layer orders found");
  }

  // Check opacity range
  layers.forEach((layer) => {
    if (layer.opacity < 0 || layer.opacity > 100) {
      errors.push(`Layer "${layer.name}" has invalid opacity: ${layer.opacity}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
