"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import {
  BookOpen,
  Compass,
  GraduationCap,
  ShieldCheck,
  FlaskConical,
  ArrowRight,
  FileText,
  Users,
  Sparkles,
  Layers,
  BookMarked,
  Zap,
  Target,
  Rocket,
  GitBranch,
  Layout,
  Lightbulb,
  Wand2,
  Calculator,
  Cpu,
  ChevronRight,
  Bird,
  Gamepad2,
  Swords,
  ScrollText,
  Flower2,
  Brain,
  ChevronDown,
  Network,
  Presentation,
  FolderOpen,
} from "lucide-react";
import { useParams } from "next/navigation";
import Script from "next/script";
import { ModuleCards } from "@/features/doc-viewer/ModuleCards";
import { LearningSpaceTagline } from "@/components/ui/LearningSpaceTagline";
import { EnhancedHero } from "@/components/brand/EnhancedHero";
import { useState } from "react";
import {
  SpaceIcon,
  MindIcon,
  EmergenceIcon,
  PoeticsIcon,
} from "@/components/icons/LivingModuleIcons";
import {
  StudentCenteredIcon,
  ExploreIcon,
  FuturisticIcon,
  FlowingSpaceIcon,
  ToolMindIcon,
  PredictLoopIcon,
  EmbodiedIcon,
  HumanAIIcon,
  DialogueIcon,
  PeripheryIcon,
  SelfOrganizeIcon,
  AICollabIcon,
  ChallengeGrowthIcon,
  FailureLearnIcon,
  StrategicGenIcon,
  MetaCogIcon,
} from "@/components/icons/PrincipleIcons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// 阅读路径配置
const readingPaths = [
  {
    id: "new-node",
    icon: Compass,
    color: "var(--neon-cyan)",
    modules: ["M01", "M06", "M02", "M03", "M05", "M07", "M04", "M08"],
    recommended: true,
  },
  {
    id: "curriculum",
    icon: GraduationCap,
    color: "var(--neon-violet)",
    modules: ["M01", "M04", "M07", "M09"],
    recommended: false,
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    color: "var(--neon-green)",
    modules: ["M06", "M02", "M05", "M08"],
    recommended: false,
  },
];

// 三层架构配置
const architectureLayers = [
  {
    id: "core",
    icon: Target,
    color: "var(--neon-cyan)",
    badge: "Core",
  },
  {
    id: "extend",
    icon: Layers,
    color: "var(--neon-violet)",
    badge: "Extend",
  },
  {
    id: "evidence",
    icon: BookMarked,
    color: "var(--neon-green)",
    badge: "Evidence",
  },
];

// 快速开始步骤
const quickStartSteps = [
  { id: "step1", icon: Compass, color: "var(--neon-cyan)" },
  { id: "step2", icon: BookOpen, color: "var(--neon-violet)" },
  { id: "step3", icon: Rocket, color: "var(--neon-green)" },
];

// Seeded random function for deterministic particle positions (avoids hydration mismatch)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Round to fixed precision to avoid hydration mismatch from floating-point differences
const round2 = (n: number) => Math.round(n * 100) / 100;

