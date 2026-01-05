import type { ExplorerConfig } from "../types";

export const M05_CONFIG: ExplorerConfig = {
  moduleId: "M05",
  title: "工具分级探索器",
  subtitle: "Tools & Equipment",
  description: "Lite 入门 → Pro 专业 → Ultra 旗舰，渐进式设备配置满足不同阶段需求",
  categories: [
    {
      id: "lite",
      tag: "LITE",
      title: "入门套件 Starter Kit",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "lite-making",
          name: "基础制作工具",
          nameEn: "Basic Making Tools",
          description: "满足入门级创作需求的核心工具，强调易用性和安全性，适合新手快速上手。",
          details: [
            "3D打印机（FDM桌面级）",
            "激光切割机（小功率CO2）",
            "电子套件（Arduino入门）",
            "手工工具基础套装",
          ],
        },
        {
          id: "lite-digital",
          name: "基础数字工具",
          nameEn: "Basic Digital Tools",
          description: "支持数字化创作和学习的基础软硬件配置。",
          details: [
            "笔记本电脑3-5台",
            "开源设计软件",
            "基础网络设施",
            "投影/显示设备",
          ],
        },
      ],
    },
    {
      id: "pro",
      tag: "PRO",
      title: "专业套件 Advanced Kit",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "pro-making",
          name: "专业制作设备",
          nameEn: "Professional Making Equipment",
          description: "满足专业级项目需求，支持更复杂的创作和更高质量的产出。",
          details: [
            "工业级3D打印（SLA/SLS）",
            "大幅面激光切割机",
            "CNC雕刻机",
            "PCB制作设备",
          ],
        },
        {
          id: "pro-workshop",
          name: "专业工作站",
          nameEn: "Professional Workstation",
          description: "完整的专业工作环境，支持高阶项目开发。",
          details: [
            "高性能工作站",
            "专业设计软件授权",
            "电子工作台全套",
            "测量测试仪器",
          ],
        },
      ],
    },
    {
      id: "ultra",
      tag: "ULTRA",
      title: "旗舰套件 Professional Kit",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "ultra-advanced",
          name: "前沿技术设备",
          nameEn: "Cutting-edge Technology",
          description: "接轨工业前沿的高端设备，支持创新研发和产品原型制作。",
          details: [
            "金属3D打印机",
            "多轴CNC加工中心",
            "SMT贴片生产线",
            "VR/AR开发套件",
          ],
        },
        {
          id: "ultra-ai",
          name: "AI 工具链",
          nameEn: "AI Toolkit",
          description: "AI 时代的创作伙伴，从文本生成到图像创作，从代码辅助到智能设计。",
          details: [
            "LLM API 接入（Claude/GPT）",
            "图像生成工具",
            "代码辅助工具",
            "AI 硬件开发套件",
          ],
        },
      ],
    },
  ],
  footer: "工具的价值在于赋能而非炫耀——适度配置，充分利用",
};
