import type { ExplorerConfig } from "../types";

export const M04_CONFIG: ExplorerConfig = {
  moduleId: "M04",
  title: "课程项目探索器",
  subtitle: "Curriculum & Projects",
  description: "从体验工作坊到长期研究项目，渐进式学习路径支撑能力成长",
  categories: [
    {
      id: "workshop",
      tag: "WORKSHOP",
      title: "体验工作坊 Workshop",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "intro-workshop",
          name: "入门体验",
          nameEn: "Introduction Workshop",
          description: "2-4小时的短期活动，让新手快速体验创客的乐趣，建立初步的兴趣和信心。",
          details: [
            "时长：2-4小时单次活动",
            "目标：点燃兴趣，建立信心",
            "产出：简单可带走的作品",
            "适合：零基础新手体验",
          ],
        },
        {
          id: "skill-workshop",
          name: "技能工作坊",
          nameEn: "Skill Workshop",
          description: "半天到一天的专项技能培训，系统学习特定工具或技术的使用方法。",
          details: [
            "时长：4-8小时专项训练",
            "目标：掌握特定技能",
            "产出：技能认证徽章",
            "适合：想深入特定领域的学员",
          ],
        },
      ],
    },
    {
      id: "course",
      tag: "COURSE",
      title: "系列课程 Course",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "foundation-course",
          name: "基础课程",
          nameEn: "Foundation Course",
          description: "4-8周的系统学习，从基础技能到综合应用，建立完整的知识框架。",
          details: [
            "时长：4-8周，每周2-4小时",
            "目标：建立系统技能体系",
            "产出：阶段性项目作品集",
            "适合：希望系统学习的学员",
          ],
        },
        {
          id: "advanced-course",
          name: "进阶课程",
          nameEn: "Advanced Course",
          description: "基于基础课程的深入学习，挑战更复杂的项目，培养独立解决问题的能力。",
          details: [
            "时长：8-12周深度学习",
            "目标：独立完成复杂项目",
            "产出：综合性创新作品",
            "适合：完成基础课程的学员",
          ],
        },
      ],
    },
    {
      id: "project",
      tag: "PROJECT",
      title: "长期项目 Project",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "research-project",
          name: "研究性项目",
          nameEn: "Research Project",
          description: "3-6个月的深度探索，针对真实问题进行研究，培养科研思维和创新能力。",
          details: [
            "时长：3-6个月持续研究",
            "目标：解决真实世界问题",
            "产出：研究报告、原型作品",
            "适合：有探索精神的高阶学员",
          ],
        },
        {
          id: "competition-project",
          name: "竞赛项目",
          nameEn: "Competition Project",
          description: "针对各类科技竞赛的备赛训练，在竞争中激发潜能，展示能力。",
          details: [
            "目标：参与科技竞赛",
            "培养：团队协作、抗压能力",
            "成果：竞赛作品、获奖荣誉",
          ],
        },
      ],
    },
  ],
  footer: "项目是载体，能力是目标——每个项目都是一次完整的学习旅程",
};
