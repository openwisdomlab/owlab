"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import {
  Rocket, Compass, Target, Wrench, Shield,
  GraduationCap, BookOpen, BarChart3, Layers,
  ArrowLeft, ExternalLink, ChevronDown, Sparkles, Settings
} from "lucide-react";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { SpaceIcon, MindIcon, EmergenceIcon, PoeticsIcon } from "@/components/icons/LivingModuleIcons";

// Three layers based on 3E framework
const layers = [
  {
    id: "enlighten",
    label: "启智层",
    labelEn: "Enlighten",
    description: "点燃好奇，打开视野",
    descriptionEn: "Spark curiosity, open horizons",
    color: brandColors.neonCyan,
    colorRgb: "0, 217, 255",
    modules: [
      { id: "M01", icon: Rocket, color: brandColors.modules.M01, colorRgb: "139, 92, 246" },
      { id: "M02", icon: Compass, color: brandColors.modules.M02, colorRgb: "0, 217, 255" },
      { id: "M03", icon: Layers, color: brandColors.modules.M03, colorRgb: "16, 185, 129" },
    ],
  },
  {
    id: "empower",
    label: "赋能层",
    labelEn: "Empower",
    description: "提供方法，赋予能力",
    descriptionEn: "Provide methods, empower abilities",
    color: brandColors.violet,
    colorRgb: "139, 92, 246",
    modules: [
      { id: "M04", icon: Target, color: brandColors.modules.M04, colorRgb: "249, 115, 22" },
      { id: "M05", icon: Wrench, color: brandColors.modules.M05, colorRgb: "6, 182, 212" },
      { id: "M06", icon: Shield, color: brandColors.modules.M06, colorRgb: "5, 150, 105" },
    ],
  },
  {
    id: "engage",
    label: "连接层",
    labelEn: "Engage",
    description: "连接现实，产生影响",
    descriptionEn: "Connect to reality, create impact",
    color: brandColors.neonPink,
    colorRgb: "217, 26, 122",
    modules: [
      { id: "M07", icon: GraduationCap, color: brandColors.modules.M07, colorRgb: "245, 158, 11" },
      { id: "M08", icon: BookOpen, color: brandColors.modules.M08, colorRgb: "100, 116, 139" },
      { id: "M09", icon: BarChart3, color: brandColors.modules.M09, colorRgb: "168, 85, 247" },
    ],
  },
];

// Living modules as ambient atmosphere in corners
const livingModules = [
  { id: "L01", position: "top-left", Icon: SpaceIcon, color: brandColors.neonCyan, colorRgb: "0, 217, 255", name: "spaceAsEducator" },
  { id: "L02", position: "top-right", Icon: MindIcon, color: brandColors.violet, colorRgb: "139, 92, 246", name: "extendedMind" },
  { id: "L03", position: "bottom-left", Icon: EmergenceIcon, color: brandColors.emerald, colorRgb: "16, 185, 129", name: "emergentWisdom" },
  { id: "L04", position: "bottom-right", Icon: PoeticsIcon, color: brandColors.neonPink, colorRgb: "217, 26, 122", name: "poeticsOfTechnology" },
];

// Recommended entry points for different user types
const recommendedPaths = [
  {
    id: "newcomer",
    icon: Sparkles,
    module: "M01",
    labelZh: "新手入门",
    labelEn: "New Explorer",
    descZh: "从发射台开始你的探索之旅",
    descEn: "Start your journey from the Launch Pad",
  },
  {
    id: "builder",
    icon: Layers,
    module: "M03",
    labelZh: "空间建设者",
    labelEn: "Space Builder",
    descZh: "直接进入空间站规划",
    descEn: "Jump into Space Station planning",
  },
  {
    id: "operator",
    icon: Settings,
    module: "M08",
    labelZh: "运营管理",
    labelEn: "Operations",
    descZh: "聚焦日常运营与管理",
    descEn: "Focus on daily operations",
  },
];

interface Props {
  locale: string;
}

