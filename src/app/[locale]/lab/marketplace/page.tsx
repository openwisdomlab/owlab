"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import {
  Search,
  Store,
  Sparkles,
  ArrowLeft,
  Share2,
  SortAsc,
  TrendingUp,
  Clock,
  GitFork,
} from "lucide-react";
import {
  type MarketplaceCategory,
  type SortOption,
  useDesignMarketplaceStore,
} from "@/stores/design-marketplace-store";
import { CategoryFilter } from "@/features/marketplace/CategoryFilter";
import { TemplateCard } from "@/features/marketplace/TemplateCard";
import { TemplateDetailDialog } from "@/features/marketplace/TemplateDetailDialog";
import { ShareDesignDialog } from "@/features/marketplace/ShareDesignDialog";
import type { DesignTemplate } from "@/stores/design-marketplace-store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function MarketplacePage() {
  const t = useTranslations("marketplace");
  const params = useParams();
  const locale = params.locale as string;

  const templates = useDesignMarketplaceStore((s) => s.templates);
  const likedIds = useDesignMarketplaceStore((s) => s.likedIds);
  const likeTemplate = useDesignMarketplaceStore((s) => s.likeTemplate);
  const unlikeTemplate = useDesignMarketplaceStore((s) => s.unlikeTemplate);
  const forkTemplate = useDesignMarketplaceStore((s) => s.forkTemplate);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<MarketplaceCategory | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedTemplate, setSelectedTemplate] =
    useState<DesignTemplate | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [forkedMessage, setForkedMessage] = useState("");

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          t.author.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.likes - a.likes);
        break;
      case "most-forked":
        result.sort((a, b) => b.forks - a.forks);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [templates, searchQuery, selectedCategory, sortBy]);

  const handleSelectTemplate = (template: DesignTemplate) => {
    setSelectedTemplate(template);
    setShowDetail(true);
  };

  const handleFork = (template: DesignTemplate) => {
    forkTemplate(template.id);
    setForkedMessage(t("forkedSuccess", { name: template.name }));
    setTimeout(() => setForkedMessage(""), 3000);
  };

  const handleLike = (template: DesignTemplate) => {
    if (likedIds.includes(template.id)) {
      unlikeTemplate(template.id);
    } else {
      likeTemplate(template.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-10"
      >
        {/* Back link */}
        <motion.div variants={itemVariants}>
          <Link
            href={`/${locale}/lab`}
            className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToLab")}
          </Link>
        </motion.div>

        {/* Hero Banner */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-[var(--neon-cyan)] mb-6">
            <Store className="w-4 h-4" />
            <span className="text-sm font-medium">{t("badge")}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--neon-cyan)] via-[var(--neon-purple)] to-[var(--owl-pink)] bg-clip-text text-transparent">
              {t("hero.title")}
            </span>
          </h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto mb-4">
            {t("hero.subtitle")}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Sparkles className="w-4 h-4 text-[var(--neon-cyan)]" />
            <span>
              {templates.length} {t("hero.templateCount")}
            </span>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={itemVariants} className="space-y-4">
          {/* Search + Sort row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] focus:border-[var(--neon-cyan)] focus:outline-none transition-colors text-sm appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="newest">{t("sort.newest")}</option>
                <option value="popular">{t("sort.popular")}</option>
                <option value="most-forked">{t("sort.mostForked")}</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareDialog(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-cyan)]/50 hover:border-[var(--neon-cyan)] text-[var(--neon-cyan)] font-medium text-sm transition-all whitespace-nowrap"
              >
                <Share2 className="w-4 h-4" />
                {t("shareDesign")}
              </motion.button>
            </div>
          </div>

          {/* Category Pills */}
          <CategoryFilter
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </motion.div>

        {/* Forked success message */}
        <AnimatePresence>
          {forkedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center"
            >
              {forkedMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Template Grid */}
        <motion.div variants={itemVariants}>
          {filteredTemplates.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleSelectTemplate}
                    onFork={handleFork}
                    isLiked={likedIds.includes(template.id)}
                    onLike={handleLike}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)] opacity-40" />
              <p className="text-lg text-[var(--muted-foreground)]">
                {t("noResults")}
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-2">
                {t("noResultsHint")}
              </p>
            </div>
          )}
        </motion.div>

        {/* Share Your Design CTA */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => setShowShareDialog(true)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-8 rounded-xl bg-gradient-to-r from-[var(--neon-purple)]/10 via-[var(--neon-cyan)]/10 to-[var(--owl-pink)]/10 border-2 border-dashed border-[var(--glass-border)] hover:border-[var(--neon-cyan)]/50 transition-all group text-center"
          >
            <Share2 className="w-8 h-8 mx-auto mb-3 text-[var(--neon-cyan)] group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-semibold mb-2">{t("cta.title")}</h3>
            <p className="text-[var(--muted-foreground)] max-w-md mx-auto">
              {t("cta.description")}
            </p>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Detail Dialog */}
      <TemplateDetailDialog
        template={selectedTemplate}
        isOpen={showDetail}
        onClose={() => {
          setShowDetail(false);
          setSelectedTemplate(null);
        }}
        onFork={handleFork}
        isLiked={
          selectedTemplate ? likedIds.includes(selectedTemplate.id) : false
        }
        onLike={handleLike}
      />

      {/* Share Dialog */}
      <ShareDesignDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      />
    </div>
  );
}
