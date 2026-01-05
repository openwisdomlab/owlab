import type { ExplorerConfig } from "../types";

export const M02_CONFIG: ExplorerConfig = {
  moduleId: "M02",
  title: "网络架构探索器",
  subtitle: "Governance & Network",
  description: "从旗舰节点到社区节点，四类节点构成 OWL 的分布式网络生态",
  categories: [
    {
      id: "flagship",
      tag: "FLAGSHIP",
      title: "旗舰节点 Flagship",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "flagship-node",
          name: "旗舰节点",
          nameEn: "Flagship Node",
          description: "网络核心枢纽，承担研发创新、标准制定、师资培养等关键职能。每个区域1-2个，辐射带动周边节点发展。",
          details: [
            "空间规模：200m² 以上",
            "核心职能：课程研发、师资认证、标准制定",
            "运营要求：全职团队、专业设备",
            "网络角色：区域中心、资源枢纽",
          ],
        },
      ],
    },
    {
      id: "standard",
      tag: "STANDARD",
      title: "标准节点 Standard",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "standard-node",
          name: "标准节点",
          nameEn: "Standard Node",
          description: "网络骨干力量，提供完整的创客教育服务，是大多数学习者的主要接触点。",
          details: [
            "空间规模：100-200m²",
            "核心职能：日常教学、项目指导",
            "运营要求：专/兼职导师团队",
            "网络角色：教学主力、社区核心",
          ],
        },
      ],
    },
    {
      id: "community",
      tag: "COMMUNITY",
      title: "社区节点 Community",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "community-node",
          name: "社区节点",
          nameEn: "Community Node",
          description: "轻量化的社区入口，降低参与门槛，让更多人接触创客文化。通常设在图书馆、社区中心等公共空间。",
          details: [
            "空间规模：50-100m²",
            "核心职能：体验活动、兴趣培养",
            "运营要求：志愿者+兼职导师",
            "网络角色：入口引流、普及推广",
          ],
        },
      ],
    },
    {
      id: "partner",
      tag: "PARTNER",
      title: "合作节点 Partner",
      color: {
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/5 dark:bg-amber-500/10",
      },
      items: [
        {
          id: "partner-node",
          name: "合作节点",
          nameEn: "Partner Node",
          description: "与学校、企业、机构合作设立的嵌入式空间，借助现有资源扩大覆盖面。",
          details: [
            "空间规模：灵活配置",
            "核心职能：嵌入式服务、定制项目",
            "运营要求：合作方+OWL支持",
            "网络角色：生态延伸、资源整合",
          ],
        },
      ],
    },
  ],
  footer: "分布式网络让创客教育触达更多社区，去中心化治理激发地方创新活力",
};
