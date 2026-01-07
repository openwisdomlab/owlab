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
  // 自动展示相关
  autoRevealPhase: 'waiting' | 'revealing' | 'showing' | 'fading' | 'cooldown';
  autoRevealStartTime: number; // 开始展示的时间
  autoRevealShowUntil: number; // 停止展示的时间
  autoRevealOpacity: number; // 自动展示的透明度（在动画循环中更新）
  // 彩蛋相关
  isPinned: boolean; // 是否被固定在眼睛上方
  pinnedY?: number; // 固定位置的Y坐标
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

// 减小圆圈尺寸，避免大泡沫效果
const CIRCLE_SIZE_RANGE = { min: 18, max: 36 };

const CURIOSITY_QUOTES = [
  { text: "好奇心是一切智慧的开始", author: "苏格拉底" },
  { text: "提出问题比解决问题更重要", author: "爱因斯坦" },
  { text: "保持好奇，保持愚蠢", author: "乔布斯" },
  { text: "问题是通往真理的门户", author: "培根" },
  { text: "好奇心是科学之母", author: "伽利略" },
];

const EYE_DISCOVERY_MESSAGES = [
  "如果这个问题有答案，会带来什么新问题？",
  "谁第一次问出这个问题？他们在想什么？",
  "如果一千年后有人再问这个问题，会有不同的含义吗？",
  "这个问题背后，藏着什么更大的未知？",
  "你愿意用多长时间去追寻这个问题的答案？",
  "如果这个问题永远没有答案，它还值得被问吗？",
];

// 彩蛋引导性问题 - 用提问方式激发更多思考
const EYE_PROVOCATIVE_PROMPTS = [
  "如果这个问题的答案完全颠覆你的认知，你准备好了吗？",
  "有没有可能，提出这个问题本身就比找到答案更重要？",
  "如果10岁的孩子问你这个问题，你会怎么回答？",
  "假设这个问题永远不会有标准答案，你还会继续探索吗？",
  "如果你必须用一个新问题来回应这个问题，你会问什么？",
  "这个问题的答案，会让世界变得更好还是更复杂？",
  "有没有可能，你已经知道答案，只是还没意识到？",
  "如果这个问题的答案藏在你今天遇到的某件小事里呢？",
  "这个问题让你想起了哪个你一直逃避的问题？",
  "如果宇宙用这个问题考验人类，我们及格了吗？",
];

