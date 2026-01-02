# 学科模板数据系统实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为五大学域创建基础模板数据，支持 SmartLauncher 快速启动生成布局

**Architecture:**
- 创建独立的 discipline-templates 数据模块
- 每个学域一个模板文件，包含布局和推荐设备
- 集成到 SmartLauncher 的快速启动流程

**Tech Stack:** TypeScript, Zod, React

---

## Task 1: 创建学科模板 Schema

**Files:**
- Create: `src/lib/schemas/discipline-template.ts`

**Step 1: 创建类型定义**

```typescript
// src/lib/schemas/discipline-template.ts
import { z } from "zod";
import { DisciplineSchema } from "./launcher";

// 设备推荐优先级
export const EquipmentPrioritySchema = z.enum(["essential", "recommended", "optional"]);

export type EquipmentPriority = z.infer<typeof EquipmentPrioritySchema>;

// 设备推荐
export const EquipmentRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  priority: EquipmentPrioritySchema,
  estimatedPrice: z.number().optional(),
});

export type EquipmentRecommendation = z.infer<typeof EquipmentRecommendationSchema>;

// 区域设备配置
export const ZoneEquipmentConfigSchema = z.object({
  zoneType: z.string(),
  items: z.array(EquipmentRecommendationSchema),
});

export type ZoneEquipmentConfig = z.infer<typeof ZoneEquipmentConfigSchema>;

// 预设区域（简化版 ZoneData）
export const TemplateZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  size: z.object({ width: z.number(), height: z.number() }),
  color: z.string(),
});

export type TemplateZone = z.infer<typeof TemplateZoneSchema>;

// 学科模板元数据
export const DisciplineTemplateMetaSchema = z.object({
  minArea: z.number(),
  capacity: z.number(),
  budgetRange: z.tuple([z.number(), z.number()]),
});

export type DisciplineTemplateMeta = z.infer<typeof DisciplineTemplateMetaSchema>;

// 学科模板
export const DisciplineTemplateSchema = z.object({
  id: DisciplineSchema,
  name: z.string(),
  description: z.string(),
  layout: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      unit: z.enum(["m", "ft"]).default("m"),
    }),
    zones: z.array(TemplateZoneSchema),
  }),
  recommendedEquipment: z.array(ZoneEquipmentConfigSchema),
  meta: DisciplineTemplateMetaSchema,
});

export type DisciplineTemplate = z.infer<typeof DisciplineTemplateSchema>;
```

**Step 2: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: 无错误

**Step 3: 提交**

```bash
git add src/lib/schemas/discipline-template.ts
git commit -m "feat(lab): add discipline template schema"
```

---

## Task 2: 创建生命健康模板

**Files:**
- Create: `src/lib/data/discipline-templates/life-health.ts`

**Step 1: 创建模板数据**

