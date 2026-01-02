"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Maximize2, Search } from "lucide-react";
import Link from "next/link";

interface ModuleNode {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  color: string;
  x: number;
  y: number;
  concepts: string[];
  docPath: string;
}

interface ModuleEdge {
  source: string;
  target: string;
  label?: string;
}

// OWL 9 Modules with positions in a radial layout
const MODULES: ModuleNode[] = [
  {
    id: "M01",
    name: "Philosophy",
    nameZh: "理念",
    description: "教育理念与核心价值",
    color: "#22d3ee",
    x: 200,
    y: 80,
    concepts: ["STEAM教育", "创客精神", "研究性学习", "设计思维"],
    docPath: "/docs/knowledge-base/01-foundations",
  },
  {
    id: "M02",
    name: "Governance",
    nameZh: "治理",
    description: "组织架构与管理制度",
    color: "#8b5cf6",
    x: 80,
    y: 160,
    concepts: ["决策机制", "资源分配", "绩效评估", "持续改进"],
    docPath: "/docs/knowledge-base/02-governance",
  },
  {
    id: "M03",
    name: "Space",
    nameZh: "空间",
    description: "物理空间规划与设计",
    color: "#10b981",
    x: 80,
    y: 280,
    concepts: ["功能分区", "人流动线", "灵活布局", "环境设计"],
    docPath: "/docs/knowledge-base/03-space",
  },
  {
    id: "M04",
    name: "Curriculum",
    nameZh: "课程",
    description: "课程体系与教学设计",
    color: "#f59e0b",
    x: 320,
    y: 80,
    concepts: ["课程框架", "项目设计", "跨学科整合", "评估方法"],
    docPath: "/docs/knowledge-base/04-curriculum",
  },
  {
    id: "M05",
    name: "Tools",
    nameZh: "工具",
    description: "设备工具与技术平台",
    color: "#ef4444",
    x: 320,
    y: 280,
    concepts: ["数字制造", "编程平台", "测量仪器", "协作工具"],
    docPath: "/docs/knowledge-base/05-tools",
  },
  {
    id: "M06",
    name: "Safety",
    nameZh: "安全",
    description: "安全规范与风险管理",
    color: "#ec4899",
    x: 200,
    y: 360,
    concepts: ["安全培训", "设备分级", "应急预案", "防护措施"],
    docPath: "/docs/knowledge-base/06-safety",
  },
  {
    id: "M07",
    name: "People",
    nameZh: "人员",
    description: "人员培训与社区建设",
    color: "#6366f1",
    x: 400,
    y: 160,
    concepts: ["师资培养", "学生发展", "志愿者管理", "家校协作"],
    docPath: "/docs/knowledge-base/07-people",
  },
  {
    id: "M08",
    name: "Operations",
    nameZh: "运营",
    description: "日常运营与活动管理",
    color: "#14b8a6",
    x: 400,
    y: 280,
    concepts: ["开放管理", "设备维护", "活动策划", "资源调度"],
    docPath: "/docs/knowledge-base/08-operations",
  },
  {
    id: "M09",
    name: "Assessment",
    nameZh: "评估",
    description: "评价体系与持续改进",
    color: "#f97316",
    x: 200,
    y: 220,
    concepts: ["学习评估", "项目评审", "空间评估", "影响力评估"],
    docPath: "/docs/knowledge-base/09-assessment",
  },
];

// Module relationships
const EDGES: ModuleEdge[] = [
  { source: "M01", target: "M02", label: "指导" },
  { source: "M01", target: "M04", label: "驱动" },
  { source: "M02", target: "M03", label: "规划" },
  { source: "M02", target: "M07", label: "管理" },
  { source: "M03", target: "M05", label: "承载" },
  { source: "M03", target: "M06", label: "保障" },
  { source: "M04", target: "M05", label: "使用" },
  { source: "M04", target: "M07", label: "培养" },
  { source: "M05", target: "M06", label: "规范" },
  { source: "M05", target: "M08", label: "支持" },
  { source: "M06", target: "M08", label: "监督" },
  { source: "M07", target: "M08", label: "执行" },
  { source: "M08", target: "M09", label: "反馈" },
  { source: "M09", target: "M01", label: "优化" },
  { source: "M09", target: "M02", label: "改进" },
];

interface KnowledgeGraphProps {
  module?: string; // Focus on specific module
  depth?: number; // Levels of connections to show
  interactive?: boolean;
  className?: string;
}

