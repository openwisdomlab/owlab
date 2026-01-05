import type { ExplorerConfig } from "../types";

export const M09_CONFIG: ExplorerConfig = {
  moduleId: "M09",
  title: "评估成长探索器",
  subtitle: "Assessment & Growth",
  description: "过程导向、能力为本——评估是为了促进成长，而非贴标签",
  categories: [
    {
      id: "formative",
      tag: "FORMATIVE",
      title: "形成性评估 Formative",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "process-observation",
          name: "过程观察",
          nameEn: "Process Observation",
          description: "在学习过程中持续观察和记录，捕捉成长的关键时刻。",
          details: [
            "学习行为观察记录",
            "问题解决过程分析",
            "协作互动质量评估",
            "及时反馈和引导",
          ],
        },
        {
          id: "learning-journal",
          name: "学习日志",
          nameEn: "Learning Journal",
          description: "学习者自主记录的思考和反思，培养元认知能力。",
          details: [
            "项目日志和迭代记录",
            "问题和解决方案记录",
            "自我反思和评估",
            "目标设定和追踪",
          ],
        },
      ],
    },
    {
      id: "portfolio",
      tag: "PORTFOLIO",
      title: "作品集评估 Portfolio",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "project-showcase",
          name: "项目展示",
          nameEn: "Project Showcase",
          description: "通过作品呈现学习成果，展示设计思维和解决问题的过程。",
          details: [
            "作品设计说明",
            "迭代过程记录",
            "技术实现文档",
            "反思和改进方向",
          ],
        },
        {
          id: "skill-badge",
          name: "技能徽章",
          nameEn: "Skill Badge",
          description: "认证特定技能掌握程度的可视化凭证，激励持续学习。",
          details: [
            "技能分级认证体系",
            "理论+实操考核",
            "数字徽章和证书",
            "技能树可视化",
          ],
        },
      ],
    },
    {
      id: "growth",
      tag: "GROWTH",
      title: "成长追踪 Growth Tracking",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "competency-map",
          name: "能力图谱",
          nameEn: "Competency Map",
          description: "多维度能力模型，可视化呈现学习者的能力发展状态。",
          details: [
            "技术技能维度",
            "创新思维维度",
            "协作沟通维度",
            "自主学习维度",
          ],
        },
        {
          id: "growth-story",
          name: "成长故事",
          nameEn: "Growth Story",
          description: "记录学习者的完整成长历程，让进步可见、可回顾。",
          details: [
            "关键里程碑记录",
            "突破时刻捕捉",
            "导师评语和鼓励",
            "自我叙事和反思",
          ],
        },
      ],
    },
  ],
  footer: "评估的目的是照亮前路，而非给过去打分",
};
