# 贡献指南 (Contributing Guide)

感谢您对 OWLab 项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 报告 Bug 或提出功能建议
- 改进文档或代码
- 提交新的案例或资源
- 参与讨论和代码审查

## 目录

- [行为准则](#行为准则)
- [开始之前](#开始之前)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [文档规范](#文档规范)
- [提交规范](#提交规范)

---

## 行为准则

请阅读并遵守我们的[行为准则](./CODE_OF_CONDUCT.md)。我们致力于为所有参与者提供一个友好、安全和包容的环境。

---

## 开始之前

### 了解项目结构

- `/content/docs/` - 文档内容（中英文知识库）
- `/src/` - 源代码
- `/public/` - 静态资源
- `.env.example` - 环境变量示例

### 阅读相关文档

在贡献之前，请先阅读：

1. [知识库架构文档](./content/docs/zh/knowledge-base/ARCHITECTURE-V2.mdx)
2. [协作与版本机制](./content/docs/zh/knowledge-base/COLLABORATION-PROTOCOL.mdx)
3. [全局定义与分级体系](./content/docs/zh/knowledge-base/GLOBAL-DEFINITIONS.mdx)

---

## 如何贡献

### 报告 Bug

如果您发现了 Bug，请：

1. 在 [Issues](https://github.com/openwisdomlab/owlab/issues) 中搜索，确认该问题尚未被报告
2. 创建新的 Issue，并包含以下信息：
   - 清晰的标题和描述
   - 复现步骤
   - 预期行为 vs 实际行为
   - 截图（如适用）
   - 环境信息（操作系统、浏览器版本等）

### 提出功能建议

1. 在 [Issues](https://github.com/openwisdomlab/owlab/issues) 中创建功能请求
2. 详细描述：
   - 该功能解决什么问题
   - 建议的实现方式
   - 可能的替代方案
   - 对现有功能的影响

### 提交代码

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 改进文档

文档改进遵循与代码相同的流程。对于知识库内容的修改，请特别注意：

- 遵循模块化架构规范
- 使用标准的 Frontmatter 格式
- 确保术语使用符合 GLOBAL-DEFINITIONS
- 引用文献使用 APA7 格式

---

## 开发流程

### 环境搭建

```bash
# 克隆仓库
git clone https://github.com/openwisdomlab/owlab.git
cd owlab

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看效果。

### 分支策略

- `main` - 主分支，用于生产环境
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - Bug 修复分支
- `docs/*` - 文档更新分支

### Pull Request 流程

1. **创建 PR 前**：
   - 确保代码通过所有测试
   - 更新相关文档
   - 遵循代码规范

2. **PR 描述应包含**：
   - 变更的目的和背景
   - 主要变更内容
   - 相关的 Issue 编号
   - 截图（如适用）

3. **审查过程**：
   - 至少需要 1 位维护者审查
   - 解决所有审查意见
   - 确保 CI 检查通过

---

## 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 编写类型安全的代码
- 遵循 ESLint 配置规则
- 使用函数式编程风格（优先使用 const、箭头函数等）
- 组件优先使用 React Hooks

### 命名规范

- 文件名：kebab-case（如 `user-profile.tsx`）
- 组件名：PascalCase（如 `UserProfile`）
- 变量/函数：camelCase（如 `getUserData`）
- 常量：UPPER_SNAKE_CASE（如 `MAX_COUNT`）

### 注释规范

```typescript
/**
 * 获取用户数据
 * @param userId - 用户ID
 * @returns 用户数据对象
 */
async function getUserData(userId: string): Promise<UserData> {
  // 实现...
}
```

---

## 文档规范

### MDX 文件格式

所有 `.mdx` 文件必须包含 Frontmatter：

```yaml
---
title: 文档标题
description: 简短描述
---
```

### 知识库内容规范

1. **模块结构**：遵循 M00-M10 的模块化架构
2. **术语使用**：参考 `GLOBAL-DEFINITIONS.mdx`
3. **引用格式**：使用 APA7 格式
4. **证据标注**：标注证据强度等级（E0-E3）
5. **风险标注**：标注风险等级（R0-R3）

### 中英文文档

- 优先完善中文文档
- 英文文档保持与中文文档同步
- 使用专业术语的标准翻译

---

## 提交规范

### Commit Message 格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具链相关

#### 示例

```
feat(auth): 添加用户登录功能

- 实现用户名密码登录
- 添加 JWT token 验证
- 更新登录页面 UI

Closes #123
```

---

## 审查标准

### 代码审查关注点

- [ ] 代码逻辑正确
- [ ] 没有明显的性能问题
- [ ] 遵循项目代码规范
- [ ] 有必要的注释
- [ ] 没有遗留的调试代码
- [ ] 安全性（无注入漏洞、XSS 等）

### 文档审查关注点

- [ ] 内容准确无误
- [ ] 格式符合规范
- [ ] 术语使用一致
- [ ] 引用完整且正确
- [ ] 链接有效
- [ ] 无拼写或语法错误

---

## 获取帮助

如果您在贡献过程中遇到问题：

1. 查看 [FAQ](./content/docs/zh/knowledge-base/M00-Meta/index.mdx)
2. 在 [Discussions](https://github.com/openwisdomlab/owlab/discussions) 中提问
3. 通过 [Issues](https://github.com/openwisdomlab/owlab/issues) 报告问题

---

## 致谢

感谢所有为 OWLab 项目做出贡献的人！您的参与让这个项目变得更好。

---

## 许可证

通过贡献代码，您同意您的贡献将在与本项目相同的许可证下发布。

---

**祝您贡献愉快！**
