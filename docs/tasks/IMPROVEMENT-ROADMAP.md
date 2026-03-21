# OWL Project Improvement Roadmap

> 5 维度系统改进方案 | Generated: 2026-03-21

---

## 总览矩阵

| 维度 | 当前成熟度 | 关键发现数 | CRITICAL | IMPORTANT | NICE-TO-HAVE |
|------|-----------|-----------|----------|-----------|-------------|
| 1. 基础功能 | 70% | 10 | 1 | 7 | 2 |
| 2. 特色功能 | 55% | 6 | 0 | 4 | 2 |
| 3. 极致打磨 | 75% | 13 | 0 | 5 | 8 |
| 4. 内容体系 | 72% | 8 | 3 | 3 | 2 |
| 5. 技术架构 | 70% | 11 | 1 | 5 | 5 |

---

## 维度一：基础功能完善

### CRITICAL
| # | 问题 | 位置 | 修复方案 |
|---|------|------|---------|
| 1 | 9个被引用的MDX页面缺失（404） | `content/docs/zh/core/` 多个模块 | 创建缺失的 extend 页面（culture-atmosphere, digital-environment, ai-ethics 等） |

### IMPORTANT
| # | 问题 | 位置 | 修复方案 |
|---|------|------|---------|
| 2 | 英文文档近乎为零（仅2个文件） | `content/docs/en/` | 优先翻译9个核心模块 index.mdx |
| 3 | 无 loading.tsx / Suspense 边界 | `src/app/[locale]/` 各路由 | 为 lab/ 等重路由添加 loading.tsx |
| 4 | habitat 页面硬编码中文字符串 | `src/app/[locale]/lab/habitat/page.tsx` | 迁移到 next-intl useTranslations() |
| 5 | 404 页面非本地化 | `src/app/not-found.tsx` | 移至 `src/app/[locale]/not-found.tsx`，支持双语 |
| 6 | 仅根 layout 有 metadata | `src/app/layout.tsx` | 为文档页添加 generateMetadata()，含 OG 标签 |
| 7 | API 路由无速率限制 | `src/app/api/ai/*/route.ts` | 添加 rate limiting middleware |
| 8 | 内容内部断链 | `content/docs/zh/core/06-safety/extend/` | 审查所有 MDX 内部链接，修复或移除 |

### NICE-TO-HAVE
| # | 问题 | 位置 | 修复方案 |
|---|------|------|---------|
| 9 | 3处 `<img>` 未使用 next/image | 多个组件 | 迁移到 `<Image />` |
| 10 | 残留 debug 代码 | 散落于代码中 | 清理 |

---

## 维度二：特色功能提升

### 当前特色功能评估

| 功能领域 | 成熟度 | 独特价值 |
|---------|--------|---------|
| AI Lab（布局+心理学设计） | 高 | 极高 - 地板规划 + Allen 曲线是独特竞争力 |
| 3D/Canvas 可视化 | 中 | 高 - 但目前仅静态预览 |
| 知识图谱 | 中 | 中 - 漂亮但静态，未动态遍历 |
| 交互式学习工具 | 中低 | 高 - 缺少测验/徽章/自适应学习 |
| 社区/协作 | 极低 | 高 - 导师网络是 OWL 核心使命 |
| 3E 框架体现 | 低 | 极高 - OWL 独特哲学，严重未开发 |

### TOP 5 增强机会

| 优先级 | 功能 | 描述 | 竞争价值 | 工作量 |
|--------|------|------|---------|--------|
| 1 | **3E 进度面板** | 可视化学习者在 Enlighten/Empower/Engage 三维度的成长轨迹 | 极高 | 中 |
| 2 | **学习分析仪表板** | 跨模块进度追踪、技能徽章、学习路径推荐 | 高 | 中 |
| 3 | **导师-学生批注系统** | 设计/文档上的叠加反馈、版本追踪、异步评审工作流 | 高 | 中 |
| 4 | **社区设计市集** | 分享/点赞/Fork 空间设计模板 | 中高 | 中 |
| 5 | **交互式3D体验模拟** | 实时模拟人流、照明覆盖、声学区域 | 中高 | 高 |

---

## 维度三：极致打磨（UI/UX/性能）

### 性能优化（HIGH Impact）

| # | 问题 | 位置 | 预期收益 |
|---|------|------|---------|
| 1 | 未使用 next/image，无 blur 占位 | `public/images/` 19个 JPG | 图片加载提升 20-30% |
| 2 | ParticleField 离屏仍消耗 CPU | `src/components/brand/ParticleField.tsx` | CPU 降低 5-10% |
| 3 | Canvas3D 未限制像素比 | `src/features/lab-editor/Canvas3D.tsx` | 低端设备 GPU 减负 15-20% |
| 4 | AI SDK 三个 provider 全量打包 | `package.json` | 按需动态 import |
| 5 | html2canvas+jspdf 非条件导入 | ExportDialog | 懒加载导出工具 |

### UI/UX 打磨

