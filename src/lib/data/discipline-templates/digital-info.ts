import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const digitalInfoTemplate: DisciplineTemplate = {
  id: "digital-info",
  name: "数智信息实验室",
  description: "适用于人工智能、大数据、物联网等方向",
  layout: {
    dimensions: { width: 12, height: 8, unit: "m" },
    zones: [
      { id: "zone-server", name: "GPU服务器区", type: "compute", position: { x: 0, y: 0 }, size: { width: 4, height: 4 }, color: "#22d3ee" },
      { id: "zone-dev", name: "开发工位区", type: "workspace", position: { x: 5, y: 0 }, size: { width: 6, height: 5 }, color: "#8b5cf6" },
      { id: "zone-test", name: "测试体验区", type: "lab", position: { x: 0, y: 5 }, size: { width: 4, height: 3 }, color: "#10b981" },
      { id: "zone-meeting", name: "协作会议区", type: "meeting", position: { x: 5, y: 6 }, size: { width: 4, height: 2 }, color: "#f59e0b" },
    ],
  },
  recommendedEquipment: [
    { zoneType: "compute", items: [
      { id: "gpu-server", name: "AI服务器/GPU集群", category: "compute", priority: "essential", estimatedPrice: 200000 },
      { id: "ups", name: "UPS电源", category: "utilities", priority: "essential", estimatedPrice: 30000 },
    ]},
    { zoneType: "workspace", items: [
      { id: "dev-workstation", name: "开发工作站", category: "compute", priority: "essential", estimatedPrice: 15000 },
    ]},
    { zoneType: "lab", items: [
      { id: "vr-headset", name: "VR/AR设备", category: "electronics", priority: "recommended", estimatedPrice: 30000 },
    ]},
  ],
  meta: { minArea: 80, capacity: 12, budgetRange: [300000, 1000000] },
};
