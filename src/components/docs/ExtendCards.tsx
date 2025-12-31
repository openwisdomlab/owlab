"use client";

import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import {
  Layers,
  BookOpen,
  FileText,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface ExtendCard {
  title: string;
  description: string;
  href: string;
  type: "extend" | "evidence" | "checklist" | "sop";
  status?: "completed" | "in_progress" | "planned" | "draft";
}

interface ExtendCardsProps {
  cards: ExtendCard[];
  locale?: string;
}

const typeConfig: Record<
  ExtendCard["type"],
  { icon: LucideIcon; color: string; label: string }
> = {
  extend: {
    icon: Layers,
    color: "var(--neon-violet)",
    label: "扩展内容",
  },
  evidence: {
    icon: BookOpen,
    color: "var(--neon-green)",
    label: "证据层",
  },
  checklist: {
    icon: FileText,
    color: "var(--neon-orange)",
    label: "检查清单",
  },
  sop: {
    icon: FileText,
    color: "var(--neon-blue)",
    label: "标准流程",
  },
};

const statusConfig = {
  completed: {
    label: "已完成",
    className: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  in_progress: {
    label: "进行中",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  planned: {
    label: "计划中",
    className: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  },
  draft: {
    label: "草稿",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 28,
    },
  },
};

export function ExtendCards({ cards, locale = "zh" }: ExtendCardsProps) {
  if (cards.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-[var(--neon-violet)]" />
        扩展阅读
      </h3>
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {cards.map((card) => {
          const config = typeConfig[card.type];
          const Icon = config.icon;

          return (
            <motion.div key={card.href} variants={itemVariants}>
              <Link
                href={card.href.startsWith("/") ? `/${locale}${card.href}` : card.href}
                className="group block h-full"
              >
                <div
                  className="h-full glass-card p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border-l-3"
                  style={{
                    borderLeftColor: config.color,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: config.color }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
                            color: config.color,
                          }}
                        >
                          {config.label}
                        </span>
                        {card.status && (
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-medium rounded border ${statusConfig[card.status].className}`}
                          >
                            {statusConfig[card.status].label}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-medium mb-1 group-hover:text-[var(--foreground)] transition-colors line-clamp-1">
                        {card.title}
                      </h4>

                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                        {card.description}
                      </p>
                    </div>

                    <ArrowRight className="flex-shrink-0 w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-all duration-300 mt-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
