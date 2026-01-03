"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lightbulb, Heart, Users, Gamepad2 } from "lucide-react";

interface PElement {
  id: string;
  name: string;
  nameZh: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  practices: string[];
  questions: string[];
}

const FOUR_PS: PElement[] = [
  {
    id: "project",
    name: "Project",
    nameZh: "项目",
    icon: <Lightbulb className="w-6 h-6" />,
    color: "#f59e0b",
    description: "学习围绕有意义的项目展开，产出可分享的作品。项目不是练习题的包装，而是真正需要解决的问题。",
    practices: [
      "从真实问题出发，而非虚构场景",
      "产出可展示、可分享的作品",
      "允许多种解决方案并存",
      "迭代改进，不追求一次完美",
    ],
    questions: [
      "这个项目对学习者有意义吗？",
      "最终作品能与他人分享吗？",
      "学习者有选择的自由度吗？",
    ],
  },
  {
    id: "passion",
    name: "Passion",
    nameZh: "热情",
    icon: <Heart className="w-6 h-6" />,
    color: "#ef4444",
    description: "当学习者关心他们正在做的事情时，他们会更努力、更持久、更深入地学习。热情是最强大的学习引擎。",
    practices: [
      "尊重学习者的兴趣选择",
      "提供多元主题供探索",
      "连接项目与个人经历",
      "庆祝独特的创意表达",
    ],
    questions: [
      "学习者对这个主题真正感兴趣吗？",
      "他们在课外会继续探索吗？",
      "项目与他们的生活有联系吗？",
    ],
  },
  {
    id: "peers",
    name: "Peers",
    nameZh: "同伴",
    icon: <Users className="w-6 h-6" />,
    color: "#10b981",
    description: "学习是社会性的。同伴不仅是合作者，更是灵感来源、反馈提供者和成长见证者。",
    practices: [
      "设计需要协作的任务",
      "创造分享和反馈的机会",
      "混龄学习，互相启发",
      "建立支持性的学习社区",
    ],
    questions: [
      "学习者有机会向同伴学习吗？",
      "他们能分享自己的作品吗？",
      "社区氛围支持冒险和试错吗？",
    ],
  },
  {
    id: "play",
    name: "Play",
    nameZh: "玩耍",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "#8b5cf6",
    description: "玩耍是探索、实验和创造的自然状态。它不是浪费时间，而是创新的温床。",
    practices: [
      "鼓励实验和冒险",
      "不惩罚失败，庆祝发现",
      "留出无结构的探索时间",
      "将困难重新定义为挑战",
    ],
    questions: [
      "学习者敢于尝试新事物吗？",
      "失败被当作学习机会吗？",
      "有自由探索的时间和空间吗？",
    ],
  },
];

interface FourPFrameworkProps {
  className?: string;
  interactive?: boolean;
  compact?: boolean;
}

