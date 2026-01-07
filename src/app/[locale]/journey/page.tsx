"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Rocket, Compass, Target, Lightbulb, CheckCircle2,
  ArrowLeft, ArrowRight, Sparkles, Brain, Layers,
  BookOpen, Wrench, Shield, GraduationCap, BarChart3
} from "lucide-react";
import { brandColors, withAlpha } from "@/lib/brand/colors";

// Hotspot configuration for each planet
const hotspotConfig: Record<string, { x: string; y: string; infoKey: string }[]> = {
  earth: [
    { x: "42%", y: "25%", infoKey: "earth.anchor" },
    { x: "55%", y: "60%", infoKey: "earth.scan" },
  ],
  moon: [
    { x: "20%", y: "40%", infoKey: "moon.principles" },
    { x: "75%", y: "15%", infoKey: "moon.shield" },
  ],
  sun: [
    { x: "35%", y: "15%", infoKey: "sun.singularity" },
    { x: "30%", y: "75%", infoKey: "sun.convergence" },
  ],
  mars: [
    { x: "50%", y: "20%", infoKey: "mars.validation" },
  ],
  space: [],
};

// Stage configuration - using brand colors
// Text content is loaded from translations
const stageConfig = [
  {
    id: 0,
    bpm: 82,
    divergence: 95,
    entropy: 0.12,
    gears: "down" as const,
    intensity: true,
    color: brandColors.blue,
    colorRgb: "37, 99, 235",
    modules: ["M01", "M02"],
    planet: "earth" as const,
  },
  {
    id: 1,
    bpm: 110,
    divergence: 35,
    entropy: 0.45,
    gears: "up" as const,
    intensity: false,
    color: brandColors.violet,
    colorRgb: "139, 92, 246",
    modules: ["M04", "M05"],
    planet: "space" as const,
  },
  {
    id: 2,
    bpm: 68,
    divergence: 85,
    entropy: 0.28,
    gears: "up" as const,
    intensity: false,
    color: brandColors.slate,
    colorRgb: "100, 116, 139",
    modules: ["M03", "M06"],
    planet: "moon" as const,
  },
  {
    id: 3,
    bpm: 92,
    divergence: 10,
    entropy: 0.08,
    gears: "up" as const,
    intensity: false,
    color: brandColors.amber,
    colorRgb: "245, 158, 11",
    modules: ["M07", "M08"],
    planet: "sun" as const,
    distance: "150.2M KM (1.004 AU)",
  },
  {
    id: 4,
    bpm: 128,
    divergence: 55,
    entropy: 0.15,
    gears: "down" as const,
    intensity: true,
    color: brandColors.neonPink,
    colorRgb: "217, 26, 122",
    modules: ["M09"],
    planet: "mars" as const,
  },
];

