import type { ExplorerConfig } from "../types";

export const M03_CONFIG: ExplorerConfig = {
  moduleId: "M03",
  title: "空间设计探索器",
  subtitle: "Space Design Framework",
  description: "物理-数字-文化三层融合，场所-属性-行动-态度四维语法",
  categories: [
    {
      id: "physical",
      tag: "PHYSICAL",
      title: "物理层 Physical Layer",
      color: {
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/5 dark:bg-amber-500/10",
      },
      items: [
        {
          id: "functional-zones",
          name: "功能分区",
          nameEn: "Functional Zones",
          description: "科学规划制作区、展示区、存储区、休息区，确保动线流畅、互不干扰。",
          details: [
            "制作区：核心工作空间，设备集中",
            "展示区：作品陈列，激发灵感",
            "存储区：材料工具有序归置",
            "休息区：思考放松的缓冲空间",
          ],
        },
        {
          id: "equipment-layout",
          name: "设备布局",
          nameEn: "Equipment Layout",
          description: "按安全等级和使用频率布置设备，确保安全间距和操作便利。",
          details: [
            "高频低风险设备靠近入口",
            "高风险设备设置安全区域",
            "相关设备临近布置形成工作站",
          ],
        },
      ],
    },
    {
      id: "digital",
      tag: "DIGITAL",
      title: "数字层 Digital Layer",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "network-infra",
          name: "网络基础设施",
          nameEn: "Network Infrastructure",
          description: "稳定高速的网络是数字化创作的基础，支持在线协作、资源访问和作品分享。",
          details: [
            "全覆盖 WiFi，带宽充足",
            "有线网络备份关键设备",
            "云存储和协作平台支持",
          ],
        },
        {
          id: "display-system",
          name: "显示系统",
          nameEn: "Display System",
          description: "大屏幕用于教学演示、作品展示和信息发布，是数字与物理的连接点。",
          details: [
            "教学区大屏幕投影",
            "实时信息展示屏",
            "互动触摸屏体验",
          ],
        },
      ],
    },
    {
      id: "cultural",
      tag: "CULTURAL",
      title: "文化层 Cultural Layer",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "atmosphere",
          name: "氛围营造",
          nameEn: "Atmosphere Design",
          description: "空间的「肢体语言」——通过视觉、触觉、嗅觉传递「这里欢迎你动手探索」的信号。",
          details: [
            "半成品项目可见，激发好奇",
            "工具触手可及，降低门槛",
            "允许适度混乱，容纳创意",
          ],
        },
        {
          id: "community-identity",
          name: "社区认同",
          nameEn: "Community Identity",
          description: "通过作品展示、成长记录和仪式设计，让学习者感受到归属感和成就感。",
          details: [
            "作品墙记录创造历程",
            "学员故事传承社区文化",
            "开幕闭幕仪式塑造记忆",
          ],
        },
      ],
    },
  ],
  footer: "空间会说话——好的设计让人走进来就想动手",
};