```typescript
// src/lib/data/discipline-templates/life-health.ts
import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const lifeHealthTemplate: DisciplineTemplate = {
  id: "life-health",
  name: "生命健康实验室",
  description: "适用于生物医学、基因工程、药物研发等方向的综合实验室",

  layout: {
    dimensions: { width: 15, height: 10, unit: "m" },
    zones: [
      {
        id: "zone-wet-lab",
        name: "湿实验区",
        type: "lab",
        position: { x: 0, y: 0 },
        size: { width: 6, height: 5 },
        color: "#22d3ee",
      },
      {
        id: "zone-cell-culture",
        name: "细胞培养室",
        type: "lab",
        position: { x: 7, y: 0 },
        size: { width: 4, height: 4 },
        color: "#10b981",
      },
      {
        id: "zone-sample",
        name: "样品处理区",
        type: "workspace",
        position: { x: 12, y: 0 },
        size: { width: 3, height: 4 },
        color: "#8b5cf6",
      },
      {
        id: "zone-data",
        name: "数据分析区",
        type: "compute",
        position: { x: 7, y: 5 },
        size: { width: 4, height: 3 },
        color: "#f59e0b",
      },
      {
        id: "zone-meeting",
        name: "会议讨论区",
        type: "meeting",
        position: { x: 12, y: 5 },
        size: { width: 3, height: 3 },
        color: "#ec4899",
      },
    ],
  },

  recommendedEquipment: [
    {
      zoneType: "lab",
      items: [
        { id: "biosafety-cabinet", name: "生物安全柜", category: "safety", priority: "essential", estimatedPrice: 80000 },
        { id: "clean-bench", name: "超净工作台", category: "safety", priority: "essential", estimatedPrice: 30000 },
        { id: "pcr-machine", name: "PCR仪", category: "tools", priority: "essential", estimatedPrice: 50000 },
        { id: "centrifuge", name: "离心机", category: "tools", priority: "essential", estimatedPrice: 20000 },
        { id: "microscope", name: "显微镜", category: "tools", priority: "recommended", estimatedPrice: 30000 },
        { id: "incubator", name: "培养箱", category: "tools", priority: "recommended", estimatedPrice: 25000 },
      ],
    },
    {
      zoneType: "compute",
      items: [
        { id: "workstation", name: "分析工作站", category: "compute", priority: "essential", estimatedPrice: 15000 },
        { id: "display", name: "大屏显示器", category: "compute", priority: "recommended", estimatedPrice: 5000 },
      ],
    },
  ],

  meta: {
    minArea: 120,
    capacity: 10,
    budgetRange: [500000, 1500000],
  },
};
```

**Step 2: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: 无错误

**Step 3: 提交**

```bash
git add src/lib/data/discipline-templates/life-health.ts
git commit -m "feat(lab): add life-health discipline template"
```

---

## Task 3: 创建其他四个学科模板

**Files:**
- Create: `src/lib/data/discipline-templates/deep-space-ocean.ts`
- Create: `src/lib/data/discipline-templates/social-innovation.ts`
- Create: `src/lib/data/discipline-templates/micro-nano.ts`
- Create: `src/lib/data/discipline-templates/digital-info.ts`

**Step 1: 创建深空海地模板**

```typescript
// src/lib/data/discipline-templates/deep-space-ocean.ts
import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const deepSpaceOceanTemplate: DisciplineTemplate = {
  id: "deep-space-ocean",
  name: "深空海地实验室",
  description: "适用于航天工程、海洋探测、极端环境研究等方向",

  layout: {
    dimensions: { width: 18, height: 10, unit: "m" },
    zones: [
      {
        id: "zone-simulation",
        name: "模拟环境区",
        type: "lab",
        position: { x: 0, y: 0 },
        size: { width: 6, height: 6 },
        color: "#3b82f6",
      },
      {
        id: "zone-datacenter",
        name: "数据中心",
        type: "compute",
        position: { x: 7, y: 0 },
        size: { width: 5, height: 5 },
        color: "#22d3ee",
      },
      {
        id: "zone-storage",
        name: "样品存储区",
        type: "storage",
        position: { x: 13, y: 0 },
        size: { width: 4, height: 4 },
        color: "#6366f1",
      },
      {
        id: "zone-analysis",
        name: "分析工作区",
        type: "workspace",
        position: { x: 0, y: 7 },
        size: { width: 6, height: 3 },
        color: "#8b5cf6",
      },
      {
        id: "zone-collab",
        name: "协作区",
        type: "meeting",
        position: { x: 13, y: 5 },
        size: { width: 4, height: 4 },
        color: "#10b981",
      },
    ],
  },

  recommendedEquipment: [
    {
      zoneType: "lab",
      items: [
        { id: "env-chamber", name: "环境模拟舱", category: "tools", priority: "essential", estimatedPrice: 200000 },
        { id: "pressure-system", name: "压力测试系统", category: "tools", priority: "recommended", estimatedPrice: 100000 },
      ],
    },
    {
      zoneType: "compute",
      items: [
        { id: "hpc-cluster", name: "高性能计算集群", category: "compute", priority: "essential", estimatedPrice: 300000 },
        { id: "vis-system", name: "3D可视化系统", category: "compute", priority: "recommended", estimatedPrice: 80000 },
      ],
    },
    {
      zoneType: "storage",
      items: [
        { id: "cryo-storage", name: "冷冻存储设备", category: "utilities", priority: "essential", estimatedPrice: 50000 },
      ],
    },
  ],

  meta: {
    minArea: 150,
    capacity: 8,
    budgetRange: [800000, 2000000],
  },
};
```

