/**
 * Science Questions Data
 * 前沿科学问题 - 激发好奇心与探索欲望
 *
 * 来源包括：Science 125个问题、诺贝尔奖级难题、前沿交叉领域、2024-2025热点
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
  { id: 'q001', question: '宇宙为什么存在而不是一片虚无？', gravity: 4, color: 'cyan' },
  { id: 'q002', question: '意识是如何从物质中涌现的？', gravity: 4, color: 'pink' },
  { id: 'q003', question: '地球生命的第一个细胞是如何诞生的？', gravity: 4, color: 'violet' },
  { id: 'q004', question: '时间的本质是什么，它真的在流动吗？', gravity: 4, color: 'blue' },
  { id: 'q005', question: '为什么数学能如此精确地描述物理世界？', gravity: 4, color: 'emerald' },
  { id: 'q006', question: '宇宙中的物理常数为何恰好允许生命存在？', gravity: 4, color: 'cyan' },

  // ===== 世纪难题 (gravity: 3) - 大圆明亮 =====
  { id: 'q007', question: '暗物质由什么粒子组成？', gravity: 3, color: 'cyan' },
  { id: 'q008', question: '暗能量为何能加速宇宙膨胀？', gravity: 3, color: 'violet' },
  { id: 'q009', question: '神经元活动如何转化为主观体验？', gravity: 3, color: 'pink' },
  { id: 'q010', question: '量子力学与广义相对论能统一成量子引力理论吗？', gravity: 3, color: 'blue' },
  { id: 'q011', question: '黑洞内部的奇点处物理定律还成立吗？', gravity: 3, color: 'cyan' },
  { id: 'q012', question: '宇宙大爆炸之前是什么状态？', gravity: 3, color: 'violet' },
  { id: 'q013', question: '银河系中存在其他智慧文明吗？', gravity: 3, color: 'emerald' },
  { id: 'q014', question: '人类寿命的生物学极限是多少岁？', gravity: 3, color: 'pink' },
  { id: 'q015', question: '长期记忆在大脑中以什么形式编码存储？', gravity: 3, color: 'orange' },
  { id: 'q016', question: 'P与NP问题能否被证明或证伪？', gravity: 3, color: 'blue' },
  { id: 'q017', question: '宇宙是有限的还是无限延伸的？', gravity: 3, color: 'cyan' },
  { id: 'q018', question: '自由意志是真实的还是决定论的幻觉？', gravity: 3, color: 'pink' },
  { id: 'q019', question: '梦境在大脑中承担什么进化功能？', gravity: 3, color: 'violet' },
  { id: 'q020', question: '反物质为什么在宇宙中几乎消失了？', gravity: 3, color: 'cyan' },

  // ===== 前沿探索 (gravity: 2) - 中圆 =====
  // 量子与物理
  { id: 'q021', question: '量子计算机能解决哪些经典计算机永远无法解决的问题？', gravity: 2, color: 'blue' },
  { id: 'q022', question: '室温超导体真的能实现吗？', gravity: 2, color: 'blue' },
  { id: 'q023', question: '可控核聚变何时能实现商业发电？', gravity: 2, color: 'orange' },
  { id: 'q024', question: '引力波能揭示宇宙大爆炸最初瞬间的信息吗？', gravity: 2, color: 'cyan' },
  { id: 'q025', question: '宇宙究竟有几个空间维度？', gravity: 2, color: 'violet' },
  { id: 'q026', question: '希格斯玻色子之外还有未发现的基本粒子吗？', gravity: 2, color: 'blue' },

  // 生命与医学
  { id: 'q027', question: '癌症能否通过基因编辑彻底根治？', gravity: 2, color: 'pink' },
  { id: 'q028', question: '人类能通过生物技术逆转衰老过程吗？', gravity: 2, color: 'pink' },
  { id: 'q029', question: 'CRISPR基因编辑的伦理边界应该划在哪里？', gravity: 2, color: 'emerald' },
  { id: 'q030', question: '阿尔茨海默病的真正病因是什么？', gravity: 2, color: 'pink' },
  { id: 'q031', question: '肠道微生物如何影响大脑和情绪？', gravity: 2, color: 'emerald' },
  { id: 'q032', question: 'mRNA技术能治疗哪些目前无法治愈的疾病？', gravity: 2, color: 'pink' },

  // AI与认知
  { id: 'q033', question: '大语言模型真的在"理解"还是只在模式匹配？', gravity: 2, color: 'violet' },
  { id: 'q034', question: '人工智能能否发展出真正的自我意识？', gravity: 2, color: 'violet' },
  { id: 'q035', question: '人类大脑能被完整地数字化模拟吗？', gravity: 2, color: 'violet' },
  { id: 'q036', question: '语言结构是否决定了思维的边界？', gravity: 2, color: 'pink' },

  // 地球与宇宙
  { id: 'q037', question: '火星上曾经存在过生命吗？', gravity: 2, color: 'orange' },
  { id: 'q038', question: '地球气候系统的临界点会在何时被触发？', gravity: 2, color: 'emerald' },
  { id: 'q039', question: '深海热泉中是否隐藏着未知的生命形式？', gravity: 2, color: 'blue' },
  { id: 'q040', question: '地球磁极翻转会对人类文明造成什么影响？', gravity: 2, color: 'orange' },
  { id: 'q041', question: '木卫二冰层下的海洋中存在生命吗？', gravity: 2, color: 'cyan' },
  { id: 'q042', question: '我们能准确预测超级火山何时喷发吗？', gravity: 2, color: 'orange' },

  // 数学与理论
  { id: 'q043', question: '黎曼猜想能否被证明？', gravity: 2, color: 'blue' },
  { id: 'q044', question: '什么是量子纠缠的物理本质？', gravity: 2, color: 'cyan' },
  { id: 'q045', question: '弦理论能被实验验证吗？', gravity: 2, color: 'violet' },

  // ===== 好奇种子 (gravity: 1) - 小圆朦胧 =====
  // 生物奥秘
  { id: 'q046', question: '蜜蜂如何利用地球磁场和太阳位置导航？', gravity: 1, color: 'orange' },
  { id: 'q047', question: '为什么人类每天必须花三分之一时间睡眠？', gravity: 1, color: 'pink' },
  { id: 'q048', question: '章鱼的分布式神经系统如何协调八条触手？', gravity: 1, color: 'emerald' },
  { id: 'q049', question: '植物能感知疼痛或对威胁做出反应吗？', gravity: 1, color: 'emerald' },
  { id: 'q050', question: '打哈欠为什么会传染？', gravity: 1, color: 'pink' },
  { id: 'q051', question: '候鸟如何在没有GPS的情况下找到万里之外的目的地？', gravity: 1, color: 'cyan' },
  { id: 'q052', question: '蚂蚁群体如何在没有领导者的情况下做出复杂决策？', gravity: 1, color: 'orange' },
  { id: 'q053', question: '为什么音乐能激发人类如此强烈的情感？', gravity: 1, color: 'pink' },
  { id: 'q054', question: '动物在睡眠时是否也会做梦？', gravity: 1, color: 'violet' },
  { id: 'q055', question: '光合作用的量子效率为何接近100%？', gravity: 1, color: 'emerald' },
  { id: 'q056', question: '人类是否仍在进化，未来会变成什么样？', gravity: 1, color: 'cyan' },
  { id: 'q057', question: '猫发出呼噜声的振动频率为何能促进骨骼愈合？', gravity: 1, color: 'violet' },
  { id: 'q058', question: '章鱼为什么需要三颗心脏和蓝色血液？', gravity: 1, color: 'emerald' },
  { id: 'q059', question: '细菌群体是否具有原始形式的记忆？', gravity: 1, color: 'cyan' },
  { id: 'q060', question: '恐龙的真实颜色能通过化石推断出来吗？', gravity: 1, color: 'emerald' },

  // 物理与宇宙
  { id: 'q061', question: '球状闪电是等离子体还是某种未知现象？', gravity: 1, color: 'orange' },
  { id: 'q062', question: '夸克之下是否还有更基本的结构？', gravity: 1, color: 'blue' },
  { id: 'q063', question: '黑洞会通过霍金辐射完全蒸发吗？', gravity: 1, color: 'cyan' },
  { id: 'q064', question: '人类大脑能够真正理解"无限"这个概念吗？', gravity: 1, color: 'blue' },
  { id: 'q065', question: '水分子的特殊结构为何赋予它如此多异常性质？', gravity: 1, color: 'cyan' },
  { id: 'q066', question: '生命与非生命的本质区别是什么？', gravity: 1, color: 'pink' },
  { id: 'q067', question: '宇宙空间本身有"气味"吗？宇航员闻到了什么？', gravity: 1, color: 'violet' },
  { id: 'q068', question: '时间旅行在物理学上是可能的吗？', gravity: 1, color: 'blue' },
  { id: 'q069', question: '真空中真的是"空"的吗？量子涨落是什么？', gravity: 1, color: 'cyan' },
  { id: 'q070', question: '我们能用基因技术复活已灭绝的物种吗？', gravity: 1, color: 'emerald' },
  { id: 'q071', question: '天空是蓝色的，但太空中看地球为什么是另一种蓝？', gravity: 1, color: 'cyan' },
  { id: 'q072', question: '宇宙有中心吗？大爆炸发生在哪里？', gravity: 1, color: 'violet' },
  { id: 'q073', question: '镜子里的左右颠倒为什么不是上下颠倒？', gravity: 1, color: 'violet' },
  { id: 'q074', question: '电子在不被观测时真的同时存在于所有位置吗？', gravity: 1, color: 'blue' },
  { id: 'q075', question: '笑为什么会传染？这是进化的产物吗？', gravity: 1, color: 'pink' },
  { id: 'q076', question: '宇宙中是否存在真正的随机性？', gravity: 1, color: 'blue' },
  { id: 'q077', question: '平行宇宙是科幻想象还是量子力学的必然推论？', gravity: 1, color: 'violet' },
  { id: 'q078', question: '人类能在实验室中从无到有创造生命吗？', gravity: 1, color: 'pink' },
  { id: 'q079', question: '数字0是人类的发明还是宇宙中本就存在的概念？', gravity: 1, color: 'blue' },
  { id: 'q080', question: '人类第一个有意义的词语是什么？', gravity: 1, color: 'violet' },

  // 2024-2025 热点前沿问题
  { id: 'q081', question: 'GPT等大模型的"涌现能力"是如何产生的？', gravity: 2, color: 'violet' },
  { id: 'q082', question: '詹姆斯·韦伯望远镜发现的早期星系为何挑战现有理论？', gravity: 2, color: 'cyan' },
  { id: 'q083', question: 'AlphaFold之后，蛋白质折叠问题真的被解决了吗？', gravity: 2, color: 'emerald' },
  { id: 'q084', question: '脑机接口能让瘫痪患者重新行走吗？', gravity: 2, color: 'pink' },
  { id: 'q085', question: '量子纠错能否让量子计算机真正实用化？', gravity: 2, color: 'blue' },
  { id: 'q086', question: 'GLP-1类药物为什么能同时治疗肥胖和多种疾病？', gravity: 1, color: 'pink' },
  { id: 'q087', question: '人造子宫技术能拯救极早产儿吗？', gravity: 1, color: 'pink' },
  { id: 'q088', question: '月球南极的水冰储量足够支撑人类基地吗？', gravity: 1, color: 'cyan' },
  { id: 'q089', question: '固态电池何时能让电动汽车续航超过1000公里？', gravity: 1, color: 'orange' },
  { id: 'q090', question: '碳捕获技术能扭转全球变暖吗？', gravity: 1, color: 'emerald' },
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
