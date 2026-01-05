# OWL 品牌视觉资产使用指南

> **版本**: 1.1.0
> **更新日期**: 2026-01-04
> **生成工具**: Google Gemini 3.0 Pro Image

---

## 📸 已生成的视觉资产总览

### 资产清单

✅ **已成功生成**: 10个核心品牌资产（全部完成）

```
public/images/brand/
├── owl-brand-logo-final.jpg    # 745KB - OWL主标志
├── owl-states/                  # 猫头鹰五种状态
│   ├── owl-gaze-state.jpg      # 604KB - 凝视状态
│   ├── owl-spark-state.jpg     # 626KB - 灵光状态
│   ├── owl-connect-state.jpg   # 649KB - 连接状态
│   ├── owl-flight-state.jpg    # 696KB - 飞翔状态
│   └── owl-share-state.jpg     # 573KB - 分享状态
├── concepts/                    # 概念说明图
│   ├── particle-field-hero.jpg           # 680KB - 粒子场背景
│   ├── geometric-lattice-framework.jpg   # 643KB - 几何框架
│   └── visual-dna-three-genes.jpg        # 554KB - 三大基因
└── modules/                     # 模块图标
    └── module-icons-m01-m03.jpg          # 559KB - M01-M03预览
```

**总计**: ~6.3MB 高质量品牌视觉资产

---

## 🎨 视觉资产详解

### 0. OWL 主标志

#### 🦉 OWL Brand Logo - 品牌核心标识

**文件**: `owl-brand-logo-final.jpg`