**Step 2: 创建社会创新模板**

```typescript
// src/lib/data/discipline-templates/social-innovation.ts
import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const socialInnovationTemplate: DisciplineTemplate = {
  id: "social-innovation",
  name: "社会创新实验室",
  description: "适用于教育科技、城市规划、可持续发展等方向",

  layout: {
    dimensions: { width: 12, height: 8, unit: "m" },
    zones: [
      {
        id: "zone-collab",
        name: "协作工作区",
        type: "workspace",
        position: { x: 0, y: 0 },
        size: { width: 6, height: 5 },
        color: "#f59e0b",
      },
      {
        id: "zone-research",
        name: "用户研究室",
        type: "meeting",
        position: { x: 7, y: 0 },
        size: { width: 4, height: 4 },
        color: "#8b5cf6",
      },
      {
        id: "zone-maker",
        name: "原型工坊",
        type: "maker",
        position: { x: 7, y: 5 },
        size: { width: 5, height: 3 },
        color: "#10b981",
      },
      {
        id: "zone-display",
        name: "展示区",
        type: "common",
        position: { x: 0, y: 6 },
        size: { width: 3, height: 2 },
        color: "#ec4899",
      },
    ],
  },

  recommendedEquipment: [
    {
      zoneType: "workspace",
      items: [
        { id: "whiteboard-wall", name: "白板墙", category: "furniture", priority: "essential", estimatedPrice: 5000 },
        { id: "projector", name: "投影设备", category: "electronics", priority: "essential", estimatedPrice: 10000 },
        { id: "recording", name: "录音录像设备", category: "electronics", priority: "recommended", estimatedPrice: 15000 },
      ],
    },
    {
      zoneType: "maker",
      items: [
        { id: "3d-printer", name: "3D打印机", category: "tools", priority: "essential", estimatedPrice: 20000 },
        { id: "laser-cutter", name: "激光切割机", category: "tools", priority: "recommended", estimatedPrice: 30000 },
      ],
    },
  ],

  meta: {
    minArea: 80,
    capacity: 15,
    budgetRange: [200000, 600000],
  },
};
```

**Step 3: 创建微纳界面模板**

```typescript
// src/lib/data/discipline-templates/micro-nano.ts
import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const microNanoTemplate: DisciplineTemplate = {
  id: "micro-nano",
  name: "微纳界面实验室",
  description: "适用于纳米材料、量子计算、精密制造等方向",

  layout: {
    dimensions: { width: 14, height: 10, unit: "m" },
    zones: [
      {
        id: "zone-cleanroom",
        name: "洁净室",
        type: "cleanroom",
        position: { x: 0, y: 0 },
        size: { width: 5, height: 5 },
        color: "#06b6d4",
      },
      {
        id: "zone-fabrication",
        name: "精密加工区",
        type: "lab",
        position: { x: 6, y: 0 },
        size: { width: 5, height: 4 },
        color: "#8b5cf6",
      },
      {
        id: "zone-analysis",
        name: "检测分析区",
        type: "lab",
        position: { x: 6, y: 5 },
        size: { width: 4, height: 4 },
        color: "#22d3ee",
      },
      {
        id: "zone-compute",
        name: "数据处理区",
        type: "compute",
        position: { x: 11, y: 0 },
        size: { width: 3, height: 3 },
        color: "#f59e0b",
      },
      {
        id: "zone-prep",
        name: "准备区",
        type: "workspace",
        position: { x: 0, y: 6 },
        size: { width: 4, height: 3 },
        color: "#10b981",
      },
    ],
  },

  recommendedEquipment: [
    {
      zoneType: "cleanroom",
      items: [
        { id: "glovebox", name: "手套箱", category: "safety", priority: "essential", estimatedPrice: 150000 },
        { id: "fume-hood", name: "通风柜", category: "safety", priority: "essential", estimatedPrice: 50000 },
      ],
    },
    {
      zoneType: "lab",
      items: [
        { id: "sem", name: "电子显微镜", category: "tools", priority: "essential", estimatedPrice: 500000 },
        { id: "precision-balance", name: "精密天平", category: "tools", priority: "essential", estimatedPrice: 30000 },
        { id: "afm", name: "原子力显微镜", category: "tools", priority: "recommended", estimatedPrice: 400000 },
      ],
    },
  ],

  meta: {
    minArea: 100,
    capacity: 8,
    budgetRange: [1000000, 3000000],
  },
};
```

