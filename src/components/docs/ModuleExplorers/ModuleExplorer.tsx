"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Info } from "lucide-react";
import type { ExplorerConfig, ExplorerItem, ExplorerCategory } from "./types";

interface ModuleExplorerProps {
  config: ExplorerConfig;
  className?: string;
}

export function ModuleExplorer({ config, className = "" }: ModuleExplorerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 头部 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-cyan-500/50" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-600 dark:text-cyan-500 uppercase">
            {config.subtitle}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          {config.title}<span className="text-cyan-500">.</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
          {config.description}
        </p>
      </div>

      {/* 分类层级 */}
      <div className="space-y-4">
        {config.categories.map((category, idx) => (
          <div key={category.id} className="relative">
            {/* 分类标题 */}
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight border ${category.color.border} ${category.color.text}`}
              >
                {category.tag}
              </span>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {category.title}
              </h4>
            </div>

            {/* 项目卡片网格 */}
            <div
              className={`grid gap-2 ${
                category.items.length === 1
                  ? "grid-cols-1 max-w-md"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {category.items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  category={category}
                  isExpanded={expandedItem === item.id}
                  onToggle={() => toggleItem(item.id)}
                />
              ))}
            </div>

            {/* 连接线 */}
            {idx !== config.categories.length - 1 && (
              <div className="hidden md:block absolute -bottom-4 left-4 w-px h-4 bg-gradient-to-b from-slate-300 dark:from-slate-700 to-transparent" />
            )}
          </div>
        ))}
      </div>

      {/* 底部信息 */}
      {config.footer && (
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {config.footer}
          </p>
        </div>
      )}
    </div>
  );
}

// 项目卡片组件
interface ItemCardProps {
  item: ExplorerItem;
  category: ExplorerCategory;
  isExpanded: boolean;
  onToggle: () => void;
}

function ItemCard({ item, category, isExpanded, onToggle }: ItemCardProps) {
  return (
    <motion.div
      layout
      onClick={onToggle}
      className={`relative cursor-pointer rounded-lg border transition-all duration-200 ${
        isExpanded
          ? `${category.color.bg} ${category.color.border}`
          : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
      } p-3`}
    >
      {/* 卡片头 */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h5
            className={`font-semibold text-sm ${
              isExpanded
                ? category.color.text
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {item.name}
          </h5>
          {item.nameEn && (
            <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              {item.nameEn}
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-slate-400 dark:text-slate-500 shrink-0"
        >
          <ChevronRight size={14} />
        </motion.div>
      </div>

      {/* 摘要（收起时） */}
      {!isExpanded && (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {item.description.split("。")[0]}。
        </p>
      )}

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3"
          >
            {/* 完整描述 */}
            <div className="flex gap-2">
              <Info
                size={12}
                className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5"
              />
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* 详细信息 */}
            {item.details && item.details.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md">
                <ul className="space-y-1">
                  {item.details.map((detail, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5"
                    >
                      <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${category.color.text.replace('text-', 'bg-').replace('-600', '-500').replace('-400', '-400')}`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
