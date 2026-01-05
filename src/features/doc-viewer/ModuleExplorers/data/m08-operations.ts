import type { ExplorerConfig } from "../types";

export const M08_CONFIG: ExplorerConfig = {
  moduleId: "M08",
  title: "运营体系探索器",
  subtitle: "Operations & Processes",
  description: "标准化流程确保服务质量，数据驱动实现持续改进",
  categories: [
    {
      id: "core-process",
      tag: "CORE",
      title: "核心流程 Core Process",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "daily-ops",
          name: "日常运营",
          nameEn: "Daily Operations",
          description: "确保空间每日正常运转的标准化流程，从开门到关门的完整闭环。",
          details: [
            "开闭馆检查清单",
            "设备状态巡检",
            "材料库存监控",
            "清洁消毒流程",
          ],
        },
        {
          id: "member-service",
          name: "会员服务",
          nameEn: "Member Service",
          description: "覆盖会员全生命周期的服务流程，从初次接触到长期发展。",
          details: [
            "新会员引导流程",
            "预约和签到系统",
            "设备使用培训",
            "反馈收集和跟进",
          ],
        },
      ],
    },
    {
      id: "quality",
      tag: "QUALITY",
      title: "质量保障 Quality Assurance",
      color: {
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-500/30",
        bg: "bg-violet-500/5 dark:bg-violet-500/10",
      },
      items: [
        {
          id: "sop",
          name: "标准作业程序",
          nameEn: "Standard Operating Procedures",
          description: "将最佳实践固化为可复制的标准流程，确保服务一致性。",
          details: [
            "版本化SOP管理",
            "流程培训和考核",
            "执行记录追溯",
            "定期回顾和改进",
          ],
        },
        {
          id: "data-driven",
          name: "数据驱动",
          nameEn: "Data-Driven Operations",
          description: "通过数据收集和分析，实现运营决策的科学化和精准化。",
          details: [
            "北极星指标监控",
            "用户行为分析",
            "设备使用率追踪",
            "异常预警和响应",
          ],
        },
      ],
    },
    {
      id: "improvement",
      tag: "IMPROVE",
      title: "持续改进 Continuous Improvement",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "feedback-loop",
          name: "反馈闭环",
          nameEn: "Feedback Loop",
          description: "建立从收集到响应的完整反馈机制，让用户声音驱动改进。",
          details: [
            "多渠道反馈收集",
            "分类分级处理",
            "改进措施跟踪",
            "效果验证和沟通",
          ],
        },
        {
          id: "retrospective",
          name: "复盘机制",
          nameEn: "Retrospective",
          description: "定期回顾和反思，从经验中学习，持续优化运营效能。",
          details: [
            "周/月/季度复盘",
            "成功经验提炼",
            "问题根因分析",
            "改进行动追踪",
          ],
        },
      ],
    },
  ],
  footer: "好的运营是隐形的——让学习者专注于创造，而非应付流程",
};
