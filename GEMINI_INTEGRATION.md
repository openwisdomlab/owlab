# Gemini 图像生成集成指南

本文档说明如何在 OWL 项目中集成 Google Gemini 图像生成功能。

## 📋 目录

- [快速开始](#快速开始)
- [架构方案](#架构方案)
- [实施步骤](#实施步骤)
- [使用示例](#使用示例)
- [OWL 应用场景](#owl-应用场景)
- [故障排除](#故障排除)

---

## 🚀 快速开始

### 1. 获取 API Key

访问 [Google AI Studio](https://aistudio.google.com/apikey) 创建 Gemini API key。

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. 选择实施方案

Gemini 图像生成目前主要支持 Python SDK，有两种集成方案：

- **方案 A**：Python 微服务（推荐，功能完整）
- **方案 B**：等待官方 JavaScript SDK（未来）

---

## 🏗️ 架构方案

### 方案 A：Python 微服务桥接（推荐）

```
┌─────────────────┐      HTTP POST      ┌─────────────────┐
│                 │   /generate-image   │                 │
│   OWL Next.js   ├────────────────────>│  Python Service │
│   Frontend      │                     │  (FastAPI)      │
│                 │<────────────────────┤                 │
└─────────────────┘   Base64 JPEG       └────────┬────────┘
                                                  │
                                                  │ Gemini API
                                                  │
                                            ┌─────▼────────┐
                                            │              │
                                            │  Google AI   │
                                            │   Platform   │
                                            │              │
                                            └──────────────┘
```

**优点**：
- ✅ 完整功能支持（多轮对话、图像编辑、Google Search）
- ✅ 独立部署，易于扩展
- ✅ 可复用 Python 生态工具

**缺点**：
- ❌ 需要额外的服务部署
- ❌ 增加架构复杂度

---

## 📦 实施步骤

### 步骤 1: 创建 Python 微服务

#### 1.1 创建服务目录

```bash
mkdir -p services/gemini-image-service
cd services/gemini-image-service
```

#### 1.2 创建 `requirements.txt`

```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
google-genai==1.0.0
pillow==11.0.0
python-multipart==0.0.20
python-dotenv==1.0.1
```

#### 1.3 创建 `main.py`

```python
import os
import base64
from io import BytesIO
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from PIL import Image
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="OWL Gemini Image Service")

# CORS configuration for Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://owlab.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

class ImageGenerationRequest(BaseModel):
    prompt: str
    aspect_ratio: str = "16:9"
    image_size: str = "2K"
    use_google_search: bool = False

class ImageGenerationResponse(BaseModel):
    image_base64: str
    text: Optional[str] = None
    model: str
    format: str = "jpeg"

@app.post("/generate-image", response_model=ImageGenerationResponse)
async def generate_image(request: ImageGenerationRequest):
    """Generate an image using Gemini API"""
    try:
        # Build config
        config = types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(
                aspect_ratio=request.aspect_ratio,
                image_size=request.image_size
            ),
        )

        # Add Google Search if requested
        if request.use_google_search:
            config.tools = [{"google_search": {}}]

        # Generate image
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=[request.prompt],
            config=config,
        )

        # Extract image and text
        image_base64 = None
        text_response = None

        for part in response.parts:
            if part.text:
                text_response = part.text
            elif part.inline_data:
                # Convert to base64
                img = part.as_image()
                buffered = BytesIO()
                img.save(buffered, format="JPEG")
                image_base64 = base64.b64encode(buffered.getvalue()).decode()

        if not image_base64:
            raise HTTPException(status_code=500, detail="No image generated")

        return ImageGenerationResponse(
            image_base64=image_base64,
            text=text_response,
            model="gemini-3-pro-image-preview",
            format="jpeg"
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "gemini_api_configured": bool(os.environ.get("GEMINI_API_KEY"))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### 1.4 创建 `Dockerfile`

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 1.5 创建 `docker-compose.yml`

```yaml
version: '3.8'

services:
  gemini-image-service:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

### 步骤 2: 启动服务

```bash
# 方式 1: 使用 Docker Compose（推荐）
docker-compose up -d

# 方式 2: 直接运行 Python
pip install -r requirements.txt
python main.py
```

验证服务运行：
```bash
curl http://localhost:8000/health
```

### 步骤 3: 更新 OWL Next.js 配置

在 `/src/lib/ai/providers/gemini-image.ts` 中，更新 `generateWithGemini` 函数：

```typescript
export async function generateWithGemini(
  config: GeminiImageConfig
): Promise<GeminiImageResult> {
  const serviceUrl = process.env.GEMINI_SERVICE_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${serviceUrl}/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: config.prompt,
        aspect_ratio: config.aspectRatio || "16:9",
        image_size: config.imageSize || "2K",
        use_google_search: config.useGoogleSearch || false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Image generation failed");
    }

    const data = await response.json();

    return {
      imageData: data.image_base64,
      text: data.text,
      model: data.model,
    };
  } catch (error) {
    throw new Error(
      `Gemini image generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
```

在 `.env.local` 中添加：
```bash
GEMINI_SERVICE_URL=http://localhost:8000
# 生产环境: GEMINI_SERVICE_URL=https://your-gemini-service.com
```

---

## 💡 使用示例

### 前端调用示例

```typescript
// 在 React 组件中使用
async function generateLivingModuleIllustration() {
  const response = await fetch("/api/ai/gemini-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promptType: "livingModule",
      promptArgs: [
        "L04 技术的诗意",
        "展示具身技术和平静设计的概念，人与技术和谐共处"
      ],
      aspectRatio: "16:9",
      imageSize: "2K",
    }),
  });

  const data = await response.json();

  if (data.success) {
    // 显示 Base64 图像
    const imageUrl = `data:image/jpeg;base64,${data.imageData}`;
    return imageUrl;
  }
}
```

### 直接调用 Python 服务

```bash
curl -X POST http://localhost:8000/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a minimalist illustration of embodied technology for OWL, neon pink and cyan on dark background, 16:9",
    "aspect_ratio": "16:9",
    "image_size": "2K"
  }'
```

---

## 🎨 OWL 应用场景

### 1. Living Modules 配图

为每个 Living Module (L01-L04) 生成概念插图：

```typescript
// L01 空间塑造
fetch("/api/ai/gemini-image", {
  method: "POST",
  body: JSON.stringify({
    promptType: "livingModule",
    promptArgs: [
      "L01 空间塑造",
      "展示神经建筑学理念，学习空间如何影响认知"
    ],
    aspectRatio: "16:9",
    imageSize: "2K",
  }),
});

// L04 技术的诗意
fetch("/api/ai/gemini-image", {
  method: "POST",
  body: JSON.stringify({
    promptType: "livingModule",
    promptArgs: [
      "L04 技术的诗意",
      "具身技术、平静设计、人与工具的和谐关系"
    ],
  }),
});
```

### 2. 知识库可视化

为知识库模块生成图表：

```typescript
fetch("/api/ai/gemini-image", {
  method: "POST",
  body: JSON.stringify({
    promptType: "conceptDiagram",
    promptArgs: [
      "3E Framework",
      ["Enlighten 启发", "Empower 赋能", "Engage 参与"]
    ],
    aspectRatio: "1:1",
  }),
});
```

### 3. 空间设计可视化

为创客空间生成效果图：

```typescript
fetch("/api/ai/gemini-image", {
  method: "POST",
  body: JSON.stringify({
    promptType: "spaceVisualization",
    promptArgs: [
      "开放式创客空间，模块化家具，协作区域，3D打印机和激光切割机可见"
    ],
    aspectRatio: "21:9",
    imageSize: "4K", // 高分辨率用于展示
  }),
});
```

### 4. 教育插图

为不同年龄段生成教育内容：

```typescript
fetch("/api/ai/gemini-image", {
  method: "POST",
  body: JSON.stringify({
    promptType: "educationalIllustration",
    promptArgs: [
      "延伸心智理论",
      "中学生（13-15岁）"
    ],
    aspectRatio: "4:3",
  }),
});
```

---

## 🔧 故障排除

### 问题 1: "GEMINI_API_KEY is not configured"

**解决方案**：
1. 检查 `.env.local` 文件中是否设置了 `GEMINI_API_KEY`
2. 重启 Next.js 开发服务器（`pnpm dev`）
3. 重启 Python 服务（如果使用）

### 问题 2: Python 服务连接失败

**解决方案**：
```bash
# 检查服务是否运行
curl http://localhost:8000/health

# 检查 Docker 容器
docker ps | grep gemini

# 查看日志
docker-compose logs -f gemini-image-service
```

### 问题 3: 图像格式错误

**原因**：Gemini 返回 JPEG 格式，但保存为 PNG 扩展名

**解决方案**：
- 始终使用 `.jpg` 扩展名保存
- 或在保存时显式转换为 PNG 格式

```python
# Python 端
img.save("output.jpg")  # 正确

# 如需 PNG
img.save("output.png", format="PNG")  # 显式转换
```

### 问题 4: 生成速度慢

**优化建议**：
- 使用 `1K` 分辨率加快生成（默认）
- 仅在最终版本使用 `4K` 分辨率
- 考虑实现缓存机制

---

## 📚 相关资源

- [Gemini API 文档](https://ai.google.dev/gemini-api/docs)
- [OWL 技能文档](~/.claude/skills/gemini-imagegen.md)
- [Python SDK 仓库](https://github.com/google/generative-ai-python)
- [FastAPI 文档](https://fastapi.tiangolo.com/)

---

## 🚀 部署建议

### 开发环境
- Python 服务本地运行（`localhost:8000`）
- Next.js 开发服务器（`localhost:3000`）

### 生产环境
- 部署 Python 服务到 Cloud Run、Railway、或 Fly.io
- 设置 `GEMINI_SERVICE_URL` 环境变量指向生产服务
- 配置 CORS 允许生产域名

**示例 Cloud Run 部署**：
```bash
cd services/gemini-image-service
gcloud run deploy gemini-image-service \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$GEMINI_API_KEY
```

---

**最后更新**: 2026-01-04
**维护者**: OWL Team
