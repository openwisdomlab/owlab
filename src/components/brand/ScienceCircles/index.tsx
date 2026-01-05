"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { brandColors, withAlpha } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import { getBalancedQuestions, type ScienceQuestion } from "@/data/science-questions";

// ============ Types ============
interface CircleState {
  id: string;
  question: ScienceQuestion;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  phase: 'entering' | 'active' | 'exiting';
  enterDelay: number;
}

// ============ Constants ============
const COLOR_MAP: Record<string, string> = {
  cyan: brandColors.neonCyan,
  pink: brandColors.neonPink,
  violet: brandColors.violet,
  emerald: brandColors.emerald,
  blue: brandColors.blue,
  orange: brandColors.orange,
};

const GRAVITY_SIZE_MAP: Record<number, { min: number; max: number }> = {
  4: { min: 70, max: 90 },
  3: { min: 50, max: 70 },
  2: { min: 35, max: 50 },
  1: { min: 22, max: 35 },
};

const CURIOSITY_QUOTES = [
  { text: "好奇心是一切智慧的开始", author: "苏格拉底" },
  { text: "提出问题比解决问题更重要", author: "爱因斯坦" },
  { text: "保持好奇，保持愚蠢", author: "乔布斯" },
  { text: "问题是通往真理的门户", author: "培根" },
  { text: "好奇心是科学之母", author: "伽利略" },
];

