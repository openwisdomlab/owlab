"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import {
  Bird,
  Layout,
  Gamepad2,
  Swords,
  ScrollText,
  Flower2,
  Brain,
  ArrowRight,
  Sparkles,
  Users,
  Zap,
  Heart,
  Clock,
  Target,
  Lightbulb,
  Trophy,
  BookOpen,
  Share2,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 6个工具配置
const habitatTools = [
  {
    id: "space-designer",
    icon: Layout,
    color: "cyan",
    gradient: "from-cyan-500/20 to-blue-500/10",
    href: "/lab/floor-plan",
    features: ["AI 智能布局", "3D 可视化", "Allen 曲线分析", "平行宇宙模式"],
    agents: 6,
  },
  {
    id: "game-workshop",
    icon: Gamepad2,
    color: "pink",
    gradient: "from-pink-500/20 to-rose-500/10",
    href: "/lab/habitat/game-workshop",
    features: ["科学剧本杀", "密室逃脱生成", "角色扮演引擎", "知识闯关"],
    agents: 5,
    comingSoon: true,
  },
  {
    id: "quest-engine",
    icon: Swords,
    color: "orange",
    gradient: "from-orange-500/20 to-amber-500/10",
    href: "/lab/habitat/quest-engine",
    features: ["世代传承任务", "探索发现任务", "技能成就系统", "运营仪表板"],
    agents: 8,
    comingSoon: true,
  },
  {
    id: "memory-heritage",
    icon: ScrollText,
    color: "amber",
    gradient: "from-amber-500/20 to-yellow-500/10",
    href: "/lab/habitat/memory-heritage",
    features: ["项目记忆馆", "失败神殿", "故事工坊", "星际画廊"],
    agents: 8,
    comingSoon: true,
  },
  {
    id: "idea-garden",
    icon: Flower2,
    color: "green",
    gradient: "from-green-500/20 to-emerald-500/10",
    href: "/lab/habitat/idea-garden",
    features: ["种子库", "培育圃", "嫁接站", "记忆园"],
    agents: 5,
    comingSoon: true,
  },
  {
    id: "wisdom-advisor",
    icon: Brain,
    color: "violet",
    gradient: "from-violet-500/20 to-purple-500/10",
    href: "/lab/habitat/wisdom-advisor",
    features: ["创作者灵魂召唤", "跨域智慧融合", "未来考古学家", "反向导师"],
    agents: 6,
    comingSoon: true,
  },
];

// 三层存在
const threeLayers = [
  {
    id: "time",
    icon: Clock,
    color: "cyan",
    examples: ["记忆博物馆", "失败神殿", "未来考古学家", "平行宇宙"],
  },
  {
    id: "emotion",
    icon: Heart,
    color: "pink",
    examples: ["反向情绪设计器", "创作能量场", "情感剧本"],
  },
  {
    id: "soul",
    icon: Sparkles,
    color: "violet",
    examples: ["创作者灵魂召唤", "探索任务生成", "智慧顾问"],
  },
];

export default function HabitatPage() {
  const t = useTranslations("lab");
  const tHome = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-16"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center relative">
          {/* 背景光效 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 opacity-5 blur-[120px] rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 opacity-5 blur-[120px] rounded-full"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.05, 0.08] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Bird className="w-5 h-5 text-emerald-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                OWL Habitat
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                {tHome("actionTools.habitat.title")}
              </span>
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] mb-4">
              {tHome("actionTools.habitat.subtitle")}
            </p>

            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto mb-8">
              {tHome("actionTools.habitat.description")}
            </p>

            {/* 统计数据 */}
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">6</div>
                <div className="text-sm text-[var(--muted-foreground)]">AI 工具</div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">38</div>
                <div className="text-sm text-[var(--muted-foreground)]">智能代理</div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">3</div>
                <div className="text-sm text-[var(--muted-foreground)]">存在层次</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 核心理念 */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">核心理念</h2>
            <p className="text-[var(--muted-foreground)]">
              OWL 生境不是一个工具集合，而是一个<span className="text-emerald-400 font-medium">有灵魂、有记忆、会做梦的生命体</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {threeLayers.map((layer) => (
              <motion.div
                key={layer.id}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-${layer.color})]/50 transition-all"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `var(--neon-${layer.color})20` }}
                >
                  <layer.icon className="w-6 h-6" style={{ color: `var(--neon-${layer.color})` }} />
                </div>
                <h3 className="font-semibold mb-2">
                  {layer.id === "time" && "时间层"}
                  {layer.id === "emotion" && "情感层"}
                  {layer.id === "soul" && "灵魂层"}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">
                  {layer.id === "time" && "空间记得过去，能看见未来"}
                  {layer.id === "emotion" && "空间有情绪剧本，能被创作能量影响"}
                  {layer.id === "soul" && "空间可以召唤智慧，生成探索任务"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {layer.examples.map((example) => (
                    <span
                      key={example}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `var(--neon-${layer.color})10`,
                        color: `var(--neon-${layer.color})`,
                      }}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 工具矩阵 */}
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">工具矩阵</h2>
            <p className="text-[var(--muted-foreground)]">
              6个AI工具，覆盖创意空间的完整生命周期
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitatTools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4, scale: 1.02 }}
                className="relative"
              >
                {tool.comingSoon ? (
                  <div className="h-full glass-card p-6 opacity-75">
                    <div className="absolute top-4 right-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-[var(--glass-bg)] text-[var(--muted-foreground)] border border-[var(--glass-border)]">
                        即将推出
                      </span>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}
                    >
                      <tool.icon className="w-7 h-7" style={{ color: `var(--neon-${tool.color})` }} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {tHome(`actionTools.habitat.tools.${tool.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`)}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tool.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {tool.agents} 个 AI 代理
                    </div>
                  </div>
                ) : (
                  <Link href={`/${locale}${tool.href}`}>
                    <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group cursor-pointer">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <tool.icon className="w-7 h-7" style={{ color: `var(--neon-${tool.color})` }} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {tHome(`actionTools.habitat.tools.${tool.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}`)}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tool.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `var(--neon-${tool.color})10`,
                              color: `var(--neon-${tool.color})`,
                            }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {tool.agents} 个 AI 代理
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: `var(--neon-${tool.color})` }}>
                          <span>进入</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 用户体验愿景 */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">用户体验愿景</h2>
              <p className="text-sm text-[var(--muted-foreground)]">一个典型的学习旅程</p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-[var(--glass-border)] space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-emerald-500" />
              <p className="text-[var(--muted-foreground)]">
                学生第一次走进 OWL 生境，空间"认出"她是新人，播放一段创始故事。她走近木工区，三个"幽灵项目"浮现——过去学生的作品在等待对话。她选择接受一个"世代传承任务"：完成五年前一个学长未竟的飞行器原型。
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-cyan-500" />
              <p className="text-[var(--muted-foreground)]">
                设计遇到瓶颈时，她召唤"达芬奇灵魂"，得到一个意想不到的机翼建议。她把设计放入"平行宇宙"探索三条路线，又用"未来考古学家"视角审视自己的选择。
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-violet-500" />
              <p className="text-[var(--muted-foreground)]">
                两年后她毕业了，她的项目进入"失败神殿"（因为飞行器最终没能飞起来），但这个"失败圣物"成为下一代学生的灵感起点。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Link
            href={`/${locale}/lab`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:border-[var(--neon-cyan)] transition-colors group"
          >
            <span className="font-medium">返回 AI 工具</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