**Step 4: 创建数智信息模板**

```typescript
// src/lib/data/discipline-templates/digital-info.ts
import type { DisciplineTemplate } from "@/lib/schemas/discipline-template";

export const digitalInfoTemplate: DisciplineTemplate = {
  id: "digital-info",
  name: "数智信息实验室",
  description: "适用于人工智能、大数据、物联网等方向",

  layout: {
    dimensions: { width: 12, height: 8, unit: "m" },
    zones: [
      {
        id: "zone-server",
        name: "GPU服务器区",
        type: "compute",
        position: { x: 0, y: 0 },
        size: { width: 4, height: 4 },
        color: "#22d3ee",
      },
      {
        id: "zone-dev",
        name: "开发工位区",
        type: "workspace",
        position: { x: 5, y: 0 },
        size: { width: 6, height: 5 },
        color: "#8b5cf6",
      },
      {
        id: "zone-test",
        name: "测试体验区",
        type: "lab",
        position: { x: 0, y: 5 },
        size: { width: 4, height: 3 },
        color: "#10b981",
      },
      {
        id: "zone-meeting",
        name: "协作会议区",
        type: "meeting",
        position: { x: 5, y: 6 },
        size: { width: 4, height: 2 },
        color: "#f59e0b",
      },
    ],
  },

  recommendedEquipment: [
    {
      zoneType: "compute",
      items: [
        { id: "gpu-server", name: "AI服务器/GPU集群", category: "compute", priority: "essential", estimatedPrice: 200000 },
        { id: "rack", name: "服务器机柜", category: "utilities", priority: "essential", estimatedPrice: 20000 },
        { id: "ups", name: "UPS电源", category: "utilities", priority: "essential", estimatedPrice: 30000 },
      ],
    },
    {
      zoneType: "workspace",
      items: [
        { id: "dev-workstation", name: "开发工作站", category: "compute", priority: "essential", estimatedPrice: 15000 },
        { id: "multi-display", name: "多屏显示器", category: "electronics", priority: "recommended", estimatedPrice: 10000 },
      ],
    },
    {
      zoneType: "lab",
      items: [
        { id: "vr-headset", name: "VR/AR设备", category: "electronics", priority: "recommended", estimatedPrice: 30000 },
        { id: "robot-platform", name: "机器人平台", category: "tools", priority: "optional", estimatedPrice: 50000 },
      ],
    },
  ],

  meta: {
    minArea: 80,
    capacity: 12,
    budgetRange: [300000, 1000000],
  },
};
```

**Step 5: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: 无错误

**Step 6: 提交**

```bash
git add src/lib/data/discipline-templates/
git commit -m "feat(lab): add all discipline templates"
```

---

## Task 4: 创建模板导出和工具函数

**Files:**
- Create: `src/lib/data/discipline-templates/index.ts`

**Step 1: 创建导出文件**

