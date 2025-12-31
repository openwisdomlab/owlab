# OWL - Open Wisdom Lab

OWL《建设与运营标准手册》模块化知识库 - AI Space / Maker Space 建设与运营的标准化指南。

## 项目简介

OWL 知识库采用 **Core + Extend + Evidence** 三层架构设计，为创新学习空间的建设与运营提供系统化、可验证的指导。

```
┌─────────────────────────────────────────────────────┐
│  CORE (核心层) ≤2000字                               │
│  精炼原则 / MVS / 关键定义                           │
│  → AI 可一次性读取完整上下文                         │
├─────────────────────────────────────────────────────┤
│  EXTEND (扩展层) 不限篇幅                            │
│  深度研究 / 案例库 / 可视化 / 前沿资料                │
│  → 按需检索，独立更新                                │
├─────────────────────────────────────────────────────┤
│  EVIDENCE (证据层)                                   │
│  结构化引用 / 验证记录                               │
│  → 可追溯，可验证                                    │
└─────────────────────────────────────────────────────┘
```

## 模块总览

| 模块 | 名称 | 定位 |
|------|------|------|
| M01 | 理念与理论 | OWL 的意义与理论根基 |
| M02 | 治理与网络 | 组织形式与协作规则 |
| M03 | 空间与环境 | 创新友好的学习环境 |
| M04 | 课程与项目 | 有效的学习体验设计 |
| M05 | 工具与资产 | 设备管理让创造可能 |
| M06 | 安全与伦理 | 底线守护保驾护航 |
| M07 | 人员与能力 | 培养点燃学习者的人 |
| M08 | 运营手册 | 让运营自然流畅 |
| M09 | 评价与影响 | 看见成长证明价值 |

## 最近更新

### AI Lab 平面图设计器增强 (2025-12)

- 新增**平行宇宙模式** - 探索空间设计的无限可能性
- 新增**情感设计工具** - 基于情感体验优化空间布局
- 新增**心理安全评估面板** - 评估空间的心理舒适度
- 新增**测量工具** - 精确测量距离和面积
- 优化键盘快捷键支持 (P/E/M 快速切换功能)
- 重构组件架构，提升性能与可维护性

### 问题驱动的研究性学习设计 (2025-12)

- 重构 PBL 指南为**问题驱动研究性学习**模式
- 新增五阶段循环模型：遭遇 → 聚焦 → 探究 → 论证 → 延伸
- 新增假设-验证循环方法论与批判性思维框架
- 新增四个前沿挑战案例：
  - AI 与人类创造力
  - 气候变化与社区碳足迹
  - 城市生物多样性调查
  - 个人数据与隐私保护

### 模块化知识库架构 v2 (2025-01)

- 实现 Core + Extend + Evidence 三层架构
- 完成所有模块核心层内容 (M01-M09)
- 建立证据分级与验证机制

## 快速开始

### 安装依赖

```bash
npm install
# or
pnpm install
```

### 启动开发服务器

```bash
npm run dev
# or
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 技术栈

- [Next.js](https://nextjs.org) - React 框架
- [Fumadocs](https://fumadocs.vercel.app) - 文档框架
- MDX - Markdown + JSX 文档格式
- [Framer Motion](https://www.framer.com/motion/) - 动画库

## AI Lab 模块

OWL 提供了一套可视化的 AI 辅助设计工具，帮助您规划和设计创新学习空间。

### 智能规划向导

输入面积、预算、目标定位，AI 自动生成个性化建设方案。

### 平面图设计器

功能丰富的空间布局设计工具：

| 功能 | 说明 | 快捷键 |
|------|------|--------|
| 区域管理 | 创建、编辑、拖拽、复制区域 | Ctrl+C/V, Delete |
| 设备库 | 浏览和添加设备到区域 | - |
| 预算仪表板 | 实时预算分析与优化建议 | - |
| 模板库 | 使用预设模板快速开始 | - |
| 3D 预览 | 实时 3D 可视化预览 | - |
| AI 助手 | 智能对话生成布局方案 | - |
| 安全评估 | 物理安全检查与建议 | - |
| 心理安全 | 空间心理舒适度评估 | - |
| 测量工具 | 精确测量距离和面积 | M |
| 平行宇宙 | 探索多种设计可能性 | P |
| 情感设计 | 基于情感体验优化空间 | E |
| 撤销/重做 | 历史记录管理 | Ctrl+Z/Shift+Z |
| 导出 | 支持多种格式导出 | - |

### 概念探索

探索创新空间设计的核心理念与设计原则。

### 案例研究

参考全球优秀的创新学习空间案例。

## 项目结构

```
owlab/
├── content/docs/zh/knowledge-base/   # 知识库内容
│   ├── 01-foundations/               # M01 理念与理论
│   ├── 02-governance/                # M02 治理与网络
│   ├── 03-space/                     # M03 空间与环境
│   ├── 04-programs/                  # M04 课程与项目
│   ├── 05-tools/                     # M05 工具与资产
│   ├── 06-safety/                    # M06 安全与伦理
│   ├── 07-people/                    # M07 人员与能力
│   ├── 08-operations/                # M08 运营手册
│   ├── 09-assessment/                # M09 评价与影响
│   ├── _meta/                        # 元数据定义
│   └── _templates/                   # 文档模板
├── src/
│   ├── app/                          # Next.js 应用路由
│   │   └── [locale]/lab/             # AI Lab 模块
│   │       ├── floor-plan/           # 平面图设计器
│   │       ├── concepts/             # 概念探索
│   │       └── case-studies/         # 案例研究
│   ├── components/lab/               # Lab 组件
│   │   ├── FloorPlanCanvas.tsx       # 画布组件
│   │   ├── EquipmentLibrary.tsx      # 设备库
│   │   ├── BudgetDashboard.tsx       # 预算仪表板
│   │   ├── SafetyPanel.tsx           # 安全面板
│   │   ├── PsychologicalSafetyPanel.tsx  # 心理安全面板
│   │   ├── Preview3D.tsx             # 3D 预览
│   │   ├── ParallelUniverseDialog.tsx    # 平行宇宙
│   │   └── EmotionDesignDialog.tsx   # 情感设计
│   ├── lib/                          # 工具库
│   │   ├── ai/                       # AI 代理
│   │   └── schemas/                  # 数据模式
│   └── hooks/                        # React Hooks
└── public/                           # 静态资源
```

## 贡献指南

1. 阅读 [架构设计文档](./content/docs/zh/knowledge-base/ARCHITECTURE-V2.mdx)
2. 使用 [文档模板](./content/docs/zh/knowledge-base/_templates/)
3. 遵循 [证据等级](./content/docs/zh/knowledge-base/_meta/evidence-levels.mdx) 标注规范
4. 按 [协作机制](./content/docs/zh/knowledge-base/COLLABORATION-PROTOCOL.mdx) 提交

## 许可证

MIT
