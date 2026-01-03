"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Concept } from "./concepts";
import { CONCEPTS } from "./concepts";

interface ConceptCardProps {
  concept: Concept;
  discoveredConcepts: Set<string>;
  onClose: () => void;
  onClickConnection: (conceptId: string) => void;
}

export function ConceptCard({
  concept,
  discoveredConcepts,
  onClose,
  onClickConnection,
}: ConceptCardProps) {
  // 获取相连理念的详细信息
  const connectedConcepts = concept.connections
    .map(id => CONCEPTS.find(c => c.id === id))
    .filter((c): c is Concept => c !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute bottom-0 left-0 right-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10 max-h-[60%] overflow-y-auto"
    >
      <div className="p-5">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white/60" />
        </button>

        {/* 头部 */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ backgroundColor: `${concept.color}20`, color: concept.color }}
          >
            ✦
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">
              {concept.name}
            </h4>
            <p className="text-sm text-white/50">
              {concept.nameEn}
            </p>
          </div>
        </div>

        {/* 核心洞见 */}
        <div className="mb-5 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-white/80 text-sm leading-relaxed italic">
            &ldquo;{concept.insight}&rdquo;
          </p>
        </div>

        {/* OWL 实践 */}
        <div className="mb-5">
          <h5 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            OWL 实践
          </h5>
          <ul className="space-y-2">
            {concept.practices.map((practice, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-white/70"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: concept.color }}
                />
                {practice}
              </li>
            ))}
          </ul>
        </div>

        {/* 相连理念 */}
        <div>
          <h5 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            相连理念
          </h5>
          <div className="flex flex-wrap gap-2">
            {connectedConcepts.map(conn => {
              const isDiscovered = discoveredConcepts.has(conn.id);
              return (
                <button
                  key={conn.id}
                  onClick={() => onClickConnection(conn.id)}
                  className="px-3 py-1.5 rounded-full text-sm transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: isDiscovered ? `${conn.color}20` : 'rgba(255,255,255,0.05)',
                    color: isDiscovered ? conn.color : 'rgba(255,255,255,0.5)',
                    borderWidth: 1,
                    borderColor: isDiscovered ? `${conn.color}40` : 'rgba(255,255,255,0.1)',
                  }}
                >
                  {isDiscovered ? (
                    <>
                      <span>✦</span>
                      <span>{conn.name}</span>
                    </>
                  ) : (
                    <>
                      <span>?</span>
                      <span>点击探索</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
