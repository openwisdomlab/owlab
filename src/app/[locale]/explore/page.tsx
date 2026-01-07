"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import {
  Rocket,
  BookOpen,
  Sparkles,
  ArrowRight,
  Brain,
  Lightbulb,
  Users,
  Compass,
  Target,
  Layers,
  Wrench,
  Shield,
  GraduationCap,
  BarChart3,
  Building2,
  Cpu,
  Zap,
  Map,
} from "lucide-react";
import {
  SpaceIcon,
  MindIcon,
  EmergenceIcon,
  PoeticsIcon,
} from "@/components/icons/LivingModuleIcons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Philosophy/Research modules (L01-L04)
const philosophyModules = [
  {
    id: "L01",
    titleKey: "spaceAsEducator",
    icon: SpaceIcon,
    color: "var(--neon-cyan)",
    href: "/docs/research/01-space-as-educator",
  },
  {
    id: "L02",
    titleKey: "extendedMind",
    icon: MindIcon,
    color: "var(--neon-violet)",
    href: "/docs/research/02-extended-mind",
  },
  {
    id: "L03",
    titleKey: "emergentWisdom",
    icon: EmergenceIcon,
    color: "var(--neon-green)",
    href: "/docs/research/03-emergent-wisdom",
  },
  {
    id: "L04",
    titleKey: "poeticsOfTechnology",
    icon: PoeticsIcon,
    color: "var(--neon-pink)",
    href: "/docs/research/04-poetics-of-technology",
  },
];

// Core knowledge modules (M01-M09)
const coreModules = [
  { id: "M01", icon: Rocket, color: "var(--neon-cyan)", href: "/docs/core/01-foundations" },
  { id: "M02", icon: Compass, color: "var(--neon-violet)", href: "/docs/core/02-governance" },
  { id: "M03", icon: Building2, color: "var(--neon-green)", href: "/docs/core/03-space" },
  { id: "M04", icon: Target, color: "var(--neon-pink)", href: "/docs/core/04-programs" },
  { id: "M05", icon: Wrench, color: "var(--neon-cyan)", href: "/docs/core/05-tools" },
  { id: "M06", icon: Shield, color: "var(--neon-yellow)", href: "/docs/core/06-safety" },
  { id: "M07", icon: GraduationCap, color: "var(--neon-violet)", href: "/docs/core/07-people" },
  { id: "M08", icon: Layers, color: "var(--neon-green)", href: "/docs/core/08-operations" },
  { id: "M09", icon: BarChart3, color: "var(--neon-pink)", href: "/docs/core/09-assessment" },
];

// Quick action cards
const quickActions = [
  {
    id: "guide",
    icon: BookOpen,
    color: "var(--neon-pink)",
    href: "/docs/core",
    gradient: "from-[var(--neon-pink)]/20 to-[var(--neon-violet)]/20",
  },
  {
    id: "tools",
    icon: Cpu,
    color: "var(--neon-cyan)",
    href: "/lab",
    gradient: "from-[var(--neon-cyan)]/20 to-[var(--neon-blue)]/20",
  },
  {
    id: "research",
    icon: Brain,
    color: "var(--neon-violet)",
    href: "/docs/research",
    gradient: "from-[var(--neon-violet)]/20 to-[var(--neon-pink)]/20",
  },
];