// 种子生长配置：降低自动展示频率，增加周期间隔
const AUTO_REVEAL_CONFIG = {
  cycleInterval: 45000, // 45秒一个周期（更长间隔）
  maxSimultaneous: 1, // 最多同时展示1个（降低密度）
  showDuration: 5000, // 展示停留5秒
  fadeInDuration: 1000, // 淡入1秒（更平缓）
  fadeOutDuration: 1500, // 淡出1.5秒
  cooldownDuration: 60000, // 展示后60秒冷却（更长冷却）
  initialDelay: 15000, // 首次展示延迟15秒（避免刚进入页面就展示）
};

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
  const dragRef = useRef<{ id: string; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  const [circles, setCircles] = useState<CircleState[]>([]);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
  const [clickedCircle, setClickedCircle] = useState<string | null>(null);
  const [draggingCircle, setDraggingCircle] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showResonance, setShowResonance] = useState(false);
  const [resonanceQuote, setResonanceQuote] = useState(CURIOSITY_QUOTES[0]);
  const [eyeDiscovery, setEyeDiscovery] = useState<{
    show: boolean;
    message: string;
    question: string;
    explanation?: string;
    provocativePrompt: string; // 引导性问题
    deepThought?: {
      followUpQuestions?: string[];
      scenario?: string;
      connections?: string[];
    };
  } | null>(null);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isNearEyeZone, setIsNearEyeZone] = useState(false); // 拖拽时是否接近眼睛区域
  const lastVisibleTimeRef = useRef<number>(0);

  // 初始化 lastVisibleTimeRef
  useEffect(() => {
    lastVisibleTimeRef.current = Date.now();
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Page visibility detection - 避免长时间不访问后突然闪现很多问题
  useEffect(() => {
    const handleVisibilityChange = () => {
      const nowVisible = !document.hidden;
      const now = Date.now();

      if (nowVisible && !isPageVisible) {
        // 页面从不可见变为可见
        const hiddenDuration = now - lastVisibleTimeRef.current;

        // 如果隐藏超过30秒，重置所有圆环的自动展示时间，避免大量同时展示
        if (hiddenDuration > 30000) {
          circlesRef.current = circlesRef.current.map((circle, index) => ({
            ...circle,
            autoRevealPhase: 'waiting' as const,
            autoRevealStartTime: now + AUTO_REVEAL_CONFIG.initialDelay + random(index * 3000, index * 5000),
            autoRevealShowUntil: 0,
            autoRevealOpacity: 0,
          }));
        }
      }

      setIsPageVisible(nowVisible);
      if (nowVisible) {
        lastVisibleTimeRef.current = now;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPageVisible]);

  const actualCircleCount = isMobile ? Math.floor(circleCount * 0.4) : circleCount;
  const heroRadius = Math.min(dimensions.width, dimensions.height) * (isMobile ? 0.22 : 0.28);
  const heroCenter = { x: dimensions.width / 2, y: dimensions.height / 2 };

  // Initialize circles
  const initCircles = useCallback((width: number, height: number) => {
    const questions = getBalancedQuestions(actualCircleCount);
    const center = { x: width / 2, y: height / 2 };
    const radius = Math.min(width, height) * (isMobile ? 0.22 : 0.28);
    const now = Date.now();

    const newCircles: CircleState[] = questions.map((q, i) => {
      let x: number, y: number;
      let attempts = 0;

      // 增大初始化时的排斥距离，确保远离中心六边形
      do {
        x = random(60, width - 60);
        y = random(60, height - 60);
        attempts++;
      } while (
        distance(x, y, center.x, center.y) < radius + 80 &&
        attempts < 50
      );

      const size = getCircleSize(isMobile);
      // 随机分配自动展示时间，错开展示，使用更长的延迟避免初始密集展示
      const autoRevealDelay = AUTO_REVEAL_CONFIG.initialDelay + random(i * 2000, i * 4000 + 30000);

      return {
        id: q.id + '-' + Date.now() + '-' + i,
        question: q,
        x, y,
        // 增强移动性：提高初始速度
        vx: random(-0.25, 0.25),
        vy: random(-0.25, 0.25),
        size, opacity: 0,
        rotation: random(0, 360),
        rotationSpeed: random(-0.12, 0.12),
        phase: 'entering' as const,
        enterDelay: i * 80,
        // 新的自动展示状态
        autoRevealPhase: 'waiting' as const,
        autoRevealStartTime: now + autoRevealDelay,
        autoRevealShowUntil: 0,
        autoRevealOpacity: 0,
        isPinned: false,
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

  // Mouse move handler for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算拖拽圆圈的实际位置
    const circleX = x - dragRef.current.offsetX;
    const circleY = y - dragRef.current.offsetY;

    // 检测是否接近眼睛区域（使用 1.5 倍半径作为提示范围）
    const distToCenter = distance(circleX, circleY, heroCenter.x, heroCenter.y);
    setIsNearEyeZone(distToCenter < heroRadius * 1.5);

    // Update circle position
    circlesRef.current = circlesRef.current.map(circle => {
      if (circle.id === dragRef.current?.id) {
        return {
          ...circle,
          x: circleX,
          y: circleY,
          vx: 0, vy: 0,
        };
      }
      return circle;
    });
    setCircles([...circlesRef.current]);
  }, [heroCenter.x, heroCenter.y, heroRadius]);

  // Mouse up handler for drag end
  const handleMouseUp = useCallback(() => {
    if (!dragRef.current) return;

    // 重置眼睛区域接近状态
    setIsNearEyeZone(false);

    const draggedCircle = circlesRef.current.find(c => c.id === dragRef.current?.id);
    if (draggedCircle) {
      const distToCenter = distance(draggedCircle.x, draggedCircle.y, heroCenter.x, heroCenter.y);

      // 彩蛋：扩大进入眼睛区域的判定范围（从0.6倍扩大到1.2倍）
      // 让用户更容易将问题拖入眼睛区域
      if (distToCenter < heroRadius * 1.2) {
        const message = EYE_DISCOVERY_MESSAGES[Math.floor(Math.random() * EYE_DISCOVERY_MESSAGES.length)];
        const provocativePrompt = EYE_PROVOCATIVE_PROMPTS[Math.floor(Math.random() * EYE_PROVOCATIVE_PROMPTS.length)];

        setEyeDiscovery({
          show: true,
          message,
          question: draggedCircle.question.question,
          explanation: draggedCircle.question.explanation,
          provocativePrompt, // 添加引导性问题
          deepThought: draggedCircle.question.deepThought,
        });

        // 固定问题在眼睛上方，并保持显示问题解释卡片
        circlesRef.current = circlesRef.current.map(circle => {
          if (circle.id === dragRef.current?.id) {
            return {
              ...circle,
              isPinned: true,
              x: heroCenter.x,
              y: heroCenter.y - heroRadius - 80,
              vx: 0, vy: 0,
            };
          }
          return circle;
        });
        setCircles([...circlesRef.current]);

        // 延长显示时间到45秒，给用户充足的时间深入思考
        setTimeout(() => setEyeDiscovery(null), 45000);
      }
    }

    setDraggingCircle(null);
    dragRef.current = null;
  }, [heroCenter.x, heroCenter.y, heroRadius]);

  // Curiosity Resonance - Easter Egg
  const handleCircleHover = useCallback((circleId: string) => {
    setHoveredCircle(circleId);

    const now = Date.now();
    hoverHistoryRef.current = [...hoverHistoryRef.current.filter(t => now - t < 3000), now];

    if (hoverHistoryRef.current.length >= 4 && !showResonance) {
      setResonanceQuote(CURIOSITY_QUOTES[Math.floor(Math.random() * CURIOSITY_QUOTES.length)]);
      setShowResonance(true);
      setTimeout(() => setShowResonance(false), 4000);
    }
  }, [showResonance]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentCircles = circlesRef.current;
      const now = Date.now();

      // Draw connection lines
      currentCircles.forEach((c1, i) => {
        if (c1.phase === 'exiting' || c1.isPinned) return;

        currentCircles.slice(i + 1).forEach((c2) => {
          if (c2.phase === 'exiting' || c2.isPinned) return;

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
      });

      // Resonance effect
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

      // 统计当前正在自动展示的圆圈数量
      const currentlyShowingCount = currentCircles.filter(
        c => c.autoRevealPhase === 'revealing' || c.autoRevealPhase === 'showing' || c.autoRevealPhase === 'fading'
      ).length;

      // Update circle positions
      circlesRef.current = currentCircles.map((circle) => {
        if (circle.phase === 'exiting') return circle;
        if (circle.isPinned) return circle; // 固定的圆环不移动

        let { x, y, vx, vy, rotation, opacity, phase, autoRevealPhase, autoRevealStartTime, autoRevealShowUntil } = circle;
        const { rotationSpeed } = circle;

        const isCurrentlyHovered = hoveredCircle === circle.id || clickedCircle === circle.id;
        const isBeingDragged = draggingCircle === circle.id;

        // 增强移动性：只有悬停时才停止移动
        if (!isCurrentlyHovered && !isBeingDragged) {
          if (showResonance) {
            vx += random(-0.05, 0.05);
            vy += random(-0.05, 0.05);
          }

          // 更慢的速度衰减，保持更长时间的运动
          vx *= 0.9985;
          vy *= 0.9985;

          // 添加微小的随机扰动，保持持续运动
          if (Math.random() < 0.02) {
            vx += random(-0.08, 0.08);
            vy += random(-0.08, 0.08);
          }

          // 提高最大速度限制
          const speed = Math.sqrt(vx * vx + vy * vy);
          if (speed > 0.8) {
            vx = (vx / speed) * 0.8;
            vy = (vy / speed) * 0.8;
          }
          // 如果速度太低，给一个随机推力
          if (speed < 0.05) {
            vx = random(-0.15, 0.15);
            vy = random(-0.15, 0.15);
          }

          x += vx;
          y += vy;
          rotation += rotationSpeed;

          const margin = circle.size;
          if (x < margin || x > dimensions.width - margin) {
            vx *= -0.9;
            x = Math.max(margin, Math.min(dimensions.width - margin, x));
          }
          if (y < margin || y > dimensions.height - margin) {
            vy *= -0.9;
            y = Math.max(margin, Math.min(dimensions.height - margin, y));
          }

          // 增强中心区域排斥力，确保问题不出现在六边形内
          const distToCenter = distance(x, y, heroCenter.x, heroCenter.y);
          if (distToCenter < heroRadius + 60) {
            const pushAngle = Math.atan2(y - heroCenter.y, x - heroCenter.x);
            // 越靠近中心，排斥力越强
            const pushForce = 0.5 * (1 - distToCenter / (heroRadius + 60));
            vx += Math.cos(pushAngle) * pushForce;
            vy += Math.sin(pushAngle) * pushForce;
          }
        }

        // 新的种子生长逻辑：控制同时展示数量
        if (autoRevealPhase === 'waiting' && now >= autoRevealStartTime) {
          // 只有当前展示数量 < 最大值时才开始展示
          if (currentlyShowingCount < AUTO_REVEAL_CONFIG.maxSimultaneous) {
            autoRevealPhase = 'revealing';
            autoRevealShowUntil = now + AUTO_REVEAL_CONFIG.fadeInDuration + AUTO_REVEAL_CONFIG.showDuration;
          } else {
            // 延迟展示，等待其他圆圈完成
            autoRevealStartTime = now + random(3000, 8000);
          }
        } else if (autoRevealPhase === 'revealing') {
          // 淡入阶段
          const elapsed = now - (autoRevealShowUntil - AUTO_REVEAL_CONFIG.showDuration - AUTO_REVEAL_CONFIG.fadeInDuration);
          if (elapsed >= AUTO_REVEAL_CONFIG.fadeInDuration) {
            autoRevealPhase = 'showing';
          }
        } else if (autoRevealPhase === 'showing') {
          // 展示阶段，等待展示结束
          if (now >= autoRevealShowUntil) {
            autoRevealPhase = 'fading';
            autoRevealShowUntil = now + AUTO_REVEAL_CONFIG.fadeOutDuration;
          }
        } else if (autoRevealPhase === 'fading') {
          // 淡出阶段
          if (now >= autoRevealShowUntil) {
            autoRevealPhase = 'cooldown';
            autoRevealStartTime = now + AUTO_REVEAL_CONFIG.cooldownDuration + random(0, 15000);
          }
        } else if (autoRevealPhase === 'cooldown') {
          // 冷却阶段，等待下一次展示
          if (now >= autoRevealStartTime) {
            autoRevealPhase = 'waiting';
            autoRevealStartTime = now + random(5000, 20000);
          }
        }

        // 计算自动展示透明度
        let autoRevealOpacity = 0;
        if (autoRevealPhase === 'revealing') {
          const startTime = autoRevealShowUntil - AUTO_REVEAL_CONFIG.showDuration - AUTO_REVEAL_CONFIG.fadeInDuration;
          const elapsed = now - startTime;
          autoRevealOpacity = Math.min(1, elapsed / AUTO_REVEAL_CONFIG.fadeInDuration);
        } else if (autoRevealPhase === 'showing') {
          autoRevealOpacity = 1;
        } else if (autoRevealPhase === 'fading') {
          const startTime = autoRevealShowUntil - AUTO_REVEAL_CONFIG.fadeOutDuration;
          const elapsed = now - startTime;
          autoRevealOpacity = Math.max(0, 1 - elapsed / AUTO_REVEAL_CONFIG.fadeOutDuration);
        }

        if (phase === 'entering') {
          opacity = Math.min(1, opacity + 0.012);
          if (opacity >= 1) phase = 'active';
        }

        return { ...circle, x, y, vx, vy, rotation, opacity, phase, autoRevealPhase, autoRevealStartTime, autoRevealShowUntil, autoRevealOpacity };
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
  }, [dimensions, hoveredCircle, clickedCircle, draggingCircle, isMobile, showResonance, heroCenter.x, heroCenter.y, heroRadius]);

  // Spawn new circles periodically (slower)
  useEffect(() => {
    if (isMobile) return;

    const spawnInterval = setInterval(() => {
      if (circlesRef.current.length < actualCircleCount + 5) {
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

          const targetX = dimensions.width / 2 + random(-250, 250);
          const targetY = dimensions.height / 2 + random(-250, 250);
          const angle = Math.atan2(targetY - y, targetX - x);
          const now = Date.now();

          const newCircle: CircleState = {
            id: `spawn-${Date.now()}-${Math.random()}`,
            question: q,
            x, y,
            vx: Math.cos(angle) * 0.6,
            vy: Math.sin(angle) * 0.6,
            size: getCircleSize(false),
            opacity: 0,
            rotation: 0,
            rotationSpeed: random(-0.12, 0.12),
            phase: 'entering',
            enterDelay: 0,
            autoRevealPhase: 'waiting',
            autoRevealStartTime: now + random(30000, 60000), // 更长的延迟
            autoRevealShowUntil: 0,
            autoRevealOpacity: 0,
            isPinned: false,
          };

          circlesRef.current = [...circlesRef.current, newCircle];
        }
      }
    }, 15000); // 更慢的生成速度

    return () => clearInterval(spawnInterval);
  }, [actualCircleCount, dimensions, isMobile]);

  // Occasionally remove a circle
  useEffect(() => {
    if (isMobile) return;

    const fadeInterval = setInterval(() => {
      const nonPinnedCircles = circlesRef.current.filter(c => !c.isPinned);
      if (nonPinnedCircles.length > actualCircleCount) {
        const indexToRemove = Math.floor(Math.random() * nonPinnedCircles.length);
        const circleToRemove = nonPinnedCircles[indexToRemove];
        circlesRef.current = circlesRef.current.filter(c => c.id !== circleToRemove.id);
        setCircles([...circlesRef.current]);
      }
    }, 20000);

    return () => clearInterval(fadeInterval);
  }, [actualCircleCount, isMobile]);

  // Handle drag start
  const handleDragStart = useCallback((circleId: string, e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const circle = circlesRef.current.find(c => c.id === circleId);
    if (!circle) return;

    dragRef.current = {
      id: circleId,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      offsetX: e.clientX - rect.left - circle.x,
      offsetY: e.clientY - rect.top - circle.y,
    };
    setDraggingCircle(circleId);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: draggingCircle ? 20 : 1 }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: isDark ? 1 : 0.7 }}
      />

      {/* 拖拽中的远距离提示 - 当拖拽但未接近眼睛时显示 */}
      <AnimatePresence>
        {draggingCircle && !isNearEyeZone && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: heroCenter.x,
              top: heroCenter.y - heroRadius - 20,
              transform: 'translateX(-50%)',
              zIndex: 45,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <span
              className="text-xs px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                background: withAlpha(isDark ? '#fff' : '#000', 0.1),
                color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
              }}
            >
              拖到眼睛里深入探索 👁
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 眼睛区域拖拽提示 - 当拖拽圆圈接近时显示 */}
      <AnimatePresence>
        {isNearEyeZone && draggingCircle && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: heroCenter.x,
              top: heroCenter.y,
              transform: 'translate(-50%, -50%)',
              width: heroRadius * 2.4,
              height: heroRadius * 2.4,
              zIndex: 50,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* 外圈发光环 */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `2px dashed ${withAlpha(brandColors.neonCyan, 0.6)}`,
                boxShadow: `
                  0 0 30px ${withAlpha(brandColors.neonCyan, 0.4)},
                  inset 0 0 30px ${withAlpha(brandColors.neonCyan, 0.2)}
                `,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {/* 提示文字 */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  background: withAlpha(brandColors.neonCyan, 0.15),
                  color: brandColors.neonCyan,
                  border: `1px solid ${withAlpha(brandColors.neonCyan, 0.3)}`,
                }}
              >
                松开以深入探索
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {circles.map((circle) => (
          <QuestionCircle
            key={circle.id}
            circle={circle}
            isDark={isDark}
            isMobile={isMobile}
            isHovered={hoveredCircle === circle.id}
            isClicked={clickedCircle === circle.id}
            isDragging={draggingCircle === circle.id}
            onHover={() => handleCircleHover(circle.id)}
            onLeave={() => {
              setHoveredCircle(null);
              if (clickedCircle === circle.id) {
                setTimeout(() => setClickedCircle(null), 0);
              }
            }}
            onClick={() => setClickedCircle(circle.id)}
            onDragStart={(e) => handleDragStart(circle.id, e)}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            heroRadius={heroRadius}
          />
        ))}
      </AnimatePresence>

      {/* Eye Discovery Easter Egg - 引发思考版 */}
      <AnimatePresence>
        {eyeDiscovery?.show && (
          <motion.div
            className="absolute left-1/2 z-50 pointer-events-auto"
            style={{
              top: heroCenter.y - heroRadius - 180,
              transform: 'translateX(-50%)',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.7 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* 发光背景特效 */}
            <motion.div
              className="absolute inset-0 -m-8 rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${withAlpha(brandColors.neonCyan, 0.15)}, ${withAlpha(brandColors.violet, 0.1)}, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.4, 0.8],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div
              className="relative px-6 py-5 rounded-2xl text-left"
              style={{
                width: isMobile ? '90vw' : '440px',
                maxWidth: '440px',
                background: isDark
                  ? 'linear-gradient(135deg, rgba(14,14,20,0.98), rgba(26,26,46,0.95))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95))',
                backdropFilter: 'blur(24px)',
                border: `2px solid ${withAlpha(brandColors.neonCyan, 0.6)}`,
                boxShadow: `
                  0 0 60px ${withAlpha(brandColors.neonCyan, 0.5)},
                  0 0 100px ${withAlpha(brandColors.violet, 0.4)},
                  0 0 140px ${withAlpha(brandColors.neonPink, 0.2)},
                  inset 0 0 30px ${withAlpha(brandColors.neonCyan, 0.1)}
                `,
              }}
            >
              {/* 顶部装饰线 */}
              <motion.div
                className="absolute -top-px left-1/2 -translate-x-1/2 h-1 rounded-full"
                style={{
                  width: '60%',
                  background: `linear-gradient(90deg, transparent, ${brandColors.neonCyan}, ${brandColors.violet}, ${brandColors.neonPink}, transparent)`,
                }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* 头部信息 - 随机发现消息 */}
              <motion.p
                className="text-xs font-bold mb-3 text-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${brandColors.neonCyan}, ${brandColors.violet}, ${brandColors.neonPink})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                👁 {eyeDiscovery.message}
              </motion.p>

              {/* 主问题 */}
              <motion.p
                className="text-base font-semibold mb-4"
                style={{ color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {eyeDiscovery.question}
              </motion.p>

              {/* 引导性问题 - 用提问代替陈述，引发更多思考 */}
              <motion.div
                className="mb-4 p-4 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${withAlpha(brandColors.neonCyan, 0.08)}, ${withAlpha(brandColors.violet, 0.06)})`,
                  border: `1px solid ${withAlpha(brandColors.neonCyan, 0.25)}`,
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p
                  className="text-sm leading-relaxed italic"
                  style={{ color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.75)' }}
                >
                  &ldquo;{eyeDiscovery.provocativePrompt}&rdquo;
                </p>
              </motion.div>

              {/* 深度思考内容 - 只显示延伸问题，以提问为主 */}
              {eyeDiscovery.deepThought && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {/* 延伸问题 - 核心内容 */}
                  {eyeDiscovery.deepThought.followUpQuestions && eyeDiscovery.deepThought.followUpQuestions.length > 0 && (
                    <div className="mb-4">
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: brandColors.neonCyan }}
                      >
                        💭 如果再往深想一步呢？
                      </p>
                      <ul className="space-y-2">
                        {eyeDiscovery.deepThought.followUpQuestions.map((q, i) => (
                          <motion.li
                            key={i}
                            className="text-xs pl-4 relative leading-relaxed"
                            style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + i * 0.2 }}
                          >
                            <span
                              className="absolute left-0"
                              style={{ color: brandColors.violet }}
                            >
                              ?
                            </span>
                            {q}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 假设场景 - 改为提问形式 */}
                  {eyeDiscovery.deepThought.scenario && (
                    <motion.div
                      className="mb-4 p-3 rounded-lg"
                      style={{
                        background: withAlpha(brandColors.violet, 0.1),
                        border: `1px solid ${withAlpha(brandColors.violet, 0.3)}`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: brandColors.violet }}
                      >
                        🎭 想象一下…
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}
                      >
                        {eyeDiscovery.deepThought.scenario}
                      </p>
                    </motion.div>
                  )}

                  {/* 关联领域 - 改为提问形式 */}
                  {eyeDiscovery.deepThought.connections && eyeDiscovery.deepThought.connections.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-1.5 items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2 }}
                    >
                      <span
                        className="text-xs"
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
                      >
                        🔗 还能连接到…
                      </span>
                      {eyeDiscovery.deepThought.connections.map((conn, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: withAlpha(brandColors.neonPink, 0.15),
                            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                            border: `1px solid ${withAlpha(brandColors.neonPink, 0.3)}`,
                          }}
                        >
                          {conn}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* 底部提示 - 邀请式提问 */}
              <motion.p
                className="text-xs mt-4 pt-3 text-center border-t"
                style={{
                  color: withAlpha(brandColors.neonCyan, 0.7),
                  borderColor: withAlpha(brandColors.neonCyan, 0.15),
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
              >
                这个问题会陪伴你一段时间…你会想到什么？
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Curiosity Resonance */}
      <AnimatePresence>
        {showResonance && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
  isClicked: boolean;
  isDragging: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  containerWidth: number;
  containerHeight: number;
  heroRadius: number;
}

function QuestionCircle({
  circle, isDark, isMobile, isHovered, isClicked, isDragging,
  onHover, onLeave, onClick, onDragStart,
  containerWidth, containerHeight, heroRadius
}: QuestionCircleProps) {
  const color = COLOR_MAP[circle.question.color];
  const [showText, setShowText] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const isActive = isHovered || isClicked || circle.isPinned;

  // 显示文字逻辑
  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    if (isActive && !isDragging) {
      showTimer = setTimeout(() => setShowText(true), 100);
    } else if (!isActive && !isDragging) {
      hideTimer = setTimeout(() => {
        setShowText(false);
        setShowExplanation(false);
      }, 0);
    }

    return () => {
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [isActive, isDragging]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showText) {
      setShowExplanation(!showExplanation);
    }
    onClick();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    onDragStart(e);
  };

  // 判断是否应该自动展示问题文本
  const isAutoRevealing = circle.autoRevealPhase === 'revealing' ||
                          circle.autoRevealPhase === 'showing' ||
                          circle.autoRevealPhase === 'fading';

  // 计算文本位置，改进边界检测
  const getTextPosition = (): 'top' | 'bottom' | 'left' | 'right' => {
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const textWidth = isMobile ? 200 : 280;
    const textHeight = showExplanation ? 150 : 80;

    let position: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    // 上下边界检测
    if (circle.y > containerHeight - textHeight - 50) {
      position = 'top';
    } else if (circle.y < textHeight + 50) {
      position = 'bottom';
    }

    // 左右边界检测
    if (circle.x < textWidth / 2 + 30) {
      position = 'right';
    } else if (circle.x > containerWidth - textWidth / 2 - 30) {
      position = 'left';
    }

    // 中心区域检测
    const distToCenter = distance(circle.x, circle.y, centerX, centerY);
    if (distToCenter < heroRadius + 80) {
      if (circle.x < centerX) {
        position = 'left';
      } else {
        position = 'right';
      }
      // 再次检查边界
      if (position === 'left' && circle.x < textWidth + 30) {
        position = 'top';
      }
      if (position === 'right' && circle.x > containerWidth - textWidth - 30) {
        position = 'top';
      }
    }

    return position;
  };

  const textPosition = getTextPosition();
  const baseOpacity = 0.7;

  return (
    <motion.div
      className={`absolute pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: circle.x,
        top: circle.y,
        transform: `translate(-50%, -50%)`,
        zIndex: isDragging || isActive ? 100 : 1,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.1 : 1,
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
      onMouseDown={handleMouseDown}
    >
      {/* Glow effect - 减小光晕尺寸，避免大泡沫效果 */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: circle.size * 1.4,
          height: circle.size * 1.4,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${withAlpha(color, isDragging ? 0.35 : 0.2)}, transparent 70%)`,
          filter: 'blur(6px)',
        }}
        animate={{
          opacity: isActive || isDragging ? 0.85 : isAutoRevealing ? 0.6 : 0.35,
          scale: isDragging ? 1.2 : 1,
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
          filter: isActive || isDragging
            ? `drop-shadow(0 0 18px ${color})`
            : `drop-shadow(0 0 6px ${withAlpha(color, 0.4)})`,
        }}
      >
        <motion.circle
          cx="30" cy="30" r="28"
          fill="none" stroke={color} strokeWidth="1"
          strokeDasharray="4 6" opacity={0.5}
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "30px 30px" }}
        />

        <circle
          cx="30" cy="30" r="20"
          fill="none" stroke={color}
          strokeWidth="1.5" opacity={0.7}
        />

        <motion.circle
          cx="30" cy="30" r="12"
          fill={withAlpha(color, isDark ? 0.25 : 0.15)}
          stroke={color} strokeWidth="1.5"
          animate={{
            scale: isAutoRevealing ? 1.083 : 0.833,
            opacity: isAutoRevealing ? 1 : 0.6,
          }}
          style={{ transformOrigin: "30px 30px" }}
        />

        <motion.circle
          cx="30" cy="30" r="4"
          fill={color}
          animate={{
            scale: isAutoRevealing ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: isAutoRevealing ? 1 : 2, repeat: Infinity, type: "tween" }}
        />

        {/* 自动展示时的脉动光环 */}
        {isAutoRevealing && (
          <motion.circle
            cx="30" cy="30" r="26"
            fill="none" stroke={color} strokeWidth="2"
            opacity={0.6 * circle.autoRevealOpacity}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
            style={{ transformOrigin: "30px 30px" }}
          />
        )}

        {circle.isPinned && (
          <motion.circle
            cx="30" cy="30" r="26"
            fill="none" stroke={brandColors.neonCyan}
            strokeWidth="2" opacity={0.8}
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, type: "tween" }}
            style={{ transformOrigin: "30px 30px" }}
          />
        )}
      </svg>

      {/* Question text - 不在 isPinned 时显示，因为 eyeDiscovery 面板会接管显示 */}
      <AnimatePresence>
        {((showText && !isDragging && !circle.isPinned) || (isAutoRevealing && !isDragging && !circle.isPinned)) && (
          <QuestionTextDisplay
            question={circle.question.question}
            explanation={circle.question.explanation}
            color={color}
            isDark={isDark}
            isMobile={isMobile}
            position={textPosition}
            showExplanation={showExplanation}
            autoRevealOpacity={isAutoRevealing ? circle.autoRevealOpacity : 1}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ Question Text Display Component ============
interface QuestionTextDisplayProps {
  question: string;
  explanation: string;
  color: string;
  isDark: boolean;
  isMobile: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  showExplanation: boolean;
  autoRevealOpacity?: number;
}

function QuestionTextDisplay({
  question, explanation, color, isDark, isMobile,
  position, showExplanation, autoRevealOpacity = 1
}: QuestionTextDisplayProps) {
  const getPositionStyles = () => {
    // 显著提高 z-index，确保显示在最上方；增大宽度提高阅读友好性
    const base = {
      position: 'absolute' as const,
      zIndex: 1000,
      maxWidth: isMobile ? '220px' : '320px',
      minWidth: isMobile ? '180px' : '240px',
      whiteSpace: 'normal' as const,
    };

    switch (position) {
      case 'top':
        return { ...base, bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '12px' };
      case 'bottom':
        return { ...base, top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px' };
      case 'left':
        return { ...base, right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '12px' };
      case 'right':
        return { ...base, left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '12px' };
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
      animate={{ opacity: autoRevealOpacity, ...animation.animate }}
      exit={{ opacity: 0, ...animation.exit, transition: { duration: 0.3 } }}
    >
      <motion.div
        className="absolute inset-0 -m-4 rounded-2xl"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(14,14,20,0.97), rgba(26,26,46,0.95))`
            : `linear-gradient(135deg, rgba(255,255,255,0.99), rgba(248,250,252,0.97))`,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${withAlpha(color, 0.35)}`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.15), 0 0 30px ${withAlpha(color, 0.2)}`,
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
      />

      <div className="relative px-5 py-3">
        <motion.p
          className="text-sm font-medium leading-relaxed"
          style={{ color: isDark ? '#fff' : '#1a1a2e', lineHeight: 1.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {question}
        </motion.p>

        <AnimatePresence>
          {showExplanation && (
            <motion.p
              className="mt-3 pt-3 text-xs leading-relaxed border-t"
              style={{
                color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
                borderColor: withAlpha(color, 0.25),
                lineHeight: 1.7,
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {explanation}
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
}

export default ScienceCircles;
