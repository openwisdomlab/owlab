"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { SearchButton } from "@/components/search";
import { BookOpen, Github, FlaskConical, Maximize2, Minimize2 } from "lucide-react";
import { useFocusStore } from "@/stores/focus-store";
import { EmotionSelector } from "@/components/ui/EmotionSelector";
import type { Locale } from "@/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}`, label: t("home"), icon: null },
    { href: `/${locale}/docs/core`, label: t("docs"), icon: BookOpen },
    { href: `/${locale}/lab`, label: t("lab"), icon: FlaskConical },
  ];

  const { isFocusMode, toggleFocusMode } = useFocusStore();

  if (isFocusMode) {
    return (
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={toggleFocusMode}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-[var(--background)] border border-[var(--glass-border)] shadow-lg hover:border-[var(--neon-cyan)] group"
        title="Exit Focus Mode"
      >
        <Minimize2 className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--neon-cyan)] transition-colors" />
      </motion.button>
    );
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 header-glass"
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2"
        >
          <img
            src="/logo.png"
            alt="Open Wisdom Lab"
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--glass-bg)] transition-colors"
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <SearchButton variant="icon" />
          <button
            onClick={toggleFocusMode}
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
            title="Focus Mode"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <EmotionSelector />
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />
          <a
            href="https://github.com/openwisdomlab/owlab"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
            aria-label={t("github")}
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </motion.header>
  );
}
