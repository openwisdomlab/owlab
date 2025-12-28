"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { Bot, BookOpen, LayoutDashboard, Github, FlaskConical } from "lucide-react";
import type { Locale } from "@/i18n";

type HeaderProps = {
  locale: Locale;
};

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("nav");

  const navItems = [
    { href: `/${locale}`, label: t("home"), icon: null },
    { href: `/${locale}/docs`, label: t("docs"), icon: BookOpen },
    { href: `/${locale}/lab`, label: t("lab"), icon: FlaskConical },
    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: LayoutDashboard },
  ];

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
          className="flex items-center gap-2 font-bold text-lg"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--neon-cyan)] to-[var(--neon-violet)] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[var(--background)]" />
          </div>
          <span className="hidden sm:inline gradient-text">AI Space</span>
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
          <ThemeToggle />
          <LanguageSwitcher locale={locale} />
          <a
            href="https://github.com"
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
