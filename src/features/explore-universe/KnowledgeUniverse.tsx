"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import {
  Rocket, Compass, Target, Wrench, Shield,
  GraduationCap, BookOpen, BarChart3, Layers,
  ArrowLeft, ExternalLink, Sparkles, Settings,
  AlertTriangle
} from "lucide-react";

// Deterministic PRNG for consistent particles across renders
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { SpaceIcon, MindIcon, EmergenceIcon, PoeticsIcon } from "@/components/icons/LivingModuleIcons";
import { ConnectionsLayer } from "./ConnectionLine";
import StationFrame from "./StationFrame";
import StationHUD from "./StationHUD";
import EnvironmentEffects from "./EnvironmentEffects";
import {
  moduleConnections,
  deckLayers,
  blueprintLayout,
  recommendedPaths,
  getConnectedLModules,
  getDeckForModule,
} from "./module-connections";

// M module icons mapping
const mModuleIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  M01: Rocket,
  M02: Compass,
  M03: Layers,
  M04: Target,
  M05: Wrench,
  M06: Shield,
  M07: GraduationCap,
  M08: BookOpen,
  M09: BarChart3,
};

// L module icons mapping
const lModuleIcons: Record<string, React.ComponentType<{ className?: string; color?: string; isHovered?: boolean }>> = {
  L01: SpaceIcon,
  L02: MindIcon,
  L03: EmergenceIcon,
  L04: PoeticsIcon,
};

// M module colors
const mModuleColors: Record<string, { color: string; colorRgb: string }> = {
  M01: { color: brandColors.modules.M01, colorRgb: "139, 92, 246" },
  M02: { color: brandColors.modules.M02, colorRgb: "0, 217, 255" },
  M03: { color: brandColors.modules.M03, colorRgb: "16, 185, 129" },
  M04: { color: brandColors.modules.M04, colorRgb: "249, 115, 22" },
  M05: { color: brandColors.modules.M05, colorRgb: "6, 182, 212" },
  M06: { color: brandColors.modules.M06, colorRgb: "5, 150, 105" },
  M07: { color: brandColors.modules.M07, colorRgb: "245, 158, 11" },
  M08: { color: brandColors.modules.M08, colorRgb: "100, 116, 139" },
  M09: { color: brandColors.modules.M09, colorRgb: "168, 85, 247" },
};

interface Props {
  locale: string;
}

