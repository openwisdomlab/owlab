/**
 * Science Questions Data
 * 前沿科学问题 - 激发好奇心与探索欲望
 *
 * 来源包括：Science 125个问题、诺贝尔奖级难题、前沿交叉领域、2024-2025热点
 */

export interface ScienceQuestion {
  id: string;
  question: string;
  // 问题简短解释
  explanation: string;
  // 引力等级: 1-4, 影响问题的深度分类（但不影响圆环大小）
  gravity: 1 | 2 | 3 | 4;
  // 颜色主题
  color: 'cyan' | 'pink' | 'violet' | 'emerald' | 'blue' | 'orange';
  // 多语言支持预留
  i18n?: {
    en?: {
      question: string;
      explanation?: string;
    };
  };
}

export const scienceQuestions: ScienceQuestion[] = [
  // ===== 终极问题 (gravity: 4) =====
  {
    id: 'q001',
    question: '宇宙为什么存在而不是一片虚无？',
    explanation: '这是莱布尼茨提出的终极哲学问题。为什么有"存在"而非"虚无"？现代物理学尝试用量子涨落解释，但仍无法回答"为什么有物理定律"这个更深层的问题。',
    gravity: 4,
    color: 'cyan',
    i18n: { en: { question: 'Why is there something rather than nothing?' } }
  },
  {
    id: 'q002',
    question: '意识是如何从物质中涌现的？',
    explanation: '这被称为"意识的难问题"。860亿个神经元的电化学活动如何产生主观体验？为什么有"感觉像是什么"这回事？',
    gravity: 4,
    color: 'pink',
    i18n: { en: { question: 'How does consciousness emerge from matter?' } }
  },
  {
    id: 'q003',
    question: '地球生命的第一个细胞是如何诞生的？',
    explanation: '从无机分子到能自我复制的细胞，中间经历了什么？RNA世界假说、热泉假说等理论都在探索这个40亿年前的谜题。',
    gravity: 4,
    color: 'violet',
    i18n: { en: { question: 'How did the first cell on Earth come into being?' } }
  },
  {
    id: 'q004',
    question: '时间的本质是什么，它真的在流动吗？',
    explanation: '在相对论中，时间是相对的；在量子力学中，时间有不同的角色。时间的"流动"可能只是意识的错觉？',
    gravity: 4,
    color: 'blue',
    i18n: { en: { question: 'What is the nature of time? Does it really flow?' } }
  },
  {
    id: 'q005',
    question: '为什么数学能如此精确地描述物理世界？',
    explanation: '物理学家尤金·维格纳称之为"数学在自然科学中不合理的有效性"。数学是发现的还是发明的？为什么抽象的数学公式能预测宇宙的行为？',
    gravity: 4,
    color: 'emerald',
    i18n: { en: { question: 'Why can mathematics describe the physical world so precisely?' } }
  },
  {
    id: 'q006',
    question: '宇宙中的物理常数为何恰好允许生命存在？',
    explanation: '如果引力常数或电磁力稍有不同，恒星、原子甚至生命都无法存在。这是巧合、多元宇宙、还是更深的原理？',
    gravity: 4,
    color: 'cyan',
    i18n: { en: { question: 'Why are the physical constants fine-tuned for life?' } }
  },
  {
    id: 'q007',
    question: '我们生活在模拟中吗？',
    explanation: '哲学家尼克·博斯特罗姆的模拟假说认为，如果未来文明能创造逼真的模拟，我们很可能就生活在其中。这个假说无法被证伪。',
    gravity: 4,
    color: 'violet',
    i18n: { en: { question: 'Are we living in a simulation?' } }
  },
  {
    id: 'q008',
    question: '死亡后意识会发生什么？',
    explanation: '科学目前无法回答。意识是大脑的产物还是更基本的存在？濒死体验的报告是大脑缺氧的幻觉还是另有深意？',
    gravity: 4,
    color: 'pink',
    i18n: { en: { question: 'What happens to consciousness after death?' } }
  },

  // ===== 世纪难题 (gravity: 3) =====
  {
    id: 'q009',
    question: '暗物质由什么粒子组成？',
    explanation: '暗物质占宇宙物质总量的85%，但我们从未直接探测到它。WIMP、轴子、还是完全未知的粒子？',
    gravity: 3,
    color: 'cyan'
  },
  {
    id: 'q010',
    question: '暗能量为何能加速宇宙膨胀？',
    explanation: '1998年发现宇宙正在加速膨胀，背后的"暗能量"是什么？宇宙学常数？还是某种动态场？',
    gravity: 3,
    color: 'violet'
  },
  {
    id: 'q011',
    question: '神经元活动如何转化为主观体验？',
    explanation: '你看到红色时，大脑里发生了什么让你"体验"到红色？这是神经科学最难的问题之一。',
    gravity: 3,
    color: 'pink'
  },
  {
    id: 'q012',
    question: '量子力学与广义相对论能统一成量子引力理论吗？',
    explanation: '爱因斯坦的引力理论和量子力学在极端情况下互相矛盾。弦理论、圈量子引力等尝试统一它们，但至今没有成功。',
    gravity: 3,
    color: 'blue'
  },
  {
    id: 'q013',
    question: '黑洞内部的奇点处物理定律还成立吗？',
    explanation: '在黑洞中心，密度趋于无限大，现有物理理论失效。奇点可能是通往其他宇宙的通道？还是完全不同的物理规律？',
    gravity: 3,
    color: 'cyan'
  },
  {
    id: 'q014',
    question: '宇宙大爆炸之前是什么状态？',
    explanation: '时间和空间都始于大爆炸，"之前"这个概念可能本身就没有意义。但宇宙学家仍在探索：是否有"循环宇宙"或"多元宇宙"？',
    gravity: 3,
    color: 'violet'
  },
  {
    id: 'q015',
    question: '银河系中存在其他智慧文明吗？',
    explanation: '费米悖论：宇宙这么大这么老，应该到处都是外星人，但我们为什么没发现他们？大过滤器理论给出了令人不安的答案。',
    gravity: 3,
    color: 'emerald'
  },
  {
    id: 'q016',
    question: '人类寿命的生物学极限是多少岁？',
    explanation: '目前有记录的最长寿命是122岁。细胞衰老、端粒缩短、DNA损伤积累——这些障碍能被突破吗？',
    gravity: 3,
    color: 'pink'
  },
  {
    id: 'q017',
    question: '长期记忆在大脑中以什么形式编码存储？',
    explanation: '神经元连接的改变？蛋白质的合成？表观遗传学的修饰？记忆的物理基础仍是谜。',
    gravity: 3,
    color: 'orange'
  },
  {
    id: 'q018',
    question: 'P与NP问题能否被证明或证伪？',
    explanation: '计算机科学的千禧年大奖难题之一：验证一个答案很容易的问题，找到答案是否同样容易？价值100万美元。',
    gravity: 3,
    color: 'blue'
  },
  {
    id: 'q019',
    question: '宇宙是有限的还是无限延伸的？',
    explanation: '可观测宇宙直径930亿光年，但这只是我们能看到的部分。宇宙的真实大小可能是无限的，也可能是有限但无边界的。',
    gravity: 3,
    color: 'cyan'
  },
  {
    id: 'q020',
    question: '自由意志是真实的还是决定论的幻觉？',
    explanation: '如果大脑遵循物理定律，我们的每个决定是否都是注定的？神经科学实验表明，大脑在"你"意识到之前就已做出决定。',
    gravity: 3,
    color: 'pink'
  },
  {
    id: 'q021',
    question: '梦境在大脑中承担什么进化功能？',
    explanation: '记忆巩固？情绪处理？威胁模拟？还是只是神经随机放电的副产品？为什么我们会忘记大部分梦？',
    gravity: 3,
    color: 'violet'
  },
  {
    id: 'q022',
    question: '反物质为什么在宇宙中几乎消失了？',
    explanation: '大爆炸应该产生等量的物质和反物质，它们会相互湮灭。为什么物质"赢了"？这个不对称性挽救了我们的存在。',
    gravity: 3,
    color: 'cyan'
  },
  {
    id: 'q023',
    question: '黎曼猜想为什么如此重要？',
    explanation: '这个关于素数分布的数学猜想已悬而未决160多年。证明它可能揭示数学最深层的结构，价值100万美元。',
    gravity: 3,
    color: 'blue'
  },
  {
    id: 'q024',
    question: '基因如何决定了生物体的形态？',
    explanation: '同样的DNA如何知道长成眼睛还是心脏？发育生物学的核心问题：信息如何转化为三维结构？',
    gravity: 3,
    color: 'emerald'
  },

  // ===== 前沿探索 (gravity: 2) =====
  {
    id: 'q025',
    question: '量子计算机能解决哪些经典计算机永远无法解决的问题？',
    explanation: '量子优势已被证明，但实际应用仍在探索。密码学、药物发现、材料科学——哪些领域会被颠覆？',
    gravity: 2,
    color: 'blue'
  },
  {
    id: 'q026',
    question: '室温超导体真的能实现吗？',
    explanation: '超导体需要极低温工作，限制了应用。2023年的室温超导宣称已被证伪，但真正的突破会带来能源革命。',
    gravity: 2,
    color: 'blue'
  },
  {
    id: 'q027',
    question: '可控核聚变何时能实现商业发电？',
    explanation: '"聚变能源永远是30年后"——但ITER和私人公司正取得进展。实现它意味着近乎无限的清洁能源。',
    gravity: 2,
    color: 'orange'
  },
  {
    id: 'q028',
    question: '引力波能揭示宇宙大爆炸最初瞬间的信息吗？',
    explanation: 'LIGO已探测到黑洞合并的引力波。下一代探测器可能"听到"宇宙诞生时的回响。',
    gravity: 2,
    color: 'cyan'
  },
  {
    id: 'q029',
    question: '宇宙究竟有几个空间维度？',
    explanation: '弦理论需要10或11个维度。如果额外维度存在，它们可能卷曲得极小，或者我们的宇宙是更高维空间中的一张"膜"。',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q030',
    question: '希格斯玻色子之外还有未发现的基本粒子吗？',
    explanation: '标准模型预测的粒子都已发现，但它不能解释暗物质和暗能量。超对称粒子？额外的希格斯粒子？',
    gravity: 2,
    color: 'blue'
  },
  {
    id: 'q031',
    question: '癌症能否通过基因编辑彻底根治？',
    explanation: 'CAR-T疗法已让一些白血病患者痊愈。但实体瘤更难攻克。基因编辑能否精确消灭癌细胞而不伤及正常细胞？',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q032',
    question: '人类能通过生物技术逆转衰老过程吗？',
    explanation: '表观遗传重编程已在小鼠实验中逆转衰老迹象。细胞"年龄"可以被重置——这对人类意味着什么？',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q033',
    question: 'CRISPR基因编辑的伦理边界应该划在哪里？',
    explanation: '2018年"基因编辑婴儿"事件震惊世界。治疗遗传病是可以的，但增强智力呢？创造"设计婴儿"呢？',
    gravity: 2,
    color: 'emerald'
  },
  {
    id: 'q034',
    question: '阿尔茨海默病的真正病因是什么？',
    explanation: '淀粉样蛋白假说主导了几十年，但靶向它的药物大多失败。神经炎症？代谢问题？真正的病因可能更复杂。',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q035',
    question: '肠道微生物如何影响大脑和情绪？',
    explanation: '"肠脑轴"连接着消化系统和中枢神经系统。肠道菌群失调与抑郁、焦虑甚至自闭症有关联。',
    gravity: 2,
    color: 'emerald'
  },
  {
    id: 'q036',
    question: 'mRNA技术能治疗哪些目前无法治愈的疾病？',
    explanation: 'COVID疫苗证明了mRNA技术的威力。癌症疫苗、罕见遗传病治疗、甚至HIV疫苗——都在研发中。',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q037',
    question: '大语言模型真的在"理解"还是只在模式匹配？',
    explanation: 'GPT能写诗、解数学题、通过医学考试。但它真的"理解"吗？还是只是统计学上的鹦鹉学舌？',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q038',
    question: '人工智能能否发展出真正的自我意识？',
    explanation: '如果AI产生了意识，我们如何知道？我们对自己意识的理解都不完整，如何判断机器？',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q039',
    question: '人类大脑能被完整地数字化模拟吗？',
    explanation: '860亿神经元，100万亿突触连接。即使有足够的计算力，模拟是否能产生意识？还是遗漏了什么关键因素？',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q040',
    question: '语言结构是否决定了思维的边界？',
    explanation: '萨丕尔-沃尔夫假说认为语言塑造思维。没有未来时态的语言使用者会如何思考未来？',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q041',
    question: '火星上曾经存在过生命吗？',
    explanation: '证据显示火星曾有液态水。好奇号和毅力号正在寻找生命痕迹。如果找到，意味着生命可能在宇宙中很常见。',
    gravity: 2,
    color: 'orange'
  },
  {
    id: 'q042',
    question: '地球气候系统的临界点会在何时被触发？',
    explanation: '永久冻土融化释放甲烷、亚马逊雨林变成草原、北极夏季无冰——这些"临界点"可能引发不可逆的连锁反应。',
    gravity: 2,
    color: 'emerald'
  },
  {
    id: 'q043',
    question: '深海热泉中是否隐藏着未知的生命形式？',
    explanation: '在没有阳光的深海，生命靠化学能生存。这里可能存在与地表生命完全不同的"影子生物圈"。',
    gravity: 2,
    color: 'blue'
  },
  {
    id: 'q044',
    question: '地球磁极翻转会对人类文明造成什么影响？',
    explanation: '磁极每隔数十万年就会翻转一次，过程中磁场会大幅减弱。这会让地球暴露在宇宙射线中，影响电网和导航。',
    gravity: 2,
    color: 'orange'
  },
  {
    id: 'q045',
    question: '木卫二冰层下的海洋中存在生命吗？',
    explanation: '木星的卫星欧罗巴有一个比地球所有海洋加起来还大的地下海洋。热液活动可能为生命提供能量。',
    gravity: 2,
    color: 'cyan'
  },
  {
    id: 'q046',
    question: '我们能准确预测超级火山何时喷发吗？',
    explanation: '黄石公园下的岩浆房如果喷发，可能引发全球灾难。但我们对地下深处的了解仍然有限。',
    gravity: 2,
    color: 'orange'
  },
  {
    id: 'q047',
    question: '什么是量子纠缠的物理本质？',
    explanation: '两个粒子可以"瞬间"相互影响，无论相隔多远。这不违反相对论，因为没有信息被传递，但它到底是什么？',
    gravity: 2,
    color: 'cyan'
  },
  {
    id: 'q048',
    question: '弦理论能被实验验证吗？',
    explanation: '弦理论是统一所有力的候选理论，但它预测的现象需要超出人类能力的能量才能观测。它是物理还是数学？',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q049',
    question: 'GPT等大模型的"涌现能力"是如何产生的？',
    explanation: '当模型规模增大时，突然出现了训练时没有明确教过的能力。这是真正的涌现还是我们测量方式的错觉？',
    gravity: 2,
    color: 'violet'
  },
  {
    id: 'q050',
    question: '詹姆斯·韦伯望远镜发现的早期星系为何挑战现有理论？',
    explanation: 'JWST发现宇宙早期就存在成熟的大星系，比理论预测的要早得多。星系形成的理论需要修正。',
    gravity: 2,
    color: 'cyan'
  },
  {
    id: 'q051',
    question: 'AlphaFold之后，蛋白质折叠问题真的被解决了吗？',
    explanation: 'AlphaFold能预测蛋白质结构，但还不能预测蛋白质如何折叠的过程，以及错误折叠导致的疾病。',
    gravity: 2,
    color: 'emerald'
  },
  {
    id: 'q052',
    question: '脑机接口能让瘫痪患者重新行走吗？',
    explanation: 'Neuralink等公司正在开发脑机接口。已有实验让瘫痪者控制机械臂。但长期安全性和精确度仍是挑战。',
    gravity: 2,
    color: 'pink'
  },
  {
    id: 'q053',
    question: '量子纠错能否让量子计算机真正实用化？',
    explanation: '量子比特极其脆弱，容易受干扰出错。有效的纠错需要大量物理量子比特来保护一个逻辑量子比特。',
    gravity: 2,
    color: 'blue'
  },

  // ===== 好奇种子 (gravity: 1) =====
  {
    id: 'q054',
    question: '蜜蜂如何利用地球磁场和太阳位置导航？',
    explanation: '蜜蜂腹部有磁铁矿晶体，可以感知地磁场。它们还能用"舞蹈"告诉同伴食物的方向和距离。',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q055',
    question: '为什么人类每天必须花三分之一时间睡眠？',
    explanation: '睡眠时大脑清理代谢废物、巩固记忆。但完全不睡觉的动物也存在，为什么我们不能？',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q056',
    question: '章鱼的分布式神经系统如何协调八条触手？',
    explanation: '章鱼的神经元大部分在触手中而非大脑。每条触手可以独立"思考"，但又能协调行动。',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q057',
    question: '植物能感知疼痛或对威胁做出反应吗？',
    explanation: '植物没有神经系统，但能释放化学信号警告邻近植物。被虫咬时会产生防御化合物。这算"感知"吗？',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q058',
    question: '打哈欠为什么会传染？',
    explanation: '看到别人打哈欠就想打哈欠，这可能与共情和社会联结有关。但具体的神经机制仍不清楚。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q059',
    question: '候鸟如何在没有GPS的情况下找到万里之外的目的地？',
    explanation: '候鸟利用地磁场、星星位置、太阳角度，甚至嗅觉来导航。有些鸟能飞行上万公里不迷路。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q060',
    question: '蚂蚁群体如何在没有领导者的情况下做出复杂决策？',
    explanation: '蚁后不发号施令，每只蚂蚁只遵循简单规则，但整个群体能做出复杂决策。这是"涌现智能"的典范。',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q061',
    question: '为什么音乐能激发人类如此强烈的情感？',
    explanation: '音乐激活大脑的奖赏系统，释放多巴胺。但为什么特定的音符组合能让人热泪盈眶？进化上有什么意义？',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q062',
    question: '动物在睡眠时是否也会做梦？',
    explanation: '狗睡觉时腿会动，猫会发出呜呜声。大鼠的大脑在睡眠时会"重放"迷宫路径。它们可能真的在做梦。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q063',
    question: '光合作用的量子效率为何接近100%？',
    explanation: '植物捕获光能的效率高得惊人，可能利用了量子相干效应。理解这点可能革新太阳能技术。',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q064',
    question: '人类是否仍在进化，未来会变成什么样？',
    explanation: '自然选择仍在进行，但现代医学和技术改变了选择压力。基因编辑可能让人类"自主进化"。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q065',
    question: '猫发出呼噜声的振动频率为何能促进骨骼愈合？',
    explanation: '猫的呼噜频率(25-50Hz)恰好能促进骨骼再生和组织修复。猫是在给自己"治疗"吗？',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q066',
    question: '章鱼为什么需要三颗心脏和蓝色血液？',
    explanation: '章鱼血液用铜基血蓝蛋白运氧，在冷水低氧环境下更高效。三颗心脏确保血液循环充足。',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q067',
    question: '细菌群体是否具有原始形式的记忆？',
    explanation: '单个细菌没有大脑，但细菌群体能"记住"过去经历并改变行为。这是一种化学编码的群体记忆。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q068',
    question: '恐龙的真实颜色能通过化石推断出来吗？',
    explanation: '化石中保存的黑素体可以揭示恐龙的颜色。我们现在知道有些恐龙是棕红色的，有些有条纹。',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q069',
    question: '球状闪电是等离子体还是某种未知现象？',
    explanation: '球状闪电是漂浮的发光球体，持续数秒。尽管有数千目击报告，科学家仍无法在实验室可靠地重现。',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q070',
    question: '夸克之下是否还有更基本的结构？',
    explanation: '夸克目前被认为是基本粒子。但历史上"基本"多次被打破。夸克可能由更小的"前子"组成？',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q071',
    question: '黑洞会通过霍金辐射完全蒸发吗？',
    explanation: '霍金预测黑洞会缓慢辐射能量最终消失。但这个过程极其缓慢，一个太阳质量的黑洞需要10^67年。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q072',
    question: '人类大脑能够真正理解"无限"这个概念吗？',
    explanation: '我们能用数学符号处理无限，但真的能"理解"它吗？有限的大脑能否把握无限的本质？',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q073',
    question: '水分子的特殊结构为何赋予它如此多异常性质？',
    explanation: '水在4°C时密度最大，固体比液体轻，溶解能力超强——这些"异常"性质让生命成为可能。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q074',
    question: '生命与非生命的本质区别是什么？',
    explanation: '病毒是生命吗？晶体能"生长"但不是生命。自我复制？新陈代谢？对刺激的反应？没有完美的定义。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q075',
    question: '宇宙空间本身有"气味"吗？宇航员闻到了什么？',
    explanation: '宇航员报告太空闻起来像"烧焦的牛排"或"枪硝味"。这可能来自垂死恒星释放的多环芳烃。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q076',
    question: '时间旅行在物理学上是可能的吗？',
    explanation: '广义相对论允许封闭类时曲线，理论上可以回到过去。但祖父悖论怎么解决？可能需要平行宇宙。',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q077',
    question: '真空中真的是"空"的吗？量子涨落是什么？',
    explanation: '即使完全真空，量子力学预测会有虚粒子不断出现又消失。这种"量子涨落"已被实验证实。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q078',
    question: '我们能用基因技术复活已灭绝的物种吗？',
    explanation: '猛犸象、渡渡鸟、袋狼——科学家正尝试"去灭绝"。但复活一个物种，能恢复它的生态位吗？',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q079',
    question: '宇宙中是否存在我们尚未发现的第五种基本力？',
    explanation: '除了引力、电磁力、强核力和弱核力，可能还存在第五种基本力。最新实验中发现的异常暗示着超出标准模型的新物理。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q080',
    question: '宇宙的最终命运是大撕裂、大冻结还是大反弹？',
    explanation: '暗能量的性质决定宇宙的终极命运。如果暗能量在增强，宇宙可能被撕裂；如果恒定，将走向热寂；如果减弱，可能会坍缩重生。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q081',
    question: '是什么机制让中微子几乎能穿透任何物质？',
    explanation: '中微子只参与弱相互作用，几乎不与普通物质发生反应。每秒有数万亿中微子穿过你的身体，却几乎无法被探测到。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q082',
    question: '电子在不被观测时真的同时存在于所有位置吗？',
    explanation: '量子力学的哥本哈根解释说是的，电子处于"叠加态"。但"观测"到底是什么？意识参与了吗？',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q083',
    question: '笑为什么会传染？这是进化的产物吗？',
    explanation: '笑能增强社会联结，释放内啡肽。笑的传染性可能帮助早期人类群体建立信任和协作。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q084',
    question: '宇宙中是否存在真正的随机性？',
    explanation: '量子力学说有——放射性衰变是真随机的。但隐变量理论认为可能有我们不知道的决定因素。',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q085',
    question: '平行宇宙是科幻想象还是量子力学的必然推论？',
    explanation: '多世界解释认为每次量子测量都分裂出新宇宙。这避免了波函数坍缩的问题，但代价是无穷多的宇宙。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q086',
    question: '人类能在实验室中从无到有创造生命吗？',
    explanation: '合成生物学已创造出人工基因组的细菌。但从无机物开始创造完整的生命，仍是巨大挑战。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q087',
    question: '数字0是人类的发明还是宇宙中本就存在的概念？',
    explanation: '"无"是一个概念还是一种存在？0的发明（或发现）是数学史上最重要的里程碑之一。',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q088',
    question: '人类第一个有意义的词语是什么？',
    explanation: '语言的起源是个谜。最早的词可能是拟声词？指示词？还是表示"危险"或"食物"的生存词汇？',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q089',
    question: 'GLP-1类药物为什么能同时治疗肥胖和多种疾病？',
    explanation: '司美格鲁肽等药物不仅减重，还改善心血管健康、可能延缓肾病。这揭示了代谢与多种疾病的深层联系。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q090',
    question: '人造子宫技术能拯救极早产儿吗？',
    explanation: '在羊的实验中，人造子宫让极早产羊存活。对人类的应用可能挽救23周前出生的婴儿，但伦理问题复杂。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q091',
    question: '月球南极的水冰储量足够支撑人类基地吗？',
    explanation: '月球陨石坑永久阴影区有水冰。这些水可以饮用、制氧、生产火箭燃料——是月球基地的关键资源。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q092',
    question: '固态电池何时能让电动汽车续航超过1000公里？',
    explanation: '固态电池比锂离子电池更安全、能量密度更高。量产仍是挑战，但丰田等公司已接近突破。',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q093',
    question: '碳捕获技术能扭转全球变暖吗？',
    explanation: '直接从空气中捕获CO2技术可行但昂贵。需要捕获数十亿吨才能有显著效果。这是补充而非替代减排。',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q094',
    question: '为什么有些人对某种药物有效，另一些人却完全无效？',
    explanation: '药物反应的个体差异巨大。基因组学、表观遗传学和微生物组都在发挥作用。精准医学正在探索如何预测每个人的最佳治疗方案。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q095',
    question: '为什么基因相同的同卵双胞胎会发展出不同的疾病？',
    explanation: '同卵双胞胎基因相同，但一个可能患上癌症或自身免疫病而另一个健康。表观遗传学、随机性和环境如何共同决定命运？',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q096',
    question: '为什么有些人天生就是夜猫子？',
    explanation: '生物钟由基因决定，有些人的昼夜节律周期比24小时长。这可能是进化遗产——需要有人在夜间守卫。',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q097',
    question: '人类能感知多少种颜色？',
    explanation: '正常人能区分约1000万种颜色。四色视者（主要是女性）可能看到1亿种。你看到的红和我看到的一样吗？',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q098',
    question: '为什么我们会忘记梦境？',
    explanation: '负责记忆编码的海马体在REM睡眠时不活跃。醒来时没有"保存"梦的内容。这可能是为了区分梦和现实。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q099',
    question: '树木之间能"交流"吗？',
    explanation: '树木通过地下真菌网络（"树联网"）共享养分和化学信号。老树会"照顾"周围的小树。这是一种森林智能？',
    gravity: 1,
    color: 'emerald'
  },
  {
    id: 'q100',
    question: '大脑如何决定删除哪些记忆？',
    explanation: '我们每天接收海量信息，但只记住一小部分。大脑如何"知道"什么重要？情绪、重复、关联都是因素。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q101',
    question: '宇宙会永远膨胀下去吗？',
    explanation: '目前观测显示宇宙加速膨胀。如果继续，万亿年后所有星系将彼此不可见，宇宙陷入"热寂"。',
    gravity: 1,
    color: 'cyan'
  },
  {
    id: 'q102',
    question: '婴儿在学会语言之前是如何"思考"的？',
    explanation: '语言之前有思维吗？婴儿能解决问题、有情绪反应。思维可能是图像、感觉和原始概念的混合。',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q103',
    question: '为什么人类是唯一会脸红的动物？',
    explanation: '达尔文称脸红为"最人类的表情"。它可能是一种诚实信号，表明我们关心社会规范，增强群体信任。',
    gravity: 1,
    color: 'pink'
  },
  {
    id: 'q104',
    question: '我们能否精确预测复杂系统的长期行为？',
    explanation: '从天气到股市，复杂系统的长期预测似乎有根本性限制。混沌理论设定了预测的边界，但这个边界究竟在哪里？',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q105',
    question: '生物进化是否具有可预测性和方向性？',
    explanation: '进化是随机突变还是存在可预测的路径？不同环境下的趋同进化暗示着某种深层规律。如果重演进化历史，结果会相似吗？',
    gravity: 1,
    color: 'blue'
  },
  {
    id: 'q106',
    question: '世界上有多少种语言？',
    explanation: '约7000种语言，但每两周就有一种消失。语言多样性如何影响人类思维的多样性？',
    gravity: 1,
    color: 'violet'
  },
  {
    id: 'q107',
    question: '人体如何感知时间的流逝？',
    explanation: '我们没有专门的"时间感官"，但能感知时间流逝。大脑如何构建时间体验？为什么快乐时光飞逝，无聊时度日如年？',
    gravity: 1,
    color: 'orange'
  },
  {
    id: 'q108',
    question: '地球内核为什么是固态的？',
    explanation: '虽然极其炽热(5000°C)，但巨大的压力让铁无法融化。内核可能比外核年轻10亿年，仍在"结晶"。',
    gravity: 1,
    color: 'orange'
  }
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
 * 获取一组平衡分布的问题（每次调用都随机）
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
