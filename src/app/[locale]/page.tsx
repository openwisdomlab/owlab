"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { Bot, Globe, BarChart3, Zap } from "lucide-react";
import { useParams } from "next/navigation";
import Script from "next/script";

const features = [
  { icon: Bot, key: "ai" },
  { icon: Globe, key: "i18n" },
  { icon: BarChart3, key: "viz" },
  { icon: Zap, key: "fast" },
];

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

export default function HomePage() {
  const t = useTranslations("home");
  const tNav = useTranslations("nav");
  const params = useParams();
  const locale = params.locale as string;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("hero.title"),
    description: t("hero.description"),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      t("features.ai.title"),
      t("features.i18n.title"),
      t("features.viz.title"),
      t("features.fast.title"),
    ],
  };

  return (
    <div className="relative">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-10 blur-[100px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-violet)] opacity-10 blur-[100px] rounded-full" />
        </div>

        <motion.div
          className="relative max-w-6xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full glass-card text-[var(--neon-cyan)]">
              <Bot className="w-4 h-4" />
              {t("hero.subtitle")}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-10"
          >
            {t("hero.description")}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href={`/${locale}/docs`}
              className="neon-button inline-flex items-center justify-center gap-2"
            >
              {t("hero.cta.primary")}
            </Link>
            <Link
              href={`/${locale}/dashboard`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--glass-border)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              {tNav("dashboard")}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text"
          >
            {t("features.title")}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.key}
                variants={itemVariants}
                className="glass-card p-6 hover:border-[var(--neon-cyan)] transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--neon-cyan)]/10 flex items-center justify-center mb-4 group-hover:bg-[var(--neon-cyan)]/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-[var(--neon-cyan)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-[var(--muted-foreground)] text-sm">
                  {t(`features.${feature.key}.description`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto text-center text-sm text-[var(--muted-foreground)]">
          <p>© 2025 {t("features.title")} - AI Space</p>
        </div>
      </footer>
    </div>
  );
}
