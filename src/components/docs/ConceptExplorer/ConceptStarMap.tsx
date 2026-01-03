"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Concept } from "./concepts";

interface ConceptStarMapProps {
  concepts: Concept[];
  discoveredConcepts: Set<string>;
  visibleConcepts: Set<string>;
  selectedConceptId: string | null;
  isFullMapRevealed: boolean;
  hasStarted: boolean;
  onConceptClick: (conceptId: string) => void;
  onStartClick: () => void;
}

export function ConceptStarMap({
  concepts,
  discoveredConcepts,
  visibleConcepts,
  selectedConceptId,
  isFullMapRevealed,
  hasStarted,
  onConceptClick,
  onStartClick,
}: ConceptStarMapProps) {
  // 计算连接线
  const edges = useMemo(() => {
    const result: Array<{
      from: Concept;
      to: Concept;
      isActive: boolean;
    }> = [];
    const addedPairs = new Set<string>();

    concepts.forEach(concept => {
      concept.connections.forEach(connId => {
        const pairKey = [concept.id, connId].sort().join('-');
        if (addedPairs.has(pairKey)) return;
        addedPairs.add(pairKey);

        const targetConcept = concepts.find(c => c.id === connId);
        if (!targetConcept) return;

        const isActive =
          isFullMapRevealed ||
          (discoveredConcepts.has(concept.id) && discoveredConcepts.has(connId));

        result.push({
          from: concept,
          to: targetConcept,
          isActive,
        });
      });
    });

    return result;
  }, [concepts, discoveredConcepts, isFullMapRevealed]);

  // SVG 视图框
  const viewBox = "0 0 600 500";

  return (
    <svg
      viewBox={viewBox}
      className="w-full h-full"
      style={{ minHeight: 400 }}
    >
      <defs>
        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 强发光滤镜 */}
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* 渐变定义 */}
        {concepts.map(concept => (
          <radialGradient key={`grad-${concept.id}`} id={`grad-${concept.id}`}>
            <stop offset="0%" stopColor={concept.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={concept.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* 连接线 */}
      <g>
        {edges.map(({ from, to, isActive }, i) => {
          const shouldShow = isActive ||
            (discoveredConcepts.has(from.id) && visibleConcepts.has(to.id)) ||
            (discoveredConcepts.has(to.id) && visibleConcepts.has(from.id));

          if (!shouldShow && hasStarted) return null;

          return (
            <motion.line
              key={`edge-${i}`}
              x1={from.position.x}
              y1={from.position.y}
              x2={to.position.x}
              y2={to.position.y}
              stroke={isActive ? "url(#edge-gradient)" : "rgba(255,255,255,0.1)"}
              strokeWidth={isActive ? 2 : 1}
              strokeDasharray={isActive ? "none" : "4 4"}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isActive ? 0.8 : (hasStarted ? 0.3 : 0.1),
                strokeWidth: isActive ? 2 : 1,
              }}
              transition={{ duration: 0.5 }}
            />
          );
        })}
      </g>

      {/* 连接线渐变 */}
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* 理念节点 */}
      <g>
        {concepts.map(concept => {
          const isDiscovered = discoveredConcepts.has(concept.id);
          const isVisible = visibleConcepts.has(concept.id);
          const isSelected = selectedConceptId === concept.id;
          const canClick = isVisible || isDiscovered || isFullMapRevealed;

          return (
            <g
              key={concept.id}
              transform={`translate(${concept.position.x}, ${concept.position.y})`}
              style={{ cursor: canClick ? "pointer" : "default" }}
              onClick={() => canClick && onConceptClick(concept.id)}
            >
              {/* 发现状态：光晕背景 */}
              {isDiscovered && (
                <motion.circle
                  r={40}
                  fill={`url(#grad-${concept.id})`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              )}

              {/* 选中状态：额外光环 */}
              {isSelected && (
                <motion.circle
                  r={35}
                  fill="none"
                  stroke={concept.color}
                  strokeWidth={2}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* 主圆圈 */}
              <motion.circle
                r={28}
                fill="#0a0a0f"
                stroke={isDiscovered ? concept.color : "rgba(255,255,255,0.2)"}
                strokeWidth={isDiscovered ? 2.5 : 1.5}
                filter={isDiscovered ? "url(#glow)" : undefined}
                initial={false}
                animate={{
                  scale: isSelected ? 1.05 : 1,
                }}
                whileHover={canClick ? { scale: 1.1 } : undefined}
                transition={{ duration: 0.2 }}
              />

              {/* 未发现但可见状态：问号 */}
              {!isDiscovered && isVisible && (
                <motion.text
                  y={6}
                  textAnchor="middle"
                  className="text-lg font-bold"
                  fill="rgba(255,255,255,0.5)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ?
                </motion.text>
              )}

              {/* 未开始时的隐藏状态 */}
              {!isDiscovered && !isVisible && !hasStarted && (
                <motion.circle
                  r={4}
                  fill="rgba(255,255,255,0.3)"
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              )}

              {/* 发现状态：显示名称 */}
              {isDiscovered && (
                <>
                  <motion.text
                    y={-4}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill={concept.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {concept.name.length > 6
                      ? concept.name.slice(0, 6)
                      : concept.name
                    }
                  </motion.text>
                  {concept.name.length > 6 && (
                    <motion.text
                      y={10}
                      textAnchor="middle"
                      className="text-xs font-bold"
                      fill={concept.color}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {concept.name.slice(6)}
                    </motion.text>
                  )}
                  {concept.name.length <= 6 && (
                    <motion.text
                      y={10}
                      textAnchor="middle"
                      className="text-[9px]"
                      fill="rgba(255,255,255,0.5)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {concept.nameEn.split(' ')[0]}
                    </motion.text>
                  )}
                </>
              )}

              {/* 全图揭示后但未发现的节点也显示名称 */}
              {isFullMapRevealed && !isDiscovered && (
                <motion.text
                  y={4}
                  textAnchor="middle"
                  className="text-[10px]"
                  fill="rgba(255,255,255,0.4)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {concept.name.slice(0, 4)}
                </motion.text>
              )}
            </g>
          );
        })}
      </g>

      {/* 中心开始按钮（未开始时显示） */}
      {!hasStarted && (
        <g
          transform="translate(300, 250)"
          style={{ cursor: "pointer" }}
          onClick={onStartClick}
        >
          <motion.circle
            r={50}
            fill="rgba(34, 211, 238, 0.1)"
            stroke="rgba(34, 211, 238, 0.5)"
            strokeWidth={2}
            filter="url(#glow-strong)"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.circle
            r={40}
            fill="#0a0a0f"
            stroke="#22d3ee"
            strokeWidth={2}
          />
          <text
            y={-8}
            textAnchor="middle"
            className="text-sm font-bold"
            fill="#22d3ee"
          >
            好奇心
          </text>
          <text
            y={8}
            textAnchor="middle"
            className="text-sm font-bold"
            fill="#22d3ee"
          >
            能走多远？
          </text>
          <text
            y={24}
            textAnchor="middle"
            className="text-[10px]"
            fill="rgba(255,255,255,0.5)"
          >
            点击开始探索
          </text>
        </g>
      )}
    </svg>
  );
}
