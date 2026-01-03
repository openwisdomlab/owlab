"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { CONCEPTS, QUESTION_OPTIONS, REVEAL_THRESHOLD, type Concept } from "./concepts";
import { ConceptStarMap } from "./ConceptStarMap";
import { ConceptCard } from "./ConceptCard";
import { QuestionPrompt } from "./QuestionPrompt";
import { TheoryLineagePopup } from "./TheoryLineagePopup";

interface ConceptExplorerProps {
  className?: string;
}

export function ConceptExplorer({ className = "" }: ConceptExplorerProps) {
  // 状态管理
  const [discoveredConcepts, setDiscoveredConcepts] = useState<Set<string>>(new Set());
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showTheoryLineage, setShowTheoryLineage] = useState(false);

  // 是否已揭示全图
  const isFullMapRevealed = discoveredConcepts.size >= REVEAL_THRESHOLD;

  // 开始探索
  const handleStart = useCallback(() => {
    setShowQuestion(true);
  }, []);

  // 选择问题答案
  const handleQuestionAnswer = useCallback((optionId: string) => {
    const option = QUESTION_OPTIONS.find(o => o.id === optionId);
    if (!option) return;

    setShowQuestion(false);
    setHasStarted(true);

    // 延迟点亮对应的理念
    setTimeout(() => {
      setDiscoveredConcepts(prev => new Set([...prev, option.triggersConceptId]));
      const concept = CONCEPTS.find(c => c.id === option.triggersConceptId);
      if (concept) {
        setSelectedConcept(concept);
      }
    }, 300);
  }, []);

  // 点击发现理念
  const handleDiscoverConcept = useCallback((conceptId: string) => {
    setDiscoveredConcepts(prev => new Set([...prev, conceptId]));
    const concept = CONCEPTS.find(c => c.id === conceptId);
    if (concept) {
      setSelectedConcept(concept);
    }
  }, []);

  // 关闭卡片
  const handleCloseCard = useCallback(() => {
    setSelectedConcept(null);
  }, []);

  // 从卡片中点击相连理念
  const handleClickConnection = useCallback((conceptId: string) => {
    handleDiscoverConcept(conceptId);
  }, [handleDiscoverConcept]);

  // 获取可见但未发现的理念（与已发现的相连）
  const getVisibleConcepts = useCallback((): Set<string> => {
    const visible = new Set<string>();
    discoveredConcepts.forEach(id => {
      const concept = CONCEPTS.find(c => c.id === id);
      if (concept) {
        concept.connections.forEach(connId => {
          if (!discoveredConcepts.has(connId)) {
            visible.add(connId);
          }
        });
      }
    });
    return visible;
  }, [discoveredConcepts]);

  const visibleConcepts = getVisibleConcepts();

  return (
    <div className={`relative bg-[#0a0a0f] rounded-2xl border border-white/10 overflow-hidden ${className}`}>
      {/* 星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-cyan-900/5" />
        {/* 星点装饰 */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 头部 */}
      <div className="relative z-10 p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-white">理念探索器</h3>
        </div>
        <p className="text-sm text-white/60 mt-1">
          {isFullMapRevealed
            ? "你已探索完整理念星图"
            : hasStarted
              ? `已发现 ${discoveredConcepts.size}/${CONCEPTS.length} 个理念`
              : "点击开始探索 OWL 的教育理念"
          }
        </p>
      </div>

      {/* 星图区域 */}
      <div className="relative z-10 h-[520px]">
        <ConceptStarMap
          concepts={CONCEPTS}
          discoveredConcepts={discoveredConcepts}
          visibleConcepts={visibleConcepts}
          selectedConceptId={selectedConcept?.id || null}
          isFullMapRevealed={isFullMapRevealed}
          hasStarted={hasStarted}
          onConceptClick={handleDiscoverConcept}
          onStartClick={handleStart}
        />
      </div>

      {/* 问题弹窗 */}
      <AnimatePresence>
        {showQuestion && (
          <QuestionPrompt
            options={QUESTION_OPTIONS}
            onSelect={handleQuestionAnswer}
            onClose={() => setShowQuestion(false)}
          />
        )}
      </AnimatePresence>

      {/* 理念详情卡片 */}
      <AnimatePresence>
        {selectedConcept && (
          <ConceptCard
            concept={selectedConcept}
            discoveredConcepts={discoveredConcepts}
            onClose={handleCloseCard}
            onClickConnection={handleClickConnection}
          />
        )}
      </AnimatePresence>

      {/* 全图揭示后的彩蛋入口 */}
      <AnimatePresence>
        {isFullMapRevealed && !showTheoryLineage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={() => setShowTheoryLineage(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/20 rounded-full text-sm text-white/80 hover:text-white hover:border-white/40 transition-all flex items-center gap-2"
            >
              <span>这些理念，源自一个多世纪的教育创新探索</span>
              <span className="text-cyan-400">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 理论脉络弹窗 */}
      <AnimatePresence>
        {showTheoryLineage && (
          <TheoryLineagePopup onClose={() => setShowTheoryLineage(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
