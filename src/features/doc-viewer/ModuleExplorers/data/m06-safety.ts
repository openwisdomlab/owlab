import type { ExplorerConfig } from "../types";

export const M06_CONFIG: ExplorerConfig = {
  moduleId: "M06",
  title: "安全体系探索器",
  subtitle: "Safety & Standards",
  description: "预防为主、教育为本、责任到人——构建全方位安全保障体系",
  categories: [
    {
      id: "prevention",
      tag: "PREVENTION",
      title: "预防体系 Prevention",
      color: {
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
      },
      items: [
        {
          id: "risk-assessment",
          name: "风险评估",
          nameEn: "Risk Assessment",
          description: "系统识别空间中的潜在危险源，评估风险等级，制定控制措施。",
          details: [
            "设备风险分级（高/中/低）",
            "材料安全数据表（MSDS）",
            "空间动线安全分析",
            "定期安全巡检机制",
          ],
        },
        {
          id: "safety-training",
          name: "安全培训",
          nameEn: "Safety Training",
          description: "所有成员必须完成安全培训并通过考核后才能使用相应设备。",
          details: [
            "新成员入门安全培训",
            "设备操作资格认证",
            "急救技能培训",
            "定期安全演练",
          ],
        },
      ],
    },
    {
      id: "protection",
      tag: "PROTECTION",
      title: "防护措施 Protection",
      color: {
        text: "text-cyan-600 dark:text-cyan-400",
        border: "border-cyan-500/30",
        bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
      },
      items: [
        {
          id: "ppe",
          name: "个人防护",
          nameEn: "Personal Protective Equipment",
          description: "根据作业类型配备必要的个人防护装备，确保操作者安全。",
          details: [
            "护目镜（激光/焊接/车削）",
            "防护手套（热/化学/机械）",
            "防尘口罩/呼吸器",
            "工作服/防护围裙",
          ],
        },
        {
          id: "facility-safety",
          name: "设施安全",
          nameEn: "Facility Safety",
          description: "空间设施层面的安全配置，为活动提供安全的物理环境。",
          details: [
            "通风系统（除尘/排烟）",
            "消防设施（灭火器/喷淋）",
            "急救箱和AED",
            "紧急出口和疏散路线",
          ],
        },
      ],
    },
    {
      id: "response",
      tag: "RESPONSE",
      title: "应急响应 Response",
      color: {
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-500/30",
        bg: "bg-amber-500/5 dark:bg-amber-500/10",
      },
      items: [
        {
          id: "emergency-plan",
          name: "应急预案",
          nameEn: "Emergency Plan",
          description: "针对不同类型紧急情况的标准化应对流程，确保快速有效响应。",
          details: [
            "火灾/触电应急流程",
            "设备故障处理程序",
            "人身伤害急救流程",
            "疏散集合点和清点",
          ],
        },
        {
          id: "incident-report",
          name: "事故报告",
          nameEn: "Incident Reporting",
          description: "完善的事故报告和分析机制，从每次事故中学习改进。",
          details: [
            "24小时内提交事故报告",
            "根本原因分析（RCA）",
            "改进措施跟踪",
            "安全经验分享",
          ],
        },
      ],
    },
  ],
  footer: "安全是底线不是限制——在安全框架内自由探索",
};
