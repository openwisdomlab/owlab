// 理念数据定义

export type ConceptLayer = 'engine' | 'principle' | 'methodology' | 'foundation';

export interface Concept {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  layer: ConceptLayer;
  insight: string;
  practices: string[];
  connections: string[];
}

export const CONCEPTS: Concept[] = [
  // 顶层三引擎
  {
    id: 'frontier-question',
    name: '前沿问题驱动',
    nameEn: 'Frontier-Question Driven',
    color: '#22d3ee',
    layer: 'engine',
    insight: '课本习题是已知答案的练习，真实的科研问题才能点燃真正的好奇。当学习者面对"连科学家都还没解决"的挑战，他们的身份从学生变成了探索者。',
    practices: [
      '真实挑战：引入未解决的前沿科研问题',
      '开放结局：问题没有标准答案',
      '多元路径：允许不同的探索方向',
      '研究者连接：与真正的科学家对话',
    ],
    connections: ['inquiry-based', 'intrinsic-motivation', 'low-floor'],
  },
  {
    id: 'inquiry-based',
    name: '研究性学习',
    nameEn: 'Inquiry-Based Learning',
    color: '#8b5cf6',
    layer: 'engine',
    insight: '不是学习科学知识，而是学习像科学家一样思考。提出问题 → 形成假设 → 设计实验 → 收集数据 → 分析验证 → 迭代改进。',
    practices: [
      '科学家101：体验完整科研流程',
      '研究日志：记录思考与发现过程',
      '同行评议：像学术期刊一样互相审阅',
      '公开发表：成果向真实世界展示',
    ],
    connections: ['frontier-question', 'gamified', 'low-floor'],
  },
  {
    id: 'gamified',
    name: '游戏化探索',
    nameEn: 'Gamified Exploration',
    color: '#f59e0b',
    layer: 'engine',
    insight: '最好的游戏不是告诉你做什么，而是创造一个世界让你自己去发现。学习也应该如此：自主选择、即时反馈、意外发现。',
    practices: [
      '探索地图：可视化学习旅程',
      '成就系统：解锁技能徽章',
      '隐藏彩蛋：奖励好奇的探索者',
      '自主节奏：没有统一进度表',
    ],
    connections: ['inquiry-based', 'hard-fun', 'low-floor'],
  },

  // 设计原则层
  {
    id: 'low-floor',
    name: '低地板高天花板宽围墙',
    nameEn: 'Low Floor, High Ceiling, Wide Walls',
    color: '#10b981',
    layer: 'principle',
    insight: '好的学习工具应该让新手能够开始（低地板），让专家能够深入（高天花板），让所有人能够找到自己的路径（宽围墙）。',
    practices: [
      '工具选择兼顾易用性与专业性',
      '提供多种难度等级的入口',
      '支持不同兴趣方向的探索路径',
    ],
    connections: ['frontier-question', 'inquiry-based', 'gamified', 'constructionism', 'embodied', 'hard-fun'],
  },

  // 方法论层
  {
    id: 'constructionism',
    name: '建构主义学习',
    nameEn: 'Constructionism',
    color: '#6366f1',
    layer: 'methodology',
    insight: '学习者不是知识的容器，而是意义的建构者。当创造外部作品时，内部理解建构得最为深刻。',
    practices: [
      '每个项目产出可展示的真实作品',
      '动手实践时间占比 ≥ 60%',
      '迭代改进，不追求一次完美',
    ],
    connections: ['low-floor', 'embodied', 'zpd'],
  },
  {
    id: 'embodied',
    name: '具身认知',
    nameEn: 'Embodied Cognition',
    color: '#ec4899',
    layer: 'methodology',
    insight: '思维不只发生在大脑里，身体也在思考。动手操作、物理感知、空间移动都是认知的一部分。',
    practices: [
      '物理制作与数字创造并重',
      '鼓励身体参与的学习活动',
      '空间设计支持多种学习姿态',
    ],
    connections: ['low-floor', 'constructionism', 'hard-fun'],
  },
  {
    id: 'hard-fun',
    name: '严肃玩耍',
    nameEn: 'Hard Fun',
    color: '#f97316',
    layer: 'methodology',
    insight: '有挑战的玩耍才能带来心流和成长。不是无目的的消遣，而是在挑战中获得深度满足。',
    practices: [
      '鼓励冒险实验',
      '重新定义失败为学习机会',
      '设计有适度挑战的任务',
    ],
    connections: ['low-floor', 'gamified', 'embodied'],
  },

  // 支撑层
  {
    id: 'zpd',
    name: '最近发展区',
    nameEn: 'Zone of Proximal Development',
    color: '#14b8a6',
    layer: 'foundation',
    insight: '最佳学习发生在"刚好够不到但有帮助就能做到"的区域。太简单无聊，太难挫败，恰当挑战才能成长。',
    practices: [
      '导师提供恰当的脚手架支持',
      '赋能而非替代，引导而非给答案',
      '根据学习者状态动态调整难度',
    ],
    connections: ['constructionism', 'intrinsic-motivation', 'community'],
  },
  {
    id: 'intrinsic-motivation',
    name: '内在动机驱动',
    nameEn: 'Intrinsic Motivation',
    color: '#ef4444',
    layer: 'foundation',
    insight: '当学习者关心他们正在做的事情时，他们会更努力、更持久、更深入地学习。外在奖励可能削弱内在动机。',
    practices: [
      '学习者主导项目选题',
      '连接项目与个人兴趣和生活',
      '减少外在评判，增加内在反馈',
    ],
    connections: ['frontier-question', 'zpd', 'community'],
  },
  {
    id: 'community',
    name: '实践共同体',
    nameEn: 'Community of Practice',
    color: '#a855f7',
    layer: 'foundation',
    insight: '学习不是孤立的个体行为，而是在社区中通过参与和身份建构发生的。同伴是灵感来源、反馈提供者和成长见证者。',
    practices: [
      '混龄学习，互相启发',
      '分享文化，定期展示',
      '同伴反馈机制',
      '支持性的社区氛围',
    ],
    connections: ['zpd', 'intrinsic-motivation'],
  },
];

// 获取某个理念的相连理念
export function getConnectedConcepts(conceptId: string): Concept[] {
  const concept = CONCEPTS.find(c => c.id === conceptId);
  if (!concept) return [];
  return CONCEPTS.filter(c => concept.connections.includes(c.id));
}
