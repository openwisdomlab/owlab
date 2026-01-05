/**
 * Science Questions Data
 * 前沿科学问题 - 激发好奇心与探索欲望
 *
 * 来源包括：Science 125个问题、诺贝尔奖级难题、前沿交叉领域
 */

export interface ScienceQuestion {
  id: string;
  question: string;
  // 引力等级: 1-4, 决定圆环大小和亮度
  gravity: 1 | 2 | 3 | 4;
  // 颜色主题
  color: 'cyan' | 'pink' | 'violet' | 'emerald' | 'blue' | 'orange';
}

export const scienceQuestions: ScienceQuestion[] = [
  // ===== 终极问题 (gravity: 4) - 最大最亮 =====
  { id: 'q001', question: '宇宙为什么存在？', gravity: 4, color: 'cyan' },
  { id: 'q002', question: '意识是什么？', gravity: 4, color: 'pink' },
  { id: 'q003', question: '生命是如何起源的？', gravity: 4, color: 'violet' },
  { id: 'q004', question: '时间是真实的吗？', gravity: 4, color: 'blue' },
  { id: 'q005', question: '数学为何能描述宇宙？', gravity: 4, color: 'emerald' },

  // ===== 世纪难题 (gravity: 3) - 大圆明亮 =====
  { id: 'q006', question: '暗物质是什么？', gravity: 3, color: 'cyan' },
  { id: 'q007', question: '暗能量从何而来？', gravity: 3, color: 'violet' },
  { id: 'q008', question: '大脑如何产生思维？', gravity: 3, color: 'pink' },
  { id: 'q009', question: '量子力学与相对论能统一吗？', gravity: 3, color: 'blue' },
  { id: 'q010', question: '黑洞里面是什么？', gravity: 3, color: 'cyan' },
  { id: 'q011', question: '为什么有物质而非虚无？', gravity: 3, color: 'violet' },
  { id: 'q012', question: '我们是宇宙中唯一的智慧生命吗？', gravity: 3, color: 'emerald' },
  { id: 'q013', question: '人类能活多久？', gravity: 3, color: 'pink' },
  { id: 'q014', question: '记忆存储在哪里？', gravity: 3, color: 'orange' },
  { id: 'q015', question: 'P=NP 吗？', gravity: 3, color: 'blue' },
  { id: 'q016', question: '宇宙有边界吗？', gravity: 3, color: 'cyan' },
  { id: 'q017', question: '自由意志存在吗？', gravity: 3, color: 'pink' },
  { id: 'q018', question: '梦为什么存在？', gravity: 3, color: 'violet' },

  // ===== 前沿探索 (gravity: 2) - 中圆 =====
  { id: 'q019', question: '量子计算机能做什么？', gravity: 2, color: 'blue' },
  { id: 'q020', question: '癌症能被彻底治愈吗？', gravity: 2, color: 'pink' },
  { id: 'q021', question: '我们能控制核聚变吗？', gravity: 2, color: 'orange' },
  { id: 'q022', question: '基因编辑的边界在哪里？', gravity: 2, color: 'emerald' },
  { id: 'q023', question: 'AI 会产生意识吗？', gravity: 2, color: 'violet' },
  { id: 'q024', question: '引力波能告诉我们什么？', gravity: 2, color: 'cyan' },
  { id: 'q025', question: '我们能移民火星吗？', gravity: 2, color: 'orange' },
  { id: 'q026', question: '衰老能被逆转吗？', gravity: 2, color: 'pink' },
  { id: 'q027', question: '地球气候的临界点在哪？', gravity: 2, color: 'emerald' },
  { id: 'q028', question: '大脑能被完整模拟吗？', gravity: 2, color: 'violet' },
  { id: 'q029', question: '反物质消失去哪了？', gravity: 2, color: 'cyan' },
  { id: 'q030', question: '深海还隐藏着什么？', gravity: 2, color: 'blue' },
  { id: 'q031', question: '语言如何塑造思维？', gravity: 2, color: 'pink' },
  { id: 'q032', question: '地球的内核在做什么？', gravity: 2, color: 'orange' },
  { id: 'q033', question: '病毒是生命吗？', gravity: 2, color: 'emerald' },
  { id: 'q034', question: '我们能预测地震吗？', gravity: 2, color: 'orange' },
  { id: 'q035', question: '超导的极限在哪里？', gravity: 2, color: 'blue' },
  { id: 'q036', question: '直觉是怎么回事？', gravity: 2, color: 'violet' },
  { id: 'q037', question: '宇宙有多少个维度？', gravity: 2, color: 'cyan' },
  { id: 'q038', question: '细胞如何决定自己的命运？', gravity: 2, color: 'pink' },
  { id: 'q039', question: '情绪从何而来？', gravity: 2, color: 'violet' },
  { id: 'q040', question: '什么是暗光子？', gravity: 2, color: 'cyan' },

  // ===== 好奇种子 (gravity: 1) - 小圆朦胧 =====
  { id: 'q041', question: '蜜蜂如何导航？', gravity: 1, color: 'orange' },
  { id: 'q042', question: '为什么我们需要睡眠？', gravity: 1, color: 'pink' },
  { id: 'q043', question: '章鱼有多聪明？', gravity: 1, color: 'emerald' },
  { id: 'q044', question: '植物有感觉吗？', gravity: 1, color: 'emerald' },
  { id: 'q045', question: '为什么会打哈欠？', gravity: 1, color: 'pink' },
  { id: 'q046', question: '猫为什么会发出呼噜声？', gravity: 1, color: 'violet' },
  { id: 'q047', question: '鸟类如何知道迁徙路线？', gravity: 1, color: 'cyan' },
  { id: 'q048', question: '蚂蚁的集体智慧从何而来？', gravity: 1, color: 'orange' },
  { id: 'q049', question: '为什么音乐让人感动？', gravity: 1, color: 'pink' },
  { id: 'q050', question: '动物会做梦吗？', gravity: 1, color: 'violet' },
  { id: 'q051', question: '光合作用能被超越吗？', gravity: 1, color: 'emerald' },
  { id: 'q052', question: '人类还在进化吗？', gravity: 1, color: 'cyan' },
  { id: 'q053', question: '我们能听懂动物的语言吗？', gravity: 1, color: 'orange' },
  { id: 'q054', question: '恐龙是什么颜色的？', gravity: 1, color: 'emerald' },
  { id: 'q055', question: '第一个字是什么？', gravity: 1, color: 'violet' },
  { id: 'q056', question: '数字 0 是发明还是发现？', gravity: 1, color: 'blue' },
  { id: 'q057', question: '地球上最古老的生命是什么？', gravity: 1, color: 'emerald' },
  { id: 'q058', question: '章鱼为什么有三颗心？', gravity: 1, color: 'pink' },
  { id: 'q059', question: '细菌有记忆吗？', gravity: 1, color: 'cyan' },
  { id: 'q060', question: '闪电球是什么？', gravity: 1, color: 'orange' },
  { id: 'q061', question: '物质的最小单位是什么？', gravity: 1, color: 'blue' },
  { id: 'q062', question: '黑洞会蒸发吗？', gravity: 1, color: 'cyan' },
  { id: 'q063', question: '宇宙最终会怎样？', gravity: 1, color: 'violet' },
  { id: 'q064', question: '人类能理解无限吗？', gravity: 1, color: 'blue' },
  { id: 'q065', question: '为什么水是透明的？', gravity: 1, color: 'cyan' },
  { id: 'q066', question: '如何定义"活着"？', gravity: 1, color: 'pink' },
  { id: 'q067', question: '宇宙有味道吗？', gravity: 1, color: 'violet' },
  { id: 'q068', question: '时间能倒流吗？', gravity: 1, color: 'blue' },
  { id: 'q069', question: '真空是空的吗？', gravity: 1, color: 'cyan' },
  { id: 'q070', question: '我们能克隆灭绝的动物吗？', gravity: 1, color: 'emerald' },
  { id: 'q071', question: '为什么天空是蓝色的？', gravity: 1, color: 'cyan' },
  { id: 'q072', question: '宇宙有中心吗？', gravity: 1, color: 'violet' },
  { id: 'q073', question: '我们能触摸彩虹吗？', gravity: 1, color: 'pink' },
  { id: 'q074', question: '电子在想什么？', gravity: 1, color: 'blue' },
  { id: 'q075', question: '镜子里的我是真的吗？', gravity: 1, color: 'violet' },
  { id: 'q076', question: '笑为什么会传染？', gravity: 1, color: 'pink' },
  { id: 'q077', question: '什么是真正的随机？', gravity: 1, color: 'blue' },
  { id: 'q078', question: '声音最远能传多远？', gravity: 1, color: 'cyan' },
  { id: 'q079', question: '存在平行宇宙吗？', gravity: 1, color: 'violet' },
  { id: 'q080', question: '我们能创造生命吗？', gravity: 1, color: 'pink' },
];

