"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Theorist {
  id: string;
  name: string;
  nameZh: string;
  years: string;
  theory: string;
  theoryZh: string;
  color: string;
  description: string;
  keyIdeas: string[];
  influence: string;
}

const THEORISTS: Theorist[] = [
  {
    id: "dewey",
    name: "John Dewey",
    nameZh: "杜威",
    years: "1859-1952",
    theory: "Pragmatism",
    theoryZh: "实用主义",
    color: "#6366f1",
    description: "教育即经验的持续重组，学习发生在真实问题解决的过程中。",
    keyIdeas: ["做中学", "经验主义", "民主教育", "反思性思维"],
    influence: "奠定了现代进步教育的哲学基础",
  },
  {
    id: "piaget",
    name: "Jean Piaget",
    nameZh: "皮亚杰",
    years: "1896-1980",
    theory: "Constructivism",
    theoryZh: "建构主义",
    color: "#8b5cf6",
    description: "儿童不是空瓶子，而是主动建构知识的小科学家。",
    keyIdeas: ["认知发展阶段", "图式", "同化与顺应", "平衡化"],
    influence: "揭示了认知发展的内在机制",
  },
  {
    id: "vygotsky",
    name: "Lev Vygotsky",
    nameZh: "维果茨基",
    years: "1896-1934",
    theory: "Social Constructivism",
    theoryZh: "社会建构主义",
    color: "#06b6d4",
    description: "学习是社会互动的产物，在最近发展区中成长最快。",
    keyIdeas: ["最近发展区", "脚手架", "社会互动", "语言与思维"],
    influence: "强调社会文化在认知发展中的核心作用",
  },
  {
    id: "papert",
    name: "Seymour Papert",
    nameZh: "帕普特",
    years: "1928-2016",
    theory: "Constructionism",
    theoryZh: "建构论",
    color: "#10b981",
    description: "当学习者创造外部作品时，内部理解建构最为深刻。",
    keyIdeas: ["Logo语言", "微世界", "强力创意", "低门槛高天花板"],
    influence: "开创了计算机辅助教育的新范式",
  },
  {
    id: "resnick",
    name: "Mitchel Resnick",
    nameZh: "雷斯尼克",
    years: "1956-",
    theory: "Creative Learning",
    theoryZh: "创造性学习",
    color: "#f59e0b",
    description: "通过项目、热情、同伴、玩耍的螺旋，培养创造性思维。",
    keyIdeas: ["4P学习法", "Scratch", "终身幼儿园", "创造性螺旋"],
    influence: "将创客教育推向全球",
  },
];

interface TheoryLineageProps {
  className?: string;
  interactive?: boolean;
}

