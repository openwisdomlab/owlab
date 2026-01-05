"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  // 问题种子生长相关
  revealProgress: number; // 0-1, 问题显示进度
  revealStartTime: number; // 开始生长的时间戳
  revealDuration: number; // 生长持续时间 (15-25秒)
  isRevealed: boolean; // 是否已完成显示
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

// 统一的圆环大小范围（不再按gravity区分）
const CIRCLE_SIZE_RANGE = { min: 22, max: 50 };

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

function getCircleSize(isMobile: boolean): number {
  const scale = isMobile ? 0.7 : 1;
  return random(CIRCLE_SIZE_RANGE.min * scale, CIRCLE_SIZE_RANGE.max * scale);
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
    // 中心六边形区域半径，圆环不能出现在这里
    const heroRadius = Math.min(width, height) * (isMobile ? 0.22 : 0.28);

    const newCircles: CircleState[] = questions.map((q, i) => {
      let x: number, y: number;
      let attempts = 0;

      do {
        x = random(60, width - 60);
        y = random(60, height - 60);
        attempts++;
      } while (
        distance(x, y, heroCenter.x, heroCenter.y) < heroRadius + 50 &&
        attempts < 50
      );

      const size = getCircleSize(isMobile);
      const now = Date.now();
      // 每个圆环有不同的显示延迟，实现种子渐次开放的效果
      const revealDelay = random(5000, 25000); // 5-25秒后开始显示

      return {
        id: q.id,
        question: q,
        x,
        y,
        vx: random(-0.08, 0.08), // 降低初始速度
        vy: random(-0.08, 0.08),
        size,
        opacity: 0,
        rotation: random(0, 360),
        rotationSpeed: random(-0.2, 0.2),
        phase: 'entering' as const,
        enterDelay: i * 100,
        // 种子生长属性
        revealProgress: 0,
        revealStartTime: now + revealDelay,
        revealDuration: random(15000, 25000), // 15-25秒完成一次显示
        isRevealed: false,
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

    const heroCenter = { x: dimensions.width / 2, y: dimensions.height / 2 };
    const heroRadius = Math.min(dimensions.width, dimensions.height) * (isMobile ? 0.22 : 0.28);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentCircles = circlesRef.current;
      const now = Date.now();

      // Draw connection lines between circles (but not mouse connection line)
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

        // 已移除：鼠标到圆环的指示线段
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

        let { x, y, vx, vy, rotation, opacity, phase, revealProgress, revealStartTime, isRevealed } = circle;
        const { rotationSpeed, revealDuration } = circle;

        // 如果当前圆环被悬停，停止移动
        const isCurrentlyHovered = hoveredCircle === circle.id;

        if (!isCurrentlyHovered) {
          // Resonance boost
          if (showResonance) {
            vx += random(-0.05, 0.05);
            vy += random(-0.05, 0.05);
          }

          vx *= 0.995; // 更慢的阻尼
          vy *= 0.995;

          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > 0.5) { // 降低最大速度
            vx = (vx / speed) * 0.5;
            vy = (vy / speed) * 0.5;
          }

          x += vx;
          y += vy;
          rotation += rotationSpeed;

          // 边界碰撞
          const margin = circle.size;
          if (x < margin || x > dimensions.width - margin) {
            vx *= -0.8;
            x = Math.max(margin, Math.min(dimensions.width - margin, x));
          }
          if (y < margin || y > dimensions.height - margin) {
            vy *= -0.8;
            y = Math.max(margin, Math.min(dimensions.height - margin, y));
          }

          // 避开中心六边形区域
          const distToCenter = distance(x, y, heroCenter.x, heroCenter.y);
          if (distToCenter < heroRadius + 30) {
            // 将圆环推离中心
            const pushAngle = Math.atan2(y - heroCenter.y, x - heroCenter.x);
            const pushForce = 0.3;
            vx += Math.cos(pushAngle) * pushForce;
            vy += Math.sin(pushAngle) * pushForce;
          }
        }

        // 种子生长逻辑
        if (now >= revealStartTime && !isRevealed) {
          const elapsed = now - revealStartTime;
          revealProgress = Math.min(1, elapsed / revealDuration);
          if (revealProgress >= 1) {
            isRevealed = true;
            // 重置为下一次显示周期
            revealStartTime = now + random(20000, 40000); // 20-40秒后重新开始
            revealProgress = 0;
            isRevealed = false;
          }
        }

        if (phase === 'entering') {
          opacity = Math.min(1, opacity + 0.015);
          if (opacity >= 1) phase = 'active';
        }

        return { ...circle, x, y, vx, vy, rotation, opacity, phase, revealProgress, revealStartTime, revealDuration, isRevealed };
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
  }, [dimensions, hoveredCircle, isMobile, showResonance]);

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
          const now = Date.now();

          const newCircle: CircleState = {
            id: `spawn-${Date.now()}`,
            question: q,
            x,
            y,
            vx: Math.cos(angle) * 0.8,
            vy: Math.sin(angle) * 0.8,
            size: getCircleSize(false),
            opacity: 0,
            rotation: 0,
            rotationSpeed: random(-0.2, 0.2),
            phase: 'entering',
            enterDelay: 0,
            revealProgress: 0,
            revealStartTime: now + random(10000, 20000),
            revealDuration: random(15000, 25000),
            isRevealed: false,
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
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
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
                &ldquo;{resonanceQuote.text}&rdquo;
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
  containerWidth: number;
  containerHeight: number;
}

function QuestionCircle({ circle, isDark, isMobile, isHovered, onHover, onLeave, containerWidth, containerHeight }: QuestionCircleProps) {
  const color = COLOR_MAP[circle.question.color];
  const [showText, setShowText] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // 悬停时显示问题文字
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (isHovered) {
      showTimer = setTimeout(() => setShowText(true), 100);
    } else {
      // 使用微小延迟来避免 lint 警告
      hideTimer = setTimeout(() => {
        setShowText(false);
        setShowExplanation(false);
      }, 0);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isHovered]);

  // 点击显示解释
  const handleClick = () => {
    if (showText) {
      setShowExplanation(!showExplanation);
    } else {
      // 移动端点击直接显示问题
      setShowText(true);
    }
  };

  // 种子生长逻辑：当生长进度达到一定阈值时自动显示问题
  const shouldAutoReveal = circle.revealProgress >= 0.8;

  // 计算文本显示位置，避免超出边界和中心区域
  const getTextPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const heroRadius = Math.min(containerWidth, containerHeight) * (isMobile ? 0.22 : 0.28);

    // 默认在下方显示
    let position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    // 如果圆环在容器下半部分，文本显示在上方
    if (circle.y > containerHeight * 0.6) {
      position = 'top';
    }

    // 如果文本可能显示到中心六边形区域，调整位置
    const distToCenter = distance(circle.x, circle.y, centerX, centerY);
    if (distToCenter < heroRadius + 100) {
      // 靠近中心，需要向外显示
      if (circle.x < centerX) {
        position = 'left';
      } else {
        position = 'right';
      }
    }

    // 边界检查
    if (circle.x < 150) position = 'right';
    if (circle.x > containerWidth - 150) position = 'left';

    return position;
  };

  const textPosition = getTextPosition();

  // 统一的基础透明度
  const baseOpacity = 0.7;

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
        scale: 1, // 去掉悬停放大效果
        opacity: circle.opacity * baseOpacity,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        delay: circle.phase === 'entering' ? circle.enterDelay / 1000 : 0,
        duration: 0.4,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleClick}
    >
      {/* Glow effect - 根据种子生长进度调整 */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: circle.size * 2,
          height: circle.size * 2,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${withAlpha(color, 0.25)}, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.4 + circle.revealProgress * 0.3,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Main circle */}
      <svg
        width={circle.size}
        height={circle.size}
        viewBox="0 0 60 60"
        className="relative"
        style={{
          filter: isHovered
            ? `drop-shadow(0 0 15px ${color})`
            : `drop-shadow(0 0 6px ${withAlpha(color, 0.4)})`,
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
          opacity={0.5}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
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
          opacity={0.7}
        />

        {/* Inner filled circle - 根据生长进度变化 */}
        <motion.circle
          cx="30"
          cy="30"
          r="12"
          fill={withAlpha(color, isDark ? 0.25 : 0.15)}
          stroke={color}
          strokeWidth="1.5"
          animate={{
            r: 10 + circle.revealProgress * 3,
            opacity: 0.6 + circle.revealProgress * 0.4,
          }}
          style={{ transformOrigin: "30px 30px" }}
        />

        {/* Center dot - 种子核心 */}
        <motion.circle
          cx="30"
          cy="30"
          r="4"
          fill={color}
          animate={{
            scale: shouldAutoReveal ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: shouldAutoReveal ? 1 : 2, repeat: Infinity }}
        />

        {/* 生长进度指示环 */}
        {circle.revealProgress > 0 && circle.revealProgress < 1 && (
          <motion.circle
            cx="30"
            cy="30"
            r="24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={`${circle.revealProgress * 150} 150`}
            strokeLinecap="round"
            opacity={0.6}
            style={{
              transformOrigin: "30px 30px",
              transform: "rotate(-90deg)"
            }}
          />
        )}
      </svg>

      {/* Question text - 悬停或自动显示时出现 */}
      <AnimatePresence>
        {(showText || shouldAutoReveal) && (
          <QuestionTextDisplay
            question={circle.question.question}
            explanation={circle.question.explanation}
            color={color}
            isDark={isDark}
            isMobile={isMobile}
            position={textPosition}
            showExplanation={showExplanation}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ Question Text Display Component ============
interface QuestionTextDisplayProps {
  question: string;
  explanation?: string;
  color: string;
  isDark: boolean;
  isMobile: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  showExplanation: boolean;
}

function QuestionTextDisplay({ question, explanation, color, isDark, isMobile, position, showExplanation }: QuestionTextDisplayProps) {
  // 根据位置计算样式
  const getPositionStyles = () => {
    const base = {
      position: 'absolute' as const,
      zIndex: 50,
      maxWidth: isMobile ? '200px' : '280px',
    };

    switch (position) {
      case 'top':
        return {
          ...base,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '12px',
        };
      case 'bottom':
        return {
          ...base,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '12px',
        };
      case 'left':
        return {
          ...base,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '12px',
        };
      case 'right':
        return {
          ...base,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '12px',
        };
    }
  };

  const getAnimationDirection = () => {
    switch (position) {
      case 'top': return { initial: { y: 10 }, animate: { y: 0 }, exit: { y: 10 } };
      case 'bottom': return { initial: { y: -10 }, animate: { y: 0 }, exit: { y: -10 } };
      case 'left': return { initial: { x: 10 }, animate: { x: 0 }, exit: { x: 10 } };
      case 'right': return { initial: { x: -10 }, animate: { x: 0 }, exit: { x: -10 } };
    }
  };

  const animation = getAnimationDirection();

  return (
    <motion.div
      style={getPositionStyles()}
      initial={{ opacity: 0, ...animation.initial }}
      animate={{ opacity: 1, ...animation.animate }}
      exit={{ opacity: 0, ...animation.exit, transition: { duration: 0.15 } }}
    >
      {/* Background blur */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-xl"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(14,14,20,0.95), rgba(26,26,46,0.9))`
            : `linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))`,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${withAlpha(color, 0.3)}`,
          boxShadow: `0 0 30px ${withAlpha(color, 0.2)}`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Content */}
      <div className="relative px-4 py-2">
        {/* Question text */}
        <motion.p
          className="text-sm font-medium leading-relaxed"
          style={{
            color: isDark ? '#fff' : '#1a1a2e',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.p>

        {/* Explanation (if available and clicked) */}
        <AnimatePresence>
          {showExplanation && explanation && (
            <motion.p
              className="mt-2 pt-2 text-xs leading-relaxed border-t"
              style={{
                color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                borderColor: withAlpha(color, 0.2),
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {explanation}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Click hint */}
        {explanation && !showExplanation && (
          <motion.p
            className="mt-1 text-xs opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.5 }}
          >
            点击查看更多
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

export default ScienceCircles;
