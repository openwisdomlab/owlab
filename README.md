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

## 项目结构

```
owlab/
├── content/docs/zh/knowledge-base/   # 知识库内容
│   ├── 01-foundations/               # M01 理念与理论
│   ├── 02-governance/                # M02 治理与网络
│   ├── 03-space/                     # M03 空间与环境
│   ├── 04-programs/                  # M04 课程与项目
│   │   └── extend/
│   │       └── pbl-design.mdx        # 问题驱动研究性学习设计
│   ├── 05-tools/                     # M05 工具与资产
│   ├── 06-safety/                    # M06 安全与伦理
│   ├── 07-people/                    # M07 人员与能力
│   ├── 08-operations/                # M08 运营手册
│   ├── 09-assessment/                # M09 评价与影响
│   ├── _meta/                        # 元数据定义
│   ├── _templates/                   # 文档模板
│   ├── ARCHITECTURE-V2.mdx           # 架构设计文档
│   ├── GLOBAL-DEFINITIONS.mdx        # 全局术语定义
│   └── COLLABORATION-PROTOCOL.mdx    # 协作机制
├── app/                              # Next.js 应用
└── components/                       # React 组件
```

## 贡献指南

1. 阅读 [架构设计文档](./content/docs/zh/knowledge-base/ARCHITECTURE-V2.mdx)
2. 使用 [文档模板](./content/docs/zh/knowledge-base/_templates/)
3. 遵循 [证据等级](./content/docs/zh/knowledge-base/_meta/evidence-levels.mdx) 标注规范
4. 按 [协作机制](./content/docs/zh/knowledge-base/COLLABORATION-PROTOCOL.mdx) 提交

## 许可证

MIT
