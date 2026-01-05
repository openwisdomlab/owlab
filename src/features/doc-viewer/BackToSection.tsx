"use client";

import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { ArrowLeft } from "lucide-react";

interface BackToSectionProps {
  href: string;
  label?: string;
  moduleId?: string;
  moduleName?: string;
  locale?: string;
}

export function BackToSection({
  href,
  label,
  moduleId,
  moduleName,
  locale = "zh",
}: BackToSectionProps) {
  const displayLabel = label || (moduleName ? `返回 ${moduleName}` : "返回上级");
  const fullHref = href.startsWith("/") ? `/${locale}${href}` : href;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Link
        href={fullHref}
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors rounded-lg hover:bg-[var(--accent)]/50"
      >
        <ArrowLeft className="w-4 h-4" />
        {moduleId && (
          <span className="text-xs font-mono text-[var(--neon-violet)]">
            {moduleId}
          </span>
        )}
        <span>{displayLabel}</span>
      </Link>
    </motion.div>
  );
}