export function KnowledgeGraph({
  module,
  depth = 2,
  interactive = true,
  className = "",
}: KnowledgeGraphProps) {
  const [selectedNode, setSelectedNode] = useState<ModuleNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter nodes based on focus module and depth
  const { visibleNodes, visibleEdges } = useMemo(() => {
    if (!module) {
      return { visibleNodes: MODULES, visibleEdges: EDGES };
    }

    const connected = new Set<string>([module]);
    let frontier = [module];

    for (let i = 0; i < depth; i++) {
      const newFrontier: string[] = [];
      for (const nodeId of frontier) {
        for (const edge of EDGES) {
          if (edge.source === nodeId && !connected.has(edge.target)) {
            connected.add(edge.target);
            newFrontier.push(edge.target);
          }
          if (edge.target === nodeId && !connected.has(edge.source)) {
            connected.add(edge.source);
            newFrontier.push(edge.source);
          }
        }
      }
      frontier = newFrontier;
    }

    return {
      visibleNodes: MODULES.filter((n) => connected.has(n.id)),
      visibleEdges: EDGES.filter(
        (e) => connected.has(e.source) && connected.has(e.target)
      ),
    };
  }, [module, depth]);

  // Search filter
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return visibleNodes;
    const query = searchQuery.toLowerCase();
    return visibleNodes.filter(
      (n) =>
        n.name.toLowerCase().includes(query) ||
        n.nameZh.includes(query) ||
        n.concepts.some((c) => c.toLowerCase().includes(query))
    );
  }, [visibleNodes, searchQuery]);

  const getNodePosition = useCallback(
    (nodeId: string) => {
      const node = MODULES.find((n) => n.id === nodeId);
      return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    },
    []
  );

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 2));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div
      className={`relative bg-[var(--glass-bg)] rounded-xl border border-[var(--glass-border)] overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--glass-border)]">
        <h3 className="font-semibold text-sm">OWL 知识图谱</h3>
        {interactive && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-2 py-1 text-xs rounded bg-[var(--background)] border border-[var(--glass-border)] w-32 focus:outline-none focus:border-[var(--neon-cyan)]"
              />
            </div>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-[var(--glass-bg)]"
              title="缩小"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-[var(--glass-bg)]"
              title="放大"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded hover:bg-[var(--glass-bg)]"
              title="重置"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Graph Area */}
      <div className="relative h-[400px] overflow-hidden">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 480 440"
          style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
        >
          {/* Edges */}
          <g>
            {visibleEdges.map((edge, i) => {
              const source = getNodePosition(edge.source);
              const target = getNodePosition(edge.target);
              const midX = (source.x + target.x) / 2;
              const midY = (source.y + target.y) / 2;
              const isHighlighted =
                hoveredNode === edge.source || hoveredNode === edge.target;

              return (
                <g key={i}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={isHighlighted ? "var(--neon-cyan)" : "var(--glass-border)"}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeOpacity={isHighlighted ? 1 : 0.5}
                  />
                  {edge.label && isHighlighted && (
                    <text
                      x={midX}
                      y={midY}
                      textAnchor="middle"
                      className="text-[10px] fill-[var(--muted-foreground)]"
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
            {filteredNodes.map((node) => {
              const isHovered = hoveredNode === node.id;
              const isFiltered =
                searchQuery &&
                !filteredNodes.find((n) => n.id === node.id);
              const opacity = isFiltered ? 0.3 : 1;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: interactive ? "pointer" : "default", opacity }}
                  onMouseEnter={() => interactive && setHoveredNode(node.id)}
                  onMouseLeave={() => interactive && setHoveredNode(null)}
                  onClick={() => interactive && setSelectedNode(node)}
                >
                  {/* Glow effect */}
                  {isHovered && (
                    <circle
                      r={35}
                      fill={node.color}
                      opacity={0.2}
                      className="animate-pulse"
                    />
                  )}
                  {/* Main circle */}
                  <circle
                    r={28}
                    fill="var(--background)"
                    stroke={node.color}
                    strokeWidth={isHovered ? 3 : 2}
                  />
                  {/* Module ID */}
                  <text
                    y={-6}
                    textAnchor="middle"
                    className="text-[10px] font-bold"
                    fill={node.color}
                  >
                    {node.id}
                  </text>
                  {/* Module Name */}
                  <text
                    y={8}
                    textAnchor="middle"
                    className="text-[11px] font-medium fill-current"
                  >
                    {node.nameZh}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Node Detail Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-[var(--background)]/95 backdrop-blur border-t border-[var(--glass-border)] p-4"
          >
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-2 right-2 p-1 rounded hover:bg-[var(--glass-bg)]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: selectedNode.color }}
              >
                {selectedNode.id}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">
                  {selectedNode.nameZh}{" "}
                  <span className="text-[var(--muted-foreground)] font-normal">
                    {selectedNode.name}
                  </span>
                </h4>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  {selectedNode.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedNode.concepts.map((concept) => (
                    <span
                      key={concept}
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{
                        backgroundColor: `${selectedNode.color}20`,
                        color: selectedNode.color,
                      }}
                    >
                      {concept}
                    </span>
                  ))}
                </div>
                <Link
                  href={selectedNode.docPath}
                  className="inline-flex items-center gap-1 mt-3 text-sm text-[var(--neon-cyan)] hover:underline"
                >
                  查看详细文档 →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute top-14 left-3 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)]" />
          <span>点击节点查看详情</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 bg-[var(--glass-border)]" />
          <span>模块关联</span>
        </div>
      </div>
    </div>
  );
}
