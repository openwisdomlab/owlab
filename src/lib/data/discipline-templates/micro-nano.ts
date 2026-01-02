import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const microNanoTemplate: DisciplineTemplate = {
  id: "micro-nano",
  name: "微纳界面实验室",
  description: "适用于纳米材料、量子计算、精密制造等方向",
  layout: {
    dimensions: { width: 14, height: 10, unit: "m" },
    zones: [
      { id: "zone-cleanroom", name: "洁净室", type: "cleanroom", position: { x: 0, y: 0 }, size: { width: 5, height: 5 }, color: "#06b6d4" },
      { id: "zone-fabrication", name: "精密加工区", type: "lab", position: { x: 6, y: 0 }, size: { width: 5, height: 4 }, color: "#8b5cf6" },
      { id: "zone-analysis", name: "检测分析区", type: "lab", position: { x: 6, y: 5 }, size: { width: 4, height: 4 }, color: "#22d3ee" },
      { id: "zone-compute", name: "数据处理区", type: "compute", position: { x: 11, y: 0 }, size: { width: 3, height: 3 }, color: "#f59e0b" },
      { id: "zone-prep", name: "准备区", type: "workspace", position: { x: 0, y: 6 }, size: { width: 4, height: 3 }, color: "#10b981" },
    ],
  },
  recommendedEquipment: [
    { zoneType: "cleanroom", items: [
      { id: "glovebox", name: "手套箱", category: "safety", priority: "essential", estimatedPrice: 150000 },
    ]},
    { zoneType: "lab", items: [
      { id: "sem", name: "电子显微镜", category: "tools", priority: "essential", estimatedPrice: 500000 },
      { id: "precision-balance", name: "精密天平", category: "tools", priority: "essential", estimatedPrice: 30000 },
    ]},
  ],
  meta: { minArea: 100, capacity: 8, budgetRange: [1000000, 3000000] },
};