export function TheoryLineage({ className = "", interactive = true }: TheoryLineageProps) {
  const [selectedTheorist, setSelectedTheorist] = useState<Theorist | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const nodeWidth = 120;
  const nodeHeight = 80;
  const gap = 40;
  const startX = 60;
  const startY = 60;

  return (
    <div className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-sm">OWL 理论脉络</h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          从杜威到雷斯尼克，百年教育思想的传承与创新
        </p>
      </div>

      {/* SVG Graph */}
      <div className="relative overflow-x-auto">
        <svg
          width={Math.max(700, THEORISTS.length * (nodeWidth + gap) + startX * 2)}
          height={220}
          className="min-w-full"
        >
          {/* Connection lines */}
          <defs>
            <marker
              id="arrowhead-lineage"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="var(--muted-foreground)"
              />
            </marker>
            {/* Gradient for timeline */}
            <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Timeline background */}
          <rect
            x={startX}
            y={startY + nodeHeight / 2 - 2}
            width={THEORISTS.length * (nodeWidth + gap) - gap}
            height={4}
            rx={2}
            fill="url(#timeline-gradient)"
          />

          {/* Connection arrows */}
          {THEORISTS.slice(0, -1).map((_, i) => {
            const x1 = startX + i * (nodeWidth + gap) + nodeWidth;
            const x2 = startX + (i + 1) * (nodeWidth + gap);
            const y = startY + nodeHeight / 2;
            const isHovered = hoveredId === THEORISTS[i].id || hoveredId === THEORISTS[i + 1].id;

            return (
              <line
                key={i}
                x1={x1}
                y1={y}
                x2={x2 - 5}
                y2={y}
                stroke={isHovered ? "var(--neon-cyan)" : "var(--muted-foreground)"}
                strokeWidth={isHovered ? 2 : 1.5}
                markerEnd="url(#arrowhead-lineage)"
                opacity={isHovered ? 1 : 0.5}
              />
            );
          })}

          {/* Theorist nodes */}
          {THEORISTS.map((theorist, i) => {
            const x = startX + i * (nodeWidth + gap);
            const y = startY;
            const isHovered = hoveredId === theorist.id;
            const isSelected = selectedTheorist?.id === theorist.id;

            return (
              <g
                key={theorist.id}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: interactive ? "pointer" : "default" }}
                onMouseEnter={() => interactive && setHoveredId(theorist.id)}
                onMouseLeave={() => interactive && setHoveredId(null)}
                onClick={() => interactive && setSelectedTheorist(theorist)}
              >
                {/* Glow effect */}
                {(isHovered || isSelected) && (
                  <rect
                    x={-4}
                    y={-4}
                    width={nodeWidth + 8}
                    height={nodeHeight + 8}
                    rx={12}
                    fill={theorist.color}
                    opacity={0.2}
                    className="animate-pulse"
                  />
                )}

                {/* Node background */}
                <rect
                  width={nodeWidth}
                  height={nodeHeight}
                  rx={8}
                  fill="var(--background)"
                  stroke={theorist.color}
                  strokeWidth={isHovered || isSelected ? 2.5 : 2}
                />

                {/* Color indicator */}
                <rect
                  x={0}
                  y={0}
                  width={nodeWidth}
                  height={4}
                  rx={8}
                  fill={theorist.color}
                  clipPath="inset(0 0 50% 0 round 8px)"
                />

                {/* Name */}
                <text
                  x={nodeWidth / 2}
                  y={28}
                  textAnchor="middle"
                  className="text-sm font-bold fill-current"
                >
                  {theorist.nameZh}
                </text>

                {/* Theory */}
                <text
                  x={nodeWidth / 2}
                  y={48}
                  textAnchor="middle"
                  className="text-[10px] fill-[var(--muted-foreground)]"
                >
                  {theorist.theoryZh}
                </text>

                {/* Years */}
                <text
                  x={nodeWidth / 2}
                  y={nodeHeight + 16}
                  textAnchor="middle"
                  className="text-[9px] fill-[var(--muted-foreground)]"
                >
                  {theorist.years}
                </text>
              </g>
            );
          })}

          {/* Branch to Vygotsky (social constructivism) */}
          <path
            d={`M ${startX + 1 * (nodeWidth + gap) + nodeWidth / 2} ${startY + nodeHeight}
                Q ${startX + 1.5 * (nodeWidth + gap)} ${startY + nodeHeight + 30}
                  ${startX + 2 * (nodeWidth + gap) + nodeWidth / 2} ${startY + nodeHeight}`}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            strokeDasharray="4 2"
            opacity={0.4}
          />
        </svg>
      </div>

      {/* Selected theorist detail */}
      <AnimatePresence>
        {selectedTheorist && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[var(--glass-border)] overflow-hidden"
          >
            <div className="p-4 bg-[var(--background)]">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: selectedTheorist.color }}
                  >
                    {selectedTheorist.nameZh.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      {selectedTheorist.nameZh}
                      <span className="text-[var(--muted-foreground)] font-normal ml-2 text-sm">
                        {selectedTheorist.name}
                      </span>
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {selectedTheorist.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedTheorist.keyIdeas.map((idea) => (
                        <span
                          key={idea}
                          className="px-2 py-0.5 text-xs rounded-full"
                          style={{
                            backgroundColor: `${selectedTheorist.color}20`,
                            color: selectedTheorist.color,
                          }}
                        >
                          {idea}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-2 italic">
                      {selectedTheorist.influence}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTheorist(null)}
                  className="p-1 rounded hover:bg-[var(--glass-bg)] shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-[var(--glass-border)] text-xs text-[var(--muted-foreground)]">
        <span>点击节点查看详情 • 思想传承脉络：实用主义 → 建构主义 → 建构论 → 创造性学习</span>
      </div>
    </div>
  );
}
