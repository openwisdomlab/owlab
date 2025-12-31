# Allen Curve 通信距离可视化 - 设计文档

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 Floor Plan 工具中可视化区域间的沟通效率，基于 Allen Curve 理论评估布局并提供优化建议。

**Architecture:** Canvas 叠加层显示连接线和同心圆，侧边栏面板展示评估结果和建议。系统自动推断协作关系，用户可手动覆盖。

**Tech Stack:** React, TypeScript, Zod, Framer Motion, Lucide Icons

---

## 1. 理论基础

Thomas Allen (MIT) 研究表明，面对面沟通频率随物理距离呈指数衰减：

```
P(d) = P₀ × e^(-αd)
```

- α ≈ 0.1（衰减系数）
- 10m 时效率约 37%
- 30m 时效率约 5%

## 2. 数据模型

### 2.1 协作关系

```typescript
interface CollaborationLink {
  id: string;
  sourceZoneId: string;
  targetZoneId: string;
  intensity: "high" | "medium" | "low";
  autoInferred: boolean;
  customWeight?: number;  // 0-1, 用户覆盖
}
```

### 2.2 评估结果

```typescript
interface LinkAssessment {
  link: CollaborationLink;
  distance: number;           // 米
  efficiency: number;         // 0-100
  status: "optimal" | "acceptable" | "warning" | "critical";
}

interface AllenCurveAssessment {
  links: LinkAssessment[];
  overallScore: number;       // 0-100
  safetyLevel: "excellent" | "good" | "moderate" | "needs_improvement" | "critical";
  recommendations: Recommendation[];
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  type: "move_closer" | "move_apart" | "cluster";
  affectedZones: string[];
  message: string;
  estimatedImprovement: number;  // 分数提升预估
}
```

### 2.3 区域类型协作矩阵

| 源/目标 | compute | workspace | meeting | storage | break |
|---------|---------|-----------|---------|---------|-------|
| compute | medium | high | medium | low | low |
| workspace | high | medium | high | low | medium |
| meeting | medium | high | low | low | medium |
| storage | low | low | low | low | low |
| break | low | medium | medium | low | low |

## 3. 可视化设计

### 3.1 连接线网络（默认视图）

在 Canvas 上方叠加 SVG 层，绘制贝塞尔曲线连接区域中心：

| 效率范围 | 颜色 | 线宽 | 样式 |
|----------|------|------|------|
| 80-100% | #10b981 (绿) | 3px | 实线 |
| 60-79% | #22d3ee (青) | 2px | 实线 |
| 40-59% | #eab308 (黄) | 2px | 实线 |
| < 40% | #ef4444 (红) | 1px | 虚线 |

### 3.2 同心圆（选中区域视图）

选中区域时显示距离参考圈：
- 10m 圈：绿色虚线（高效沟通区）
- 30m 圈：橙色虚线（沟通衰减警告）

### 3.3 交互

- 悬停连接线 → tooltip 显示距离、效率、建议
- 点击连接线 → 高亮两端区域，侧边栏显示详情
- 右键连接线 → 菜单调整协作强度

## 4. 面板 UI

```
┌─────────────────────────────────────┐
│ 🔗 Allen Curve 通信分析        [×] │
├─────────────────────────────────────┤
│ 整体沟通效率  ████████░░ 78        │
│ 状态: 良好                          │
├─────────────────────────────────────┤
│ [概览] [连接详情] [优化建议]        │
├─────────────────────────────────────┤
│ ⚠️ 需关注的连接 (2)                 │
│ ┌─────────────────────────────────┐ │
│ │ Workspace ↔ Meeting Room        │ │
│ │ 距离: 12.5m  效率: 45%          │ │
│ │ [调整强度 ▾]                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 5. 文件结构

### 新增文件

```
src/lib/schemas/allen-curve.ts
src/lib/utils/allen-curve-calculator.ts
src/components/lab/AllenCurvePanel.tsx
src/components/lab/AllenCurveOverlay.tsx
```

### 修改文件

```
src/app/[locale]/lab/floor-plan/page.tsx
```

## 6. 核心算法

### 距离计算

```typescript
function getZoneCenter(zone: ZoneData): { x: number; y: number } {
  return {
    x: zone.position.x + zone.size.width / 2,
    y: zone.position.y + zone.size.height / 2,
  };
}

function calculateDistance(zoneA: ZoneData, zoneB: ZoneData): number {
  const a = getZoneCenter(zoneA);
  const b = getZoneCenter(zoneB);
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
```

### 效率计算

```typescript
const INTENSITY_WEIGHTS = { high: 1.0, medium: 0.7, low: 0.4 };
const DECAY_ALPHA = 0.1;

function calculateEfficiency(distance: number, intensity: CollaborationLink["intensity"]): number {
  const rawEfficiency = Math.exp(-DECAY_ALPHA * distance) * 100;
  return Math.round(rawEfficiency);
}

function getEfficiencyStatus(efficiency: number): LinkAssessment["status"] {
  if (efficiency >= 80) return "optimal";
  if (efficiency >= 60) return "acceptable";
  if (efficiency >= 40) return "warning";
  return "critical";
}
```

## 7. 与现有组件集成

- 复用 `zoom`、`selectedZone` 状态
- 样式与 `PsychologicalSafetyPanel` 一致
- 使用相同的 motion 动画模式
- 工具栏使用 `Link2` 图标
