import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const socialInnovationTemplate: DisciplineTemplate = {
  id: "social-innovation",
  name: "社会创新实验室",
  description: "适用于教育科技、城市规划、可持续发展等方向",
  layout: {
    dimensions: { width: 12, height: 8, unit: "m" },
    zones: [
      { id: "zone-collab", name: "协作工作区", type: "workspace", position: { x: 0, y: 0 }, size: { width: 6, height: 5 }, color: "#f59e0b" },
      { id: "zone-research", name: "用户研究室", type: "meeting", position: { x: 7, y: 0 }, size: { width: 4, height: 4 }, color: "#8b5cf6" },
      { id: "zone-maker", name: "原型工坊", type: "maker", position: { x: 7, y: 5 }, size: { width: 5, height: 3 }, color: "#10b981" },
      { id: "zone-display", name: "展示区", type: "common", position: { x: 0, y: 6 }, size: { width: 3, height: 2 }, color: "#ec4899" },
    ],
  },
  recommendedEquipment: [
    { zoneType: "workspace", items: [
      { id: "whiteboard-wall", name: "白板墙", category: "furniture", priority: "essential", estimatedPrice: 5000 },
      { id: "projector", name: "投影设备", category: "electronics", priority: "essential", estimatedPrice: 10000 },
    ]},
    { zoneType: "maker", items: [
      { id: "3d-printer", name: "3D打印机", category: "tools", priority: "essential", estimatedPrice: 20000 },
    ]},
  ],
  meta: { minArea: 80, capacity: 15, budgetRange: [200000, 600000] },
};
