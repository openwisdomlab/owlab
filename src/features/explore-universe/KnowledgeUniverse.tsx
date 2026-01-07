"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/ui/Link";
import { useTranslations } from "next-intl";
import {
  Rocket, Compass, Target, Wrench, Shield,
  GraduationCap, BookOpen, BarChart3, Layers,
  ArrowLeft, Brain, Cpu, ExternalLink
} from "lucide-react";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { SpaceIcon, MindIcon, EmergenceIcon, PoeticsIcon } from "@/components/icons/LivingModuleIcons";

// Module configuration for M01-M09
const coreModules = [
  { id: "M01", orbit: 220, angle: 0,   size: 52, color: brandColors.modules.M01, icon: Rocket, colorRgb: "139, 92, 246" },
  { id: "M02", orbit: 220, angle: 40,  size: 48, color: brandColors.modules.M02, icon: Compass, colorRgb: "0, 217, 255" },
  { id: "M03", orbit: 260, angle: 80,  size: 56, color: brandColors.modules.M03, icon: Layers, colorRgb: "16, 185, 129" },
  { id: "M04", orbit: 260, angle: 125, size: 50, color: brandColors.modules.M04, icon: Target, colorRgb: "249, 115, 22" },
  { id: "M05", orbit: 300, angle: 170, size: 46, color: brandColors.modules.M05, icon: Wrench, colorRgb: "6, 182, 212" },
  { id: "M06", orbit: 300, angle: 215, size: 44, color: brandColors.modules.M06, icon: Shield, colorRgb: "5, 150, 105" },
  { id: "M07", orbit: 340, angle: 255, size: 48, color: brandColors.modules.M07, icon: GraduationCap, colorRgb: "245, 158, 11" },
  { id: "M08", orbit: 340, angle: 295, size: 42, color: brandColors.modules.M08, icon: BookOpen, colorRgb: "100, 116, 139" },
  { id: "M09", orbit: 380, angle: 335, size: 54, color: brandColors.modules.M09, icon: BarChart3, colorRgb: "168, 85, 247" },
];

// Living modules L01-L04
const livingModules = [
  { id: "L01", x: 0.18, y: 0.30, Icon: SpaceIcon, color: brandColors.neonCyan, colorRgb: "0, 217, 255", name: "spaceAsEducator" },
  { id: "L02", x: 0.82, y: 0.30, Icon: MindIcon, color: brandColors.violet, colorRgb: "139, 92, 246", name: "extendedMind" },
  { id: "L03", x: 0.18, y: 0.70, Icon: EmergenceIcon, color: brandColors.emerald, colorRgb: "16, 185, 129", name: "emergentWisdom" },
  { id: "L04", x: 0.82, y: 0.70, Icon: PoeticsIcon, color: brandColors.neonPink, colorRgb: "217, 26, 122", name: "poeticsOfTechnology" },
];

// 3E Framework rings
const threeERings = [
  { label: "enlighten", radius: 60, color: brandColors.neonCyan, colorRgb: "0, 217, 255", rotationSpeed: 0.02 },
  { label: "empower", radius: 90, color: brandColors.violet, colorRgb: "139, 92, 246", rotationSpeed: -0.015 },
  { label: "engage", radius: 120, color: brandColors.neonPink, colorRgb: "217, 26, 122", rotationSpeed: 0.01 },
];