// ============ Utility Functions ============
function random(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getCircleSize(gravity: number, isMobile: boolean): number {
  const range = GRAVITY_SIZE_MAP[gravity] || GRAVITY_SIZE_MAP[1];
  const scale = isMobile ? 0.7 : 1;
  return random(range.min * scale, range.max * scale);
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ============ Main Component ============
interface ScienceCirclesProps {
  className?: string;
  circleCount?: number;
}

export function ScienceCircles({ className = "", circleCount = 25 }: ScienceCirclesProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const circlesRef = useRef<CircleState[]>([]);
  const hoverHistoryRef = useRef<number[]>([]);

  const [circles, setCircles] = useState<CircleState[]>([]);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showResonance, setShowResonance] = useState(false);
  const [resonanceQuote, setResonanceQuote] = useState(CURIOSITY_QUOTES[0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Actual circle count based on device
  const actualCircleCount = isMobile ? Math.floor(circleCount * 0.4) : circleCount;

  // Initialize circles
  const initCircles = useCallback((width: number, height: number) => {
    const questions = getBalancedQuestions(actualCircleCount);
    const heroCenter = { x: width / 2, y: height / 2 };
    const heroRadius = Math.min(width, height) * (isMobile ? 0.2 : 0.25);

    const newCircles: CircleState[] = questions.map((q, i) => {
      let x: number, y: number;
      let attempts = 0;

      do {
        x = random(60, width - 60);
        y = random(60, height - 60);
        attempts++;
      } while (
        distance(x, y, heroCenter.x, heroCenter.y) < heroRadius + 40 &&
        attempts < 50
      );

      const size = getCircleSize(q.gravity, isMobile);

      return {
        id: q.id,
        question: q,
        x,
        y,
        vx: random(-0.12, 0.12),
        vy: random(-0.12, 0.12),
        size,
        opacity: 0,
        rotation: random(0, 360),
        rotationSpeed: random(-0.3, 0.3),
        phase: 'entering' as const,
        enterDelay: i * 100,
      };
    });

    circlesRef.current = newCircles;
    setCircles(newCircles);
  }, [actualCircleCount, isMobile]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        if (circlesRef.current.length === 0 || Math.abs(width - dimensions.width) > 100) {
          initCircles(width, height);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [initCircles, dimensions.width]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current && !isMobile) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  }, [mouseX, mouseY, isMobile]);

  // Curiosity Resonance - Easter Egg
  const handleCircleHover = useCallback((circleId: string) => {
    setHoveredCircle(circleId);

    const now = Date.now();
    hoverHistoryRef.current = [...hoverHistoryRef.current.filter(t => now - t < 3000), now];

    // Trigger resonance after hovering 4+ circles in 3 seconds
    if (hoverHistoryRef.current.length >= 4 && !showResonance) {
      setResonanceQuote(CURIOSITY_QUOTES[Math.floor(Math.random() * CURIOSITY_QUOTES.length)]);
      setShowResonance(true);
      setTimeout(() => setShowResonance(false), 4000);
    }
  }, [showResonance]);

  // Animation loop for canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentCircles = circlesRef.current;
      const mx = smoothMouseX.get();
      const my = smoothMouseY.get();

      // Draw connection lines
      currentCircles.forEach((c1, i) => {
        if (c1.phase === 'exiting') return;

        currentCircles.slice(i + 1).forEach((c2) => {
          if (c2.phase === 'exiting') return;

          const dist = distance(c1.x, c1.y, c2.x, c2.y);
          const maxDist = isMobile ? 150 : 200;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15 * Math.min(c1.opacity, c2.opacity);
            const color1 = COLOR_MAP[c1.question.color];
            const color2 = COLOR_MAP[c2.question.color];

            const gradient = ctx.createLinearGradient(c1.x, c1.y, c2.x, c2.y);
            gradient.addColorStop(0, withAlpha(color1, alpha));
            gradient.addColorStop(1, withAlpha(color2, alpha));

            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(c2.x, c2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Connect to mouse if hovering (desktop only)
        if (!isMobile && hoveredCircle === c1.id) {
          const distToMouse = distance(c1.x, c1.y, mx, my);
          if (distToMouse < 150) {
            const color = COLOR_MAP[c1.question.color];
            ctx.beginPath();
            ctx.moveTo(c1.x, c1.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = withAlpha(color, 0.4);
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Resonance effect - all circles pulse
      if (showResonance) {
        currentCircles.forEach((c) => {
          const color = COLOR_MAP[c.question.color];
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.size * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = withAlpha(color, 0.3);
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }

      // Update circle positions
      circlesRef.current = currentCircles.map((circle) => {
        if (circle.phase === 'exiting') return circle;

        let { x, y, vx, vy, rotation, rotationSpeed, opacity, phase } = circle;

        // Mouse gravity (desktop only)
        if (!isMobile) {
          const distToMouse = distance(x, y, mx, my);
          if (distToMouse < 300 && distToMouse > 30) {
            const force = 0.3 / (distToMouse * distToMouse) * 1000;
            const angle = Math.atan2(my - y, mx - x);
            vx += Math.cos(angle) * force;
            vy += Math.sin(angle) * force;
          }
        }

        // Resonance boost
        if (showResonance) {
          vx += random(-0.1, 0.1);
          vy += random(-0.1, 0.1);
        }

        vx *= 0.99;
        vy *= 0.99;

        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 0.8) {
          vx = (vx / speed) * 0.8;
          vy = (vy / speed) * 0.8;
        }

        x += vx;
        y += vy;
        rotation += rotationSpeed;

        const margin = circle.size;
        if (x < margin || x > dimensions.width - margin) {
          vx *= -0.8;
          x = Math.max(margin, Math.min(dimensions.width - margin, x));
        }
        if (y < margin || y > dimensions.height - margin) {
          vy *= -0.8;
          y = Math.max(margin, Math.min(dimensions.height - margin, y));
        }

        if (phase === 'entering') {
          opacity = Math.min(1, opacity + 0.015);
          if (opacity >= 1) phase = 'active';
        }

        return { ...circle, x, y, vx, vy, rotation, opacity, phase };
      });

      setCircles([...circlesRef.current]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, hoveredCircle, smoothMouseX, smoothMouseY, isMobile, showResonance]);

  // Spawn new circles periodically
  useEffect(() => {
    if (isMobile) return; // Disable spawn on mobile

    const spawnInterval = setInterval(() => {
      if (circlesRef.current.length < actualCircleCount + 3) {
        const questions = getBalancedQuestions(1);
        if (questions.length > 0) {
          const q = questions[0];
          const side = Math.floor(Math.random() * 4);
          let x: number, y: number;

          switch (side) {
            case 0: x = -50; y = random(0, dimensions.height); break;
            case 1: x = dimensions.width + 50; y = random(0, dimensions.height); break;
            case 2: x = random(0, dimensions.width); y = -50; break;
            default: x = random(0, dimensions.width); y = dimensions.height + 50;
          }

          const targetX = dimensions.width / 2 + random(-200, 200);
          const targetY = dimensions.height / 2 + random(-200, 200);
          const angle = Math.atan2(targetY - y, targetX - x);

          const newCircle: CircleState = {
            id: `spawn-${Date.now()}`,
            question: q,
            x,
            y,
            vx: Math.cos(angle) * 1.5,
            vy: Math.sin(angle) * 1.5,
            size: getCircleSize(q.gravity, false),
            opacity: 0,
            rotation: 0,
            rotationSpeed: random(-0.3, 0.3),
            phase: 'entering',
            enterDelay: 0,
          };

          circlesRef.current = [...circlesRef.current, newCircle];
        }
      }
    }, 10000);

    return () => clearInterval(spawnInterval);
  }, [actualCircleCount, dimensions, isMobile]);

  // Occasionally remove a circle
  useEffect(() => {
    if (isMobile) return;

    const fadeInterval = setInterval(() => {
      if (circlesRef.current.length > actualCircleCount) {
        const indexToRemove = Math.floor(Math.random() * circlesRef.current.length);
        circlesRef.current = circlesRef.current.filter((_, i) => i !== indexToRemove);
        setCircles([...circlesRef.current]);
      }
    }, 15000);

    return () => clearInterval(fadeInterval);
  }, [actualCircleCount, isMobile]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{ zIndex: 1 }}
    >
      {/* Canvas for connection lines */}
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: isDark ? 1 : 0.7 }}
      />

      {/* Question Circles */}
      <AnimatePresence>
        {circles.map((circle) => (
          <QuestionCircle
            key={circle.id}
            circle={circle}
            isDark={isDark}
            isMobile={isMobile}
            isHovered={hoveredCircle === circle.id}
            onHover={() => handleCircleHover(circle.id)}
            onLeave={() => setHoveredCircle(null)}
          />
        ))}
      </AnimatePresence>

      {/* Curiosity Resonance - Easter Egg */}
      <AnimatePresence>
        {showResonance && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Aurora background effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${withAlpha(brandColors.neonCyan, 0.1)}, ${withAlpha(brandColors.violet, 0.05)}, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Quote card */}
            <motion.div
              className="relative px-8 py-6 rounded-2xl max-w-md mx-4"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(14,14,20,0.95), rgba(26,26,46,0.9))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${withAlpha(brandColors.neonCyan, 0.3)}`,
                boxShadow: `0 0 60px ${withAlpha(brandColors.neonCyan, 0.3)}, 0 0 120px ${withAlpha(brandColors.violet, 0.2)}`,
              }}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              <motion.p
                className="text-xl md:text-2xl font-bold text-center mb-3"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.violet}, ${brandColors.neonPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                "{resonanceQuote.text}"
              </motion.p>
              <p
                className="text-sm text-center"
                style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}
              >
                — {resonanceQuote.author}
              </p>

              {/* Sparkle decorations */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: [brandColors.neonCyan, brandColors.violet, brandColors.neonPink][i % 3],
                    left: `${random(10, 90)}%`,
                    top: `${random(10, 90)}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============ Question Circle Component ============
interface QuestionCircleProps {
  circle: CircleState;
  isDark: boolean;
  isMobile: boolean;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function QuestionCircle({ circle, isDark, isMobile, isHovered, onHover, onLeave }: QuestionCircleProps) {
  const color = COLOR_MAP[circle.question.color];
  const [showText, setShowText] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (isHovered && !isMobile) {
      const timer = setTimeout(() => setShowText(true), 150);
      return () => clearTimeout(timer);
    } else if (!isClicked) {
      setShowText(false);
    }
  }, [isHovered, isMobile, isClicked]);

  const handleClick = () => {
    if (isMobile) {
      setIsClicked(!isClicked);
      setShowText(!showText);
    }
  };

  const baseOpacity = circle.question.gravity === 4 ? 0.9 :
                      circle.question.gravity === 3 ? 0.7 :
                      circle.question.gravity === 2 ? 0.5 : 0.35;

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        left: circle.x,
        top: circle.y,
        transform: `translate(-50%, -50%)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isHovered || isClicked ? 1.3 : 1,
        opacity: circle.opacity * baseOpacity,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        delay: circle.phase === 'entering' ? circle.enterDelay / 1000 : 0,
        duration: 0.4,
        scale: { type: "spring", stiffness: 300, damping: 20 },
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: circle.size * 2.5,
          height: circle.size * 2.5,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${withAlpha(color, 0.3)}, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{
          scale: isHovered || isClicked ? [1, 1.2, 1] : 1,
          opacity: isHovered || isClicked ? 1 : 0.5,
        }}
        transition={{ duration: 0.8, repeat: isHovered || isClicked ? Infinity : 0 }}
      />

      {/* Main circle */}
      <svg
        width={circle.size}
        height={circle.size}
        viewBox="0 0 60 60"
        className="relative"
        style={{
          filter: isHovered || isClicked
            ? `drop-shadow(0 0 20px ${color})`
            : `drop-shadow(0 0 8px ${withAlpha(color, 0.5)})`,
        }}
      >
        {/* Outer rotating ring */}
        <motion.circle
          cx="30"
          cy="30"
          r="28"
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity={0.6}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }}
        />

        {/* Middle ring */}
        <circle
          cx="30"
          cy="30"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity={0.8}
        />

        {/* Inner filled circle */}
        <motion.circle
          cx="30"
          cy="30"
          r="12"
          fill={withAlpha(color, isDark ? 0.3 : 0.2)}
          stroke={color}
          strokeWidth="2"
          animate={{
            scale: isHovered || isClicked ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 1.5, repeat: isHovered || isClicked ? Infinity : 0 }}
          style={{ transformOrigin: "30px 30px" }}
        />

        {/* Center dot */}
        <motion.circle
          cx="30"
          cy="30"
          r="4"
          fill={color}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Particle orbits when hovered */}
        {(isHovered || isClicked) && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.circle
                key={i}
                cx="30"
                cy="30"
                r="2"
                fill={color}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  cx: [30, 30 + 24 * Math.cos((i * 120 * Math.PI) / 180), 30],
                  cy: [30, 30 + 24 * Math.sin((i * 120 * Math.PI) / 180), 30],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
      </svg>

      {/* Question text - Quantum Emergence Effect */}
      <AnimatePresence>
        {showText && (
          <QuantumTextReveal
            text={circle.question.question}
            color={color}
            isDark={isDark}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ Quantum Text Reveal Component ============
interface QuantumTextRevealProps {
  text: string;
  color: string;
  isDark: boolean;
  isMobile: boolean;
}

function QuantumTextReveal({ text, color, isDark, isMobile }: QuantumTextRevealProps) {
  const [phase, setPhase] = useState<'particles' | 'forming' | 'complete'>('particles');
  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('forming'), 250);
    const timer2 = setTimeout(() => setPhase('complete'), 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      className="absolute left-1/2 whitespace-nowrap z-50"
      style={{
        top: isMobile ? 'auto' : '100%',
        bottom: isMobile ? '100%' : 'auto',
        marginTop: isMobile ? 0 : '12px',
        marginBottom: isMobile ? '12px' : 0,
        transform: 'translateX(-50%)',
      }}
      initial={{ opacity: 0, y: isMobile ? 10 : -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMobile ? 10 : -10, transition: { duration: 0.15 } }}
    >
      {/* Background blur */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-xl"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(14,14,20,0.95), rgba(26,26,46,0.9))`
            : `linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))`,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${withAlpha(color, 0.4)}`,
          boxShadow: `0 0 40px ${withAlpha(color, 0.25)}, inset 0 0 30px ${withAlpha(color, 0.1)}`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
      />

      {/* Text container */}
      <div className="relative px-4 py-2 flex">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block text-sm md:text-base font-semibold"
            style={{
              color: phase === 'complete' ? (isDark ? '#fff' : '#1a1a2e') : color,
              textShadow: phase === 'complete' ? 'none' : `0 0 12px ${color}`,
            }}
            initial={{
              opacity: 0,
              x: random(-15, 15),
              y: random(-15, 15),
              scale: 0,
              filter: 'blur(6px)',
            }}
            animate={{
              opacity: phase === 'particles' ? 0.4 : 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 0.4,
              delay: phase === 'particles' ? i * 0.015 : i * 0.02,
              ease: "easeOut",
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>

      {/* Energy burst effect during formation */}
      {phase !== 'complete' && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: color,
                left: '50%',
                top: '50%',
              }}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 0.6, 0],
                x: Math.cos((i / 10) * Math.PI * 2) * random(30, 50),
                y: Math.sin((i / 10) * Math.PI * 2) * random(30, 50),
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ScienceCircles;
