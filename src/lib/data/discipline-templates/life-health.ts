import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const lifeHealthTemplate: DisciplineTemplate = {
  id: "life-health",
  name: "生命健康实验室",
  description: "适用于生物医学、基因工程、药物研发等方向的综合实验室",
  layout: {
    dimensions: { width: 15, height: 10, unit: "m" },
    zones: [
      { id: "zone-wet-lab", name: "湿实验区", type: "lab", position: { x: 0, y: 0 }, size: { width: 6, height: 5 }, color: "#22d3ee" },
      { id: "zone-cell-culture", name: "细胞培养室", type: "lab", position: { x: 7, y: 0 }, size: { width: 4, height: 4 }, color: "#10b981" },
      { id: "zone-sample", name: "样品处理区", type: "workspace", position: { x: 12, y: 0 }, size: { width: 3, height: 4 }, color: "#8b5cf6" },
      { id: "zone-data", name: "数据分析区", type: "compute", position: { x: 7, y: 5 }, size: { width: 4, height: 3 }, color: "#f59e0b" },
      { id: "zone-meeting", name: "会议讨论区", type: "meeting", position: { x: 12, y: 5 }, size: { width: 3, height: 3 }, color: "#ec4899" },
    ],
  },
  recommendedEquipment: [
    { zoneType: "lab", items: [
      { id: "biosafety-cabinet", name: "生物安全柜", category: "safety", priority: "essential", estimatedPrice: 80000 },
      { id: "pcr-machine", name: "PCR仪", category: "tools", priority: "essential", estimatedPrice: 50000 },
      { id: "centrifuge", name: "离心机", category: "tools", priority: "essential", estimatedPrice: 20000 },
      { id: "microscope", name: "显微镜", category: "tools", priority: "recommended", estimatedPrice: 30000 },
    ]},
    { zoneType: "compute", items: [
      { id: "workstation", name: "分析工作站", category: "compute", priority: "essential", estimatedPrice: 15000 },
    ]},
  ],
  meta: { minArea: 120, capacity: 10, budgetRange: [500000, 1500000] },
};