// Pre-computed particle data for consistent SSR/client rendering
// Round to 2 decimal places to avoid hydration mismatch from floating-point precision differences
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: Math.round(seededRandom(i * 3) * 10000) / 100,
  top: Math.round(seededRandom(i * 3 + 1) * 10000) / 100,
  opacity: Math.round((seededRandom(i * 3 + 2) * 0.5 + 0.2) * 100) / 100,
  duration: Math.round((seededRandom(i * 3 + 3) * 5 + 5) * 100) / 100,
  delay: Math.round(seededRandom(i * 3 + 4) * 500) / 100,
}));

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  // State for expandable core principles
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  // State for hover effects on module cards
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  // State for hover effects on principle cards
  const [hoveredPrinciple, setHoveredPrinciple] = useState<string | null>(null);

  const togglePrinciples = (moduleId: string) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OWL 开放智慧实验室建设与运营标准手册",
    description: "开放式学习空间的模块化知识库，涵盖理念、治理、空间、课程、工具、安全、人员、运营和评价九大核心模块",
    url: "https://owl.openwisdomlab.org",
  };

  return (
    <div className="relative">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section - Enhanced OWL Visual Identity */}
      <EnhancedHero locale={locale} t={t} />

      {/* 前沿理念模块 Section - 独立展示 */}
      <section className="py-14 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("livingModules.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("livingModules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("livingModules.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-5 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* L01 空间的塑造 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/01-space-as-educator`}>
                <div
                  className="glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group"
                  onMouseEnter={() => setHoveredModule("L01")}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        <SpaceIcon
                          className="w-12 h-12"
                          color="var(--neon-cyan)"
                          isHovered={hoveredModule === "L01"}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-cyan)]">
                            {t("livingModules.modules.spaceAsEducator.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.spaceAsEducator.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.spaceAsEducator.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.spaceAsEducator.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      {t("livingModules.modules.spaceAsEducator.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]">
                      {t("livingModules.modules.spaceAsEducator.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L01")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-cyan)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-cyan)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L01" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L01" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L01 */}
              <AnimatePresence>
                {expandedModule === "L01" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 以学生为中心 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L01-01")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <StudentCenteredIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-cyan)"
                                isHovered={hoveredPrinciple === "L01-01"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                以学生为中心
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                开放自由的氛围，没有标准答案
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 鼓励大胆探索 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L01-02")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <ExploreIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-green)"
                                isHovered={hoveredPrinciple === "L01-02"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Rocket className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                鼓励大胆探索
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                允许犯错，包容失败
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 科技感与未来感 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L01-03")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <FuturisticIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-violet)"
                                isHovered={hoveredPrinciple === "L01-03"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                科技感与未来感
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                点燃技术好奇心
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 灵活流动的空间 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L01-04")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <FlowingSpaceIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-pink)"
                                isHovered={hoveredPrinciple === "L01-04"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                灵活流动的空间
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                灵活、流动和多样化
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L02 思维的延伸 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/02-extended-mind`}>
                <div
                  className="glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group"
                  onMouseEnter={() => setHoveredModule("L02")}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        <MindIcon
                          className="w-12 h-12"
                          color="var(--neon-violet)"
                          isHovered={hoveredModule === "L02"}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-violet)]">
                            {t("livingModules.modules.extendedMind.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.extendedMind.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.extendedMind.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.extendedMind.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
                      {t("livingModules.modules.extendedMind.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]">
                      {t("livingModules.modules.extendedMind.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L02")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-violet)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-violet)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L02" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L02" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L02 */}
              <AnimatePresence>
                {expandedModule === "L02" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 工具即思维 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L02-01")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <ToolMindIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-violet)"
                                isHovered={hoveredPrinciple === "L02-01"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                工具即思维
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                AI 和设备是认知系统的延伸部分
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 预测-验证循环 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L02-02")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <PredictLoopIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-cyan)"
                                isHovered={hoveredPrinciple === "L02-02"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Target className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                预测-验证循环
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                用原型测试假设，失败即学习
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 身体锚定思维 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L02-03")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <EmbodiedIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-pink)"
                                isHovered={hoveredPrinciple === "L02-03"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Wand2 className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                身体锚定思维
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                抽象概念需要触觉和动作支撑
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 人机协作智能 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L02-04")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <HumanAIIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-green)"
                                isHovered={hoveredPrinciple === "L02-04"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                人机协作智能
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                与 AI 共同思考，而非被替代
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L03 涌现的智慧 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/03-emergent-wisdom`}>
                <div
                  className="glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group"
                  onMouseEnter={() => setHoveredModule("L03")}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        <EmergenceIcon
                          className="w-12 h-12"
                          color="var(--neon-green)"
                          isHovered={hoveredModule === "L03"}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-green)]">
                            {t("livingModules.modules.emergentWisdom.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.emergentWisdom.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.emergentWisdom.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.emergentWisdom.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
                      {t("livingModules.modules.emergentWisdom.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
                      {t("livingModules.modules.emergentWisdom.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L03")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-green)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-green)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L03" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L03" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L03 */}
              <AnimatePresence>
                {expandedModule === "L03" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 对话即智能 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L03-01")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <DialogueIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-green)"
                                isHovered={hoveredPrinciple === "L03-01"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Users className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                对话即智能
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                思想在交流中变得更强大
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 边缘参与路径 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L03-02")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <PeripheryIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-cyan)"
                                isHovered={hoveredPrinciple === "L03-02"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Compass className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                边缘参与路径
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                从观察者到贡献者的成长阶梯
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 知识自组织 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L03-03")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <SelfOrganizeIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-violet)"
                                isHovered={hoveredPrinciple === "L03-03"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                知识自组织
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                分享-迭代-精炼的循环产生集体智慧
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: AI 辅助协作 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L03-04")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <AICollabIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-pink)"
                                isHovered={hoveredPrinciple === "L03-04"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                AI 辅助协作
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                技术降低协作门槛，放大集体智能
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* L04 持续的进化 */}
            <motion.div variants={itemVariants} className="flex flex-col">
              <Link href={`/${locale}/docs/research/04-poetics-of-technology`}>
                <div
                  className="glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group"
                  onMouseEnter={() => setHoveredModule("L04")}
                  onMouseLeave={() => setHoveredModule(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        <PoeticsIcon
                          className="w-12 h-12"
                          color="var(--neon-pink)"
                          isHovered={hoveredModule === "L04"}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-[var(--neon-pink)]">
                            {t("livingModules.modules.poeticsOfTechnology.id")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {t("livingModules.modules.poeticsOfTechnology.title")}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3 leading-relaxed">
                    {t("livingModules.modules.poeticsOfTechnology.subtitle")}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("livingModules.modules.poeticsOfTechnology.description")}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 rounded bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]">
                      {t("livingModules.modules.poeticsOfTechnology.principles")}
                    </span>
                    <span className="px-2 py-1 rounded bg-[var(--neon-pink)]/10 text-[var(--neon-pink)]">
                      {t("livingModules.modules.poeticsOfTechnology.checklist")}
                    </span>
                  </div>
                </div>
              </Link>

              {/* Expandable Button */}
              <motion.button
                onClick={() => togglePrinciples("L04")}
                className="mt-2 w-full px-4 py-2 rounded-lg glass-card hover:border-[var(--neon-pink)]/50 transition-all flex items-center justify-center gap-2 text-sm font-medium text-[var(--neon-pink)]"
                whileHover={{ y: -2 }}
              >
                <span>{expandedModule === "L04" ? "收起核心理念" : "查看核心理念"}</span>
                <motion.div
                  animate={{ rotate: expandedModule === "L04" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.button>

              {/* Expandable Core Principles - L04 */}
              <AnimatePresence>
                {expandedModule === "L04" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      {/* Principle 1: 挑战即成长 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L04-01")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-pink)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-pink)]/30 hover:border-[var(--neon-pink)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-pink)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-pink)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-pink)]">01</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <ChallengeGrowthIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-pink)"
                                isHovered={hoveredPrinciple === "L04-01"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Target className="w-8 h-8 text-[var(--neon-pink)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-pink)]">
                                挑战即成长
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                困难是能力扩展的信号
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 2: 失败即反馈 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L04-02")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-green)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-green)]/30 hover:border-[var(--neon-green)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-green)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-green)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-green)]">02</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <FailureLearnIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-green)"
                                isHovered={hoveredPrinciple === "L04-02"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Lightbulb className="w-8 h-8 text-[var(--neon-green)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-green)]">
                                失败即反馈
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                错误提供更新认知模型的数据
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 3: 战略性生成 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L04-03")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-cyan)]/30 hover:border-[var(--neon-cyan)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-cyan)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-cyan)]">03</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <StrategicGenIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-cyan)"
                                isHovered={hoveredPrinciple === "L04-03"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GitBranch className="w-8 h-8 text-[var(--neon-cyan)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-cyan)]">
                                战略性生成
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                主动创造解决方法而非套用公式
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Principle 4: 元认知循环 */}
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="group relative"
                        onMouseEnter={() => setHoveredPrinciple("L04-04")}
                        onMouseLeave={() => setHoveredPrinciple(null)}
                      >
                        <div className="relative h-full p-3 rounded-lg bg-gradient-to-br from-[var(--neon-violet)]/10 via-[var(--background)] to-[var(--background)] border-2 border-[var(--neon-violet)]/30 hover:border-[var(--neon-violet)] transition-all duration-300 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-violet)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--neon-violet)]/20 flex items-center justify-center">
                            <span className="text-base font-black text-[var(--neon-violet)]">04</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0 w-16 h-16">
                              <MetaCogIcon
                                className="absolute inset-0 w-full h-full"
                                color="var(--neon-violet)"
                                isHovered={hoveredPrinciple === "L04-04"}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Brain className="w-8 h-8 text-[var(--neon-violet)] relative z-10" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-bold mb-0.5 text-[var(--neon-violet)]">
                                元认知循环
                              </h3>
                              <p className="text-sm text-[var(--foreground)] font-medium mb-1">
                                觉察-规划-监控-调整的持续迭代
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/research`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookMarked className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("livingModules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 五大核心价值 Section */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2 text-[var(--foreground)]">OWL 核心价值</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto text-sm">
              构建创新学习空间的五大支柱
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {[
              {
                label: '开放',
                en: 'Open',
                color: '#9A6A8A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
                    <circle cx="40" cy="40" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="40" cy="40" r="6" fill="currentColor" />
                    <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="58" x2="40" y2="70" stroke="currentColor" strokeWidth="2" />
                    <line x1="10" y1="40" x2="22" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="58" y1="40" x2="70" y2="40" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                desc: '开放式创新，拥抱多元视角'
              },
              {
                label: '交叉',
                en: 'Cross',
                color: '#6A809A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="55" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="40" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                    <circle cx="40" cy="35" r="5" fill="currentColor" opacity="0.8" />
                  </svg>
                ),
                desc: '跨学科融合，突破边界思考'
              },
              {
                label: '连接',
                en: 'Connect',
                color: '#7A8490',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <circle cx="20" cy="40" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="60" cy="40" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="40" cy="20" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="40" cy="60" r="8" fill="currentColor" opacity="0.8" />
                    <line x1="28" y1="40" x2="52" y2="40" stroke="currentColor" strokeWidth="2" />
                    <line x1="40" y1="28" x2="40" y2="52" stroke="currentColor" strokeWidth="2" />
                    <line x1="26" y1="34" x2="34" y2="26" stroke="currentColor" strokeWidth="2" />
                    <line x1="46" y1="26" x2="54" y2="34" stroke="currentColor" strokeWidth="2" />
                    <line x1="26" y1="46" x2="34" y2="54" stroke="currentColor" strokeWidth="2" />
                    <line x1="46" y1="54" x2="54" y2="46" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                desc: '连接全球资源，构建协作网络'
              },
              {
                label: '可持续',
                en: 'Sustainable',
                color: '#4A9A6A',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    {/* 循环箭头 - 经典的可持续发展符号 */}
                    <path
                      d="M40 16 C55 16 66 27 66 40 C66 47 63 53 58 57"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="58,50 64,58 52,58" fill="currentColor" />
                    <path
                      d="M58 57 C50 66 38 68 27 62 C20 58 16 50 16 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="16,47 10,39 22,39" fill="currentColor" />
                    <path
                      d="M16 40 C16 27 27 16 40 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon points="33,16 40,10 40,22" fill="currentColor" />
                    {/* 中心叶子 */}
                    <ellipse cx="40" cy="40" rx="8" ry="12" fill="currentColor" opacity="0.6" transform="rotate(-30, 40, 40)" />
                    <path d="M40 34 L40 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                  </svg>
                ),
                desc: '持续发展，生生不息的创新生态'
              },
              {
                label: '黑科技',
                en: 'Tech',
                color: '#A49464',
                svg: (
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <rect x="22" y="22" width="36" height="36" rx="4" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2.5" />
                    <rect x="30" y="30" width="20" height="20" rx="2" fill="currentColor" opacity="0.4" stroke="currentColor" strokeWidth="2" />
                    <line x1="32" y1="22" x2="32" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="40" y1="22" x2="40" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="22" x2="48" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="32" y1="58" x2="32" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="40" y1="58" x2="40" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="48" y1="58" x2="48" y2="66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="40" x2="14" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="22" y1="48" x2="14" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="32" x2="66" y2="32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="40" x2="66" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="58" y1="48" x2="66" y2="48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="40" cy="40" r="5" fill="currentColor" />
                  </svg>
                ),
                desc: 'AI时代的前沿工具与创新思维'
              },
            ].map((value) => (
              <motion.div
                key={value.label}
                className="group relative"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div
                  className="px-5 py-3 rounded-xl glass-card cursor-pointer transition-all duration-300 hover:shadow-lg flex items-center gap-3"
                  style={{
                    borderColor: `${value.color}40`,
                    boxShadow: `0 0 0 1px ${value.color}20`,
                  }}
                >
                  <div
                    className="w-8 h-8 flex-shrink-0"
                    style={{ color: value.color }}
                  >
                    {value.svg}
                  </div>
                  <div>
                    <span className="font-semibold text-sm" style={{ color: value.color }}>
                      {value.label}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-1">
                      {value.en}
                    </span>
                  </div>
                </div>

                {/* Hover Card with Description */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                  <div
                    className="relative p-4 rounded-xl glass-card border min-w-[200px] shadow-xl"
                    style={{ borderColor: `${value.color}40`, background: 'var(--glass-bg)' }}
                  >
                    {/* Arrow */}
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t glass-card"
                      style={{ borderColor: `${value.color}40` }}
                    />

                    {/* SVG Visualization */}
                    <div
                      className="w-16 h-16 mx-auto mb-3"
                      style={{ color: value.color }}
                    >
                      {value.svg}
                    </div>

                    {/* Title */}
                    <div className="text-center mb-2">
                      <span className="font-bold" style={{ color: value.color }}>
                        {value.label}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-1">
                        {value.en}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[var(--muted-foreground)] text-center leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 知识库模块 Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("modules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("modules.description")}
            </p>
          </motion.div>

          <ModuleCards locale={locale} showHighlights={false} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/core`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("modules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 爱因斯坦名言 Section - 冲击力设计 */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* 简洁背景 */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, var(--glass-bg) 20%, var(--glass-bg) 80%, transparent 100%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* E=mc² 右上角装饰 */}
          <motion.div
            className="absolute -top-8 right-0 md:right-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="text-xl md:text-2xl lg:text-3xl font-bold italic"
              style={{
                fontFamily: "'Times New Roman', 'Georgia', serif",
                background: 'linear-gradient(135deg, var(--neon-violet) 0%, var(--neon-cyan) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))',
              }}
            >
              E=mc²
            </span>
          </motion.div>

          {/* 名言内容 */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* 名言文字 - 重新设计排版 */}
            <div
              className="text-lg md:text-xl lg:text-2xl leading-loose text-center max-w-4xl mx-auto"
              style={{
                fontFamily: "'Source Han Serif CN', 'Noto Serif SC', 'STSong', serif",
                letterSpacing: '0.03em',
                lineHeight: '2',
              }}
            >
              <span className="text-[var(--foreground)]">
                <span
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-violet) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  提出一个问题
                </span>
                往往比
                <span className="text-[var(--muted-foreground)]">解决一个问题</span>
                更重要。
              </span>
              <br className="hidden md:block" />
              <span className="text-[var(--muted-foreground)]">
                因为解决问题也许仅是一个数学上或实验上的技能而已，
              </span>
              <br className="hidden md:block" />
              <span className="text-[var(--foreground)]">
                而提出新的问题，却需要有
                <span
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-violet) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  创造性的想象力
                </span>
                ，
              </span>
              <br className="hidden md:block" />
              <span className="text-[var(--foreground)]">
                标志着
                <span
                  className="font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--neon-violet) 0%, var(--neon-cyan) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  科学的真正进步
                </span>
                。
              </span>
            </div>

            {/* 作者署名 - 居中简洁 */}
            <motion.div
              className="flex items-center justify-center gap-4 mt-8 md:mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div
                className="h-px w-12"
                style={{
                  background: 'linear-gradient(to right, transparent, var(--neon-violet))'
                }}
              />
              <span
                className="text-sm md:text-base font-medium tracking-wide text-[var(--foreground)]"
              >
                阿尔伯特·爱因斯坦
              </span>
              <div
                className="h-px w-12"
                style={{
                  background: 'linear-gradient(to left, transparent, var(--neon-cyan))'
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 行动层工具 Section */}
      <section className="py-14 px-4 bg-[var(--glass-bg)]/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Wand2 className="w-4 h-4 text-[var(--neon-violet)]" />
              {t("actionTools.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 text-[var(--foreground)]">{t("actionTools.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("actionTools.description")}
            </p>
          </motion.div>

          {/* OWL 创意工具箱 - 突出入口卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <Link href={`/${locale}/lab/habitat`}>
              <motion.div
                whileHover={{ scale: 1.01, y: -4 }}
                whileTap={{ scale: 0.99 }}
                className="relative overflow-hidden rounded-2xl p-8 group cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.12) 50%, rgba(139, 92, 246, 0.15) 100%)",
                  border: "2px solid rgba(16, 185, 129, 0.3)",
                }}
              >
                {/* 背景动画光效 */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -top-20 -right-20 w-60 h-60 bg-[var(--neon-green)] opacity-10 blur-[80px] rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-[var(--neon-cyan)] opacity-10 blur-[80px] rounded-full"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.1, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* 左侧：标题和描述 */}
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Bird className="w-8 h-8 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400 bg-clip-text text-transparent">
                          {t("actionTools.habitat.title")}
                        </h3>
                        <p className="text-[var(--muted-foreground)] mb-3">
                          {t("actionTools.habitat.subtitle")}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)] max-w-xl">
                          {t("actionTools.habitat.description")}
                        </p>
                      </div>
                    </div>

                    {/* 右侧：工具标签和CTA */}
                    <div className="flex flex-col items-start lg:items-end gap-4">
                      {/* 6个工具标签 */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { icon: Layout, label: t("actionTools.habitat.tools.spaceDesigner"), color: "cyan" },
                          { icon: Gamepad2, label: t("actionTools.habitat.tools.gameWorkshop"), color: "pink" },
                          { icon: Swords, label: t("actionTools.habitat.tools.questEngine"), color: "orange" },
                          { icon: ScrollText, label: t("actionTools.habitat.tools.memoryHeritage"), color: "amber" },
                          { icon: Flower2, label: t("actionTools.habitat.tools.ideaGarden"), color: "green" },
                          { icon: Brain, label: t("actionTools.habitat.tools.wisdomAdvisor"), color: "violet" },
                        ].map((tool, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `var(--neon-${tool.color})15`,
                              color: `var(--neon-${tool.color})`,
                              border: `1px solid var(--neon-${tool.color})30`,
                            }}
                          >
                            <tool.icon className="w-3.5 h-3.5" />
                            {tool.label}
                          </div>
                        ))}
                      </div>

                      {/* 统计和CTA */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {t("actionTools.habitat.stats")}
                        </span>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium group-hover:bg-emerald-500/30 transition-colors">
                          <span>{t("actionTools.habitat.enter")}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover 边框效果 */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-500/50 transition-colors pointer-events-none" />
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* T01 AI 空间设计器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/floor-plan`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layout className="w-6 h-6 text-[var(--neon-cyan)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-cyan)]">
                      {t("actionTools.tools.spaceDesigner.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.spaceDesigner.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.spaceDesigner.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                    <span>开始设计</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T02 虚拟课题组 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/habitat`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-[var(--neon-violet)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-violet)]">
                      {t("actionTools.tools.researchTeam.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.researchTeam.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.researchTeam.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-violet)] font-medium group-hover:gap-3 transition-all">
                    <span>组建课题组</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T03 游戏工坊 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/habitat`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Gamepad2 className="w-6 h-6 text-[var(--neon-green)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-green)]">
                      {t("actionTools.tools.gameWorkshop.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.gameWorkshop.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.gameWorkshop.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-green)] font-medium group-hover:gap-3 transition-all">
                    <span>设计游戏</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T04 智慧连接器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/habitat`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Network className="w-6 h-6 text-[var(--neon-pink)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-pink)]">
                      {t("actionTools.tools.connector.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.connector.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.connector.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-pink)] font-medium group-hover:gap-3 transition-all">
                    <span>发现连接</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T05 作品展示生成器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/habitat`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-yellow)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-yellow)]/20 to-[var(--neon-yellow)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Presentation className="w-6 h-6 text-[var(--neon-yellow)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-yellow)]">
                      {t("actionTools.tools.showcaseGenerator.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.showcaseGenerator.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.showcaseGenerator.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-yellow)] font-medium group-hover:gap-3 transition-all">
                    <span>生成展示</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* T06 开源资源库 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/resources`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-orange)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-orange)]/20 to-[var(--neon-orange)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FolderOpen className="w-6 h-6 text-[var(--neon-orange)]" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[var(--neon-orange)]">
                      {t("actionTools.tools.opensourceHub.id")}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.opensourceHub.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.opensourceHub.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-orange)] font-medium group-hover:gap-3 transition-all">
                    <span>探索资源</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/lab`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-violet)]/10 to-[var(--neon-pink)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-violet)] transition-colors group"
            >
              <FlaskConical className="w-5 h-5 text-[var(--neon-violet)]" />
              <span className="font-medium">{t("actionTools.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Quote Section - 没有问题是太愚蠢的 */}
      <section className="py-6 md:py-8 px-4 relative overflow-hidden">
        {/* 背景装饰 - 问号和灯泡漂浮 */}
        <div className="absolute inset-0 pointer-events-none">
          {/* 扩散圆环 */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, var(--neon-yellow)/5 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", type: "tween" }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[var(--neon-cyan)]/10"
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear", type: "tween" }}
          />

          {/* 漂浮的问号 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`question-${i}`}
              className="absolute text-2xl md:text-3xl opacity-20"
              style={{
                left: `${10 + i * 20}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [-10, 10, -10],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.8,
                type: "tween",
              }}
            >
              ?
            </motion.div>
          ))}

          {/* 漂浮的灯泡 */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`bulb-${i}`}
              className="absolute text-xl md:text-2xl"
              style={{
                left: `${20 + i * 22}%`,
                top: `${60 + (i % 2) * 20}%`,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.35, 0.15],
              }}
              transition={{
                duration: 3 + i * 0.7,
                repeat: Infinity,
                delay: i * 0.5 + 1,
              }}
            >
              💡
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* 主引言卡片 */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* 卡片容器 */}
              <motion.div
                className="relative px-8 py-10 md:px-14 md:py-12 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
                whileHover={{
                  boxShadow: '0 12px 48px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
                transition={{ duration: 0.3 }}
              >
                {/* 卡片内发光效果 */}
                <motion.div
                  className="absolute -top-20 -left-20 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, var(--neon-yellow)/15 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, type: "tween" }}
                />
                <motion.div
                  className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, var(--neon-pink)/15 0%, transparent 70%)',
                  }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2, type: "tween" }}
                />

                {/* 引言内容 */}
                <motion.h2
                  className="relative z-10 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-relaxed md:leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {/* 第一句 */}
                  <span className="block md:inline">
                    <span className="text-[var(--foreground)]">没有</span>
                    <motion.span
                      className="inline-flex items-baseline mx-1"
                      whileHover={{
                        textShadow: "0 0 20px var(--neon-yellow)",
                      }}
                    >
                      <span className="bg-gradient-to-r from-[var(--neon-yellow)] via-[var(--neon-orange)] to-[var(--neon-yellow)] bg-clip-text text-transparent font-black">
                        问题
                      </span>
                      <motion.span
                        className="inline-block ml-0.5 text-[1.1em] font-black text-[var(--neon-yellow)] drop-shadow-[0_0_12px_var(--neon-yellow)]"
                        animate={{ rotate: [0, 15, 0], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, type: "tween" }}
                      >
                        ?
                      </motion.span>
                    </motion.span>
                    <span className="text-[var(--foreground)]">是太</span>
                    <motion.span
                      className="inline-block bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] bg-clip-text text-transparent mx-1 font-black"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      愚蠢
                    </motion.span>
                    <span className="text-[var(--foreground)]">的</span>
                  </span>

                  {/* 分隔符 - 在移动端换行 */}
                  <span className="hidden md:inline mx-3 text-[var(--foreground)]/30 font-light">|</span>
                  <span className="block md:hidden h-3" />

                  {/* 第二句 */}
                  <span className="block md:inline">
                    <span className="text-[var(--foreground)]">没有</span>
                    <motion.span
                      className="inline-flex items-baseline mx-1"
                      whileHover={{
                        textShadow: "0 0 20px var(--neon-pink)",
                      }}
                    >
                      <span className="bg-gradient-to-r from-[var(--neon-pink)] via-[var(--neon-violet)] to-[var(--neon-pink)] bg-clip-text text-transparent font-black">
                        想法
                      </span>
                      <motion.span
                        className="inline-block ml-0.5 text-[1.1em] drop-shadow-[0_0_12px_var(--neon-yellow)]"
                        animate={{ scale: [1, 1.3, 1], filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        💡
                      </motion.span>
                    </motion.span>
                    <span className="text-[var(--foreground)]">是太</span>
                    <motion.span
                      className="inline-block bg-gradient-to-r from-[var(--neon-orange)] to-[var(--neon-pink)] bg-clip-text text-transparent mx-1 font-black"
                      whileHover={{ scale: 1.1, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      疯狂
                    </motion.span>
                    <span className="text-[var(--foreground)]">的</span>
                  </span>
                </motion.h2>

                {/* 装饰性角标 */}
                <div className="absolute top-4 left-4 text-2xl opacity-20 text-[var(--neon-yellow)]">"</div>
                <div className="absolute bottom-4 right-4 text-2xl opacity-20 text-[var(--neon-pink)]">"</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brand Visual System Section */}
      <section className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[#D91A7A]" />
              Brand Identity
            </motion.div>
            <h2 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[#D91A7A] via-[#5C5470] to-[#D91A7A] bg-clip-text text-transparent">
                品牌视觉系统
              </span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              「夜视者」—— 在深夜星空中洞察光明，于未知领域激发创意
            </p>
            <p className="text-[var(--muted-foreground)] text-sm max-w-3xl mx-auto mt-4 leading-relaxed">
              融合霓虹粉与深邃蓝的双色体系，以几何晶格、能量粒子流、混合符号三大视觉基因，
              构建沉稳而富有创意的品牌语言。猫头鹰五种状态——凝视、灵光、连接、飞翔、分享——
              完整呈现从好奇到创造的学习旅程。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/core/10-brand`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[var(--glass-border)] hover:border-[#D91A7A] transition-colors group"
              style={{ background: 'linear-gradient(135deg, rgba(217,26,122,0.08), rgba(92,84,112,0.08))' }}
            >
              <Sparkles className="w-5 h-5 text-[#D91A7A]" />
              <span className="font-medium">查看完整品牌规范</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            {/* Main footer row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo & Copyright */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Open Wisdom Lab"
                  className="h-10 w-auto opacity-80"
                />
                <p className="text-sm text-[var(--muted-foreground)]">
                  © 2025 Open Wisdom Lab
                </p>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6 text-sm">
                <Link
                  href={`/${locale}/docs/core/ARCHITECTURE-V2`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.architecture")}
                </Link>
                <Link
                  href={`/${locale}/docs/core/COLLABORATION-PROTOCOL`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.collaboration")}
                </Link>
                <Link
                  href={`/${locale}/docs/core/CHANGELOG`}
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {t("footer.changelog")}
                </Link>
                <a
                  href="https://github.com/openwisdomlab/owlab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* AI Space description */}
            <div className="pt-4 border-t border-[var(--glass-border)]/50 text-center">
              <Link
                href={`/${locale}/docs`}
                className="inline-flex items-center gap-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                <span>{t("footer.aiSpace")}</span>
                <span className="opacity-60">·</span>
                <span className="opacity-60">{t("footer.aiSpaceDesc")}</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
