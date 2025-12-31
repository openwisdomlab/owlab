"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { useParams } from "next/navigation";
import Script from "next/script";
import { ModuleCards } from "@/components/docs/ModuleCards";

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

export default function HomePage() {
  const t = useTranslations("home");
  const params = useParams();
  const locale = params.locale as string;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OWL 建设与运营标准手册",
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

      {/* Hero Section - 更活泼的设计 */}
      <section className="relative py-20 lg:py-28 px-4 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-5 blur-[100px] rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-violet)] opacity-5 blur-[100px] rounded-full"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.05, 0.08] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--neon-pink)] opacity-[0.02] blur-[120px] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <motion.div
          className="relative max-w-5xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* 标题区域 */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("hero.version")}
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">
              <span className="gradient-text">{t("hero.title")}</span>
            </h1>

            <p className="text-sm text-[var(--neon-cyan)] font-mono tracking-widest mb-4">
              {t("hero.subtitle")}
            </p>

            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-8">
              {t("hero.description")}
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/${locale}/docs/zh/knowledge-base`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-medium hover:opacity-90 transition-opacity shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                {t("hero.cta.start")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/docs/zh/knowledge-base/ARCHITECTURE-V2`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass-card hover:border-[var(--neon-cyan)] transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                {t("hero.cta.architecture")}
              </Link>
            </div>
          </motion.div>

          {/* 核心特性和统计数据已隐藏，直接切入正题 */}
        </motion.div>
      </section>

      {/* 三层架构导航 Section */}
      <section className="py-16 px-4 border-y border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Layers className="w-4 h-4 text-[var(--neon-cyan)]" />
              {t("threeLayerNav.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 gradient-text">{t("threeLayerNav.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("threeLayerNav.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* 理念层 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/living-modules`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-[var(--neon-cyan)]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] font-mono">
                      {t("threeLayerNav.layers.philosophy.badge")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("threeLayerNav.layers.philosophy.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("threeLayerNav.layers.philosophy.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                    <span>{t("threeLayerNav.layers.philosophy.link")}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 行动层 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket className="w-6 h-6 text-[var(--neon-violet)]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--neon-violet)]/10 text-[var(--neon-violet)] font-mono">
                      {t("threeLayerNav.layers.action.badge")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("threeLayerNav.layers.action.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("threeLayerNav.layers.action.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-violet)] font-medium group-hover:gap-3 transition-all">
                    <span>{t("threeLayerNav.layers.action.link")}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 主文档 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base/ARCHITECTURE-V2`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-[var(--neon-green)]" />
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--neon-green)]/10 text-[var(--neon-green)] font-mono">
                      {t("threeLayerNav.layers.docs.badge")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t("threeLayerNav.layers.docs.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("threeLayerNav.layers.docs.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-green)] font-medium group-hover:gap-3 transition-all">
                    <span>{t("threeLayerNav.layers.docs.link")}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 前沿理念模块 Section - 独立展示 */}
      <section className="py-20 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Sparkles className="w-4 h-4 text-[var(--neon-yellow)]" />
              {t("livingModules.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 gradient-text">{t("livingModules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("livingModules.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-6 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* 空间的塑造 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/living-modules/01-space-as-educator`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-[var(--neon-cyan)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t("livingModules.modules.spaceAsEducator.title")}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {t("livingModules.modules.spaceAsEducator.meta")}
                        </p>
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
            </motion.div>

            {/* 思维的延伸 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/living-modules/02-extended-mind`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6 text-[var(--neon-violet)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t("livingModules.modules.extendedMind.title")}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {t("livingModules.modules.extendedMind.meta")}
                        </p>
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
            </motion.div>

            {/* 涌现的智慧 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/living-modules/03-emergent-wisdom`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-[var(--neon-green)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t("livingModules.modules.emergentWisdom.title")}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {t("livingModules.modules.emergentWisdom.meta")}
                        </p>
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
            </motion.div>

            {/* 技术的诗意 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/living-modules/04-poetics-of-technology`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-[var(--neon-pink)]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {t("livingModules.modules.poeticsOfTechnology.title")}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] font-mono">
                          {t("livingModules.modules.poeticsOfTechnology.meta")}
                        </p>
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
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <Link
              href={`/${locale}/docs/zh/living-modules`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookMarked className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("livingModules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 行动层工具 Section */}
      <section className="py-20 px-4 bg-[var(--glass-bg)]/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <Wand2 className="w-4 h-4 text-[var(--neon-violet)]" />
              {t("actionTools.subtitle")}
            </motion.div>
            <h2 className="text-3xl font-bold mb-3 gradient-text">{t("actionTools.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("actionTools.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {/* AI 实验室布局生成器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab/floor-plan`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-cyan)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-cyan)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layout className="w-6 h-6 text-[var(--neon-cyan)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.floorPlan.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.floorPlan.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                    <span>立即使用</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 智能规划向导 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/lab`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-violet)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-violet)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Wand2 className="w-6 h-6 text-[var(--neon-violet)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.wizard.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.wizard.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-violet)] font-medium group-hover:gap-3 transition-all">
                    <span>开始规划</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 设备选型向导 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base/05-tools`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-green)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-green)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FlaskConical className="w-6 h-6 text-[var(--neon-green)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.equipmentGuide.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.equipmentGuide.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-green)] font-medium group-hover:gap-3 transition-all">
                    <span>查看指南</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* AI 工具链指南 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base/05-tools/extend/ai-tools-guide`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-pink)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-pink)]/20 to-[var(--neon-pink)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-[var(--neon-pink)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.aiToolsGuide.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.aiToolsGuide.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-pink)] font-medium group-hover:gap-3 transition-all">
                    <span>探索工具</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 成本计算器 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base/05-tools#预算模板`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-yellow)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-yellow)]/20 to-[var(--neon-yellow)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Calculator className="w-6 h-6 text-[var(--neon-yellow)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.costCalculator.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.costCalculator.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-yellow)] font-medium group-hover:gap-3 transition-all">
                    <span>计算预算</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* 开源硬件选型 */}
            <motion.div variants={itemVariants} whileHover={{ y: -5 }}>
              <Link href={`/${locale}/docs/zh/knowledge-base/05-tools/extend/opensource-hardware`}>
                <div className="h-full glass-card p-6 hover:border-[var(--neon-orange)]/50 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--neon-orange)]/20 to-[var(--neon-orange)]/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Cpu className="w-6 h-6 text-[var(--neon-orange)]" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t("actionTools.tools.hardwareSelector.title")}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t("actionTools.tools.hardwareSelector.description")}
                  </p>
                  <div className="flex items-center gap-2 text-[var(--neon-orange)] font-medium group-hover:gap-3 transition-all">
                    <span>选择硬件</span>
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

      {/* 知识库模块 Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold mb-3">{t("modules.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("modules.description")}
            </p>
          </motion.div>

          <ModuleCards locale={locale} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/zh/knowledge-base`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10 border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-[var(--neon-cyan)]" />
              <span className="font-medium">{t("modules.viewAll")}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
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
                href={`/${locale}/docs/zh/knowledge-base/ARCHITECTURE-V2`}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {t("footer.architecture")}
              </Link>
              <Link
                href={`/${locale}/docs/zh/knowledge-base/COLLABORATION-PROTOCOL`}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {t("footer.collaboration")}
              </Link>
              <Link
                href={`/${locale}/docs/zh/knowledge-base/CHANGELOG`}
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
        </div>
      </footer>
    </div>
  );
}
