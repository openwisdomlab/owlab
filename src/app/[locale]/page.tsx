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
  Quote,
  Zap,
  Target,
  Rocket,
  GitBranch,
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-violet)] text-white font-medium hover:opacity-90 transition-opacity"
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

          {/* 核心特性 - 更生动的展示 */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            {[
              {
                icon: FileText,
                label: t("hero.features.modular"),
                desc: t("hero.features.modularDesc"),
                color: "var(--neon-cyan)",
              },
              {
                icon: Users,
                label: t("hero.features.collaborative"),
                desc: t("hero.features.collaborativeDesc"),
                color: "var(--neon-violet)",
              },
              {
                icon: Sparkles,
                label: t("hero.features.verified"),
                desc: t("hero.features.verifiedDesc"),
                color: "var(--neon-green)",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl glass-card hover:border-[var(--glass-border)] transition-all"
                whileHover={{ y: -5, scale: 1.02 }}
                variants={floatVariants}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                >
                  <item.icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <span className="font-medium text-center">{item.label}</span>
                <span className="text-xs text-[var(--muted-foreground)] text-center">{item.desc}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* 统计数据 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-8 pt-8 border-t border-[var(--glass-border)]"
          >
            {[
              { value: "9", label: t("stats.modules"), color: "var(--neon-cyan)" },
              { value: "25+", label: t("stats.subModules"), color: "var(--neon-violet)" },
              { value: "100+", label: t("stats.references"), color: "var(--neon-green)" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-3xl font-bold font-mono"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 快速开始 Section */}
      <section className="py-12 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">{t("quickStart.title")}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("quickStart.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  {/* 步骤编号 */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative"
                    style={{ backgroundColor: `color-mix(in srgb, ${step.color} 15%, transparent)` }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{t(`quickStart.${step.id}.title`)}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t(`quickStart.${step.id}.description`)}
                  </p>
                </div>
                {/* 连接线 */}
                {index < quickStartSteps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-[var(--glass-border)] to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 阅读路径 Section - 更丰富的卡片 */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">{t("paths.title")}</h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              {t("paths.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {readingPaths.map((path) => (
              <motion.div
                key={path.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {path.recommended && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-medium text-white z-10"
                    style={{ backgroundColor: path.color }}
                  >
                    推荐
                  </div>
                )}
                <div
                  className={`
                    h-full glass-card p-6 transition-all
                    hover:border-[var(--neon-cyan)]/50
                    ${path.recommended ? "border-2" : ""}
                  `}
                  style={{
                    borderColor: path.recommended ? `color-mix(in srgb, ${path.color} 50%, transparent)` : undefined,
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, ${path.color} 15%, transparent)` }}
                    >
                      <path.icon className="w-7 h-7" style={{ color: path.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{t(`paths.${path.id}.title`)}</h3>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {t(`paths.${path.id}.subtitle`)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--muted-foreground)] mb-4">
                    {t(`paths.${path.id}.description`)}
                  </p>

                  {/* 模块流程 */}
                  <div className="pt-4 border-t border-[var(--glass-border)]">
                    <p className="text-[10px] text-[var(--muted-foreground)] mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      学习路径
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {path.modules.map((mod, idx) => (
                        <span key={mod} className="flex items-center text-xs text-[var(--muted-foreground)]">
                          <span
                            className="px-2 py-1 rounded text-[10px] font-mono font-medium"
                            style={{
                              backgroundColor: `color-mix(in srgb, ${path.color} 10%, transparent)`,
                              color: path.color,
                            }}
                          >
                            {mod}
                          </span>
                          {idx < path.modules.length - 1 && (
                            <ArrowRight className="w-3 h-3 mx-1 opacity-40" />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 三层架构 Section */}
      <section className="py-16 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">{t("architecture.title")}</h2>
            <p className="text-[var(--muted-foreground)]">
              {t("architecture.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {architectureLayers.map((layer, index) => (
              <motion.div
                key={layer.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <div
                  className="h-full p-6 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: `color-mix(in srgb, ${layer.color} 30%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${layer.color} 5%, transparent)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `color-mix(in srgb, ${layer.color} 20%, transparent)` }}
                    >
                      <layer.icon className="w-5 h-5" style={{ color: layer.color }} />
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold"
                      style={{ backgroundColor: layer.color, color: "white" }}
                    >
                      {layer.badge}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{t(`architecture.${layer.id}.title`)}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t(`architecture.${layer.id}.description`)}
                  </p>
                </div>
                {/* 层级指示 */}
                <div
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-16 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
              </motion.div>
            ))}
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

      {/* AI 工具入口 */}
      <section className="py-12 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-xl font-bold mb-2">{t("tools.title")}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("tools.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href={`/${locale}/lab`}
              className="group flex items-center justify-between p-6 glass-card hover:border-[var(--neon-violet)]/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--neon-violet)]/20 to-[var(--neon-pink)]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FlaskConical className="w-7 h-7 text-[var(--neon-violet)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{t("tools.lab.title")}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t("tools.lab.description")}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-[var(--muted-foreground)] group-hover:text-[var(--neon-violet)] group-hover:translate-x-2 transition-all" />
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center">
                <Quote className="w-4 h-4 text-white" />
              </div>
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