export function FourPFramework({
  className = "",
  interactive = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  compact = false,
}: FourPFrameworkProps) {
  const [selectedP, setSelectedP] = useState<PElement | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const centerX = 150;
  const centerY = 150;

  // Calculate positions for 4 elements in a square arrangement
  const positions = [
    { x: centerX - 60, y: centerY - 60 }, // Top-left: Project
    { x: centerX + 60, y: centerY - 60 }, // Top-right: Passion
    { x: centerX - 60, y: centerY + 60 }, // Bottom-left: Peers
    { x: centerX + 60, y: centerY + 60 }, // Bottom-right: Play
  ];

  return (
    <div className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-3 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-sm">4P 创造性学习框架</h3>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          Project · Passion · Peers · Play — 创造性学习的四大支柱
        </p>
      </div>

      {/* SVG Diagram */}
      <div className="flex justify-center p-4">
        <svg width={300} height={300} className="overflow-visible">
          {/* Background connections */}
          <defs>
            <filter id="glow-4p">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connection lines between all 4 Ps */}
          {[0, 1, 2, 3].map((i) =>
            [0, 1, 2, 3]
              .filter((j) => j > i)
              .map((j) => {
                const isHighlighted =
                  hoveredId === FOUR_PS[i].id || hoveredId === FOUR_PS[j].id;
                return (
                  <line
                    key={`${i}-${j}`}
                    x1={positions[i].x}
                    y1={positions[i].y}
                    x2={positions[j].x}
                    y2={positions[j].y}
                    stroke={isHighlighted ? "var(--neon-cyan)" : "var(--glass-border)"}
                    strokeWidth={isHighlighted ? 2 : 1}
                    opacity={isHighlighted ? 0.8 : 0.3}
                  />
                );
              })
          )}

          {/* Center: Learner */}
          <circle
            cx={centerX}
            cy={centerY}
            r={28}
            fill="var(--background)"
            stroke="var(--neon-cyan)"
            strokeWidth={2}
          />
          <text
            x={centerX}
            y={centerY - 4}
            textAnchor="middle"
            className="text-xs font-bold fill-[var(--neon-cyan)]"
          >
            学习者
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-[9px] fill-[var(--muted-foreground)]"
          >
            Learner
          </text>

          {/* 4P nodes */}
          {FOUR_PS.map((p, i) => {
            const pos = positions[i];
            const isHovered = hoveredId === p.id;
            const isSelected = selectedP?.id === p.id;

            return (
              <g
                key={p.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: interactive ? "pointer" : "default" }}
                onMouseEnter={() => interactive && setHoveredId(p.id)}
                onMouseLeave={() => interactive && setHoveredId(null)}
                onClick={() => interactive && setSelectedP(p)}
              >
                {/* Glow effect */}
                {(isHovered || isSelected) && (
                  <circle
                    r={38}
                    fill={p.color}
                    opacity={0.2}
                    className="animate-pulse"
                  />
                )}

                {/* Main circle */}
                <circle
                  r={32}
                  fill="var(--background)"
                  stroke={p.color}
                  strokeWidth={isHovered || isSelected ? 3 : 2}
                />

                {/* Icon */}
                <g
                  transform="translate(-12, -18)"
                  style={{ color: p.color }}
                >
                  {p.icon}
                </g>

                {/* Label */}
                <text
                  y={12}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-current"
                >
                  {p.nameZh}
                </text>

                {/* English name */}
                <text
                  y={50}
                  textAnchor="middle"
                  className="text-[9px] fill-[var(--muted-foreground)]"
                >
                  {p.name}
                </text>
              </g>
            );
          })}

          {/* Spiral arrows indicating creative learning cycle */}
          <path
            d={`M ${centerX} ${centerY - 50}
                A 50 50 0 0 1 ${centerX + 50} ${centerY}
                A 50 50 0 0 1 ${centerX} ${centerY + 50}
                A 50 50 0 0 1 ${centerX - 50} ${centerY}
                A 50 50 0 0 1 ${centerX} ${centerY - 45}`}
            fill="none"
            stroke="var(--muted-foreground)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.3}
          />
        </svg>
      </div>

      {/* Selected P detail */}
      <AnimatePresence>
        {selectedP && (
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
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: selectedP.color }}
                  >
                    {selectedP.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {selectedP.nameZh}
                      <span className="text-[var(--muted-foreground)] font-normal ml-2 text-sm">
                        {selectedP.name}
                      </span>
                    </h4>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {selectedP.description}
                    </p>

                    {/* Practices */}
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                        实践要点
                      </h5>
                      <ul className="space-y-1">
                        {selectedP.practices.map((practice, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs"
                          >
                            <span style={{ color: selectedP.color }}>•</span>
                            {practice}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Self-check questions */}
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
                        自检问题
                      </h5>
                      <ul className="space-y-1">
                        {selectedP.questions.map((question, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs text-[var(--muted-foreground)] italic"
                          >
                            <span>?</span>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedP(null)}
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
      <div className="px-4 py-2 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
        <span>点击元素查看详情</span>
        <span className="italic">— Mitchel Resnick, Lifelong Kindergarten</span>
      </div>
    </div>
  );
}
