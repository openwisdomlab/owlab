"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Compass, Wrench, BookOpen } from "lucide-react";
import { CONCEPTS, type Concept, type ConceptLayer } from "./concepts";

interface ConceptPyramidProps {
  className?: string;
}

// 层级配置
const LAYERS: {
  id: ConceptLayer;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "engine",
    title: "探索引擎",
    subtitle: "点燃好奇的起点",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  {
    id: "principle",
    title: "设计原则",
    subtitle: "让理念可落地",
    icon: <Compass className="w-3.5 h-3.5" />,
  },
  {
    id: "methodology",
    title: "核心方法",
    subtitle: "实践中的操作框架",
    icon: <Wrench className="w-3.5 h-3.5" />,
  },
  {
    id: "foundation",
    title: "理论基础",
    subtitle: "学习科学的支撑",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  },
];

// 按层级分组理念
function getConceptsByLayer(layer: ConceptLayer): Concept[] {
  return CONCEPTS.filter((c) => c.layer === layer);
}

export function ConceptPyramid({ className = "" }: ConceptPyramidProps) {
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  const toggleConcept = (conceptId: string) => {
    setExpandedConcept(expandedConcept === conceptId ? null : conceptId);
  };

  return (
    <div className={`relative ${className}`}>
      {/* 主容器 */}
      <div className="relative p-4 md:p-5 bg-slate-900/90 backdrop-blur-sm rounded-xl border border-slate-700/50">
        {/* 头部 - 更紧凑 */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-slate-100 mb-1">
            OWL 教育理念体系
          </h3>
          <p className="text-xs text-slate-400">
            从探索引擎到理论基础，四层架构支撑创新教育
          </p>
        </div>

        {/* 双栏层级布局 */}
        <div className="grid md:grid-cols-2 gap-4">
          {LAYERS.map((layer, layerIndex) => {
            const concepts = getConceptsByLayer(layer.id);
            const isFullWidth = layer.id === "principle"; // 设计原则独占一行

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: layerIndex * 0.05 }}
                className={isFullWidth ? "md:col-span-2" : ""}
              >
                {/* 层级标题 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    {layer.icon}
                    <span className="text-xs font-medium">
                      {layer.title}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-slate-700/50" />
                  <span className="text-[10px] text-slate-500">{layer.subtitle}</span>
                </div>

                {/* 理念卡片 */}
                <div
                  className={`grid gap-2 ${
                    isFullWidth
                      ? "grid-cols-1 max-w-lg mx-auto"
                      : concepts.length > 1
                        ? "grid-cols-1"
                        : "grid-cols-1"
                  }`}
                >
                  {concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      isExpanded={expandedConcept === concept.id}
                      onToggle={() => toggleConcept(concept.id)}
                      compact={!isFullWidth}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底部提示 - 更紧凑 */}
        <div className="text-center mt-4 pt-3 border-t border-slate-700/30">
          <p className="text-[10px] text-slate-500">
            源自杜威、皮亚杰、维果茨基、帕普特、雷斯尼克的百年教育创新探索
          </p>
        </div>
      </div>
    </div>
  );
}

// 理念卡片组件
interface ConceptCardProps {
  concept: Concept;
  isExpanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}

function ConceptCard({ concept, isExpanded, onToggle, compact = false }: ConceptCardProps) {
  // 更易读的颜色映射
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    '#22d3ee': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/30' },
    '#8b5cf6': { bg: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-500/30' },
    '#f59e0b': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/30' },
    '#10b981': { bg: 'bg-emerald-500/10', text: 'text-emerald-300', border: 'border-emerald-500/30' },
    '#6366f1': { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/30' },
    '#ec4899': { bg: 'bg-pink-500/10', text: 'text-pink-300', border: 'border-pink-500/30' },
    '#f97316': { bg: 'bg-orange-500/10', text: 'text-orange-300', border: 'border-orange-500/30' },
    '#14b8a6': { bg: 'bg-teal-500/10', text: 'text-teal-300', border: 'border-teal-500/30' },
    '#ef4444': { bg: 'bg-red-500/10', text: 'text-red-300', border: 'border-red-500/30' },
    '#a855f7': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/30' },
  };

  const colors = colorMap[concept.color] || { bg: 'bg-slate-500/10', text: 'text-slate-300', border: 'border-slate-500/30' };

  return (
    <motion.div layout className="relative">
      {/* 卡片主体 */}
      <motion.button
        onClick={onToggle}
        className={`w-full text-left rounded-lg border transition-all duration-200 ${
          isExpanded
            ? `${colors.bg} ${colors.border}`
            : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600/50"
        } ${compact ? "p-3" : "p-3.5"}`}
        whileHover={{ scale: isExpanded ? 1 : 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* 卡片头部 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('/10', '/60')}`}
                style={{ backgroundColor: concept.color }}
              />
              <h4 className={`font-medium text-sm ${isExpanded ? colors.text : 'text-slate-200'}`}>
                {concept.name}
              </h4>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {concept.nameEn}
              </span>
            </div>
            {!isExpanded && (
              <p className="text-xs text-slate-400 line-clamp-1 ml-3.5">
                {concept.insight.split("。")[0]}
              </p>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.div>
        </div>
      </motion.button>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3 pt-2">
              {/* 完整洞见 */}
              <div className={`p-2.5 rounded-md ${colors.bg} border ${colors.border} mb-2.5`}>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.insight}
                </p>
              </div>

              {/* OWL 实践 */}
              <div>
                <h5 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                  OWL 实践
                </h5>
                <ul className="space-y-1">
                  {concept.practices.map((practice, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-slate-400"
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: concept.color }}
                      />
                      {practice}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
