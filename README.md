# OWL - Open Wisdom Lab

> **点燃好奇心，培养有改变世界潜质的未来科研创新者**

OWL（开放智慧实验室）不只是一个空间，而是一段从好奇到创造的旅程。我们相信，好奇心是一切创新的起点——保持好奇、敢于冒险、持续创造的人，才能在 AI 时代产生真正的价值。

## OWL 培养什么样的人

| 特质 | 表现 |
|------|------|
| **好奇心与奇思妙想** | 对世界充满问题，想法天马行空 |
| **兴趣广泛** | 不被学科边界束缚，跨界探索 |
| **敢于冒险和打破常规** | 不怕失败，挑战已知 |
| **有创造力和理想** | 能把想法变成现实，有远大目标 |
| **长期主义** | 能持续投入，延迟满足 |
| **科研潜质** | 有能力产生真正的创新和影响 |

## 3E 核心路径

OWL 通过 **Enlighten - Empower - Engage** 三个维度支持学生成长：

### Enlighten 激发 — 点燃好奇，打开视野
用前沿科研挑战激发好奇，让学生接触真实科学家和真实问题，创造安全感让奇思妙想能自由表达。

### Empower 赋能 — 给方法，给工具，给空间
教探究方法（科学思维、设计思维、工程思维），提供 AI 工具链放大创造力，容许失败、鼓励试错。

### Engage 连接 — 进入真实世界，产生真实影响
连接大导师、科学家、全球社群，支持真实项目和长期投入，让学生的创造被看见、被认可。

## 内容结构

本项目是 OWL《建设与运营标准手册》的模块化知识库，采用 **Core + Extend + Evidence** 三层架构。

| 目录 | 内容 | 访问路径 |
|------|------|----------|
| **core/** | 核心标准 - 9大模块 (M01-M09) | `/docs/core` |
| **research/** | 探索研究 - 4个前沿理念模块 | `/docs/research` |
| **resources/** | 资源工具 - 实践工具和资源 | `/docs/resources` |

## 知识库模块

| 模块 | 定位 | 3E 维度 |
|------|------|---------|
| M01 理念与理论 | 为什么好奇心是最珍贵的能力 | Enlighten + Empower + Engage |
| M02 治理与网络 | 连接全球资源，让好问题找到好答案 | Enlighten + Empower + Engage |
| M03 空间与环境 | 空间会说话——让好奇自由生长的地方 | Enlighten + Empower + Engage |
| M04 课程与项目 | 从好奇到创造的探究之旅 | Enlighten + Empower + Engage |
| M05 工具与资产 | AI 时代的创造者工具箱 | Enlighten + Empower + Engage |
| M06 安全与伦理 | 敢于冒险的前提——安全与边界 | Enlighten + Empower + Engage |
| M07 人员与能力 | 不是教，而是点燃 | Enlighten + Empower + Engage |
| M08 运营手册 | 让探究持续发生 | Enlighten + Empower + Engage |
| M09 成长与影响力 | 看见成长的痕迹 | Enlighten + Empower + Engage |

## AI Lab 设计工具

OWL 提供一套 AI 辅助设计工具，帮助规划创新学习空间：

- **智能规划向导** — 输入面积、预算、目标，AI 自动生成方案
- **平面图设计器** — 拖拽式布局，内置设备库和模板
- **概念库与案例库** — 理论依据和全球优秀案例

## 快速开始

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器 (localhost:3000)
pnpm build        # 构建生产版本
pnpm lint         # 运行 ESLint 检查
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 文档 | Fumadocs + MDX |
| UI | Radix UI + Tailwind CSS 4 |
| 状态管理 | Zustand |
| AI | Vercel AI SDK (Anthropic/OpenAI/Google) |
| 3D/Canvas | React Three Fiber + Konva |
| 国际化 | next-intl (中文/English) |

## 项目结构

```
owlab/
├── content/docs/zh/
│   ├── core/                         # 核心标准 (M01-M09 模块)
│   ├── research/                     # 探索研究 (前沿理念)
│   └── resources/                    # 资源工具
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/ai/                   # AI API 端点
│   │   └── [locale]/                 # i18n 路由
│   │       ├── lab/                  # AI Lab 设计工具
│   │       └── docs/                 # 文档页面
│   ├── features/                     # 功能组件
│   │   ├── doc-viewer/               # 文档渲染组件
│   │   └── lab-editor/               # Lab 编辑器组件
│   ├── components/                   # 通用 UI 组件
│   ├── data/                         # 强类型静态数据
│   ├── hooks/                        # React Hooks
│   └── lib/                          # 工具函数和配置
└── public/                           # 静态资源
```

## 贡献指南

1. 阅读 [架构设计文档](./content/docs/zh/core/ARCHITECTURE-V2.mdx)
2. 使用 [文档模板](./content/docs/zh/core/_templates/)
3. 遵循 [证据等级](./content/docs/zh/core/_meta/evidence-levels.mdx) 标注规范

## 许可证

MIT
