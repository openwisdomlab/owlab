"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, CheckCircle2, Circle, AlertCircle } from "lucide-react";

type NodeType = "start" | "end" | "process" | "decision" | "action";

interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  description?: string;
  details?: string[];
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
  condition?: "yes" | "no" | string;
}

interface FlowChartProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  title?: string;
  interactive?: boolean;
  currentStep?: string; // Highlight current step
  completedSteps?: string[]; // Mark completed steps
  className?: string;
}

// Helper to calculate node positions in a vertical flow
function calculateLayout(nodes: FlowNode[], edges: FlowEdge[]) {
  const positions: Record<string, { x: number; y: number; level: number }> = {};
  const levels: string[][] = [];

  // Build adjacency list
  const children: Record<string, string[]> = {};
  const parents: Record<string, string[]> = {};

  nodes.forEach((n) => {
    children[n.id] = [];
    parents[n.id] = [];
  });

  edges.forEach((e) => {
    children[e.from].push(e.to);
    parents[e.to].push(e.from);
  });

  // Find start node (no parents)
  const startNodes = nodes.filter((n) => parents[n.id].length === 0);

  // BFS to assign levels
  const visited = new Set<string>();
  const queue: { id: string; level: number }[] = startNodes.map((n) => ({
    id: n.id,
    level: 0,
  }));

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    if (!levels[level]) levels[level] = [];
    levels[level].push(id);

    children[id].forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, level: level + 1 });
      }
    });
  }

  // Assign positions
  const nodeWidth = 160;
  const nodeHeight = 60;
  const levelGap = 80;
  const nodeGap = 40;

  levels.forEach((levelNodes, levelIndex) => {
    const totalWidth = levelNodes.length * nodeWidth + (levelNodes.length - 1) * nodeGap;
    const startX = (400 - totalWidth) / 2;

    levelNodes.forEach((nodeId, nodeIndex) => {
      positions[nodeId] = {
        x: startX + nodeIndex * (nodeWidth + nodeGap) + nodeWidth / 2,
        y: 40 + levelIndex * (nodeHeight + levelGap) + nodeHeight / 2,
        level: levelIndex,
      };
    });
  });

  return { positions, maxLevel: levels.length };
}

function getNodeColors(type: NodeType, isActive: boolean, isCompleted: boolean) {
  if (isCompleted) {
    return {
      bg: "var(--neon-green)",
      border: "var(--neon-green)",
      text: "white",
    };
  }
  if (isActive) {
    return {
      bg: "var(--neon-cyan)",
      border: "var(--neon-cyan)",
      text: "white",
    };
  }

  switch (type) {
    case "start":
      return { bg: "#22c55e", border: "#22c55e", text: "white" };
    case "end":
      return { bg: "#ef4444", border: "#ef4444", text: "white" };
    case "decision":
      return { bg: "#f59e0b", border: "#f59e0b", text: "white" };
    case "action":
      return { bg: "#8b5cf6", border: "#8b5cf6", text: "white" };
    default:
      return { bg: "var(--glass-bg)", border: "var(--glass-border)", text: "inherit" };
  }
}

function getNodeShape(type: NodeType) {
  switch (type) {
    case "start":
    case "end":
      return "rounded-full";
    case "decision":
      return "rotate-45";
    default:
      return "rounded-lg";
  }
}

