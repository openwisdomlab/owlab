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
  Heart,
  Clock,
  Lightbulb,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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

type ToolConfig = {
  id: string;
  featureKey: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  href: string;
  agents: number;
  comingSoon?: boolean;
};

const habitatTools: ToolConfig[] = [
  {
    id: "space-designer",
    featureKey: "spaceDesigner",
    icon: Layout,
    color: "cyan",
    gradient: "from-cyan-500/20 to-blue-500/10",
    href: "/lab/floor-plan",
    agents: 6,
  },
  {
    id: "game-workshop",
    featureKey: "gameWorkshop",
    icon: Gamepad2,
    color: "pink",
    gradient: "from-pink-500/20 to-rose-500/10",
    href: "/lab/habitat/game-workshop",
    agents: 5,
    comingSoon: true,
  },
  {
    id: "quest-engine",
    featureKey: "questEngine",
    icon: Swords,
    color: "orange",
    gradient: "from-orange-500/20 to-amber-500/10",
    href: "/lab/habitat/quest-engine",
    agents: 8,
    comingSoon: true,
  },
  {
    id: "memory-heritage",
    featureKey: "memoryHeritage",
    icon: ScrollText,
    color: "amber",
    gradient: "from-amber-500/20 to-yellow-500/10",
    href: "/lab/habitat/memory-heritage",
    agents: 8,
    comingSoon: true,
  },
  {
    id: "idea-garden",
    featureKey: "ideaGarden",
    icon: Flower2,
    color: "green",
    gradient: "from-green-500/20 to-emerald-500/10",
    href: "/lab/habitat/idea-garden",
    agents: 5,
    comingSoon: true,
  },
  {
    id: "wisdom-advisor",
    featureKey: "wisdomAdvisor",
    icon: Brain,
    color: "violet",
    gradient: "from-violet-500/20 to-purple-500/10",
    href: "/lab/habitat/wisdom-advisor",
    agents: 6,
    comingSoon: true,
  },
];

type LayerConfig = {
  id: string;
  icon: LucideIcon;
  color: string;
  titleKey: string;
  descKey: string;
  exampleKey: string;
};

const threeLayers: LayerConfig[] = [
  {
    id: "time",
    icon: Clock,
    color: "cyan",
    titleKey: "timeLayer",
    descKey: "timeLayerDesc",
    exampleKey: "time",
  },
  {
    id: "emotion",
    icon: Heart,
    color: "pink",
    titleKey: "emotionLayer",
    descKey: "emotionLayerDesc",
    exampleKey: "emotion",
  },
  {
    id: "soul",
    icon: Sparkles,
    color: "violet",
    titleKey: "soulLayer",
    descKey: "soulLayerDesc",
    exampleKey: "soul",
  },
];

export default function HabitatPage() {
  const tHome = useTranslations("home");
  const tHabitat = useTranslations("habitat");
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

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">6</div>
                <div className="text-sm text-[var(--muted-foreground)]">{tHabitat("stats.tools")}</div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">38</div>
                <div className="text-sm text-[var(--muted-foreground)]">{tHabitat("stats.agents")}</div>
              </div>
              <div className="w-px h-10 bg-[var(--glass-border)]" />
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400">3</div>
                <div className="text-sm text-[var(--muted-foreground)]">{tHabitat("stats.layers")}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Philosophy */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{tHabitat("corePhilosophy")}</h2>
            <p className="text-[var(--muted-foreground)]">
              {tHabitat("corePhilosophyDesc")}
              <span className="text-emerald-400 font-medium">{tHabitat("corePhilosophyHighlight")}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {threeLayers.map((layer) => {
              const examples = tHabitat.raw(`examples.${layer.exampleKey}`) as string[];
              return (
                <motion.div
                  key={layer.id}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `var(--neon-${layer.color})20` }}
                  >
                    <layer.icon className="w-6 h-6" style={{ color: `var(--neon-${layer.color})` }} />
                  </div>
                  <h3 className="font-semibold mb-2">
                    {tHabitat(layer.titleKey)}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    {tHabitat(layer.descKey)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {examples.map((example: string) => (
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
              );
            })}
          </div>
        </motion.div>

        {/* Tool Matrix */}
        <motion.div variants={itemVariants}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{tHabitat("toolMatrix")}</h2>
            <p className="text-[var(--muted-foreground)]">
              {tHabitat("toolMatrixDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitatTools.map((tool) => {
              const features = tHabitat.raw(`features.${tool.featureKey}`) as string[];
              const toolNameKey = tool.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              return (
                <motion.div
                  key={tool.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="relative"
                >
                  {tool.comingSoon ? (
                    <div className="h-full glass-card p-6 opacity-75">
                      <div className="absolute top-4 right-4">
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--glass-bg)] text-[var(--muted-foreground)] border border-[var(--glass-border)]">
                          {tHabitat("comingSoon")}
                        </span>
                      </div>
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4`}
                      >
                        <tool.icon className="w-7 h-7" style={{ color: `var(--neon-${tool.color})` }} />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {tHome(`actionTools.habitat.tools.${toolNameKey}`)}
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {features.map((feature: string) => (
                          <span
                            key={feature}
                            className="text-xs px-2 py-0.5 rounded-full bg-[var(--glass-bg)] text-[var(--muted-foreground)]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-[var(--muted-foreground)]">
                        {tHabitat("aiAgents", { count: tool.agents })}
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
                          {tHome(`actionTools.habitat.tools.${toolNameKey}`)}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {features.map((feature: string) => (
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
                            {tHabitat("aiAgents", { count: tool.agents })}
                          </span>
                          <div className="flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all" style={{ color: `var(--neon-${tool.color})` }}>
                            <span>{tHabitat("enter")}</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* User Experience Vision */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">{tHabitat("uxVision")}</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{tHabitat("uxVisionSubtitle")}</p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-[var(--glass-border)] space-y-6">
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-emerald-500" />
              <p className="text-[var(--muted-foreground)]">
                {tHabitat("uxStep1")}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-cyan-500" />
              <p className="text-[var(--muted-foreground)]">
                {tHabitat("uxStep2")}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-violet-500" />
              <p className="text-[var(--muted-foreground)]">
                {tHabitat("uxStep3")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Back button */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <Link
            href={`/${locale}/lab`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:border-[var(--neon-cyan)] transition-colors group"
          >
            <span className="font-medium">{tHabitat("backToTools")}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