// Portals for quick actions
const portals = [
  { id: "guide", position: "bottom-left" as const, dest: "/docs/core", icon: BookOpen, colorRgb: "37, 99, 235" },
  { id: "lab", position: "bottom-right" as const, dest: "/lab", icon: Cpu, colorRgb: "217, 26, 122" },
  { id: "research", position: "top-right" as const, dest: "/docs/research", icon: Brain, colorRgb: "139, 92, 246" },
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [orbitalAngles, setOrbitalAngles] = useState<number[]>(coreModules.map(m => m.angle));
  const [ringRotations, setRingRotations] = useState<number[]>([0, 0, 0]);
  const [signalRings, setSignalRings] = useState<{ x: number; y: number; id: number; color: string }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<{ x: number; y: number; z: number; a: number }[]>([]);
  const shootingStarsRef = useRef<{ x: number; y: number; len: number; speed: number; opacity: number }[]>([]);
  const animationRef = useRef<number>(0);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(e.key) - 1;
        if (idx < coreModules.length) {
          setSelectedModule(coreModules[idx].id);
        }
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

  // Orbital animation
  useEffect(() => {
    const animateOrbits = () => {
      setOrbitalAngles(prev =>
        prev.map((angle, i) => {
          // Pause orbit when module is hovered or selected
          const module = coreModules[i];
          if (hoveredModule === module.id || selectedModule === module.id) {
            return angle;
          }
          return (angle + 0.015 * (1 - i * 0.08)) % 360;
        })
      );
      setRingRotations(prev =>
        prev.map((rot, i) => rot + threeERings[i].rotationSpeed)
      );
      animationRef.current = requestAnimationFrame(animateOrbits);
    };
    animationRef.current = requestAnimationFrame(animateOrbits);
    return () => cancelAnimationFrame(animationRef.current);
  }, [hoveredModule, selectedModule]);

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
      const count = window.innerWidth < 768 ? 200 : 500;
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

      // Nebula base gradient
      const grad = nctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, "rgba(139, 92, 246, 0.08)");
      grad.addColorStop(0.3, "rgba(217, 26, 122, 0.05)");
      grad.addColorStop(0.6, "rgba(0, 217, 255, 0.03)");
      grad.addColorStop(1, "transparent");
      nctx.fillStyle = grad;
      nctx.fillRect(0, 0, w, h);

      // Animated nebula blobs
      const nebulaColors = [
        { colorRgb: "139, 92, 246", offset: 0 },
        { colorRgb: "217, 26, 122", offset: 2 },
        { colorRgb: "0, 217, 255", offset: 4 },
        { colorRgb: "16, 185, 129", offset: 6 },
      ];
      for (let i = 0; i < nebulaColors.length; i++) {
        const bx = w * (0.3 + 0.4 * Math.sin(Date.now() * 0.0003 + nebulaColors[i].offset));
        const by = h * (0.3 + 0.4 * Math.cos(Date.now() * 0.0004 + nebulaColors[i].offset));
        const bgrad = nctx.createRadialGradient(bx, by, 0, bx, by, 350);
        bgrad.addColorStop(0, `rgba(${nebulaColors[i].colorRgb}, 0.08)`);
        bgrad.addColorStop(1, "transparent");
        nctx.fillStyle = bgrad;
        nctx.fillRect(0, 0, w, h);
      }

      // Shooting stars
      if (Math.random() < 0.005 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * w,
          y: 0,
          len: 50 + Math.random() * 100,
          speed: 8 + Math.random() * 12,
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
        s.y += 0.1 + s.z * 0.2;
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

  // Calculate planet position based on orbital parameters
  const getPlanetPosition = useCallback((orbit: number, angle: number) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radians = (angle * Math.PI) / 180;
    // Elliptical orbit with 1.4:0.6 aspect ratio
    const x = centerX + orbit * Math.cos(radians) * 1.2;
    const y = centerY + orbit * Math.sin(radians) * 0.55;
    return { x, y };
  }, [dimensions]);

  // Trigger signal ring animation
  const triggerSignal = useCallback((x: number, y: number, color: string) => {
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

  // Get selected module info
  const selectedModuleInfo = selectedModule ?
    (selectedModule.startsWith("L")
      ? livingModules.find(m => m.id === selectedModule)
      : coreModules.find(m => m.id === selectedModule))
    : null;

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative">
      {/* Nebula canvas */}
      <canvas
        ref={nebulaRef}
        className="absolute inset-0 z-0 opacity-50 blur-[80px] mix-blend-color-dodge"
      />

      {/* Star field canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Cosmic vignette */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 200px 50px rgba(2, 6, 23, 0.8)",
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

      {/* Title badge */}
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

      {/* Main content area with parallax */}
      <motion.div
        className="relative z-20 w-full h-screen"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 30 }}
      >
        {/* 3E Central Beacon */}
        <div
          className="absolute z-30"
          style={{
            left: dimensions.width / 2,
            top: dimensions.height / 2,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Rotating rings */}
          {threeERings.map((ring, i) => (
            <motion.div
              key={ring.label}
              className="absolute rounded-full border"
              style={{
                width: ring.radius * 2,
                height: ring.radius * 2,
                left: -ring.radius,
                top: -ring.radius,
                borderColor: withAlpha(ring.color, 0.3),
                transform: `rotate(${ringRotations[i]}rad)`,
              }}
            >
              {/* Ring label */}
              <motion.span
                className="absolute text-[10px] font-mono uppercase tracking-widest"
                style={{
                  color: ring.color,
                  top: -8,
                  left: "50%",
                  transform: `translateX(-50%) rotate(-${ringRotations[i]}rad)`,
                  textShadow: `0 0 10px ${ring.color}`,
                }}
              >
                {t(`universe.beacon.${ring.label}`)}
              </motion.span>
            </motion.div>
          ))}

          {/* Central core */}
          <motion.div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 40% 40%, ${withAlpha(brandColors.violet, 0.4)}, ${withAlpha(brandColors.neonPink, 0.2)}, transparent)`,
              boxShadow: `0 0 60px ${withAlpha(brandColors.violet, 0.3)}, 0 0 120px ${withAlpha(brandColors.neonPink, 0.2)}`,
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-2xl font-bold gradient-text">3E</span>
          </motion.div>
        </div>

        {/* Orbital paths (SVG) */}
        <svg className="absolute inset-0 z-15 pointer-events-none" style={{ width: "100%", height: "100%" }}>
          {[220, 260, 300, 340, 380].map((orbit, i) => {
            const cx = dimensions.width / 2;
            const cy = dimensions.height / 2;
            const rx = orbit * 1.2;
            const ry = orbit * 0.55;
            return (
              <ellipse
                key={orbit}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
            );
          })}
        </svg>

        {/* Core Modules (Planets M01-M09) */}
        {coreModules.map((module, i) => {
          const pos = getPlanetPosition(module.orbit, orbitalAngles[i]);
          const isHovered = hoveredModule === module.id;
          const isSelected = selectedModule === module.id;
          const Icon = module.icon;

          return (
            <motion.div
              key={module.id}
              className="absolute z-40 cursor-pointer"
              style={{
                left: pos.x,
                top: pos.y,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.15 }}
              animate={{
                scale: isSelected ? 1.2 : 1,
              }}
              onHoverStart={() => setHoveredModule(module.id)}
              onHoverEnd={() => setHoveredModule(null)}
              onClick={(e) => {
                setSelectedModule(module.id);
                triggerSignal(pos.x, pos.y, module.color);
              }}
            >
              {/* Planet glow */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  width: module.size + 20,
                  height: module.size + 20,
                  left: -(module.size + 20) / 2 + module.size / 2,
                  top: -(module.size + 20) / 2 + module.size / 2,
                  background: `radial-gradient(circle, ${withAlpha(module.color, isHovered ? 0.4 : 0.2)}, transparent)`,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: isHovered || isSelected ? 1 : 0.5,
                }}
              />

              {/* Planet body */}
              <motion.div
                className="rounded-full flex items-center justify-center border"
                style={{
                  width: module.size,
                  height: module.size,
                  background: `radial-gradient(circle at 30% 30%, ${withAlpha(module.color, 0.8)}, ${withAlpha(module.color, 0.4)})`,
                  borderColor: withAlpha(module.color, 0.5),
                  boxShadow: isHovered || isSelected ? `0 0 30px ${withAlpha(module.color, 0.6)}` : "none",
                }}
              >
                <Icon size={module.size * 0.4} className="text-white/90" />
              </motion.div>

              {/* Module ID label */}
              <motion.div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono"
                style={{ color: module.color }}
                animate={{ opacity: isHovered || isSelected ? 1 : 0.6 }}
              >
                {module.id}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Living Modules (Nebulae L01-L04) */}
        {livingModules.map((module) => {
          const x = dimensions.width * module.x;
          const y = dimensions.height * module.y;
          const isHovered = hoveredModule === module.id;
          const isSelected = selectedModule === module.id;
          const Icon = module.Icon;

          return (
            <motion.div
              key={module.id}
              className="absolute z-35 cursor-pointer"
              style={{
                left: x,
                top: y,
                transform: "translate(-50%, -50%)",
              }}
              whileHover={{ scale: 1.1 }}
              onHoverStart={() => setHoveredModule(module.id)}
              onHoverEnd={() => setHoveredModule(null)}
              onClick={() => {
                setSelectedModule(module.id);
                triggerSignal(x, y, module.color);
              }}
            >
              {/* Nebula glow */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 180,
                  height: 180,
                  left: -90,
                  top: -90,
                  background: `radial-gradient(circle, ${withAlpha(module.color, 0.15)}, transparent 70%)`,
                  filter: "blur(20px)",
                }}
                animate={{
                  scale: isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
                  opacity: isHovered || isSelected ? 0.8 : 0.5,
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {/* Icon container */}
              <motion.div
                className="relative w-24 h-24 flex items-center justify-center rounded-full border"
                style={{
                  background: `radial-gradient(circle, ${withAlpha(module.color, 0.1)}, transparent)`,
                  borderColor: withAlpha(module.color, isHovered ? 0.5 : 0.2),
                }}
                animate={{
                  boxShadow: isHovered || isSelected
                    ? `0 0 40px ${withAlpha(module.color, 0.4)}`
                    : `0 0 20px ${withAlpha(module.color, 0.2)}`,
                }}
              >
                <Icon className="w-12 h-12" color={module.color} isHovered={isHovered} />
              </motion.div>

              {/* Module label */}
              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono whitespace-nowrap"
                style={{ color: module.color }}
                animate={{ opacity: isHovered || isSelected ? 1 : 0.6 }}
              >
                {module.id}
              </motion.div>
            </motion.div>
          );
        })}
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
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.1, 0.5, 0.5, 1] }}
          />
        ))}
      </AnimatePresence>

      {/* Portal Gates */}
      {portals.map((portal) => {
        const positionStyles = {
          "bottom-left": { bottom: "8%", left: "8%" },
          "bottom-right": { bottom: "8%", right: "8%" },
          "top-right": { top: "15%", right: "8%" },
        };
        const Icon = portal.icon;

        return (
          <motion.div
            key={portal.id}
            className="fixed z-50"
            style={positionStyles[portal.position]}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href={`/${locale}${portal.dest}`}
              className="group flex flex-col items-center gap-2"
            >
              {/* Portal ring */}
              <motion.div
                className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center"
                style={{
                  borderColor: `rgba(${portal.colorRgb}, 0.4)`,
                  background: `radial-gradient(circle, rgba(${portal.colorRgb}, 0.1), transparent)`,
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: `0 0 30px rgba(${portal.colorRgb}, 0.5)`,
                }}
              >
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed"
                  style={{ borderColor: `rgba(${portal.colorRgb}, 0.3)` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <Icon size={24} style={{ color: `rgba(${portal.colorRgb}, 0.9)` }} />
              </motion.div>

              {/* Portal label */}
              <span className="text-xs font-mono opacity-60 group-hover:opacity-100 transition-opacity">
                {t(`universe.portals.${portal.id}.title`)}
              </span>
            </Link>
          </motion.div>
        );
      })}

      {/* Module Detail Panel */}
      <AnimatePresence>
        {selectedModule && selectedModuleInfo && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[60] p-6"
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="max-w-2xl mx-auto rounded-2xl border backdrop-blur-xl p-6"
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                borderColor: `rgba(${(selectedModuleInfo as typeof coreModules[0]).colorRgb}, 0.3)`,
                boxShadow: `0 0 60px rgba(${(selectedModuleInfo as typeof coreModules[0]).colorRgb}, 0.15)`,
              }}
            >
              {/* Scanline effect */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
                style={{
                  backgroundImage: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)`,
                  backgroundSize: "100% 2px",
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xl font-bold"
                      style={{ color: (selectedModuleInfo as typeof coreModules[0]).color }}
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
                    className="text-white/40 hover:text-white/80 transition-colors"
                  >
                    ESC
                  </button>
                </div>

                <p className="text-sm text-white/60 mb-4 line-clamp-2">
                  {selectedModule.startsWith("L")
                    ? tLiving(`modules.${(selectedModuleInfo as typeof livingModules[0]).name}.subtitle`)
                    : tDocs(`modules.${selectedModule}.description`)
                  }
                </p>

                <Link
                  href={getModuleLink(selectedModule)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: `rgba(${(selectedModuleInfo as typeof coreModules[0]).colorRgb}, 0.2)`,
                    color: (selectedModuleInfo as typeof coreModules[0]).color,
                    border: `1px solid rgba(${(selectedModuleInfo as typeof coreModules[0]).colorRgb}, 0.3)`,
                  }}
                >
                  {t("universe.explore")}
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hints */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-xs text-white/40 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="hidden md:inline">
          {t("universe.nav.hint")}
        </span>
      </motion.div>

      {/* Tagline (typewriter effect position) */}
      <motion.div
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-sm text-white/40 font-light tracking-wide">
          {t("tagline")}
        </p>
      </motion.div>
    </div>
  );
}