// Module icons mapping
const moduleIcons: Record<string, typeof Rocket> = {
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

export default function JourneyPage() {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("journey");

  // Build missionStages with translated content
  const missionStages = stageConfig.map((config, idx) => ({
    ...config,
    hero: t(`stages.${idx}.hero`),
    meta: t(`stages.${idx}.meta`),
    title: t(`stages.${idx}.title`),
    desc: t(`stages.${idx}.desc`),
    log: t(`stages.${idx}.log`),
    tasks: [
      { text: t(`stages.${idx}.tasks.0`), done: false },
      { text: t(`stages.${idx}.tasks.1`), done: false },
      { text: t(`stages.${idx}.tasks.2`), done: false },
    ],
  }));

  const [activeIdx, setActiveIdx] = useState(0);
  const [isWarping, setIsWarping] = useState(false);
  const [tasks, setTasks] = useState(missionStages[0].tasks.map(task => ({ ...task })));
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [signalRings, setSignalRings] = useState<{ x: number; y: number; id: number }[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [jitterBpm, setJitterBpm] = useState(missionStages[0].bpm);
  const [jitterEntropy, setJitterEntropy] = useState(missionStages[0].entropy);
  const [capturedHotspots, setCapturedHotspots] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const ecgRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; z: number; a: number }[]>([]);
  const shootingStarsRef = useRef<{ x: number; y: number; len: number; speed: number; opacity: number }[]>([]);

  const stage = missionStages[activeIdx];

  // Set stage with warp effect
  const setStage = useCallback((idx: number) => {
    if (idx < 0 || idx >= missionStages.length || idx === activeIdx) return;
    setIsWarping(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setTasks(missionStages[idx].tasks.map(task => ({ ...task })));
      setIsWarping(false);
    }, 600);
  }, [activeIdx, missionStages]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") setStage(parseInt(e.key) - 1);
      if (e.key === "ArrowRight") setStage(activeIdx + 1);
      if (e.key === "ArrowLeft") setStage(activeIdx - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeIdx, setStage]);

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Metric jitter effect - telemetry feel
  useEffect(() => {
    const interval = setInterval(() => {
      setJitterBpm(Math.round(stage.bpm + (Math.random() - 0.5) * 4));
      setJitterEntropy(stage.entropy + (Math.random() - 0.5) * 0.02);
    }, 1000);
    return () => clearInterval(interval);
  }, [stage.bpm, stage.entropy]);

  // Hotspot signal capture
  const triggerSignalCapture = useCallback((e: React.MouseEvent, hotspotKey: string) => {
    if (capturedHotspots.has(hotspotKey)) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const id = Date.now();
    setSignalRings(prev => [...prev, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      id
    }]);
    setCapturedHotspots(prev => new Set([...prev, hotspotKey]));
    setTimeout(() => setSignalRings(prev => prev.filter(r => r.id !== id)), 1000);
  }, [capturedHotspots]);

  // Star field animation with shooting stars and animated nebula
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
      for (let i = 0; i < 350; i++) {
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

      // Clear
      ctx.clearRect(0, 0, w, h);
      nctx.clearRect(0, 0, w, h);

      // Nebula base gradient
      const grad = nctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
      grad.addColorStop(0, `rgba(${stage.colorRgb}, 0.15)`);
      grad.addColorStop(0.5, `rgba(${stage.colorRgb}, 0.05)`);
      grad.addColorStop(1, "transparent");
      nctx.fillStyle = grad;
      nctx.fillRect(0, 0, w, h);

      // Animated nebula blobs
      for (let i = 0; i < 3; i++) {
        const bx = w * (0.3 + 0.4 * Math.sin(Date.now() * 0.0005 + i));
        const by = h * (0.3 + 0.4 * Math.cos(Date.now() * 0.0007 + i));
        const bgrad = nctx.createRadialGradient(bx, by, 0, bx, by, 400);
        bgrad.addColorStop(0, `rgba(${stage.colorRgb}, 0.1)`);
        bgrad.addColorStop(1, "transparent");
        nctx.fillStyle = bgrad;
        nctx.fillRect(0, 0, w, h);
      }

      // Shooting stars - spawn randomly
      if (Math.random() < 0.01 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w,
          y: 0,
          len: 50 + Math.random() * 100,
          speed: 10 + Math.random() * 15,
          opacity: 1
        });
      }

      // Draw and update shooting stars
      shootingStarsRef.current.forEach(s => {
        s.x += s.speed * 0.5;
        s.y += s.speed;
        s.opacity -= 0.01;
        ctx.strokeStyle = `rgba(255,255,255,${s.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 0.5, s.y - s.len);
        ctx.stroke();
      });
      shootingStarsRef.current = shootingStarsRef.current.filter(s => s.y < h && s.opacity > 0);

      // Stars
      ctx.fillStyle = "#fff";
      starsRef.current.forEach((s) => {
        const baseSpeed = 0.2 + s.z * (activeIdx === 1 ? 8 : 1.2);
        const speed = isWarping ? baseSpeed * 15 : baseSpeed;
        s.y += speed;
        if (s.y > h) s.y = 0;

        ctx.globalAlpha = s.a * (0.3 + Math.abs(Math.sin(Date.now() * 0.001 * s.z)));

        if (isWarping) {
          ctx.strokeStyle = `rgba(255,255,255,${ctx.globalAlpha})`;
          ctx.lineWidth = s.z;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x, s.y - speed * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.z + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    createStars();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [activeIdx, isWarping, stage.colorRgb]);

  // ECG animation
  useEffect(() => {
    const canvas = ecgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    let x = 0;
    let points: { x: number; y: number }[] = [];
    let animationId: number;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = stage.color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const speed = (stage.bpm / 60) * 2;
      points.push({ x, y: h / 2 });
      if (x % 50 < 5) {
        points[points.length - 1].y -= 15 * Math.sin(((x % 50) / 5) * Math.PI);
      }

      points.forEach((p, i) => {
        p.x -= speed;
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });

      ctx.stroke();
      points = points.filter((p) => p.x > -10);
      x += speed;

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [stage.bpm, stage.color]);

  // Toggle task completion
  const toggleTask = (idx: number) => {
    setTasks((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div
      className="min-h-screen bg-[#020617] text-white overflow-hidden relative"
      style={{ "--accent": stage.color, "--accent-rgb": stage.colorRgb } as React.CSSProperties}
    >
      {/* Nebula canvas */}
      <canvas
        ref={nebulaRef}
        className="absolute inset-0 z-0 opacity-40 blur-[60px] mix-blend-color-dodge"
      />

      {/* Star field canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Emotion vignette */}
      <div
        className="fixed inset-0 z-50 pointer-events-none transition-all duration-800"
        style={{
          boxShadow: stage.intensity
            ? `inset 0 0 150px rgba(${stage.colorRgb}, 0.3)`
            : `inset 0 0 100px rgba(${stage.colorRgb}, 0)`,
        }}
      />

      {/* Back button */}
      <Link
        href={`/${locale}`}
        className="fixed top-6 left-6 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t("back")}</span>
      </Link>

      {/* Top indicator */}
      <motion.div
        className="absolute top-8 left-8 z-[100]"
        style={{ transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.2}px)` }}
      >
        <div className="font-mono text-xs tracking-widest uppercase opacity-80" style={{ color: stage.color }}>
          {stage.meta}
        </div>
        <div
          className="text-3xl md:text-5xl font-black"
          style={{ textShadow: `0 0 20px rgba(${stage.colorRgb}, 0.5)` }}
        >
          {stage.hero}
        </div>
      </motion.div>

      {/* Trajectory navigation */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] w-[80%] max-w-[800px]">
        <svg width="100%" height="80" viewBox="0 0 800 80">
          <path
            d="M 40,40 Q 220,10 400,40 T 760,40"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
            strokeDasharray="8 8"
          />
          {missionStages.map((s, i) => {
            const x = 40 + (i / 4) * 720;
            return (
              <g
                key={s.id}
                className="cursor-pointer"
                onClick={() => setStage(i)}
                onKeyDown={(e) => e.key === "Enter" && setStage(i)}
                tabIndex={0}
                role="button"
                aria-label={`${s.hero}: ${s.title}`}
                aria-pressed={i === activeIdx}
              >
                <motion.circle
                  cx={x}
                  cy={40}
                  r={i === activeIdx ? 12 : 8}
                  fill={i === activeIdx ? "#fff" : "rgba(255,255,255,0.1)"}
                  stroke={i === activeIdx ? stage.color : "transparent"}
                  strokeWidth={i === activeIdx ? 4 : 0}
                  animate={{ scale: i === activeIdx ? 1 : 0.8 }}
                  style={{ filter: i === activeIdx ? `drop-shadow(0 0 10px ${stage.color})` : "none" }}
                />
                <text
                  x={x}
                  y={15}
                  textAnchor="middle"
                  className="text-xs font-mono"
                  fill={i === activeIdx ? "#fff" : "#94a3b8"}
                  fontWeight={i === activeIdx ? "bold" : "normal"}
                >
                  {s.hero}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Planet scenes with enhanced warp effect */}
      <div
        className="absolute inset-0 z-[1] overflow-hidden perspective-[2500px] transition-all duration-600"
        style={isWarping ? {
          filter: "blur(8px) contrast(1.5) brightness(1.2) hue-rotate(30deg)",
          transform: "scale(0.95) translateZ(-100px)",
        } : {
          filter: "none",
          transform: "scale(1) translateZ(0)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: -100, scale: 1.5, rotateX: 20 }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0"
          >
            {/* Earth */}
            {stage.planet === "earth" && (
              <div
                className="absolute rounded-full"
                style={{
                  bottom: "-60vh",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "160vh",
                  height: "160vh",
                  background: `
                    radial-gradient(circle at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 20%),
                    radial-gradient(circle at 35% 25%, #22c55e 0%, transparent 18%),
                    radial-gradient(circle at 55% 45%, #15803d 0%, transparent 22%),
                    radial-gradient(circle at 50% 10%, #3b82f6, #0c4a6e, #020617)
                  `,
                  boxShadow: "0 0 120px rgba(59, 130, 246, 0.5), inset -50px -50px 100px rgba(0,0,0,0.6)",
                }}
              />
            )}

            {/* Space (stage 1 - 离地) - Receding Earth visible */}
            {stage.planet === "space" && (
              <div className="absolute inset-0">
                {/* Receding Earth - smaller, dimmer, off to the side */}
                <motion.div
                  className="absolute rounded-full"
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 0.5, opacity: 0.4, y: [0, 10, 0] }}
                  transition={{ y: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                  style={{
                    bottom: "-30vh",
                    left: "15%",
                    width: "80vh",
                    height: "80vh",
                    background: `
                      radial-gradient(circle at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 20%),
                      radial-gradient(circle at 35% 25%, #22c55e 0%, transparent 18%),
                      radial-gradient(circle at 55% 45%, #15803d 0%, transparent 22%),
                      radial-gradient(circle at 50% 10%, #3b82f6, #0c4a6e, #020617)
                    `,
                    boxShadow: "0 0 80px rgba(59, 130, 246, 0.3), inset -30px -30px 60px rgba(0,0,0,0.6)",
                  }}
                />
                {/* Atmosphere glow around receding Earth */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    bottom: "-32vh",
                    left: "14%",
                    width: "84vh",
                    height: "84vh",
                    background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
                  }}
                />
                {/* Deep space distant glow */}
                <div
                  className="absolute"
                  style={{
                    top: "10%",
                    right: "10%",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
                    filter: "blur(40px)",
                  }}
                />
              </div>
            )}

            {/* Moon */}
            {stage.planet === "moon" && (
              <div
                className="absolute rounded-full overflow-hidden"
                style={{
                  right: "5%",
                  top: "15%",
                  width: "450px",
                  height: "450px",
                  background: "radial-gradient(circle at 30% 30%, #f1f5f9, #475569)",
                  boxShadow: "inset -40px -40px 120px #000",
                }}
              >
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 30%, rgba(0,0,0,0.6) 0%, transparent 6%),
                      radial-gradient(circle at 70% 20%, rgba(0,0,0,0.5) 0%, transparent 5%),
                      radial-gradient(circle at 40% 60%, rgba(0,0,0,0.6) 0%, transparent 8%)
                    `,
                  }}
                />
              </div>
            )}

            {/* Sun with lens flares - distant observation, not approaching */}
            {stage.planet === "sun" && (
              <>
                {/* Solar flare 1 - diagonal */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    left: "8%",
                    top: "12%",
                    width: "350px",
                    height: "350px",
                    background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
                    mixBlendMode: "screen",
                    transform: "scale(6, 0.08) rotate(45deg)",
                  }}
                />
                {/* Solar flare 2 - perpendicular */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                  style={{
                    left: "8%",
                    top: "12%",
                    width: "350px",
                    height: "350px",
                    background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
                    mixBlendMode: "screen",
                    transform: "scale(0.08, 6) rotate(45deg)",
                  }}
                />
                {/* Main sun - moderate size for distant observation */}
                <motion.div
                  className="absolute rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  style={{
                    left: "8%",
                    top: "12%",
                    width: "350px",
                    height: "350px",
                    background: "radial-gradient(circle at 40% 40%, #fff 0%, #fff7ed 15%, #fef3c7 30%, #fbbf24 60%, #f59e0b)",
                    boxShadow: `
                      0 0 120px 50px rgba(255,255,255,0.9),
                      0 0 250px 100px rgba(251,191,36,0.7),
                      0 0 500px 200px rgba(245,158,11,0.4)
                    `,
                  }}
                />
                {/* Corona pulse */}
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  style={{
                    left: "calc(8% - 20px)",
                    top: "calc(12% - 20px)",
                    width: "390px",
                    height: "390px",
                    background: "radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%)",
                  }}
                />
                {/* Ambient golden glow across screen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at 20% 30%, rgba(251, 191, 36, 0.08) 0%, transparent 60%)",
                  }}
                />
              </>
            )}

            {/* Mars with enhanced terrain, atmosphere, and Mars globe */}
            {stage.planet === "mars" && (
              <>
                {/* Mars globe in the sky - distant view */}
                <motion.div
                  className="absolute rounded-full"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                  style={{
                    right: "15%",
                    top: "8%",
                    width: "180px",
                    height: "180px",
                    background: `
                      radial-gradient(circle at 35% 35%, #fcd34d 0%, transparent 25%),
                      radial-gradient(circle at 60% 50%, #dc2626 0%, transparent 30%),
                      radial-gradient(circle at 30% 60%, #b91c1c 0%, transparent 25%),
                      radial-gradient(circle at 50% 30%, #ef4444, #b91c1c, #7f1d1d)
                    `,
                    boxShadow: `
                      inset -15px -15px 40px rgba(0,0,0,0.6),
                      0 0 60px rgba(239, 68, 68, 0.4),
                      0 0 120px rgba(239, 68, 68, 0.2)
                    `,
                  }}
                />
                {/* Martian atmosphere haze */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(to top, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.05) 30%, transparent 60%)",
                  }}
                />
                {/* Mars terrain - expanded and enhanced */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    bottom: "-8vh",
                    left: "-15vw",
                    width: "130vw",
                    height: "55vh",
                  }}
                >
                  {/* Base gradient - richer colors */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, #450a0a 0%, #7c2d12 25%, #b45309 50%, #a16207 70%, transparent)",
                    }}
                  />
                  {/* Rocky terrain texture */}
                  <div
                    className="absolute inset-0 opacity-70"
                    style={{
                      backgroundImage: `
                        conic-gradient(from 120deg at 20% 30%, transparent, rgba(251, 191, 36, 0.15) 40deg, transparent 80deg),
                        conic-gradient(from -60deg at 80% 40%, transparent, rgba(251, 191, 36, 0.12) 40deg, transparent 80deg),
                        conic-gradient(from 45deg at 50% 60%, transparent, rgba(185, 28, 28, 0.1) 30deg, transparent 60deg),
                        radial-gradient(ellipse at 30% 25%, rgba(0, 0, 0, 0.8) 0%, transparent 35%),
                        radial-gradient(ellipse at 75% 55%, rgba(0, 0, 0, 0.7) 0%, transparent 40%),
                        radial-gradient(ellipse at 55% 40%, rgba(0, 0, 0, 0.6) 0%, transparent 30%)
                      `,
                      filter: "contrast(140%) brightness(1.05)",
                    }}
                  />
                  {/* Mountain ridges - more prominent */}
                  <div
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 10% 50%, #7c2d12 0%, transparent 10%),
                        radial-gradient(circle at 25% 40%, #92400e 0%, transparent 8%),
                        radial-gradient(circle at 45% 45%, #78350f 0%, transparent 12%),
                        radial-gradient(circle at 65% 35%, #7c2d12 0%, transparent 7%),
                        radial-gradient(circle at 85% 55%, #92400e 0%, transparent 9%),
                        radial-gradient(circle at 95% 40%, #78350f 0%, transparent 6%)
                      `,
                      filter: "blur(1px) contrast(160%)",
                    }}
                  />
                  {/* Crater details */}
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 60%, rgba(0,0,0,0.8) 0%, rgba(120, 53, 15, 0.3) 3%, transparent 5%),
                        radial-gradient(circle at 60% 50%, rgba(0,0,0,0.7) 0%, rgba(120, 53, 15, 0.2) 4%, transparent 6%),
                        radial-gradient(circle at 80% 65%, rgba(0,0,0,0.6) 0%, rgba(120, 53, 15, 0.2) 2%, transparent 4%)
                      `,
                    }}
                  />
                  {/* Dust storm animation - more intense */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "linear-gradient(90deg, transparent 20%, rgba(185,28,28,0.2) 50%, transparent 80%)",
                      filter: "blur(25px)",
                    }}
                  />
                  {/* Secondary dust layer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.12), transparent)",
                      filter: "blur(35px)",
                    }}
                  />
                  {/* Ground-level dust particles */}
                  <motion.div
                    className="absolute pointer-events-none"
                    animate={{ x: ["-50%", "50%"], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      bottom: "10%",
                      left: "-25%",
                      width: "150%",
                      height: "30%",
                      background: "linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.08), transparent)",
                      filter: "blur(15px)",
                    }}
                  />
                </div>
                {/* Landing zone glow */}
                <motion.div
                  className="absolute pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    bottom: "35vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "200px",
                    height: "100px",
                    background: "radial-gradient(ellipse, rgba(239, 68, 68, 0.3) 0%, transparent 70%)",
                    filter: "blur(20px)",
                  }}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Planet Hotspots */}
        {hotspotConfig[stage.planet]?.map((hotspot, idx) => {
          const hotspotKey = `${stage.planet}-${idx}`;
          const isCaptured = capturedHotspots.has(hotspotKey);
          return (
            <motion.div
              key={hotspotKey}
              className={`absolute w-5 h-5 rounded-full cursor-pointer z-[10] ${isCaptured ? 'opacity-50' : ''}`}
              style={{
                left: hotspot.x,
                top: hotspot.y,
                background: `rgba(${stage.colorRgb}, 0.5)`,
                border: "2px solid #fff",
              }}
              animate={!isCaptured ? {
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 0 0 rgba(255, 255, 255, 0.7)",
                  "0 0 0 10px rgba(255, 255, 255, 0)",
                  "0 0 0 0 rgba(255, 255, 255, 0)"
                ]
              } : undefined}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={(e) => triggerSignalCapture(e, hotspotKey)}
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10,
                  text: t(`hotspots.${hotspot.infoKey}`)
                });
              }}
              onMouseLeave={() => setTooltip(null)}
              role="button"
              aria-label={t(`hotspots.${hotspot.infoKey}`)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && triggerSignalCapture(e as unknown as React.MouseEvent, hotspotKey)}
            />
          );
        })}
      </div>

      {/* Signal Ring Animations */}
      {signalRings.map(ring => (
        <motion.div
          key={ring.id}
          className="fixed rounded-full border-2 pointer-events-none z-[10000]"
          style={{ left: ring.x, top: ring.y, borderColor: stage.color }}
          initial={{ width: 0, height: 0, x: "-50%", y: "-50%", opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 1, ease: [0.1, 0.5, 0.5, 1] }}
        />
      ))}

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="fixed z-[2000] px-3 py-2 rounded-lg font-mono text-[10px] text-white pointer-events-none backdrop-blur-md"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              background: "rgba(15, 23, 42, 0.85)",
              border: `1px solid ${stage.color}`,
              boxShadow: `0 0 15px rgba(${stage.colorRgb}, 0.3)`,
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Watermark - Large hero text on side */}
      <div
        className="hidden lg:block absolute right-[5vw] top-1/2 -translate-y-1/2 text-[clamp(80px,14vw,180px)] font-black opacity-[0.04] pointer-events-none z-[5] tracking-[0.2em]"
        style={{
          color: stage.color,
          textShadow: `0 0 40px rgba(${stage.colorRgb}, 0.2)`,
          writingMode: "vertical-rl",
          textOrientation: "upright",
        }}
      >
        {stage.hero}
      </div>

      {/* Shuttle */}
      <motion.div
        className="absolute left-1/2 top-[45%] z-[50] pointer-events-none"
        style={{
          transform: `translate(-50%, -50%) translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
        }}
        animate={{
          rotate: stage.gears === "down" ? 0 : [0, 5, -5, 0][activeIdx] || 0,
        }}
      >
        <svg width="120" height="200" viewBox="0 0 160 260" fill="none">
          {/* Landing gears */}
          <motion.g
            animate={{ opacity: stage.gears === "down" ? 1 : 0, scale: stage.gears === "down" ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <path d="M50 160 L20 230 L10 235" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <rect x="5" y="235" width="20" height="5" fill="#475569" rx="2" />
            <path d="M110 160 L140 230 L150 235" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
            <rect x="135" y="235" width="20" height="5" fill="#475569" rx="2" />
          </motion.g>
          {/* Body */}
          <path
            d="M80 10 C50 60 40 160 80 200 C120 160 110 60 80 10 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="0.5"
          />
          {/* Details */}
          <path d="M80 10 L80 40 M60 50 L100 50 M55 100 L105 100" stroke="rgba(0,0,0,0.1)" strokeWidth="0.3" />
          {/* Cockpit */}
          <path d="M65 80 Q80 70 95 80 L90 120 Q80 115 70 120 Z" fill="#38bdf8" stroke="#082f49" strokeWidth="1.5" />
          {/* Side modules */}
          <path fill="#cbd5e1" d="M48 100 Q30 150 48 180 Z" />
          <path fill="#cbd5e1" d="M112 100 Q130 150 112 180 Z" />
          {/* Nozzle */}
          <rect x="70" y="195" width="20" height="15" fill="#334155" rx="2" />
        </svg>
        {/* Thruster */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full mix-blend-screen"
          animate={{
            height: activeIdx === 0 ? 40 : activeIdx === 1 ? 120 : 80,
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ opacity: { duration: 0.1, repeat: Infinity } }}
          style={{
            width: 40,
            background: `linear-gradient(to bottom, ${stage.color}, transparent)`,
            filter: "blur(15px)",
          }}
        />
      </motion.div>

      {/* HUD Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-[100] h-[38vh] bg-gradient-to-t from-[#020617] via-[#020617]/80 to-transparent border-t border-white/10">
        <div className="h-full max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel - Metrics with scanline overlay */}
          <div className="hidden md:flex flex-col gap-4 p-6 bg-[rgba(15,23,42,0.75)] border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
                `,
                backgroundSize: "100% 2px, 3px 100%",
              }}
            />
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{t("metrics.title")}</span>
              <motion.span
                className="text-xs text-green-500"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {t("metrics.active").toUpperCase()}
              </motion.span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{t("metrics.heartRate")}</span>
              <motion.span
                className="font-mono text-xl font-bold"
                style={{ color: stage.color }}
                animate={{ x: [0, 0.5, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                {jitterBpm} <small className="text-[10px]">BPM</small>
              </motion.span>
            </div>
            {/* ECG */}
            <div className="h-10 bg-white/5 rounded-lg overflow-hidden">
              <canvas ref={ecgRef} className="w-full h-full" />
            </div>
            <div className="flex justify-between items-baseline">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{t("metrics.entropy")}</span>
              <motion.span
                className="font-mono text-xl font-bold"
                style={{ color: stage.color }}
                animate={{ x: [0, 0.5, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              >
                {jitterEntropy.toFixed(2)}
              </motion.span>
            </div>
            {/* Thinking wave */}
            <div>
              <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2">{t("metrics.thinking")}</div>
              <div className="relative h-[60px] bg-white/5 rounded-xl overflow-hidden flex items-center justify-center">
                <motion.div
                  className="h-1 rounded-full"
                  animate={{ width: `${stage.divergence}%` }}
                  style={{ background: stage.color, boxShadow: `0 0 15px ${stage.color}` }}
                />
                <div className="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
                  <span className="font-mono text-[9px] font-bold opacity-60">{t("metrics.convergent").toUpperCase()}</span>
                  <span className="font-mono text-[9px] font-bold opacity-60">{t("metrics.divergent").toUpperCase()}</span>
                </div>
              </div>
            </div>
            {/* Log */}
            <div className="border-t border-white/10 pt-4 mt-auto">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{t("metrics.log")}</span>
              <p className="text-sm italic mt-2 text-white leading-relaxed">&quot;{stage.log}&quot;</p>
            </div>
          </div>

          {/* Center Panel - Stage Info */}
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className="font-mono font-bold text-xs tracking-widest mb-2"
              style={{ color: stage.color }}
            >
              {stage.meta}
              {"distance" in stage && stage.distance && (
                <span className="ml-2 opacity-60">[{stage.distance}]</span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {stage.title}
            </h1>
            <p className="text-sm text-slate-400 max-w-lg leading-relaxed mb-4">{stage.desc}</p>
            {/* Related modules */}
            <div className="flex gap-2 mb-4">
              {stage.modules.map((m) => {
                const Icon = moduleIcons[m];
                return (
                  <Link
                    key={m}
                    href={`/${locale}/docs/core/${m.toLowerCase().replace("m", "")}-${m === "M01" ? "foundations" : m === "M02" ? "governance" : m === "M03" ? "space" : m === "M04" ? "programs" : m === "M05" ? "tools" : m === "M06" ? "safety" : m === "M07" ? "people" : m === "M08" ? "operations" : "assessment"}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs hover:bg-white/10 transition-colors"
                  >
                    {Icon && <Icon className="w-3 h-3" style={{ color: stage.color }} />}
                    <span>{m}</span>
                  </Link>
                );
              })}
            </div>
            {/* Navigation arrows */}
            <div className="flex gap-4">
              <button
                onClick={() => setStage(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="p-2 rounded-full bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
                aria-label={t("navigate")}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setStage(activeIdx + 1)}
                disabled={activeIdx === missionStages.length - 1}
                className="p-2 rounded-full bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition-colors"
                aria-label={t("navigate")}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            {/* Mobile metrics - condensed view with jitter */}
            <div className="flex md:hidden gap-4 mt-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-slate-400">{t("metrics.heartRate")}:</span>
                <span style={{ color: stage.color }}>{jitterBpm}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-slate-400">{t("metrics.entropy")}:</span>
                <span style={{ color: stage.color }}>{jitterEntropy.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Panel - Protocols with scanline overlay */}
          <div className="hidden md:flex flex-col gap-4 p-6 bg-[rgba(15,23,42,0.75)] border border-white/10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
            {/* Scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-30"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                  linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
                `,
                backgroundSize: "100% 2px, 3px 100%",
              }}
            />
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">{t("protocols.title")}</span>
            <ul className="flex flex-col gap-3" role="list" aria-label={t("protocols.title")}>
              {tasks.map((task, i) => (
                <li
                  key={i}
                  onClick={() => toggleTask(i)}
                  onKeyDown={(e) => e.key === "Enter" && toggleTask(i)}
                  tabIndex={0}
                  role="checkbox"
                  aria-checked={task.done}
                  className={`p-3 rounded-xl cursor-pointer transition-all text-sm border-l-4 ${
                    task.done
                      ? "bg-green-500/10 border-green-500 line-through opacity-70"
                      : "bg-white/5 border-white/20 hover:bg-white/10 hover:border-opacity-50"
                  }`}
                  style={{ borderLeftColor: task.done ? "#22c55e" : `rgba(${stage.colorRgb}, 0.5)` }}
                >
                  <div className="flex items-center gap-2">
                    {task.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2" style={{ borderColor: stage.color }} />
                    )}
                    <span>{task.text}</span>
                  </div>
                </li>
              ))}
            </ul>
            {/* Quick links */}
            <div className="mt-auto pt-4 border-t border-white/10">
              <Link
                href={`/${locale}/docs/core`}
                className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t("viewDocs")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-4 py-2 rounded-full bg-[rgba(15,23,42,0.6)] border border-white/10 backdrop-blur-md font-mono text-xs text-slate-400"
      >
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-white">1-5</kbd>
        <span>{t("selectStage")}</span>
        <span className="opacity-30">|</span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-white">←</kbd>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-white">→</kbd>
        <span>{t("navigate")}</span>
      </motion.div>
    </div>
  );
}