/**
 * 获取随机问题子集
 */
export function getRandomQuestions(count: number): ScienceQuestion[] {
  const shuffled = [...scienceQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 按引力等级获取问题
 */
export function getQuestionsByGravity(gravity: 1 | 2 | 3 | 4): ScienceQuestion[] {
  return scienceQuestions.filter(q => q.gravity === gravity);
}

/**
 * 获取一组平衡分布的问题
 */
export function getBalancedQuestions(total: number): ScienceQuestion[] {
  // 分配比例: gravity 4: 10%, gravity 3: 20%, gravity 2: 30%, gravity 1: 40%
  const g4Count = Math.max(1, Math.floor(total * 0.1));
  const g3Count = Math.max(2, Math.floor(total * 0.2));
  const g2Count = Math.max(3, Math.floor(total * 0.3));
  const g1Count = total - g4Count - g3Count - g2Count;

  const g4 = getQuestionsByGravity(4).sort(() => Math.random() - 0.5).slice(0, g4Count);
  const g3 = getQuestionsByGravity(3).sort(() => Math.random() - 0.5).slice(0, g3Count);
  const g2 = getQuestionsByGravity(2).sort(() => Math.random() - 0.5).slice(0, g2Count);
  const g1 = getQuestionsByGravity(1).sort(() => Math.random() - 0.5).slice(0, g1Count);

  return [...g4, ...g3, ...g2, ...g1].sort(() => Math.random() - 0.5);
}
