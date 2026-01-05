"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import {
  Layout,
  PenTool,
  BookOpen,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Wand2,
} from "lucide-react";
import { RecommendationWizard } from "@/features/lab-editor/RecommendationWizard";

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

export default function LabPage() {
  const t = useTranslations("lab");
  const params = useParams();
  const locale = params.locale as string;
  const [showWizard, setShowWizard] = useState(false);

  const modules = [
    {
      id: "floor-plan",
      icon: Layout,
      color: "var(--neon-cyan)",
      href: `/${locale}/lab/floor-plan`,
    },
    {
      id: "concepts",
      icon: Lightbulb,
      color: "var(--neon-violet)",
      href: `/${locale}/lab/concepts`,
    },
    {
      id: "case-studies",
      icon: BookOpen,
      color: "var(--neon-green)",
      href: `/${locale}/lab/case-studies`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-12"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-cyan)] mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">{t("badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4">
            {t("title")}
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            {t("description")}
          </p>
        </motion.div>

        {/* Smart Planning Wizard CTA */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => setShowWizard(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-6 rounded-xl bg-gradient-to-r from-[var(--neon-purple)]/20 to-[var(--neon-cyan)]/20 border-2 border-[var(--neon-purple)]/50 hover:border-[var(--neon-purple)] transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[var(--neon-purple)]/20 flex items-center justify-center">
                  <Wand2 className="w-7 h-7 text-[var(--neon-purple)]" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-1">智能规划向导</h3>
                  <p className="text-[var(--muted-foreground)]">
                    输入面积、预算、目标定位，AI 自动生成个性化建设方案
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 text-[var(--neon-purple)] font-medium group-hover:gap-3 transition-all">
                <span>开始规划</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Module Cards */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {modules.map((module) => (
            <Link key={module.id} href={module.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-8 h-full group cursor-pointer hover:border-[var(--neon-cyan)] transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${module.color}20` }}
                >
                  <module.icon
                    className="w-7 h-7"
                    style={{ color: module.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {t(`modules.${module.id}.title`)}
                </h3>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {t(`modules.${module.id}.description`)}
                </p>
                <div className="flex items-center gap-2 text-[var(--neon-cyan)] font-medium group-hover:gap-3 transition-all">
                  <span>{t("explore")}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants} className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <PenTool className="w-6 h-6 text-[var(--neon-cyan)]" />
            {t("features.title")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["ai-design", "interactive", "export", "multilang"].map((feature) => (
              <div
                key={feature}
                className="p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
              >
                <h4 className="font-medium mb-2">{t(`features.${feature}.title`)}</h4>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {t(`features.${feature}.description`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Smart Planning Wizard Modal */}
      <RecommendationWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />
    </div>
  );
}
