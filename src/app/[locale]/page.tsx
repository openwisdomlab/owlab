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

// 阅读路径配置
const readingPaths = [
  {
    id: "new-node",
    icon: Compass,
    color: "var(--neon-cyan)",
    modules: ["M01", "M06", "M02", "M03", "M05", "M07", "M04", "M08"],
  },
  {
    id: "curriculum",
    icon: GraduationCap,
    color: "var(--neon-violet)",
    modules: ["M01", "M04", "M07", "M09"],
  },
  {
    id: "compliance",
    icon: ShieldCheck,
    color: "var(--neon-green)",
    modules: ["M06", "M02", "M05", "M08"],
  },
];

export default function HomePage() {
  const t = useTranslations("home");
  const tDocs = useTranslations("docs.knowledgeBase");
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

      {/* Hero Section - 简洁的文档首页 */}
      <section className="relative py-16 lg:py-24 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-5 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-violet)] opacity-5 blur-[100px] rounded-full" />
        </div>

        <motion.div
          className="relative max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* 标题区域 */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full glass-card text-[var(--muted-foreground)] mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              {t("hero.version")}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="gradient-text">{t("hero.title")}</span>
            </h1>

            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              {t("hero.description")}
            </p>
          </motion.div>

          {/* 核心特性 - 简洁展示 */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {[
              { icon: FileText, label: t("hero.features.modular") },
              { icon: Users, label: t("hero.features.collaborative") },
              { icon: Sparkles, label: t("hero.features.verified") },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              >
                <item.icon className="w-5 h-5 text-[var(--neon-cyan)]" />
                <span className="text-sm text-center">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 阅读路径 Section */}
      <section className="py-12 px-4 border-y border-[var(--glass-border)] bg-[var(--glass-bg)]/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-2">{t("paths.title")}</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              {t("paths.description")}
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {readingPaths.map((path) => (
              <motion.div
                key={path.id}
                variants={itemVariants}
                className="glass-card p-5 hover:border-[var(--neon-cyan)]/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `color-mix(in srgb, ${path.color} 15%, transparent)` }}
                  >
                    <path.icon className="w-5 h-5" style={{ color: path.color }} />
                  </div>
                  <div>
                    <h3 className="font-medium">{t(`paths.${path.id}.title`)}</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {t(`paths.${path.id}.subtitle`)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {path.modules.map((mod, idx) => (
                    <span key={mod} className="flex items-center text-xs text-[var(--muted-foreground)]">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                        style={{ backgroundColor: `color-mix(in srgb, ${path.color} 10%, transparent)`, color: path.color }}
                      >
                        {mod}
                      </span>
                      {idx < path.modules.length - 1 && (
                        <ArrowRight className="w-3 h-3 mx-1 opacity-40" />
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 知识库模块 Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-2">{t("modules.title")}</h2>
            <p className="text-[var(--muted-foreground)]">
              {t("modules.description")}
            </p>
          </motion.div>

          <ModuleCards locale={locale} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <Link
              href={`/${locale}/docs/zh/knowledge-base`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors text-sm"
            >
              <BookOpen className="w-4 h-4" />
              {t("modules.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI 工具入口 - 次要位置 */}
      <section className="py-12 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
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
                <div className="w-12 h-12 rounded-xl bg-[var(--neon-violet)]/10 flex items-center justify-center group-hover:bg-[var(--neon-violet)]/20 transition-colors">
                  <FlaskConical className="w-6 h-6 text-[var(--neon-violet)]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("tools.lab.title")}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t("tools.lab.description")}
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--neon-violet)] group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
            <p>© 2025 Open Wisdom Lab</p>
            <div className="flex items-center gap-6">
              <Link
                href={`/${locale}/docs/zh/knowledge-base/ARCHITECTURE-V2`}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                {t("footer.architecture")}
              </Link>
              <Link
                href={`/${locale}/docs/zh/knowledge-base/COLLABORATION-PROTOCOL`}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                {t("footer.collaboration")}
              </Link>
              <a
                href="https://github.com/openwisdomlab/owlab"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--foreground)] transition-colors"
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