export default function KnowledgeUniverse({ locale }: Props) {
  const t = useTranslations("explore");
  const tDocs = useTranslations("docs.knowledgeBase");
  const tLiving = useTranslations("home.livingModules");

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [signalRings, setSignalRings] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; z: number; a: number }[]>([]);
  const shootingStarsRef = useRef<{ x: number; y: number; len: number; speed: number; opacity: number }[]>([]);

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        const moduleId = `M0${e.key}`;
        setSelectedModule(moduleId);
      }
      if (e.key === "q" || e.key === "Q") setSelectedModule("L01");
      if (e.key === "w" || e.key === "W") setSelectedModule("L02");
      if (e.key === "e" || e.key === "E") setSelectedModule("L03");
      if (e.key === "r" || e.key === "R") setSelectedModule("L04");
      if (e.key === "Escape") setSelectedModule(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Star field and nebula animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const nebula = nebulaRef.current;
    if (!canvas || !nebula) return;

    const ctx = canvas.getContext("2d");
    const nctx = nebula.getContext("2d");
    if (!ctx || !nctx) return;

    const resize = () => {
      canvas.width = nebula.width = window.innerWidth;
      canvas.height = nebula.height = window.innerHeight;
    };

    const createStars = () => {
      starsRef.current = [];
      const count = window.innerWidth < 768 ? 150 : 400;
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2,
          a: Math.random(),
        });
      }
    };

    let animationId: number;
    const draw = () => {
      if (!ctx || !nctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      nctx.clearRect(0, 0, w, h);

      // Nebula gradient matching 3 layers
      const grad = nctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(0, 217, 255, 0.03)");     // Enlighten - cyan
      grad.addColorStop(0.4, "rgba(139, 92, 246, 0.04)");  // Empower - violet
      grad.addColorStop(0.7, "rgba(217, 26, 122, 0.03)");  // Engage - pink
      grad.addColorStop(1, "transparent");
      nctx.fillStyle = grad;
      nctx.fillRect(0, 0, w, h);

      // Subtle nebula blobs at corners for L01-L04
      const cornerBlobs = [
        { x: w * 0.1, y: h * 0.15, color: "0, 217, 255" },    // L01 top-left
        { x: w * 0.9, y: h * 0.15, color: "139, 92, 246" },   // L02 top-right
        { x: w * 0.1, y: h * 0.85, color: "16, 185, 129" },   // L03 bottom-left
        { x: w * 0.9, y: h * 0.85, color: "217, 26, 122" },   // L04 bottom-right
      ];
      cornerBlobs.forEach(blob => {
        const bgrad = nctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, 250);
        bgrad.addColorStop(0, `rgba(${blob.color}, 0.08)`);
        bgrad.addColorStop(1, "transparent");
        nctx.fillStyle = bgrad;
        nctx.fillRect(0, 0, w, h);
      });

      // Shooting stars
      if (Math.random() < 0.004 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w,
          y: 0,
          len: 50 + Math.random() * 80,
          speed: 6 + Math.random() * 10,
          opacity: 1
        });
      }

      shootingStarsRef.current.forEach(s => {
        s.x += s.speed * 0.5;
        s.y += s.speed;
        s.opacity -= 0.008;
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 0.5, s.y - s.len);
        ctx.stroke();
      });
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.y < h && s.opacity > 0);

      // Stars with twinkling
      ctx.fillStyle = "#fff";
      starsRef.current.forEach((s) => {
        s.y += 0.05 + s.z * 0.1;
        if (s.y > h) s.y = 0;

        ctx.globalAlpha = s.a * (0.3 + 0.4 * Math.abs(Math.sin(Date.now() * 0.001 * s.z + s.a * 10)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.z + 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    draw();
    window.addEventListener("resize", () => {
      resize();
      createStars();
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Trigger signal ring animation
  const triggerSignal = useCallback((e: React.MouseEvent, color: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const id = Date.now();
    setSignalRings(prev => [...prev, { x, y, id, color }]);
    setTimeout(() => setSignalRings(prev => prev.filter(r => r.id !== id)), 1000);
  }, []);

  // Get module link based on ID
  const getModuleLink = (moduleId: string) => {
    if (moduleId.startsWith("L")) {
      const num = parseInt(moduleId.slice(1));
      const paths = ["01-space-as-educator", "02-extended-mind", "03-emergent-wisdom", "04-poetics-of-technology"];
      return `/${locale}/docs/research/${paths[num - 1]}`;
    } else {
      const num = parseInt(moduleId.slice(1));
      const paths = ["01-foundations", "02-governance", "03-space", "04-programs", "05-tools", "06-safety", "07-people", "08-operations", "09-assessment"];
      return `/${locale}/docs/core/${paths[num - 1]}`;
    }
  };

  // Get module info for detail panel
  const getModuleInfo = (moduleId: string) => {
    if (moduleId.startsWith("L")) {
      return livingModules.find(m => m.id === moduleId);
    }
    for (const layer of layers) {
      const mod = layer.modules.find(m => m.id === moduleId);
      if (mod) return { ...mod, layer };
    }
    return null;
  };

  const selectedModuleInfo = selectedModule ? getModuleInfo(selectedModule) : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">
      {/* Nebula canvas */}
      <canvas
        ref={nebulaRef}
        className="absolute inset-0 z-0 opacity-60 blur-[100px] mix-blend-color-dodge"
      />

      {/* Star field canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Cosmic vignette */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px 50px rgba(2, 6, 23, 0.8)" }}
      />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </Link>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <span className="text-sm font-mono tracking-wider text-white/80">
            {t("universe.title")}
          </span>
        </div>
      </motion.div>

      {/* Layer Navigation Sidebar */}
      <motion.div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {layers.map((layer, idx) => {
          const isActive = activeLayer === layer.id;
          return (
            <motion.button
              key={layer.id}
              className="group relative flex items-center justify-end gap-2"
              onClick={() => {
                const el = document.getElementById(`layer-${layer.id}`);
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              onHoverStart={() => setActiveLayer(layer.id)}
              onHoverEnd={() => setActiveLayer(null)}
            >
              {/* Label tooltip */}
              <motion.span
                className="text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: layer.color }}
              >
                {locale === "zh" ? layer.label : layer.labelEn}
              </motion.span>

              {/* Indicator dot */}
              <motion.div
                className="w-2.5 h-2.5 rounded-full border-2 transition-all"
                style={{
                  borderColor: layer.color,
                  background: isActive ? layer.color : "transparent",
                }}
                animate={{
                  scale: isActive ? 1.3 : 1,
                  boxShadow: isActive ? `0 0 12px ${layer.color}` : "none",
                }}
              />

              {/* Connector line (except last) */}
              {idx < layers.length - 1 && (
                <div
                  className="absolute top-full right-[4px] w-0.5 h-3 opacity-20"
                  style={{ background: layer.color }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Recommended Entry Points */}
      <AnimatePresence>
        {showRecommendations && !selectedModule && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-white/40 mr-1">
                {locale === "zh" ? "推荐入口" : "Start here"}:
              </span>
              {recommendedPaths.map((path) => {
                const PathIcon = path.icon;
                const targetModule = layers.reduce<{ color: string } | undefined>(
                  (found, layer) => found || layer.modules.find(m => m.id === path.module),
                  undefined
                );

                return (
                  <motion.button
                    key={path.id}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all"
                    style={{
                      borderColor: withAlpha(targetModule?.color || "#fff", 0.2),
                      background: withAlpha(targetModule?.color || "#fff", 0.05),
                    }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: withAlpha(targetModule?.color || "#fff", 0.5),
                      background: withAlpha(targetModule?.color || "#fff", 0.15),
                    }}
                    onClick={() => {
                      setSelectedModule(path.module);
                      setShowRecommendations(false);
                    }}
                  >
                    <PathIcon size={12} style={{ color: targetModule?.color }} />
                    <span className="text-xs" style={{ color: targetModule?.color }}>
                      {locale === "zh" ? path.labelZh : path.labelEn}
                    </span>

                    {/* Hover tooltip */}
                    <motion.div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: withAlpha(targetModule?.color || "#fff", 0.2),
                        color: targetModule?.color,
                      }}
                    >
                      {locale === "zh" ? path.descZh : path.descEn}
                    </motion.div>
                  </motion.button>
                );
              })}

              {/* Close button */}
              <button
                className="ml-1 text-white/30 hover:text-white/60 transition-colors"
                onClick={() => setShowRecommendations(false)}
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Living Modules - Corner Atmosphere */}
      {livingModules.map((module) => {
        const positionStyles: Record<string, React.CSSProperties> = {
          "top-left": { top: "12%", left: "6%" },
          "top-right": { top: "12%", right: "6%" },
          "bottom-left": { bottom: "12%", left: "6%" },
          "bottom-right": { bottom: "12%", right: "6%" },
        };
        const isHovered = hoveredModule === module.id;
        const isSelected = selectedModule === module.id;
        const Icon = module.Icon;

        return (
          <motion.div
            key={module.id}
            className="fixed z-30 cursor-pointer"
            style={positionStyles[module.position]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            onHoverStart={() => setHoveredModule(module.id)}
            onHoverEnd={() => setHoveredModule(null)}
            onClick={(e) => {
              setSelectedModule(module.id);
              triggerSignal(e, module.color);
            }}
          >
            {/* Ambient glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 200,
                height: 200,
                left: -70,
                top: -70,
                background: `radial-gradient(circle, ${withAlpha(module.color, 0.1)}, transparent 70%)`,
                filter: "blur(30px)",
              }}
              animate={{
                scale: isHovered ? [1, 1.15, 1] : [1, 1.05, 1],
                opacity: isHovered || isSelected ? 0.8 : 0.4,
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            {/* Icon container */}
            <motion.div
              className="relative w-16 h-16 flex items-center justify-center rounded-full border"
              style={{
                background: `radial-gradient(circle, ${withAlpha(module.color, 0.1)}, transparent)`,
                borderColor: withAlpha(module.color, isHovered ? 0.5 : 0.2),
              }}
              whileHover={{ scale: 1.1 }}
              animate={{
                boxShadow: isHovered || isSelected
                  ? `0 0 30px ${withAlpha(module.color, 0.4)}`
                  : `0 0 15px ${withAlpha(module.color, 0.15)}`,
              }}
            >
              <Icon className="w-8 h-8" color={module.color} isHovered={isHovered} />
            </motion.div>

            {/* Label */}
            <motion.div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap"
              style={{ color: module.color }}
              animate={{ opacity: isHovered || isSelected ? 1 : 0.5 }}
            >
              {module.id}
            </motion.div>
          </motion.div>
        );
      })}

      {/* Main content - Three Layer Layout */}
      <motion.div
        className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center py-24 px-4"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        <div className="flex flex-col items-center gap-8 max-w-4xl w-full">
          {layers.map((layer, layerIdx) => (
            <motion.div
              key={layer.id}
              id={`layer-${layer.id}`}
              className="w-full scroll-mt-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + layerIdx * 0.15 }}
              onViewportEnter={() => setActiveLayer(layer.id)}
            >
              {/* Layer container */}
              <div
                className="relative rounded-2xl border p-6 backdrop-blur-sm"
                style={{
                  background: `linear-gradient(135deg, ${withAlpha(layer.color, 0.05)}, transparent)`,
                  borderColor: withAlpha(layer.color, 0.2),
                }}
              >
                {/* Layer glow */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 60px ${withAlpha(layer.color, 0.05)}, 0 0 40px ${withAlpha(layer.color, 0.08)}`,
                  }}
                />

                {/* Layer header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ background: layer.color }}
                  />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold" style={{ color: layer.color }}>
                        {layer.label}
                      </span>
                      <span className="text-xs font-mono text-white/40 uppercase tracking-wider">
                        {layer.labelEn}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{layer.description}</p>
                  </div>
                </div>

                {/* Modules grid */}
                <div className="grid grid-cols-3 gap-4">
                  {layer.modules.map((module) => {
                    const isHovered = hoveredModule === module.id;
                    const isSelected = selectedModule === module.id;
                    const Icon = module.icon;

                    return (
                      <motion.div
                        key={module.id}
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onHoverStart={() => setHoveredModule(module.id)}
                        onHoverEnd={() => setHoveredModule(null)}
                        onClick={(e) => {
                          setSelectedModule(module.id);
                          triggerSignal(e, module.color);
                        }}
                      >
                        <motion.div
                          className="flex flex-col items-center gap-3 p-4 rounded-xl border transition-all"
                          style={{
                            background: isHovered || isSelected
                              ? withAlpha(module.color, 0.1)
                              : "rgba(255,255,255,0.02)",
                            borderColor: isHovered || isSelected
                              ? withAlpha(module.color, 0.4)
                              : "rgba(255,255,255,0.05)",
                            boxShadow: isHovered || isSelected
                              ? `0 0 25px ${withAlpha(module.color, 0.2)}`
                              : "none",
                          }}
                        >
                          {/* Module icon */}
                          <motion.div
                            className="w-14 h-14 rounded-full flex items-center justify-center border"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, ${withAlpha(module.color, 0.6)}, ${withAlpha(module.color, 0.3)})`,
                              borderColor: withAlpha(module.color, 0.4),
                            }}
                            animate={{
                              boxShadow: isHovered || isSelected
                                ? `0 0 20px ${withAlpha(module.color, 0.5)}`
                                : `0 0 10px ${withAlpha(module.color, 0.2)}`,
                            }}
                          >
                            <Icon size={24} className="text-white/90" />
                          </motion.div>

                          {/* Module ID */}
                          <span
                            className="text-sm font-mono font-bold"
                            style={{ color: module.color }}
                          >
                            {module.id}
                          </span>

                          {/* Module title */}
                          <span className="text-xs text-white/60 text-center line-clamp-1">
                            {tDocs(`modules.${module.id}.title`)}
                          </span>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Flow arrow between layers */}
              {layerIdx < layers.length - 1 && (
                <motion.div
                  className="flex justify-center py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + layerIdx * 0.15 }}
                >
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ChevronDown
                      size={24}
                      className="text-white/20"
                    />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Signal rings animation */}
      <AnimatePresence>
        {signalRings.map(ring => (
          <motion.div
            key={ring.id}
            className="fixed rounded-full border-2 pointer-events-none z-[100]"
            style={{
              left: ring.x,
              top: ring.y,
              borderColor: ring.color,
            }}
            initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 1 }}
            animate={{ width: 150, height: 150, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.1, 0.5, 0.5, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Module Detail Panel */}
      <AnimatePresence>
        {selectedModule && selectedModuleInfo && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="max-w-2xl mx-auto rounded-2xl border backdrop-blur-xl p-5"
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                borderColor: `rgba(${(selectedModuleInfo as { colorRgb: string }).colorRgb}, 0.3)`,
                boxShadow: `0 0 60px rgba(${(selectedModuleInfo as { colorRgb: string }).colorRgb}, 0.15)`,
              }}
            >
              {/* Scanline effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-15"
                style={{
                  backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)`,
                  backgroundSize: "100% 2px",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Layer badge for core modules */}
                    {"layer" in selectedModuleInfo && (
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                        style={{
                          color: (selectedModuleInfo as { layer: typeof layers[0] }).layer.color,
                          borderColor: withAlpha((selectedModuleInfo as { layer: typeof layers[0] }).layer.color, 0.3),
                          background: withAlpha((selectedModuleInfo as { layer: typeof layers[0] }).layer.color, 0.1),
                        }}
                      >
                        {(selectedModuleInfo as { layer: typeof layers[0] }).layer.labelEn}
                      </span>
                    )}
                    <span
                      className="text-xl font-bold"
                      style={{ color: (selectedModuleInfo as { color: string }).color }}
                    >
                      {selectedModule}
                    </span>
                    <span className="text-lg text-white/90">
                      {selectedModule.startsWith("L")
                        ? tLiving(`modules.${(selectedModuleInfo as typeof livingModules[0]).name}.title`)
                        : tDocs(`modules.${selectedModule}.title`)
                      }
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedModule(null)}
                    className="text-white/40 hover:text-white/80 transition-colors text-sm"
                  >
                    ESC
                  </button>
                </div>

                {/* Layer description for core modules */}
                {"layer" in selectedModuleInfo && (
                  <p className="text-xs text-white/40 mb-2">
                    {locale === "zh"
                      ? (selectedModuleInfo as { layer: typeof layers[0] }).layer.description
                      : (selectedModuleInfo as { layer: typeof layers[0] }).layer.descriptionEn
                    }
                  </p>
                )}

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {selectedModule.startsWith("L")
                    ? tLiving(`modules.${(selectedModuleInfo as typeof livingModules[0]).name}.subtitle`)
                    : tDocs(`modules.${selectedModule}.description`)
                  }
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={getModuleLink(selectedModule)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: `rgba(${(selectedModuleInfo as { colorRgb: string }).colorRgb}, 0.2)`,
                      color: (selectedModuleInfo as { color: string }).color,
                      border: `1px solid rgba(${(selectedModuleInfo as { colorRgb: string }).colorRgb}, 0.3)`,
                    }}
                  >
                    {t("universe.explore")}
                    <ExternalLink size={14} />
                  </Link>

                  {/* Module navigation for core modules */}
                  {selectedModule.startsWith("M") && (
                    <div className="flex items-center gap-2">
                      {(() => {
                        const currentNum = parseInt(selectedModule.slice(1));
                        const prevModule = currentNum > 1 ? `M0${currentNum - 1}` : null;
                        const nextModule = currentNum < 9 ? `M0${currentNum + 1}` : null;
                        const prevInfo = prevModule ? getModuleInfo(prevModule) : null;
                        const nextInfo = nextModule ? getModuleInfo(nextModule) : null;

                        return (
                          <>
                            {prevModule && prevInfo && (
                              <motion.button
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                                style={{
                                  color: (prevInfo as { color: string }).color,
                                  background: withAlpha((prevInfo as { color: string }).color, 0.1),
                                }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedModule(prevModule)}
                              >
                                ← {prevModule}
                              </motion.button>
                            )}
                            {nextModule && nextInfo && (
                              <motion.button
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all"
                                style={{
                                  color: (nextInfo as { color: string }).color,
                                  background: withAlpha((nextInfo as { color: string }).color, 0.1),
                                }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedModule(nextModule)}
                              >
                                {nextModule} →
                              </motion.button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hints */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 text-xs text-white/30 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="hidden md:inline">
          {t("universe.nav.hint")}
        </span>
      </motion.div>
    </div>
  );
}
