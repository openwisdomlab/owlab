import type { ExplorerConfig } from "../types";

export const M07_CONFIG: ExplorerConfig = {
  moduleId: "M07",
  title: "角色能力探索器",
  subtitle: "People & Roles",
  description: "从入门导师到首席科学家，清晰的成长路径激发每个人的潜能",
  categories: [
    {
      id: "facilitator",
      tag: "FACILITATOR",
      title: "导师团队 Facilitator",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "junior-facilitator",
          name: "初级导师",
          nameEn: "Junior Facilitator",
          description: "刚加入团队的新导师，在资深导师指导下开展教学工作，主要负责辅助和观察学习。",
          details: [
            "协助课程准备和设备维护",
            "辅导单个或小组学员",
            "学习教学方法和课程设计",
            "参与导师培训和认证",
          ],
        },
        {
          id: "senior-facilitator",
          name: "资深导师",
          nameEn: "Senior Facilitator",
          description: "经验丰富的核心教学力量，能独立承担课程设计和项目指导工作。",
          details: [
            "独立设计和执行课程",
            "指导复杂项目和竞赛",
            "培养和指导初级导师",
            "参与课程研发和改进",
          ],
        },
      ],
    },
    {
      id: "specialist",
      tag: "SPECIALIST",
      title: "专家顾问 Specialist",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "tech-specialist",
          name: "技术专家",
          nameEn: "Technical Specialist",
          description: "在特定技术领域有深入专长的专家，为复杂技术问题提供专业支持。",
          details: [
            "深度技术问题咨询",
            "新技术研究和引入",
            "高阶项目技术指导",
            "设备选型和维护顾问",
          ],
        },
        {
          id: "industry-mentor",
          name: "行业导师",
          nameEn: "Industry Mentor",
          description: "来自企业和行业的资深专家，带来真实世界的视角和前沿资讯。",
          details: [
            "分享行业经验和趋势",
            "指导职业发展规划",
            "连接行业资源和机会",
            "评审优秀项目成果",
          ],
        },
      ],
    },
    {
      id: "learner",
      tag: "LEARNER",
      title: "学习者 Learner",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "explorer",
          name: "探索者",
          nameEn: "Explorer",
          description: "刚接触创客的新手，正在发现兴趣方向，需要更多引导和鼓励。",
          details: [
            "参与入门体验活动",
            "尝试不同技术领域",
            "建立基础技能和信心",
            "发现个人兴趣方向",
          ],
        },
        {
          id: "maker",
          name: "创客",
          nameEn: "Maker",
          description: "已具备一定技能和经验，能独立完成项目，并开始帮助他人。",
          details: [
            "独立设计和制作项目",
            "参与竞赛和展示活动",
            "分享经验帮助新手",
            "探索跨学科整合",
          ],
        },
      ],
    },
  ],
  footer: "人是创客空间的灵魂——好导师成就好学员，好学员成长为好导师",
};