**视觉特征**:
- 几何化的猫头鹰脸部/眼睛作为核心元素
- 一只眼睛蓝色 (#2563EB)，一只眼睛粉色 (#D91A7A)，象征双重本质：理性与创意的结合
- 六边形或圆形几何框架
- 边缘的精致粒子效果
- 简洁、极简主义的构图
- 可作为完整logo或独立图标使用

**色彩配置**:
- 霓虹粉 (#D91A7A) 和蓝色 (#2563EB)
- 深色背景 (#0E0E14)
- 高对比度确保可见性
- 未来科技美学
- 温暖而友好，非冷淡风格
- 玩味的精致感

**适用场景**:
- 网站Favicon (16x16)
- App图标 (512x512)
- 页面Header/Footer
- 品牌宣传材料
- 社交媒体头像
- PPT封面
- 品牌文档水印

**使用建议**:
```tsx
// 网站Logo（导航栏）
<Image
  src="/images/brand/owl-brand-logo-final.jpg"
  alt="OWL Innovation Lab"
  width={120}
  height={120}
  className="rounded-lg"
/>

// App Icon (大尺寸)
<Image
  src="/images/brand/owl-brand-logo-final.jpg"
  alt="OWL"
  width={512}
  height={512}
  quality={95}
/>

// Favicon (需要额外转换为ICO格式)
// convert owl-brand-logo-final.jpg -resize 32x32 favicon.ico
```

**技术要求**:
- ✅ 在16px (favicon) 到500px+ 尺寸下都能清晰显示
- ✅ 单色版本下可识别
- ✅ 可识别的轮廓
- ✅ 独特且具有品牌所有权
- ✅ 适合矢量化转换

---

### 1. 猫头鹰五种状态

#### 🦉 凝视 (Gaze) - 好奇的起点

**文件**: `owl-gaze-state.jpg`

**视觉特征**:
- 双色渐变眼睛：粉色和蓝色同心圆
- 六边形几何框架包围
- 探测波纹（同心圆扩散）
- 从眼睛发出的好奇光束
- 电路纹理和粒子点缀

**色彩配置**:
- 主色：Blue (#2563EB) 占70%
- 点缀：Pink (#D91A7A) 占30%
- 背景：Dark (#0E0E14)

**适用场景**:
- 知识库首页banner
- M01理念模块图标
- M06安全模块图标
- "发现问题"阶段引导
- 探索功能入口

**使用建议**:
```tsx
// 作为模块图标（200x200）
<Image
  src="/images/brand/owl-states/owl-gaze-state.jpg"
  alt="探索与好奇"
  width={200}
  height={200}
  className="rounded-lg shadow-lg"
/>

// 作为大型装饰（500x500）
<div className="relative w-[500px] h-[500px]">
  <Image
    src="/images/brand/owl-states/owl-gaze-state.jpg"
    alt="OWL Gaze"
    fill
    className="object-cover"
  />
</div>
```

---

#### ✨ 灵光 (Spark) - 奇思妙想

**文件**: `owl-spark-state.jpg`

**视觉特征**:
- 爆炸性的几何碎片（三角形、菱形）
- 粉色和蓝色粒子随机碰撞
- 紫色(#8B5CF6)碰撞火花
- 不规则、动态的构图
- "EUREKA SPARK"文字（可裁剪掉）

**色彩配置**:
- Pink和Blue粒子各占50%
- Violet碰撞效果
- 高饱和度、高对比度

**适用场景**:
- AI Lab工具入口
- 创意工具图标
- 头脑风暴功能
- "灵感时刻"通知
- Living Modules配图

**使用建议**:
```tsx
// 动态效果（配合动画）
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <Image
    src="/images/brand/owl-states/owl-spark-state.jpg"
    alt="灵感爆发"
    width={300}
    height={300}
  />
</motion.div>
```

---

#### 🔗 连接 (Connect) - 偶然连接

**文件**: `owl-connect-state.jpg`

**视觉特征**:
- 网络节点结构
- 多个"眼睛"通过光束连接
- 渐变色连接线（Pink → Violet → Blue → Cyan）
- 节点处形成发光晶体
- 网络呼吸感

**色彩配置**:
- 全光谱渐变
- 连接线透明度渐变
- 节点发光效果

**适用场景**:
- 社区网络页面
- M02治理模块
- M08运营模块
- 协作项目展示
- 跨界融合场景

---

#### 🪶 飞翔 (Flight) - 勇敢探索

**文件**: `owl-flight-state.jpg`

**视觉特征**:
- 展开的翅膀轮廓
- 羽毛飘散轨迹
- 向前飞行的动态姿态
- Cyan路径轨迹
- 粒子形成羽毛纹理

**色彩配置**:
- 主色：Pink（行动）
- 轨迹：Cyan（创新路径）
- 羽毛渐变：Pink → Violet → Blue

**适用场景**:
- 项目启动页
- M03空间模块
- M05工具模块
- "探索"功能
- 实践阶段引导

---

#### 🌟 分享 (Share) - 开放共享

**文件**: `owl-share-state.jpg`

**视觉特征**:
- 同心圆波纹扩散
- 眼睛变成光源
- 向外辐射的开放构图
- 全光谱色彩
- 波纹渐变透明

**色彩配置**:
- Pink + Blue + Cyan + Violet全光谱
- 多样性和包容性
- 波纹由实到虚

**适用场景**:
- 作品展示页
- M07人员模块
- M09成长模块
- 开源分享功能
- 社区成果展示

---

### 2. 三大视觉基因说明图

#### 🧬 三基因组合

**文件**: `visual-dna-three-genes.jpg`

**内容说明**:
- **左侧**: GEOMETRIC LATTICE - 蓝色几何晶格，精确、有序、理性
- **中央**: ENERGY PARTICLE FLOW - 粉蓝粒子流，有机、涌现、玩耍
- **右侧**: HYBRID SYMBOLS - 粉色框架包含蓝色粒子，刚柔并济

**视觉价值**:
- 完美展示OWL视觉设计哲学
- 教育性强，适合对外说明
- 品牌DNA的可视化表达

**使用场景**:
- 品牌介绍PPT
- 设计系统文档
- 团队培训材料
- 对外宣传资料
- 设计规范说明

**使用示例**:
```tsx
// 文档中展示
<figure className="my-8">
  <Image
    src="/images/brand/concepts/visual-dna-three-genes.jpg"
    alt="OWL三大视觉基因"
    width={800}
    height={533}
    className="rounded-xl shadow-2xl"
  />
  <figcaption className="text-center mt-4 text-sm text-slate-500">
    OWL视觉识别系统的三大核心基因
  </figcaption>
</figure>
```

---

#### 🌌 粒子场背景

**文件**: `particle-field-hero.jpg`

**特征**:
- 16:9宽屏格式
- 数百粉蓝粒子布朗运动
- 紫色连接线网络
- 深空背景
- 适合文字叠加

**使用场景**:
- 网站首页Hero区背景
- PPT封面背景
- 视频片头背景
- 大屏展示背景

**使用示例**:
```tsx
// Hero背景
<div className="relative h-screen">
  <Image
    src="/images/brand/concepts/particle-field-hero.jpg"
    alt="Background"
    fill
    className="object-cover opacity-60"
  />
  <div className="relative z-10 flex items-center justify-center h-full">
    <h1 className="text-8xl font-bold text-white">
      OPEN WISDOM LAB
    </h1>
  </div>
</div>
```

---

#### 📐 几何晶格框架

**文件**: `geometric-lattice-framework.jpg`

**特征**:
- 等轴测网格视角
- 蓝色线框立方体阵列
- 粉色节点高亮
- 技术蓝图美学

**使用场景**:
- 知识库结构说明
- MVS框架展示
- 模块关系图
- 技术架构图背景

---

### 3. 模块图标预览

**文件**: `module-icons-m01-m03.jpg`

**内容**:
- M01理念：紫色(#8B5CF6) + 凝视状态 + 金字塔结构
- M02治理：青色(#00D9FF) + 连接状态 + 网格结构
- M03空间：绿色(#10B981) + 飞翔状态 + 立方体框架

**价值**:
- 展示模块图标设计系统
- 演示模块色彩规范
- 预览完整系列效果

**使用场景**:
- 设计评审
- 客户presentation
- 模块导航设计参考

---

## 💡 使用最佳实践

### 尺寸建议

| 用途 | 推荐尺寸 | 资产选择 |
|------|---------|---------|
| **Favicon** | 32x32 | 简化版Logo（待生成）|
| **App Icon** | 512x512 | 猫头鹰状态图标（裁剪版）|
| **导航图标** | 48x48 - 64x64 | 猫头鹰状态系列 |
| **卡片封面** | 300x300 - 400x400 | 猫头鹰状态、模块图标 |
| **页面Banner** | 1200x300 | 粒子场背景 |
| **Hero背景** | 1920x1080 | 粒子场、几何框架 |
| **PPT封面** | 1920x1080 (16:9) | 粒子场背景 |
| **社交媒体** | 1200x630 (OG) | 自定义合成 |

### 文件格式转换

当前所有资产为JPG格式，根据需要可转换：

```bash
# 转换为PNG（透明背景需要）
convert owl-gaze-state.jpg -fuzz 5% -transparent black owl-gaze-state.png

# 转换为WebP（网页优化）
cwebp -q 90 owl-gaze-state.jpg -o owl-gaze-state.webp

# 批量转换
for file in *.jpg; do cwebp -q 90 "$file" -o "${file%.jpg}.webp"; done
```

### 性能优化

**Next.js优化配置**:
```tsx
import Image from 'next/image';

// 自动优化
<Image
  src="/images/brand/owl-states/owl-gaze-state.jpg"
  alt="OWL"
  width={400}
  height={400}
  quality={85}  // 平衡质量和大小
  priority={false}  // 非关键图片延迟加载
/>
```

**CSS背景优化**:
```css
.hero-bg {
  background-image: url('/images/brand/concepts/particle-field-hero.jpg');
  background-size: cover;
  background-position: center;
  /* 移动端使用较小的图 */
  @media (max-width: 768px) {
    background-image: url('/images/brand/concepts/particle-field-hero-mobile.jpg');
  }
}
```

---

## 🔄 重新生成资产

如需调整或重新生成：

### 单个资产生成

修改`scripts/generate-brand-assets-gemini3.ts`中的提示词，然后：

```bash
# 编辑提示词
vim scripts/generate-brand-assets-gemini3.ts

# 重新生成所有
npx tsx scripts/generate-brand-assets-gemini3.ts

# 或手动调用Gemini API
curl -X POST http://localhost:8000/generate-image \
  -H "Content-Type: application/json" \
  -d @custom-prompt.json
```

### 提示词调优技巧

1. **增强特定元素**:
   ```
   "with EMPHASIS on geometric patterns"
   "featuring PROMINENT particle effects"
   ```

2. **调整构图**:
   ```
   "centered composition"
   "asymmetric layout with focal point on left"
   ```

3. **修改色彩平衡**:
   ```
   "dominant blue with pink accents"
   "equal mix of pink and blue"
   ```

4. **控制复杂度**:
   ```
   "minimalist, clean, simple"
   "rich details, intricate patterns"
   ```

---

## 📋 待生成资产清单

### 高优先级

- [x] **OWL主Logo最终版** - 1:1, 4K质量（✅ 已完成）
- [ ] **Favicon系列** - 16x16, 32x32, 64x64（简化版）
- [ ] **M04-M09模块图标** - 补全剩余6个模块

### 中优先级

- [ ] **Living Modules配图** - L01-L04各一张，16:9
- [ ] **社交媒体套图** - Twitter/LinkedIn header等
- [ ] **PPT模板背景** - 多种场景（封面、目录、内容页）

### 低优先级

- [ ] **空间导视系统** - 实体空间标识设计
- [ ] **周边设计** - T恤、贴纸、马克杯等
- [ ] **动画素材** - GIF/Lottie版本的猫头鹰状态

---

## 🎯 版权和使用规范

### 许可协议

所有OWL品牌视觉资产为**内部资产**，使用规范：

✅ **允许**:
- OWL官方网站、文档、宣传材料
- 团队内部分享、培训、展示
- 开源项目（标注OWL品牌）
- 教育和非商业用途

❌ **禁止**:
- 商业转售或再授权
- 修改后不标注来源
- 用于非OWL相关项目
- 误导性使用

### 署名要求

使用OWL品牌资产时建议署名：

```
视觉设计：OWL Innovation Lab
生成工具：Google Gemini 3.0 Pro Image
设计系统：Claude Sonnet 4.5 + OWL Team
```

---

**文档版本**: 1.1.0
**最后更新**: 2026-01-04
**维护者**: OWL Team
