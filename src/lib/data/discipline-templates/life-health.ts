import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const lifeHealthTemplate: DisciplineTemplate = {
  id: "life-health",
  name: "生命健康实验室",
  description: "适用于生物医学、基因工程、药物研发等方向的综合实验室，配备完善的生物安全设施",
  layout: {
    dimensions: { width: 18, height: 12, unit: "m" },
    zones: [
      // 核心实验区域 - 湿实验区
      {
        id: "zone-wet-lab",
        name: "湿实验区",
        type: "lab",
        position: { x: 0, y: 0 },
        size: { width: 6, height: 5 },
        color: "#22d3ee",
      },
      // PCR专用区域 - 与细胞培养区物理隔离以防止污染
      {
        id: "zone-pcr",
        name: "PCR扩增区",
        type: "pcr-isolation",
        position: { x: 7, y: 0 },
        size: { width: 4, height: 4 },
        color: "#f97316",
      },
      // 细胞培养室 - 需要独立空调和正压环境
      {
        id: "zone-cell-culture",
        name: "细胞培养室",
        type: "biosafety",
        position: { x: 12, y: 0 },
        size: { width: 5, height: 5 },
        color: "#10b981",
      },
      // 样品处理区
      {
        id: "zone-sample",
        name: "样品处理区",
        type: "workspace",
        position: { x: 0, y: 6 },
        size: { width: 4, height: 4 },
        color: "#8b5cf6",
      },
      // 试剂储存区
      {
        id: "zone-reagent",
        name: "试剂储存区",
        type: "storage",
        position: { x: 5, y: 6 },
        size: { width: 3, height: 3 },
        color: "#6366f1",
      },
      // 数据分析区
      {
        id: "zone-data",
        name: "数据分析区",
        type: "compute",
        position: { x: 9, y: 5 },
        size: { width: 4, height: 4 },
        color: "#f59e0b",
      },
      // 会议讨论区
      {
        id: "zone-meeting",
        name: "会议讨论区",
        type: "meeting",
        position: { x: 14, y: 6 },
        size: { width: 3, height: 4 },
        color: "#ec4899",
      },
      // 清洁/消毒区 - 生物安全要求
      {
        id: "zone-decontamination",
        name: "清洁消毒区",
        type: "safety",
        position: { x: 5, y: 10 },
        size: { width: 3, height: 2 },
        color: "#ef4444",
      },
    ],
  },
  recommendedEquipment: [
    // 湿实验区设备
    {
      zoneType: "lab",
      items: [
        {
          id: "biosafety-cabinet-2",
          name: "II级生物安全柜",
          category: "safety",
          priority: "essential",
          estimatedPrice: 80000,
        },
        {
          id: "fume-hood",
          name: "通风橱",
          category: "safety",
          priority: "essential",
          estimatedPrice: 45000,
        },
        {
          id: "centrifuge-high",
          name: "高速离心机",
          category: "tools",
          priority: "essential",
          estimatedPrice: 35000,
        },
        {
          id: "centrifuge-low",
          name: "低速离心机",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 15000,
        },
        {
          id: "microscope-inverted",
          name: "倒置显微镜",
          category: "tools",
          priority: "essential",
          estimatedPrice: 50000,
        },
        {
          id: "microscope-fluorescence",
          name: "荧光显微镜",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 120000,
        },
        {
          id: "water-bath",
          name: "恒温水浴锅",
          category: "tools",
          priority: "essential",
          estimatedPrice: 5000,
        },
        {
          id: "vortex-mixer",
          name: "漩涡混合器",
          category: "tools",
          priority: "essential",
          estimatedPrice: 2000,
        },
        {
          id: "analytical-balance",
          name: "分析天平",
          category: "tools",
          priority: "essential",
          estimatedPrice: 15000,
        },
        {
          id: "ph-meter",
          name: "pH计",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 3000,
        },
        {
          id: "emergency-shower",
          name: "紧急冲淋装置",
          category: "safety",
          priority: "essential",
          estimatedPrice: 8000,
        },
        {
          id: "eyewash-station",
          name: "洗眼器",
          category: "safety",
          priority: "essential",
          estimatedPrice: 3000,
        },
      ],
    },
    // PCR隔离区设备 - 独立区域防止交叉污染
    {
      zoneType: "pcr-isolation",
      items: [
        {
          id: "pcr-machine",
          name: "PCR仪",
          category: "tools",
          priority: "essential",
          estimatedPrice: 50000,
        },
        {
          id: "qpcr-machine",
          name: "实时荧光定量PCR仪",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 180000,
        },
        {
          id: "pcr-workstation",
          name: "PCR专用超净工作台",
          category: "safety",
          priority: "essential",
          estimatedPrice: 25000,
        },
        {
          id: "nucleic-acid-extractor",
          name: "核酸提取仪",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 60000,
        },
        {
          id: "gel-electrophoresis",
          name: "凝胶电泳仪",
          category: "tools",
          priority: "essential",
          estimatedPrice: 15000,
        },
        {
          id: "gel-imaging",
          name: "凝胶成像系统",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 45000,
        },
        {
          id: "uv-sterilizer-pcr",
          name: "紫外消毒灯",
          category: "safety",
          priority: "essential",
          estimatedPrice: 2000,
        },
        {
          id: "mini-centrifuge",
          name: "微型离心机",
          category: "tools",
          priority: "essential",
          estimatedPrice: 3000,
        },
      ],
    },
    // 生物安全区/细胞培养室设备
    {
      zoneType: "biosafety",
      items: [
        {
          id: "biosafety-cabinet-cell",
          name: "II级B2生物安全柜",
          category: "safety",
          priority: "essential",
          estimatedPrice: 120000,
        },
        {
          id: "co2-incubator",
          name: "CO2培养箱",
          category: "tools",
          priority: "essential",
          estimatedPrice: 60000,
        },
        {
          id: "liquid-nitrogen-tank",
          name: "液氮罐",
          category: "storage",
          priority: "essential",
          estimatedPrice: 25000,
        },
        {
          id: "cell-counter",
          name: "细胞计数仪",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 30000,
        },
        {
          id: "autoclave",
          name: "高压灭菌锅",
          category: "safety",
          priority: "essential",
          estimatedPrice: 35000,
        },
        {
          id: "water-purification",
          name: "超纯水系统",
          category: "utilities",
          priority: "essential",
          estimatedPrice: 40000,
        },
        {
          id: "hepa-filter",
          name: "HEPA空气过滤系统",
          category: "safety",
          priority: "essential",
          estimatedPrice: 50000,
        },
        {
          id: "cryogenic-freezer",
          name: "-80°C超低温冰箱",
          category: "storage",
          priority: "essential",
          estimatedPrice: 80000,
        },
      ],
    },
    // 样品处理区设备
    {
      zoneType: "workspace",
      items: [
        {
          id: "laminar-flow",
          name: "超净工作台",
          category: "safety",
          priority: "essential",
          estimatedPrice: 20000,
        },
        {
          id: "pipette-set",
          name: "移液器套装",
          category: "tools",
          priority: "essential",
          estimatedPrice: 8000,
        },
        {
          id: "spectrophotometer",
          name: "分光光度计",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 25000,
        },
        {
          id: "microplate-reader",
          name: "酶标仪",
          category: "tools",
          priority: "recommended",
          estimatedPrice: 80000,
        },
        {
          id: "homogenizer",
          name: "匀浆机",
          category: "tools",
          priority: "optional",
          estimatedPrice: 15000,
        },
      ],
    },
    // 试剂储存区设备
    {
      zoneType: "storage",
      items: [
        {
          id: "fridge-4c",
          name: "4°C冷藏冰箱",
          category: "storage",
          priority: "essential",
          estimatedPrice: 15000,
        },
        {
          id: "freezer-20c",
          name: "-20°C冷冻冰箱",
          category: "storage",
          priority: "essential",
          estimatedPrice: 20000,
        },
        {
          id: "chemical-cabinet",
          name: "化学品安全柜",
          category: "safety",
          priority: "essential",
          estimatedPrice: 8000,
        },
        {
          id: "flammable-cabinet",
          name: "易燃品存储柜",
          category: "safety",
          priority: "essential",
          estimatedPrice: 6000,
        },
        {
          id: "desiccator",
          name: "干燥箱",
          category: "storage",
          priority: "recommended",
          estimatedPrice: 5000,
        },
      ],
    },
    // 数据分析区设备
    {
      zoneType: "compute",
      items: [
        {
          id: "workstation",
          name: "生物信息分析工作站",
          category: "compute",
          priority: "essential",
          estimatedPrice: 25000,
        },
        {
          id: "large-monitor",
          name: "大屏显示器",
          category: "compute",
          priority: "recommended",
          estimatedPrice: 5000,
        },
        {
          id: "network-storage",
          name: "网络存储设备",
          category: "compute",
          priority: "recommended",
          estimatedPrice: 15000,
        },
      ],
    },
    // 清洁消毒区设备
    {
      zoneType: "safety",
      items: [
        {
          id: "biohazard-waste",
          name: "生物危害废弃物容器",
          category: "safety",
          priority: "essential",
          estimatedPrice: 3000,
        },
        {
          id: "sharps-container",
          name: "利器收集盒",
          category: "safety",
          priority: "essential",
          estimatedPrice: 500,
        },
        {
          id: "autoclave-small",
          name: "台式高压灭菌器",
          category: "safety",
          priority: "essential",
          estimatedPrice: 15000,
        },
        {
          id: "uv-cabinet",
          name: "紫外消毒柜",
          category: "safety",
          priority: "recommended",
          estimatedPrice: 8000,
        },
        {
          id: "hand-sanitizer",
          name: "自动感应消毒装置",
          category: "safety",
          priority: "essential",
          estimatedPrice: 1500,
        },
      ],
    },
    // 会议区设备
    {
      zoneType: "meeting",
      items: [
        {
          id: "display-screen",
          name: "会议显示屏",
          category: "compute",
          priority: "recommended",
          estimatedPrice: 10000,
        },
        {
          id: "whiteboard",
          name: "白板",
          category: "tools",
          priority: "optional",
          estimatedPrice: 1500,
        },
      ],
    },
  ],
  meta: {
    minArea: 150,
    capacity: 12,
    budgetRange: [800000, 2500000],
  },
};
