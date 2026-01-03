"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Lightbulb, Sparkles } from "lucide-react";
import { CONCEPTS, type Concept, type ConceptLayer } from "./concepts";

interface ConceptPyramidProps {
  className?: string;
}

// 层级配置
const LAYERS: {
  id: ConceptLayer;
  tag: string;
  title: string;
  color: {
    text: string;
    border: string;
    bg: string;
  };
}[] = [
  {
    id: "engine",
    tag: "IGNITION",
    title: "探索引擎 Engine",
    color: {
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-500/5 dark:bg-cyan-500/10",
    },
  },
  {
    id: "principle",
    tag: "FRAMEWORK",
    title: "设计原则 Principle",
    color: {
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-500/30",
      bg: "bg-violet-500/5 dark:bg-violet-500/10",
    },
  },
  {
    id: "methodology",
    tag: "METHOD",
    title: "核心方法 Methodology",
    color: {
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    },
  },
  {
    id: "foundation",
    tag: "BASE",
    title: "理论基础 Foundation",
    color: {
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-500/5 dark:bg-amber-500/10",
    },
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
      {/* 头部 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px w-8 bg-cyan-500/50" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-600 dark:text-cyan-500 uppercase">
            Educational Philosophy
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          理念探索器<span className="text-cyan-500">.</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
          从探索引擎到理论基础，四层架构支撑 OWL 的创新教育体系
        </p>
      </div>

      {/* 层级流 */}
      <div className="space-y-4">
        {LAYERS.map((layer, idx) => {
          const concepts = getConceptsByLayer(layer.id);

          return (
            <div key={layer.id} className="relative">
              {/* 层级标题 */}
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight border ${layer.color.border} ${layer.color.text}`}
                >
                  {layer.tag}
                </span>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {layer.title}
                </h4>
              </div>

              {/* 卡片网格 - 紧凑双栏 */}
              <div
                className={`grid gap-2 ${
                  concepts.length === 1
                    ? "grid-cols-1 max-w-md"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {concepts.map((concept) => (
                  <ConceptCard
                    key={concept.id}
                    concept={concept}
                    layer={layer}
                    isExpanded={expandedConcept === concept.id}
                    onToggle={() => toggleConcept(concept.id)}
                  />
                ))}
              </div>

              {/* 连接线 */}
              {idx !== LAYERS.length - 1 && (
                <div className="hidden md:block absolute -bottom-4 left-4 w-px h-4 bg-gradient-to-b from-slate-300 dark:from-slate-700 to-transparent" />
              )}
            </div>
          );
        })}
      </div>

      {/* 底部信息 */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/50 text-center">
        <p className="text-[10px] text-slate-400 dark:text-slate-500">
          源自杜威、皮亚杰、维果茨基、帕普特、雷斯尼克的百年教育创新探索
        </p>
      </div>
    </div>
  );
}

// 理念卡片组件
interface ConceptCardProps {
  concept: Concept;
  layer: (typeof LAYERS)[number];
  isExpanded: boolean;
  onToggle: () => void;
}

function ConceptCard({ concept, layer, isExpanded, onToggle }: ConceptCardProps) {
  return (
    <motion.div
      layout
      onClick={onToggle}
      className={`relative cursor-pointer rounded-lg border transition-all duration-200 ${
        isExpanded
          ? `${layer.color.bg} ${layer.color.border}`
          : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
      } p-3`}
    >
      {/* 卡片头 */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h5
            className={`font-semibold text-sm ${
              isExpanded
                ? layer.color.text
                : "text-slate-800 dark:text-slate-200"
            }`}
          >
            {concept.name}
          </h5>
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {concept.nameEn}
          </p>
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
          {concept.insight.split("。")[0]}。
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
            {/* 核心洞见 */}
            <div className="flex gap-2">
              <Lightbulb
                size={12}
                className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
                  核心洞见
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{concept.insight}"
                </p>
              </div>
            </div>

            {/* OWL 实践 */}
            <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-md">
              <div className="flex gap-2">
                <Sparkles
                  size={12}
                  className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                    OWL 实践
                  </p>
                  <ul className="space-y-1">
                    {concept.practices.map((practice, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5"
                      >
                        <span className="w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-1.5 shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
