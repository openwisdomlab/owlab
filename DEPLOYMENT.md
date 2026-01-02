# 部署指南

本文档介绍如何将 OWL 项目部署到 Vercel 和 Zeabur 平台。

## 平台选择

### Vercel
- 专为 Next.js 优化，零配置部署
- 全球 CDN 网络，访问速度快
- 自动 HTTPS 和域名配置
- 适合：国际化项目、需要全球加速的应用

### Zeabur
- 支持多种框架和语言
- 简单易用的控制面板
- 灵活的资源配置
- 适合：中国大陆访问、需要自定义资源的项目

## Vercel 部署

### 快速部署

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Import Project"
3. 导入 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目并使用 `vercel.json` 配置

### 配置说明

项目已包含 `vercel.json` 配置文件，主要设置：

- **构建配置**
  - 构建命令：`npm run build`
  - 安装命令：`npm install`
  - 输出目录：`.next`

- **部署区域**
  - 香港：`hkg1`
  - 旧金山：`sfo1`
  - 可根据需要调整区域

- **安全头部**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### 环境变量

如需配置环境变量，在 Vercel 项目设置中添加：

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

如果项目使用了 AI 功能，还需添加：

```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here
```

### 自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加自定义域名
3. 按照提示配置 DNS 记录

## Zeabur 部署

### 快速部署

1. 访问 [Zeabur](https://zeabur.com)
2. 创建新项目
3. 连接 GitHub 仓库
4. Zeabur 会自动检测 `zeabur.json` 并部署

### 配置说明

项目已包含 `zeabur.json` 配置文件，主要设置：

- **构建配置**
  - 项目类型：Next.js
  - 构建命令：`npm run build`
  - 安装命令：`npm install`
  - 输出目录：`.next`

- **运行时配置**
  - 启动命令：`npm start`
  - 框架：Next.js

- **部署设置**
  - 区域：香港 (hkg)
  - 健康检查路径：`/`
  - 超时时间：30秒
  - 检查间隔：10秒

- **资源限制**
  - 内存：1024Mi
  - CPU：1000m (1核)

### 环境变量

在 Zeabur 项目设置中添加环境变量：

```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

AI 功能相关的环境变量（如需要）：

```
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
GOOGLE_API_KEY=your_key_here
REPLICATE_API_TOKEN=your_token_here
```

### 资源调整

根据实际需要，可以在 Zeabur 控制面板调整资源配置，或修改 `zeabur.json` 中的 `resources` 部分：

```json
"resources": {
  "limits": {
    "memory": "2048Mi",  // 调整内存
    "cpu": "2000m"       // 调整 CPU
  }
}
```

### 自定义域名

1. 在 Zeabur 项目设置中点击 "Domains"
2. 添加自定义域名
3. 配置 CNAME 记录指向 Zeabur 提供的地址

## 持续部署

两个平台都支持自动部署：

- **Vercel**：推送到 `main` 分支自动部署生产环境
- **Zeabur**：推送到配置的分支自动部署

预览分支：
- Vercel：每个 PR 自动创建预览环境
- Zeabur：支持配置多个分支环境

## 监控和日志

### Vercel

- 在项目面板查看部署日志
- 使用 Vercel Analytics 查看访问数据
- 使用 Vercel Speed Insights 监控性能

### Zeabur

- 在项目面板查看构建和运行日志
- 查看资源使用情况
- 配置告警通知

## 故障排查

### 构建失败

1. 检查 `package.json` 中的依赖版本
2. 确保 Node.js 版本兼容（建议 18+）
3. 查看构建日志获取详细错误信息

### 运行时错误

1. 检查环境变量是否正确配置
2. 查看运行时日志
3. 确保 API 密钥有效

### 性能问题

1. 启用 Next.js 图片优化
2. 使用 CDN 加速静态资源
3. 根据需要调整区域和资源配置

## 成本优化

### Vercel

- 免费套餐适合个人和小型项目
- Pro 套餐适合商业项目
- 注意函数执行时间和带宽限制

### Zeabur

- 按使用量计费，更灵活
- 可以根据流量动态调整资源
- 暂停不使用的服务可节省成本

## 安全建议

1. **使用环境变量**：不要在代码中硬编码密钥
2. **启用 HTTPS**：两个平台都默认启用
3. **配置安全头部**：已在 `vercel.json` 中配置
4. **定期更新依赖**：保持依赖包最新以修复安全漏洞
5. **设置访问控制**：为敏感功能添加认证

## 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Zeabur 文档](https://zeabur.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)

---

有问题？请查看项目 [Issues](https://github.com/openwisdomlab/owlab/issues) 或提交新问题。
