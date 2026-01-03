"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles, Lightbulb, Compass, Wrench, BookOpen } from "lucide-react";
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
  gradient: string;
}[] = [
  {
    id: "engine",
    title: "顶层引擎",
    subtitle: "从哪里开始探索",
    icon: <Sparkles className="w-4 h-4" />,
    gradient: "from-cyan-500/20 via-violet-500/20 to-amber-500/20",
  },
  {
    id: "principle",
    title: "设计原则",
    subtitle: "让理念可执行",
    icon: <Compass className="w-4 h-4" />,
    gradient: "from-emerald-500/20 to-emerald-500/10",
  },
  {
    id: "methodology",
    title: "方法论",
    subtitle: "实践中的核心方法",
    icon: <Wrench className="w-4 h-4" />,
    gradient: "from-indigo-500/20 via-pink-500/20 to-orange-500/20",
  },
  {
    id: "foundation",
    title: "支撑基础",
    subtitle: "学习科学的理论根基",
    icon: <BookOpen className="w-4 h-4" />,
    gradient: "from-teal-500/20 via-red-500/20 to-purple-500/20",
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
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      </div>

      {/* 主容器 */}
      <div className="relative space-y-6 p-6 bg-[#0a0a0f]/80 backdrop-blur-sm rounded-2xl border border-white/10">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/70">OWL 教育理念体系</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            点燃好奇心的四层架构
          </h3>
          <p className="text-sm text-white/50 max-w-md mx-auto">
            从顶层引擎到支撑基础，每一层都在回答一个核心问题
          </p>
        </div>

        {/* 层级 */}
        <div className="space-y-4">
          {LAYERS.map((layer, layerIndex) => {
            const concepts = getConceptsByLayer(layer.id);

            return (
              <motion.div
                key={layer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: layerIndex * 0.1 }}
                className="relative"
              >
                {/* 连接线 */}
                {layerIndex > 0 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-white/20 to-white/5" />
                )}

                {/* 层级标题 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-white/40">
                    {layer.icon}
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {layer.title}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                  <span className="text-xs text-white/30">{layer.subtitle}</span>
                </div>

                {/* 理念卡片网格 */}
                <div
                  className={`grid gap-3 ${
                    concepts.length === 1
                      ? "grid-cols-1 max-w-md mx-auto"
                      : "grid-cols-1 md:grid-cols-3"
                  }`}
                >
                  {concepts.map((concept) => (
                    <ConceptCard
                      key={concept.id}
                      concept={concept}
                      isExpanded={expandedConcept === concept.id}
                      onToggle={() => toggleConcept(concept.id)}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-xs text-white/30">
            这些理念源自杜威、皮亚杰、维果茨基、帕普特、雷斯尼克等教育先驱的百年探索
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
}

function ConceptCard({ concept, isExpanded, onToggle }: ConceptCardProps) {
  return (
    <motion.div
      layout
      className="relative group"
      initial={false}
    >
      {/* 卡片主体 */}
      <motion.button
        onClick={onToggle}
        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
          isExpanded
            ? "bg-white/10 border-white/20"
            : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/15"
        }`}
        whileHover={{ scale: isExpanded ? 1 : 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 顶部色条 */}
        <div
          className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60"
          style={{ backgroundColor: concept.color }}
        />

        {/* 卡片头部 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: concept.color }}
              />
              <h4 className="font-semibold text-white truncate">
                {concept.name}
              </h4>
            </div>
            <p className="text-xs text-white/40 mb-2">{concept.nameEn}</p>
            <p className="text-sm text-white/60 line-clamp-2">
              {concept.insight.split("。")[0]}。
            </p>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown className="w-4 h-4 text-white/30" />
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
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              {/* 完整洞见 */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/5 mb-3">
                <p className="text-sm text-white/70 italic leading-relaxed">
                  &ldquo;{concept.insight}&rdquo;
                </p>
              </div>

              {/* OWL 实践 */}
              <div>
                <h5 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  OWL 实践
                </h5>
                <ul className="space-y-1.5">
                  {concept.practices.map((practice, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/60"
                    >
                      <span
                        className="w-1 h-1 rounded-full mt-2 shrink-0"
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