export default function ExplorePage() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--neon-cyan)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--neon-violet)]/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-6xl mx-auto relative z-10"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-cyan)] mb-6">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">{t("explore.badge")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4">
              {t("explore.title")}
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("explore.description")}
            </p>
          </motion.div>

          {/* Tagline */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl glass-card">
              <Sparkles className="w-5 h-5 text-[var(--neon-yellow)]" />
              <span className="text-lg font-medium text-[var(--foreground)]">
                {t("explore.tagline")}
              </span>
            </div>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {quickActions.map((action) => (
              <Link key={action.id} href={`/${locale}${action.href}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`glass-card p-6 h-full group cursor-pointer hover:border-[${action.color}] transition-all bg-gradient-to-br ${action.gradient}`}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${action.color}20` }}
                  >
                    <action.icon
                      className="w-7 h-7"
                      style={{ color: action.color }}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {t(`explore.actions.${action.id}.title`)}
                  </h3>
                  <p className="text-[var(--muted-foreground)] mb-4">
                    {t(`explore.actions.${action.id}.description`)}
                  </p>
                  <div
                    className="flex items-center gap-2 font-medium group-hover:gap-3 transition-all"
                    style={{ color: action.color }}
                  >
                    <span>{t(`explore.actions.${action.id}.cta`)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Philosophy Modules Section */}
      <section className="py-14 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-violet)] mb-4">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">{t("explore.philosophy.badge")}</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{t("explore.philosophy.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("explore.philosophy.description")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {philosophyModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <motion.div key={module.id} variants={itemVariants}>
                  <Link href={`/${locale}${module.href}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="glass-card p-5 h-full group cursor-pointer transition-all"
                      style={{ borderColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${module.color}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                          style={{ backgroundColor: `${module.color}15` }}
                        >
                          <IconComponent
                            className="w-10 h-10"
                            color={module.color}
                            isHovered={false}
                          />
                        </div>
                        <div>
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: module.color }}
                          >
                            {module.id}
                          </span>
                          <h3 className="font-semibold">
                            {t(`home.livingModules.modules.${module.titleKey}.title`)}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {t(`home.livingModules.modules.${module.titleKey}.subtitle`)}
                      </p>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-8">
            <Link href={`/${locale}/docs/research`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-card text-[var(--neon-violet)] font-medium hover:border-[var(--neon-violet)]/50 transition-all"
              >
                <span>{t("explore.philosophy.viewAll")}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Modules Section */}
      <section className="py-14 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-cyan)] mb-4">
              <Map className="w-4 h-4" />
              <span className="text-sm font-medium">{t("explore.core.badge")}</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{t("explore.core.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("explore.core.description")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4"
          >
            {coreModules.map((module) => (
              <motion.div key={module.id} variants={itemVariants}>
                <Link href={`/${locale}${module.href}`}>
                  <motion.div
                    whileHover={{ scale: 1.08, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-card p-4 h-full group cursor-pointer transition-all flex flex-col items-center text-center"
                    style={{ borderColor: 'transparent' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${module.color}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${module.color}15` }}
                    >
                      <module.icon
                        className="w-6 h-6"
                        style={{ color: module.color }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono font-bold"
                      style={{ color: module.color }}
                    >
                      {module.id}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] mt-1">
                      {t(`docs.knowledgeBase.modules.${module.id}.title`)}
                    </span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-8">
            <Link href={`/${locale}/docs/core`}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-violet)] text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <BookOpen className="w-5 h-5" />
                <span>{t("explore.core.viewAll")}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* AI Tools Section */}
      <section className="py-14 px-4 border-t border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-yellow)] mb-4">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">{t("explore.tools.badge")}</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">{t("explore.tools.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              {t("explore.tools.description")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link href={`/${locale}/lab`}>
              <motion.div
                whileHover={{ scale: 1.01, y: -2 }}
                className="glass-card p-8 cursor-pointer hover:border-[var(--neon-cyan)]/50 transition-all bg-gradient-to-br from-[var(--neon-cyan)]/10 to-[var(--neon-violet)]/10"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-violet)]/20 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-[var(--neon-cyan)]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-1">{t("explore.tools.lab.title")}</h3>
                      <p className="text-[var(--muted-foreground)]">
                        {t("explore.tools.lab.description")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium">
                    <span>{t("explore.tools.lab.cta")}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
              {t("explore.cta.title")}
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-8">
              {t("explore.cta.description")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href={`/${locale}/docs/core`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-violet)] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>{t("explore.cta.primary")}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href={`/${locale}/lab`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card text-[var(--neon-cyan)] font-bold text-lg hover:border-[var(--neon-cyan)]/50 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{t("explore.cta.secondary")}</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