export default function KnowledgeUniverse({ locale }: Props) {
  const t = useTranslations("explore");
  const tDocs = useTranslations("docs.knowledgeBase");
  const tLiving = useTranslations("home.livingModules");
  const reduceMotion = useReducedMotion();

  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [normalizedMouse, setNormalizedMouse] = useState({ x: 0, y: 0 }); // -0.5..0.5
  const [signalRings, setSignalRings] = useState<{ x: number; y: number; id: number; color: string }[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1200, height: 800 });
  const [viewport, setViewport] = useState({ w: 1200, h: 800 });
  const [alertOn, setAlertOn] = useState(false);

  // Generate dust particles with depth
  const dustParticles = useMemo(() => {
    const rnd = mulberry32(1337);
    return Array.from({ length: 24 }, () => {
      const z = rnd(); // depth 0..1
      return {
        top: rnd() * 100,
        left: rnd() * 100,
        z,
        size: 1 + z * 3,
        opacity: 0.03 + z * 0.08,
        blur: z > 0.7 ? "blur-sm" : z > 0.4 ? "blur-[1px]" : "",
        drift: 6 + z * 14,
        dur: 10 + rnd() * 12,
        delay: rnd() * 4,
      };
    });
  }, []);

  // Parallax amounts based on mouse position
  const deepParallax = useMemo(() => ({
    x: reduceMotion ? 0 : normalizedMouse.x * -20,
    y: reduceMotion ? 0 : normalizedMouse.y * -20,
  }), [normalizedMouse, reduceMotion]);

  const midParallax = useMemo(() => ({
    x: reduceMotion ? 0 : normalizedMouse.x * -10,
    y: reduceMotion ? 0 : normalizedMouse.y * -10,
  }), [normalizedMouse, reduceMotion]);

  // Compute active system (L module) based on selection or hover
  const activeSystem = useMemo(() => {
    if (selectedModule?.startsWith("L")) return selectedModule;
    if (hoveredModule?.startsWith("L")) return hoveredModule;
    if (selectedModule?.startsWith("M")) {
      const connectedLs = getConnectedLModules(selectedModule);
      return connectedLs[0] || null;
    }
    if (hoveredModule?.startsWith("M")) {
      const connectedLs = getConnectedLModules(hoveredModule);
      return connectedLs[0] || null;
    }
    return null;
  }, [selectedModule, hoveredModule]);

  // Focus scale for spatial depth effect
  const focusScale = selectedModule ? 0.98 : 1;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<{ x: number; y: number; z: number; a: number }[]>([]);
  const shootingStarsRef = useRef<{ x: number; y: number; len: number; speed: number; opacity: number }[]>([]);

  // Build connection data for SVG
  const connectionData = useMemo(() => {
    const connections: {
      lId: string;
      mId: string;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
      color: string;
      colorRgb: string;
    }[] = [];

    for (const [lId, data] of Object.entries(moduleConnections)) {
      const lPos = blueprintLayout.lModules[lId as keyof typeof blueprintLayout.lModules];
      for (const mId of data.targets) {
        const mPos = blueprintLayout.mModules[mId as keyof typeof blueprintLayout.mModules];
        if (lPos && mPos) {
          connections.push({
            lId,
            mId,
            fromX: lPos.x,
            fromY: lPos.y,
            toX: mPos.x,
            toY: mPos.y,
            color: data.color,
            colorRgb: data.colorRgb,
          });
        }
      }
    }
    return connections;
  }, []);

  // Handle SVG resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        // Maintain aspect ratio but fit container
        const aspectRatio = blueprintLayout.viewBox.width / blueprintLayout.viewBox.height;
        if (width / height > aspectRatio) {
          setSvgDimensions({ width: height * aspectRatio, height });
        } else {
          setSvgDimensions({ width, height: width / aspectRatio });
        }
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse parallax and viewport tracking
  useEffect(() => {
    const updateViewport = () => {
      setViewport({ w: window.innerWidth || 1, h: window.innerHeight || 1 });
    };
    updateViewport();

    const handleMouse = (e: MouseEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      // Normalized -0.5 to 0.5
      const nx = e.clientX / w - 0.5;
      const ny = e.clientY / h - 0.5;
      setNormalizedMouse({ x: nx, y: ny });
      setMousePos({ x: nx * 15, y: ny * 15 });
    };

    window.addEventListener("mousemove", handleMouse, { passive: true });
    window.addEventListener("resize", updateViewport);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  // Alert flash timer (occasional)
  useEffect(() => {
    const alertInterval = setInterval(() => {
      setAlertOn(true);
      setTimeout(() => setAlertOn(false), 800);
    }, 15000); // Flash every 15 seconds
    return () => clearInterval(alertInterval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        setSelectedModule(`M0${e.key}`);
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
      const count = window.innerWidth < 768 ? 150 : 350;
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

      // Blueprint-style gradient (darker, more technical)
      const grad = nctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, "rgba(0, 40, 80, 0.15)");
      grad.addColorStop(0.5, "rgba(0, 20, 50, 0.1)");
      grad.addColorStop(1, "transparent");
      nctx.fillStyle = grad;
      nctx.fillRect(0, 0, w, h);

      // Drifting nebula clouds
      const time = Date.now() * 0.0001;
      const nebulaClouds = [
        { x: w * 0.3 + Math.sin(time) * 50, y: h * 0.25, size: 300, color: "0, 100, 150", opacity: 0.06 },
        { x: w * 0.7 + Math.cos(time * 0.7) * 40, y: h * 0.6, size: 250, color: "80, 40, 120", opacity: 0.05 },
        { x: w * 0.5 + Math.sin(time * 0.5) * 60, y: h * 0.8, size: 350, color: "20, 60, 100", opacity: 0.04 },
      ];
      nebulaClouds.forEach(cloud => {
        const cloudGrad = nctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size);
        cloudGrad.addColorStop(0, `rgba(${cloud.color}, ${cloud.opacity})`);
        cloudGrad.addColorStop(0.5, `rgba(${cloud.color}, ${cloud.opacity * 0.5})`);
        cloudGrad.addColorStop(1, "transparent");
        nctx.fillStyle = cloudGrad;
        nctx.fillRect(0, 0, w, h);
      });

      // Corner glows for L modules
      const cornerGlows = [
        { x: w * 0.08, y: h * 0.15, color: "0, 217, 255" },
        { x: w * 0.92, y: h * 0.15, color: "139, 92, 246" },
        { x: w * 0.08, y: h * 0.85, color: "16, 185, 129" },
        { x: w * 0.92, y: h * 0.85, color: "217, 26, 122" },
      ];
      cornerGlows.forEach(glow => {
        const bgrad = nctx.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, 200);
        bgrad.addColorStop(0, `rgba(${glow.color}, 0.12)`);
        bgrad.addColorStop(1, "transparent");
        nctx.fillStyle = bgrad;
        nctx.fillRect(0, 0, w, h);
      });

      // Shooting stars
      if (Math.random() < 0.003 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w,
          y: 0,
          len: 40 + Math.random() * 60,
          speed: 5 + Math.random() * 8,
          opacity: 1
        });
      }

      shootingStarsRef.current.forEach(s => {
        s.x += s.speed * 0.5;
        s.y += s.speed;
        s.opacity -= 0.01;
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 0.5, s.y - s.len);
        ctx.stroke();
      });
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.y < h && s.opacity > 0);

      // Stars
      ctx.fillStyle = "#fff";
      starsRef.current.forEach((s) => {
        s.y += 0.03 + s.z * 0.05;
        if (s.y > h) s.y = 0;

        ctx.globalAlpha = s.a * (0.2 + 0.3 * Math.abs(Math.sin(Date.now() * 0.001 * s.z + s.a * 10)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.z + 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    draw();
    window.addEventListener("resize", () => { resize(); createStars(); });

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Trigger signal ring
  const triggerSignal = useCallback((x: number, y: number, color: string) => {
    const id = Date.now();
    setSignalRings(prev => [...prev, { x, y, id, color }]);
    setTimeout(() => setSignalRings(prev => prev.filter(r => r.id !== id)), 1000);
  }, []);

  // Get module link
  const getModuleLink = (moduleId: string) => {
    if (moduleId.startsWith("L")) {
      const paths = ["01-space-as-educator", "02-extended-mind", "03-emergent-wisdom", "04-poetics-of-technology"];
      return `/${locale}/docs/research/${paths[parseInt(moduleId.slice(1)) - 1]}`;
    }
    const paths = ["01-foundations", "02-governance", "03-space", "04-programs", "05-tools", "06-safety", "07-people", "08-operations", "09-assessment"];
    return `/${locale}/docs/core/${paths[parseInt(moduleId.slice(1)) - 1]}`;
  };

  // Get connected modules for display
  const getConnectionInfo = (moduleId: string) => {
    if (moduleId.startsWith("L")) {
      const conn = moduleConnections[moduleId as keyof typeof moduleConnections];
      return conn ? { type: "powers", targets: conn.targets } : null;
    }
    const connected = getConnectedLModules(moduleId);
    return connected.length > 0 ? { type: "powered-by", targets: connected } : null;
  };

  // Calculate SVG position to screen position
  const svgToScreen = (svgX: number, svgY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = svgDimensions.width / blueprintLayout.viewBox.width;
    const scaleY = svgDimensions.height / blueprintLayout.viewBox.height;
    const offsetX = (rect.width - svgDimensions.width) / 2;
    const offsetY = (rect.height - svgDimensions.height) / 2;
    return {
      x: rect.left + offsetX + svgX * scaleX,
      y: rect.top + offsetY + svgY * scaleY,
    };
  };

  const selectedInfo = selectedModule ? {
    isL: selectedModule.startsWith("L"),
    color: selectedModule.startsWith("L")
      ? moduleConnections[selectedModule as keyof typeof moduleConnections]?.color || brandColors.neonCyan
      : mModuleColors[selectedModule]?.color || "#fff",
    colorRgb: selectedModule.startsWith("L")
      ? moduleConnections[selectedModule as keyof typeof moduleConnections]?.colorRgb || "0, 217, 255"
      : mModuleColors[selectedModule]?.colorRgb || "255, 255, 255",
  } : null;

  // Camera drift animation
  const cameraAnim = reduceMotion
    ? { x: 0, y: 0, rotateZ: 0 }
    : {
        x: [0, 1, -0.6, 0.4, 0],
        y: [0, -0.7, 0.8, -0.3, 0],
        rotateZ: [0, 0.1, -0.08, 0.05, 0],
      };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative cursor-none">
      {/* Camera rig with subtle drift */}
      <motion.div
        className="absolute inset-0"
        animate={cameraAnim}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Layer 1: Deep space (strongest parallax) */}
        <motion.div
          className="absolute inset-0"
          animate={{ x: deepParallax.x, y: deepParallax.y, scale: 1.04 }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          {/* Nebula canvas */}
          <canvas
            ref={nebulaRef}
            className="absolute inset-0 z-0 opacity-70 blur-[80px] mix-blend-screen"
          />

          {/* Star field canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 z-0" />

          {/* Nebula blobs */}
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl mix-blend-screen" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-500/8 blur-3xl mix-blend-screen" />
        </motion.div>

        {/* Layer 2: Mid space - Planet limb */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ x: midParallax.x, y: midParallax.y }}
          transition={{ type: "tween", duration: 0.1 }}
        >
          <div className="absolute -bottom-1/3 -left-1/4 h-2/3 w-[140%] opacity-30">
            <div className="h-full w-full rounded-[100%] bg-gradient-to-t from-cyan-900/50 via-slate-950 to-transparent border-t border-cyan-500/20" />
          </div>
        </motion.div>

        {/* Blueprint grid overlay */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 217, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 217, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Cockpit frame vignette */}
        <div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{ boxShadow: "inset 0 0 200px 80px rgba(2, 6, 23, 0.9)" }}
        />

        {/* Glass glare effects */}
        <div className="pointer-events-none absolute inset-0 z-[11]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-40" />
          <div className="absolute -left-1/4 top-0 h-full w-1/2 rotate-12 bg-white/3 blur-2xl opacity-30" />
        </div>

        {/* Dust motes with depth */}
        <div className="pointer-events-none absolute inset-0 z-[12]">
          {dustParticles.map((p, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-white ${p.blur}`}
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                opacity: p.opacity,
              }}
              animate={
                reduceMotion
                  ? { x: 0, y: 0 }
                  : { x: [0, p.drift, 0], y: [0, -p.drift * 0.6, 0] }
              }
              transition={{
                duration: p.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: p.delay,
              }}
            />
          ))}
        </div>

      {/* Station Frame (cabin walls) */}
      <StationFrame
        activeSystem={activeSystem}
        hoveredSystem={hoveredModule?.startsWith("L") ? hoveredModule : null}
      />

      {/* Environment Effects (ambient lighting, pipes, debris) */}
      <EnvironmentEffects activeSystem={activeSystem} />

      {/* Station HUD (top status bar) */}
      <StationHUD
        locale={locale}
        activeSystem={activeSystem}
        hoveredSystem={hoveredModule}
        selectedModule={selectedModule}
        onSystemClick={(systemId) => {
          setSelectedModule(systemId);
          setShowRecommendations(false);
        }}
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

      {/* Recommended Entry Points */}
      <AnimatePresence>
        {showRecommendations && !selectedModule && (
          <motion.div
            className="fixed top-24 left-1/2 -translate-x-1/2 z-40"
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
                const PathIcon = path.id === "newcomer" ? Sparkles : path.id === "builder" ? Layers : Settings;
                const targetColor = mModuleColors[path.module]?.color || "#fff";

                return (
                  <motion.button
                    key={path.id}
                    className="group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all"
                    style={{
                      borderColor: withAlpha(targetColor, 0.2),
                      background: withAlpha(targetColor, 0.05),
                    }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: withAlpha(targetColor, 0.5),
                      background: withAlpha(targetColor, 0.15),
                    }}
                    onClick={() => {
                      setSelectedModule(path.module);
                      setShowRecommendations(false);
                    }}
                  >
                    <PathIcon size={12} style={{ color: targetColor }} />
                    <span className="text-xs" style={{ color: targetColor }}>
                      {locale === "zh" ? path.label.zh : path.label.en}
                    </span>
                  </motion.button>
                );
              })}
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

      {/* Main Blueprint SVG */}
      <motion.div
        ref={containerRef}
        className="relative z-20 w-full h-screen flex items-center justify-center p-8"
        animate={{
          scale: focusScale,
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{
          scale: { duration: 0.5, ease: "easeOut" },
          x: { duration: 0 },
          y: { duration: 0 },
        }}
      >
        <svg
          viewBox={`0 0 ${blueprintLayout.viewBox.width} ${blueprintLayout.viewBox.height}`}
          width={svgDimensions.width}
          height={svgDimensions.height}
          className="max-w-full max-h-full"
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Deck labels and dividers */}
          {Object.entries(deckLayers).map(([deckId, deck], idx) => {
            const yStart = 150 + idx * 200;
            return (
              <g key={deckId}>
                {/* Deck background */}
                <rect
                  x={blueprintLayout.gridArea.x}
                  y={yStart}
                  width={blueprintLayout.gridArea.width}
                  height={180}
                  fill={withAlpha(deck.color, 0.03)}
                  stroke={withAlpha(deck.color, 0.1)}
                  strokeWidth={1}
                  rx={12}
                />
                {/* Deck label */}
                <text
                  x={blueprintLayout.gridArea.x - 10}
                  y={yStart + 90}
                  fill={deck.color}
                  fontSize={12}
                  fontFamily="monospace"
                  textAnchor="end"
                  opacity={0.6}
                >
                  {locale === "zh" ? deck.label.zh : deck.label.en}
                </text>
              </g>
            );
          })}

          {/* Connection lines layer */}
          <ConnectionsLayer
            connections={connectionData}
            hoveredModule={hoveredModule}
            selectedModule={selectedModule}
          />

          {/* L Modules (corner core systems) */}
          {Object.entries(blueprintLayout.lModules).map(([lId, pos]) => {
            const conn = moduleConnections[lId as keyof typeof moduleConnections];
            const isHovered = hoveredModule === lId;
            const isSelected = selectedModule === lId;
            const isRelated = !!(selectedModule && selectedModule.startsWith("M") && conn.targets.includes(selectedModule));
            const isActive = isHovered || isSelected || isRelated;
            const Icon = lModuleIcons[lId];
            const dimmed = selectedModule && !isActive && selectedModule !== lId;

            return (
              <g
                key={lId}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredModule(lId)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => {
                  setSelectedModule(lId);
                  const screenPos = svgToScreen(pos.x, pos.y);
                  triggerSignal(screenPos.x, screenPos.y, conn.color);
                }}
                opacity={dimmed ? 0.3 : 1}
              >
                {/* Outer glow ring */}
                <motion.circle
                  r={isActive ? 55 : 45}
                  fill="none"
                  stroke={conn.color}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 0.4 : 0.15}
                  filter="url(#glow)"
                  animate={{
                    r: isActive ? [55, 60, 55] : [45, 48, 45],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* Core circle */}
                <circle
                  r={35}
                  fill={withAlpha(conn.color, 0.15)}
                  stroke={conn.color}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 1 : 0.6}
                />
                {/* Icon */}
                <foreignObject x={-20} y={-20} width={40} height={40}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-8 h-8" color={conn.color} isHovered={isActive} />
                  </div>
                </foreignObject>
                {/* Label */}
                <text
                  y={55}
                  fill={conn.color}
                  fontSize={10}
                  fontFamily="monospace"
                  textAnchor="middle"
                  opacity={isActive ? 1 : 0.6}
                >
                  {lId}
                </text>
                {/* Station role */}
                <text
                  y={68}
                  fill={conn.color}
                  fontSize={9}
                  textAnchor="middle"
                  opacity={isActive ? 0.8 : 0.4}
                >
                  {locale === "zh" ? conn.stationRole.zh : conn.stationRole.en}
                </text>
              </g>
            );
          })}

          {/* M Modules (central compartments) */}
          {Object.entries(blueprintLayout.mModules).map(([mId, pos]) => {
            const colors = mModuleColors[mId];
            const Icon = mModuleIcons[mId];
            const isHovered = hoveredModule === mId;
            const isSelected = selectedModule === mId;
            const connectedLs = getConnectedLModules(mId);
            const isRelated = !!(selectedModule && selectedModule.startsWith("L") && connectedLs.includes(selectedModule));
            const isActive = isHovered || isSelected || isRelated;
            const dimmed = selectedModule && !isActive && selectedModule !== mId;

            return (
              <g
                key={mId}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredModule(mId)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => {
                  setSelectedModule(mId);
                  const screenPos = svgToScreen(pos.x, pos.y);
                  triggerSignal(screenPos.x, screenPos.y, colors.color);
                }}
                opacity={dimmed ? 0.3 : 1}
              >
                {/* Compartment background */}
                <motion.rect
                  x={-55}
                  y={-45}
                  width={110}
                  height={90}
                  rx={12}
                  fill={withAlpha(colors.color, isActive ? 0.15 : 0.05)}
                  stroke={colors.color}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 1 : 0.5}
                  animate={isActive ? {
                    boxShadow: `0 0 20px ${colors.color}`,
                  } : {}}
                />
                {/* Icon circle */}
                <circle
                  cy={-8}
                  r={22}
                  fill={withAlpha(colors.color, 0.3)}
                  stroke={colors.color}
                  strokeWidth={1}
                  opacity={0.8}
                />
                {/* Icon */}
                <foreignObject x={-14} y={-22} width={28} height={28}>
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon size={20} className="text-white/90" />
                  </div>
                </foreignObject>
                {/* Module ID */}
                <text
                  y={25}
                  fill={colors.color}
                  fontSize={12}
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {mId}
                </text>
                {/* Module title (abbreviated) */}
                <text
                  y={38}
                  fill="white"
                  fontSize={9}
                  textAnchor="middle"
                  opacity={0.6}
                >
                  {tDocs(`modules.${mId}.title`).slice(0, 8)}
                </text>
              </g>
            );
          })}
        </svg>
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
            animate={{ width: 120, height: 120, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      {/* Module Detail Panel */}
      <AnimatePresence>
        {selectedModule && selectedInfo && (
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
                background: "rgba(15, 23, 42, 0.95)",
                borderColor: `rgba(${selectedInfo.colorRgb}, 0.3)`,
                boxShadow: `0 0 60px rgba(${selectedInfo.colorRgb}, 0.15)`,
              }}
            >
              {/* Scanline effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)`,
                  backgroundSize: "100% 2px",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Module type badge */}
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border"
                      style={{
                        color: selectedInfo.color,
                        borderColor: withAlpha(selectedInfo.color, 0.3),
                        background: withAlpha(selectedInfo.color, 0.1),
                      }}
                    >
                      {selectedInfo.isL
                        ? (locale === "zh" ? "核心系统" : "Core System")
                        : (locale === "zh" ? getDeckForModule(selectedModule) && deckLayers[getDeckForModule(selectedModule)!].label.zh : getDeckForModule(selectedModule) && deckLayers[getDeckForModule(selectedModule)!].label.en)
                      }
                    </span>
                    <span className="text-xl font-bold" style={{ color: selectedInfo.color }}>
                      {selectedModule}
                    </span>
                    <span className="text-lg text-white/90">
                      {selectedInfo.isL
                        ? tLiving(`modules.${selectedModule === "L01" ? "spaceAsEducator" : selectedModule === "L02" ? "extendedMind" : selectedModule === "L03" ? "emergentWisdom" : "poeticsOfTechnology"}.title`)
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

                {/* Connection info */}
                {(() => {
                  const connInfo = getConnectionInfo(selectedModule);
                  if (!connInfo) return null;
                  return (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-white/40">
                        {connInfo.type === "powers"
                          ? (locale === "zh" ? "为以下模块供能:" : "Powers:")
                          : (locale === "zh" ? "由以下系统支撑:" : "Powered by:")
                        }
                      </span>
                      {connInfo.targets.map(targetId => {
                        const targetColor = targetId.startsWith("L")
                          ? moduleConnections[targetId as keyof typeof moduleConnections]?.color
                          : mModuleColors[targetId]?.color;
                        return (
                          <button
                            key={targetId}
                            className="text-xs px-2 py-0.5 rounded-full border transition-all hover:scale-105"
                            style={{
                              borderColor: withAlpha(targetColor || "#fff", 0.3),
                              color: targetColor,
                            }}
                            onClick={() => setSelectedModule(targetId)}
                          >
                            {targetId}
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {selectedInfo.isL
                    ? tLiving(`modules.${selectedModule === "L01" ? "spaceAsEducator" : selectedModule === "L02" ? "extendedMind" : selectedModule === "L03" ? "emergentWisdom" : "poeticsOfTechnology"}.subtitle`)
                    : tDocs(`modules.${selectedModule}.description`)
                  }
                </p>

                <div className="flex items-center justify-between">
                  <Link
                    href={getModuleLink(selectedModule)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: `rgba(${selectedInfo.colorRgb}, 0.2)`,
                      color: selectedInfo.color,
                      border: `1px solid rgba(${selectedInfo.colorRgb}, 0.3)`,
                    }}
                  >
                    {t("universe.explore")}
                    <ExternalLink size={14} />
                  </Link>

                  {/* Module navigation */}
                  {!selectedInfo.isL && (
                    <div className="flex items-center gap-2">
                      {(() => {
                        const num = parseInt(selectedModule.slice(1));
                        const prev = num > 1 ? `M0${num - 1}` : null;
                        const next = num < 9 ? `M0${num + 1}` : null;
                        return (
                          <>
                            {prev && (
                              <motion.button
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{
                                  color: mModuleColors[prev]?.color,
                                  background: withAlpha(mModuleColors[prev]?.color || "#fff", 0.1),
                                }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedModule(prev)}
                              >
                                ← {prev}
                              </motion.button>
                            )}
                            {next && (
                              <motion.button
                                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                                style={{
                                  color: mModuleColors[next]?.color,
                                  background: withAlpha(mModuleColors[next]?.color || "#fff", 0.1),
                                }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setSelectedModule(next)}
                              >
                                {next} →
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

      {/* Post FX: Scanlines overlay */}
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-15 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_3px]" />

      {/* Subtle noise texture */}
      <div className="pointer-events-none fixed inset-0 z-[101] opacity-[0.04] bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[length:3px_3px]" />

      {/* Alert flash */}
      <AnimatePresence>
        {alertOn && !reduceMotion && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[102] bg-red-500/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute left-6 top-20 flex items-center gap-2 text-red-400/80 text-xs font-mono">
              <AlertTriangle className="h-4 w-4" />
              {locale === "zh" ? "传感器检测到异常" : "SENSOR ANOMALY DETECTED"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom sci-fi cursor */}
      <div className="pointer-events-none fixed inset-0 z-[200] hidden md:block">
        <motion.div
          className="fixed left-0 top-0 h-8 w-8 -ml-4 -mt-4"
          animate={{
            x: viewport.w * 0.5 + normalizedMouse.x * viewport.w,
            y: viewport.h * 0.5 + normalizedMouse.y * viewport.h,
          }}
          transition={{ type: "tween", duration: 0.05 }}
        >
          <div className="absolute inset-0 rounded-full border border-cyan-400/40" />
          <div className="absolute inset-2 rounded-full border border-cyan-200/60" />
          <div className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          {/* Crosshair lines */}
          <div className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-cyan-400/40" />
          <div className="absolute left-1/2 bottom-0 h-2 w-px -translate-x-1/2 bg-cyan-400/40" />
          <div className="absolute top-1/2 left-0 w-2 h-px -translate-y-1/2 bg-cyan-400/40" />
          <div className="absolute top-1/2 right-0 w-2 h-px -translate-y-1/2 bg-cyan-400/40" />
        </motion.div>
      </div>

      </motion.div>
    </div>
  );
}
