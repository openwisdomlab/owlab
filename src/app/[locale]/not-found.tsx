"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-violet)] opacity-5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-cyan)] opacity-5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-lg text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-8xl font-bold gradient-text mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold mb-3">{t("title")}</h1>
        <p className="text-[var(--muted-foreground)] mb-8">
          {t("description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={`/${locale}`}
            className="neon-button inline-flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t("goHome")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-cyan)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("goBack")}
          </button>
          <Link
            href={`/${locale}/docs`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--neon-violet)] transition-colors"
          >
            <Search className="w-4 h-4" />
            {t("browseDocs")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
