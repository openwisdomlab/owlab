"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  type MarketplaceCategory,
  CATEGORY_COLORS,
} from "@/stores/design-marketplace-store";

const ALL_CATEGORIES: MarketplaceCategory[] = [
  "makerspace",
  "stem-lab",
  "art-studio",
  "science-lab",
  "multi-purpose",
  "outdoor",
];

interface CategoryFilterProps {
  selected: MarketplaceCategory | null;
  onChange: (category: MarketplaceCategory | null) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const t = useTranslations("marketplace");

  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selected === null
            ? "bg-[var(--foreground)] text-[var(--background)]"
            : "glass-card hover:border-[var(--muted-foreground)]"
        }`}
      >
        {t("filters.all")}
      </motion.button>
      {ALL_CATEGORIES.map((category) => {
        const isActive = selected === category;
        const color = CATEGORY_COLORS[category];
        return (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(isActive ? null : category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? "border-2"
                : "glass-card hover:border-[var(--muted-foreground)]"
            }`}
            style={
              isActive
                ? {
                    backgroundColor: `${color}20`,
                    borderColor: color,
                    color,
                  }
                : undefined
            }
          >
            {t(`categories.${category}`)}
          </motion.button>
        );
      })}
    </div>
  );
}