export function FlowChart({
  nodes,
  edges,
  title,
  interactive = true,
  currentStep,
  completedSteps = [],
  className = "",
}: FlowChartProps) {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { positions, maxLevel } = useMemo(
    () => calculateLayout(nodes, edges),
    [nodes, edges]
  );

  const svgHeight = useMemo(() => maxLevel * 140 + 80, [maxLevel]);

  const getEdgePath = useCallback(
    (edge: FlowEdge) => {
      const from = positions[edge.from];
      const to = positions[edge.to];

      if (!from || !to) return "";

      // Simple vertical or curved path
      if (from.x === to.x) {
        // Straight vertical line
        return `M ${from.x} ${from.y + 25} L ${to.x} ${to.y - 25}`;
      } else {
        // Curved path for non-vertical connections
        const midY = (from.y + to.y) / 2;
        return `M ${from.x} ${from.y + 25} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - 25}`;
      }
    },
    [positions]
  );

  const completedSet = useMemo(() => new Set(completedSteps), [completedSteps]);

  return (
    <div
      className={`bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}
    >
      {/* Header */}
      {title && (
        <div className="p-3 border-b border-[var(--glass-border)]">
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
      )}

      {/* Flow Chart */}
      <div className="relative overflow-auto">
        <svg width="400" height={svgHeight} className="mx-auto">
          {/* Edges */}
          <defs>
            <marker
              id="arrowhead"
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
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="var(--neon-cyan)" />
            </marker>
          </defs>

          <g>
            {edges.map((edge, i) => {
              const isActive =
                currentStep === edge.from ||
                hoveredNode === edge.from ||
                hoveredNode === edge.to;
              const path = getEdgePath(edge);
              const from = positions[edge.from];
              const to = positions[edge.to];

              return (
                <g key={i}>
                  <path
                    d={path}
                    fill="none"
                    stroke={isActive ? "var(--neon-cyan)" : "var(--muted-foreground)"}
                    strokeWidth={isActive ? 2 : 1.5}
                    markerEnd={`url(#arrowhead${isActive ? "-active" : ""})`}
                    opacity={isActive ? 1 : 0.6}
                  />
                  {edge.label && from && to && (
                    <text
                      x={(from.x + to.x) / 2 + (from.x === to.x ? 10 : 0)}
                      y={(from.y + to.y) / 2}
                      className="text-[10px] fill-[var(--muted-foreground)]"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {nodes.map((node) => {
              const pos = positions[node.id];
              if (!pos) return null;

              const isActive = currentStep === node.id;
              const isCompleted = completedSet.has(node.id);
              const isHovered = hoveredNode === node.id;
              const colors = getNodeColors(node.type, isActive, isCompleted);

              const width = node.type === "decision" ? 50 : 140;
              const height = node.type === "decision" ? 50 : 44;

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  style={{ cursor: interactive ? "pointer" : "default" }}
                  onMouseEnter={() => interactive && setHoveredNode(node.id)}
                  onMouseLeave={() => interactive && setHoveredNode(null)}
                  onClick={() => interactive && setSelectedNode(node)}
                >
                  {/* Glow effect for active/hovered */}
                  {(isActive || isHovered) && (
                    <rect
                      x={-width / 2 - 4}
                      y={-height / 2 - 4}
                      width={width + 8}
                      height={height + 8}
                      rx={node.type === "start" || node.type === "end" ? height / 2 + 4 : 8}
                      fill={colors.bg}
                      opacity={0.2}
                      className="animate-pulse"
                      style={{
                        transform: node.type === "decision" ? "rotate(45deg)" : undefined,
                        transformOrigin: "center",
                      }}
                    />
                  )}

                  {/* Node shape */}
                  {node.type === "decision" ? (
                    <rect
                      x={-width / 2}
                      y={-height / 2}
                      width={width}
                      height={height}
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth={2}
                      style={{
                        transform: "rotate(45deg)",
                        transformOrigin: "center",
                      }}
                    />
                  ) : (
                    <rect
                      x={-width / 2}
                      y={-height / 2}
                      width={width}
                      height={height}
                      rx={node.type === "start" || node.type === "end" ? height / 2 : 6}
                      fill={colors.bg}
                      stroke={colors.border}
                      strokeWidth={2}
                    />
                  )}

                  {/* Status icon */}
                  {isCompleted && (
                    <g transform="translate(50, -16)">
                      <circle r={10} fill="var(--neon-green)" />
                      <path
                        d="M -4 0 L -1 3 L 4 -2"
                        stroke="white"
                        strokeWidth={2}
                        fill="none"
                      />
                    </g>
                  )}

                  {/* Label */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-medium"
                    fill={colors.text}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Node Detail */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border-t border-[var(--glass-border)] p-4 bg-[var(--background)]"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    completedSet.has(selectedNode.id)
                      ? "bg-[var(--neon-green)]"
                      : currentStep === selectedNode.id
                      ? "bg-[var(--neon-cyan)]"
                      : "bg-[var(--glass-bg)]"
                  }`}
                >
                  {completedSet.has(selectedNode.id) ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : currentStep === selectedNode.id ? (
                    <Circle className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{selectedNode.label}</h4>
                  {selectedNode.description && (
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      {selectedNode.description}
                    </p>
                  )}
                  {selectedNode.details && selectedNode.details.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {selectedNode.details.map((detail, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-[var(--muted-foreground)]"
                        >
                          <span className="text-[var(--neon-cyan)]">•</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded hover:bg-[var(--glass-bg)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-[var(--glass-border)] flex flex-wrap gap-4 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span>开始</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-[var(--glass-border)]" />
          <span>步骤</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rotate-45 bg-[#f59e0b]" />
          <span>判断</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span>结束</span>
        </div>
      </div>
    </div>
  );
}

// Pre-built flow chart data
export const EQUIPMENT_ACCESS_FLOW: { nodes: FlowNode[]; edges: FlowEdge[] } = {
  nodes: [
    { id: "start", type: "start", label: "新用户" },
    {
      id: "check-training",
      type: "decision",
      label: "培训?",
      description: "是否完成安全培训",
      details: ["需要完成基础安全培训课程", "培训时长约2小时", "通过考核后获得资格"],
    },
    {
      id: "book-training",
      type: "action",
      label: "预约培训",
      description: "预约基础安全培训",
      details: ["登录系统预约培训时间", "准备学习材料", "按时参加培训"],
    },
    {
      id: "complete-training",
      type: "process",
      label: "完成培训",
      description: "完成安全培训并通过考核",
    },
    {
      id: "check-level",
      type: "decision",
      label: "级别?",
      description: "设备安全等级",
      details: [
        "S1/S2: 低风险设备，培训后可直接使用",
        "S3/S4: 高风险设备，需要专项认证",
      ],
    },
    {
      id: "direct-use",
      type: "process",
      label: "直接使用",
      description: "S1/S2级别设备可直接使用",
    },
    {
      id: "certification",
      type: "action",
      label: "专项认证",
      description: "完成高风险设备专项认证",
      details: ["接受设备专项培训", "在指导下完成操作考核", "获得设备使用许可"],
    },
    {
      id: "book-use",
      type: "process",
      label: "预约使用",
      description: "在系统中预约设备使用时间",
    },
    { id: "end", type: "end", label: "使用设备" },
  ],
  edges: [
    { from: "start", to: "check-training" },
    { from: "check-training", to: "book-training", label: "否" },
    { from: "check-training", to: "check-level", label: "是" },
    { from: "book-training", to: "complete-training" },
    { from: "complete-training", to: "check-level" },
    { from: "check-level", to: "direct-use", label: "S1/S2" },
    { from: "check-level", to: "certification", label: "S3/S4" },
    { from: "direct-use", to: "book-use" },
    { from: "certification", to: "book-use" },
    { from: "book-use", to: "end" },
  ],
};

export const SPACE_PLANNING_FLOW: { nodes: FlowNode[]; edges: FlowEdge[] } = {
  nodes: [
    { id: "start", type: "start", label: "开始规划" },
    {
      id: "needs",
      type: "process",
      label: "需求分析",
      description: "明确空间功能需求",
      details: ["确定目标用户群体", "列出核心功能需求", "评估预算范围"],
    },
    {
      id: "space-eval",
      type: "process",
      label: "场地评估",
      description: "评估可用场地条件",
      details: ["测量场地尺寸", "检查基础设施", "评估改造成本"],
    },
    {
      id: "feasible",
      type: "decision",
      label: "可行?",
      description: "场地是否满足需求",
    },
    {
      id: "find-new",
      type: "action",
      label: "寻找新场地",
      description: "重新寻找合适场地",
    },
    {
      id: "design",
      type: "process",
      label: "空间设计",
      description: "进行详细空间设计",
      details: ["功能分区规划", "人流动线设计", "设备布局方案"],
    },
    {
      id: "procure",
      type: "process",
      label: "采购施工",
      description: "设备采购与场地施工",
    },
    { id: "end", type: "end", label: "投入使用" },
  ],
  edges: [
    { from: "start", to: "needs" },
    { from: "needs", to: "space-eval" },
    { from: "space-eval", to: "feasible" },
    { from: "feasible", to: "find-new", label: "否" },
    { from: "feasible", to: "design", label: "是" },
    { from: "find-new", to: "space-eval" },
    { from: "design", to: "procure" },
    { from: "procure", to: "end" },
  ],
};