```typescript
// src/lib/data/discipline-templates/index.ts
import type { Discipline } from "@/lib/schemas/launcher";
import type { DisciplineTemplate, TemplateZone } from "@/lib/schemas/discipline-template";
import type { ZoneData, LayoutData } from "@/lib/ai/agents/layout-agent";

import { lifeHealthTemplate } from "./life-health";
import { deepSpaceOceanTemplate } from "./deep-space-ocean";
import { socialInnovationTemplate } from "./social-innovation";
import { microNanoTemplate } from "./micro-nano";
import { digitalInfoTemplate } from "./digital-info";

// 所有学科模板
export const DISCIPLINE_TEMPLATES: Record<Discipline, DisciplineTemplate> = {
  "life-health": lifeHealthTemplate,
  "deep-space-ocean": deepSpaceOceanTemplate,
  "social-innovation": socialInnovationTemplate,
  "micro-nano": microNanoTemplate,
  "digital-info": digitalInfoTemplate,
};

/**
 * 获取学科模板
 */
export function getDisciplineTemplate(discipline: Discipline): DisciplineTemplate {
  return DISCIPLINE_TEMPLATES[discipline];
}

/**
 * 将模板区域转换为 LayoutData 格式
 */
export function templateToLayout(template: DisciplineTemplate): LayoutData {
  const zones: ZoneData[] = template.layout.zones.map((zone: TemplateZone) => ({
    id: zone.id,
    name: zone.name,
    type: zone.type as ZoneData["type"],
    position: zone.position,
    size: zone.size,
    color: zone.color,
    equipment: [],
  }));

  return {
    name: template.name,
    description: template.description,
    dimensions: template.layout.dimensions,
    zones,
  };
}

/**
 * 获取学科模板并转换为可用布局
 */
export function getLayoutFromDiscipline(discipline: Discipline): LayoutData {
  const template = getDisciplineTemplate(discipline);
  return templateToLayout(template);
}

// 导出所有模板
export { lifeHealthTemplate } from "./life-health";
export { deepSpaceOceanTemplate } from "./deep-space-ocean";
export { socialInnovationTemplate } from "./social-innovation";
export { microNanoTemplate } from "./micro-nano";
export { digitalInfoTemplate } from "./digital-info";
```

**Step 2: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: 无错误

**Step 3: 提交**

```bash
git add src/lib/data/discipline-templates/index.ts
git commit -m "feat(lab): add discipline template utilities"
```

---

## Task 5: 集成到 SmartLauncher

**Files:**
- Modify: `src/app/[locale]/lab/floor-plan/page.tsx`

**Step 1: 导入工具函数**

在 imports 区域添加:
```typescript
import { getLayoutFromDiscipline } from "@/lib/data/discipline-templates";
```

**Step 2: 修改 handleLauncherStart 函数**

找到 `handleLauncherStart` 函数，更新快速启动逻辑:

```typescript
const handleLauncherStart = useCallback((state: LauncherState) => {
  setLauncherState(state);
  setShowLauncher(false);

  // 如果是自然语言输入，调用 AI 生成布局
  if (state.mode === "chat" && state.prompt) {
    setShowAISidebar(true);
    console.log("Generate layout from prompt:", state.prompt);
  }

  // 如果是快速选择，基于学科生成基础布局
  if (state.mode === "quick" && state.discipline) {
    const newLayout = getLayoutFromDiscipline(state.discipline);
    setLayout(newLayout);
    setShowAISidebar(true);
  }

  // 如果是模板模式，打开模板库
  if (state.mode === "template") {
    setShowTemplates(true);
  }
}, [setLayout]);
```

**Step 3: 验证构建**

Run: `pnpm build 2>&1 | grep -E "(error|Error)" | head -10`
Expected: 无错误

**Step 4: 提交**

```bash
git add src/app/[locale]/lab/floor-plan/page.tsx
git commit -m "feat(lab): integrate discipline templates into SmartLauncher"
```

---

## Task 6: 最终验证

**Step 1: 完整构建**

Run: `pnpm build`
Expected: 构建成功

**Step 2: 检查 git 状态**

Run: `git status && git log --oneline -5`
Expected: 工作区干净，5 个新提交

**Step 3: 更新设计文档状态**

在设计文档末尾添加实施完成状态。

---

## 预期成果

完成后，用户在 SmartLauncher 中：
1. 选择任一学科（如"生命健康"）
2. 选择 1-2 个子方向
3. 点击"生成设计方案"
4. 系统自动加载对应学科的预设布局
5. 进入编辑器继续调整