| 项目 | 当前状态 | 改进方向 |
|------|---------|---------|
| 暗色模式 | 优秀 - 情感化主题 | 无需改进 |
| 动画 | 良好 - Framer Motion 集成 | ParticleField 添加帧率限制 |
| 加载状态 | 部分覆盖（仅 spinner） | 添加 Skeleton Loader |
| 空状态 | 缺失 | 设计空态卡片 + 引导 |
| 可访问性 | 良好基础 | 3D 组件添加键盘导航 |
| 微交互 | 已打磨 | 基本无需改进 |
| 响应式 | 良好 | Canvas 元素方向切换适配 |

---

## 维度四：内容体系深化

### 三层架构完成度

```
Core（核心层）    ████████████████████ 100%  ← 9/9 模块完整
Extend（扩展层）  ████████████████░░░░  85%  ← 105 文件，M08/M09 偏少
Evidence（证据层） ░░░░░░░░░░░░░░░░░░░░   0%  ← 完全空白！
Cases（案例层）   █░░░░░░░░░░░░░░░░░░░  10%  ← 仅 8 个案例
```

### 模块深度评估

| 模块 | 核心 | 扩展文件数 | 案例 | 完成度 | 优先补充 |
|------|------|-----------|------|--------|---------|
| M01 基础 | 44KB | 16 | 1 | 75% | 证据层 |
| M02 治理 | 78KB | 11 | 1 | 70% | 扩展+证据 |
| M03 空间 | 84KB | 13 | 1 | 75% | 证据层 |
| M04 课程 | 110KB | 13 | 1 | 75% | 案例+证据 |
| M05 工具 | 84KB | 10 | 1 | 70% | 扩展+证据 |
| M06 安全 | 83KB | 14 | 1 | 80% | 证据层 |
| M07 人员 | 101KB | 12 | 1 | 75% | 证据层 |
| **M08 运营** | 76KB | **6** | 1 | **60%** | **扩展急需补充** |
| **M09 评估** | 79KB | **8** | **0** | **65%** | **案例+扩展急需** |

### 内容深化路线

| 阶段 | 时间 | 重点 |
|------|------|------|
| Phase 1 | 4-6周 | 创建 40-60 个证据/引用文件；补充 20+ 案例；扩充 M08/M09 |
| Phase 2 | 8-12周 | 启动英文翻译管线（核心模块优先）；创建 10+ SOP/检查单 |
| Phase 3 | 3-6月 | 完成英文本地化 90%+；建设跨模块知识图谱链接 |

---

## 维度五：技术架构优化

### CRITICAL
| # | 问题 | 修复方案 |
|---|------|---------|
| 1 | 环境变量无运行时校验，缺失时静默降级 | 创建 `src/lib/env.ts` + Zod schema，启动时 fail fast |

### IMPORTANT
| # | 问题 | 修复方案 |
|---|------|---------|
| 2 | API 错误响应不一致，缺少 HTTP 状态码 | 统一 ApiError 类，标准化 400/401/429/500 |
| 3 | 22 处 `any` 类型（strict 模式下） | 为 Equipment、IconType、node 变换创建类型定义 |
| 4 | ESLint 配置缺失 | 添加 eslint.config.js + no-explicit-any 规则 |
| 5 | 无 Tailwind 配置文件 | 验证 Tailwind v4 CSS-first 配置，或创建 tailwind.config.ts |
| 6 | 无安全头（CORS/CSP） | 添加 middleware.ts 安全头 |

### NICE-TO-HAVE
| # | 问题 | 修复方案 |
|---|------|---------|
| 7 | 零测试覆盖 | 添加 vitest，优先测试 Zustand stores 和 API routes |
| 8 | 30 个 console.* 语句 | 替换为 logger 服务 |
| 9 | multiverse-store 过大（169行） | 拆分子 store |

### Quick Wins（各 1-2 小时）
1. API 路由添加正确 HTTP 状态码
2. 创建 ESLint 配置
3. 创建 env.ts 环境变量校验
4. 验证/创建 Tailwind 配置

---

## 实施优先级总排序

### Tier 1 - 立即修复（影响用户体验/系统可靠性）
1. 修复 9 个 404 断链页面
2. 创建 env.ts 环境变量校验
3. API 错误响应标准化
4. 404 页面本地化
5. loading.tsx 添加

### Tier 2 - 短期改进（1-4 周）
6. 内容证据层启动（40+ 引用文件）
7. next/image 迁移 + blur 占位
8. ESLint 配置
9. Skeleton Loader 替换 Spinner
10. M08/M09 内容扩充

### Tier 3 - 中期增强（1-3 月）
11. 3E 进度面板 MVP
12. 学习分析仪表板
13. 英文翻译管线启动
14. 安全头中间件
15. ParticleField/Canvas3D 性能优化

### Tier 4 - 长期规划（3-6 月）
16. 导师-学生批注系统
17. 社区设计市集
18. 测试覆盖体系
19. 交互式 3D 体验模拟
20. 完整英文本地化
