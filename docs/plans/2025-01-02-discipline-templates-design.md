# 学科模板数据系统设计

> 设计日期：2025-01-02
> 目标：为五大学域创建基础模板，支持快速启动

---

## 一、设计决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 系统关系 | 独立系统 | 专门为快速启动服务，不影响现有模板库 |
| 模板粒度 | 学域级 | 5个模板，简洁易维护 |
| 模板内容 | 布局 + 设备 | 平衡实用性和复杂度 |

---

## 二、数据结构

```typescript
// src/lib/schemas/discipline-template.ts

import { z } from "zod";
import { DisciplineSchema } from "./launcher";
import type { ZoneData } from "@/lib/ai/agents/layout-agent";

// 设备推荐
export const EquipmentRecommendationSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  priority: z.enum(["essential", "recommended", "optional"]),
  estimatedPrice: z.number().optional(),
});

export type EquipmentRecommendation = z.infer<typeof EquipmentRecommendationSchema>;

// 区域设备配置
export const ZoneEquipmentConfigSchema = z.object({
  zoneType: z.string(),
  items: z.array(EquipmentRecommendationSchema),
});

export type ZoneEquipmentConfig = z.infer<typeof ZoneEquipmentConfigSchema>;

// 学科模板
export const DisciplineTemplateSchema = z.object({
  id: DisciplineSchema,
  name: z.string(),
  description: z.string(),

  // 基础布局
  layout: z.object({
    dimensions: z.object({
      width: z.number(),
      height: z.number(),
      unit: z.enum(["m", "ft"]).default("m"),
    }),
    zones: z.array(z.any()), // ZoneData[]
  }),

  // 推荐设备
  recommendedEquipment: z.array(ZoneEquipmentConfigSchema),

  // 元数据
  meta: z.object({
    minArea: z.number(),
    capacity: z.number(),
    budgetRange: z.tuple([z.number(), z.number()]),
  }),
});

export type DisciplineTemplate = z.infer<typeof DisciplineTemplateSchema>;
```

---

## 三、五大学域模板配置

### 3.1 生命健康 (life-health)

**布局尺寸：** 15m × 10m (150m²)

**区域配置：**
| 区域 | 类型 | 尺寸 | 位置 |
|------|------|------|------|
| 湿实验区 | lab | 6×5m | 左上 |
| 细胞培养室 | lab | 4×4m | 右上 |
| 样品处理区 | workspace | 5×4m | 中部 |
| 数据分析区 | compute | 4×3m | 右下 |
| 会议讨论区 | meeting | 4×3m | 左下 |

**核心设备：**
- 必备：生物安全柜、超净工作台、PCR仪、离心机、冰箱
- 推荐：显微镜、培养箱、电泳仪

**元数据：**
- 最小面积：120m²
- 容纳人数：8-12人
- 预算范围：50-150万

---

### 3.2 深空海地 (deep-space-ocean)

**布局尺寸：** 18m × 10m (180m²)

**区域配置：**
| 区域 | 类型 | 尺寸 | 位置 |
|------|------|------|------|
| 模拟环境区 | lab | 6×6m | 左侧 |
| 数据中心 | compute | 5×5m | 中上 |
| 样品存储区 | storage | 4×4m | 右上 |
| 分析工作区 | workspace | 6×4m | 中下 |
| 协作区 | meeting | 4×4m | 右下 |

**核心设备：**
- 必备：环境模拟舱、高性能计算集群、冷冻存储设备
- 推荐：遥感数据处理站、3D可视化系统

**元数据：**
- 最小面积：150m²
- 容纳人数：6-10人
- 预算范围：80-200万

---

### 3.3 社会创新 (social-innovation)

**布局尺寸：** 12m × 8m (96m²)

**区域配置：**
| 区域 | 类型 | 尺寸 | 位置 |
|------|------|------|------|
| 协作工作区 | workspace | 6×5m | 左侧 |
| 用户研究室 | meeting | 4×4m | 右上 |
| 原型工坊 | maker | 5×3m | 右下 |
| 展示区 | common | 3×3m | 中部 |

**核心设备：**
- 必备：白板墙、投影设备、录音录像设备
- 推荐：3D打印机、激光切割机、VR设备

**元数据：**
- 最小面积：80m²
- 容纳人数：10-20人
- 预算范围：20-60万

---

### 3.4 微纳界面 (micro-nano)

**布局尺寸：** 14m × 10m (140m²)

**区域配置：**
| 区域 | 类型 | 尺寸 | 位置 |
|------|------|------|------|
| 洁净室 | cleanroom | 5×5m | 左上 |
| 精密加工区 | lab | 5×4m | 右上 |
| 检测分析区 | lab | 4×4m | 中部 |
| 数据处理区 | compute | 4×3m | 右下 |
| 准备区 | workspace | 4×3m | 左下 |

**核心设备：**
- 必备：手套箱、电子显微镜、精密天平
- 推荐：光刻机、溅射镀膜机、原子力显微镜

**元数据：**
- 最小面积：100m²
- 容纳人数：6-10人
- 预算范围：100-300万

---

### 3.5 数智信息 (digital-info)

**布局尺寸：** 12m × 8m (96m²)

**区域配置：**
| 区域 | 类型 | 尺寸 | 位置 |
|------|------|------|------|
| GPU服务器区 | compute | 4×4m | 左上 |
| 开发工位区 | workspace | 6×5m | 右侧 |
| 测试体验区 | lab | 4×3m | 左下 |
| 协作会议区 | meeting | 4×3m | 中下 |

**核心设备：**
- 必备：AI服务器/GPU集群、开发工作站、大屏显示
- 推荐：VR/AR设备、机器人平台、边缘计算设备

**元数据：**
- 最小面积：80m²
- 容纳人数：8-15人
- 预算范围：30-100万

---

## 四、文件结构

```
src/lib/data/
└── discipline-templates/
    ├── index.ts              # 导出和工具函数
    ├── types.ts              # 类型定义（可选，复用 schema）
    ├── life-health.ts        # 生命健康模板
    ├── deep-space-ocean.ts   # 深空海地模板
    ├── social-innovation.ts  # 社会创新模板
    ├── micro-nano.ts         # 微纳界面模板
    └── digital-info.ts       # 数智信息模板
```

---

## 五、使用流程

```
用户选择学科 → getDisciplineTemplate(discipline) → 返回基础布局
                                                    ↓
                                            用户选择子方向
                                                    ↓
                                      adjustForSubDisciplines(template, subs)
                                                    ↓
                                            生成最终布局 → 进入编辑器
```

---

## 六、集成点

1. **SmartLauncher.tsx** - `handleQuickStart` 调用模板生成布局
2. **floor-plan/page.tsx** - `handleLauncherStart` 接收生成的布局
3. **AISidebar.tsx** - 可选：基于当前学科提供针对性建议

---

## 七、实施计划

详见：[2025-01-02-discipline-templates-plan.md](./2025-01-02-discipline-templates-plan.md)
