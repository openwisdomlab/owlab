import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const deepSpaceOceanTemplate: DisciplineTemplate = {
  id: "deep-space-ocean",
  name: "深空海地实验室",
  description: "适用于航天工程、海洋探测、极端环境研究等方向",
  layout: {
    dimensions: { width: 18, height: 10, unit: "m" },
    zones: [
      { id: "zone-simulation", name: "模拟环境区", type: "lab", position: { x: 0, y: 0 }, size: { width: 6, height: 6 }, color: "#3b82f6" },
      { id: "zone-datacenter", name: "数据中心", type: "compute", position: { x: 7, y: 0 }, size: { width: 5, height: 5 }, color: "#22d3ee" },
      { id: "zone-storage", name: "样品存储区", type: "storage", position: { x: 13, y: 0 }, size: { width: 4, height: 4 }, color: "#6366f1" },
      { id: "zone-analysis", name: "分析工作区", type: "workspace", position: { x: 0, y: 7 }, size: { width: 6, height: 3 }, color: "#8b5cf6" },
      { id: "zone-collab", name: "协作区", type: "meeting", position: { x: 13, y: 5 }, size: { width: 4, height: 4 }, color: "#10b981" },
    ],
  },
  recommendedEquipment: [
    { zoneType: "lab", items: [
      { id: "env-chamber", name: "环境模拟舱", category: "tools", priority: "essential", estimatedPrice: 200000 },
    ]},
    { zoneType: "compute", items: [
      { id: "hpc-cluster", name: "高性能计算集群", category: "compute", priority: "essential", estimatedPrice: 300000 },
    ]},
    { zoneType: "storage", items: [
      { id: "cryo-storage", name: "冷冻存储设备", category: "utilities", priority: "essential", estimatedPrice: 50000 },
    ]},
  ],
  meta: { minArea: 150, capacity: 8, budgetRange: [800000, 2000000] },
};
