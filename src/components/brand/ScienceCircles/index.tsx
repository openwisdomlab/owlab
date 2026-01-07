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
  const dragRef = useRef<{ id: string; startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);

  const [circles, setCircles] = useState<CircleState[]>([]);
  const [hoveredCircle, setHoveredCircle] = useState<string | null>(null);
  const [clickedCircle, setClickedCircle] = useState<string | null>(null);
  const [draggingCircle, setDraggingCircle] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isNearEyeZone, setIsNearEyeZone] = useState(false); // 拖拽时是否接近眼睛区域
  const [pinnedCircleId, setPinnedCircleId] = useState<string | null>(null); // 当前固定的圆圈ID
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
        const currentPinnedId = dragRef.current?.id;

        // 固定问题在眼睛上方，使用新的固定标签显示
        // 圆圈位于眼睛上边缘，卡片在圆圈上方展示
        circlesRef.current = circlesRef.current.map(circle => {
          if (circle.id === currentPinnedId) {
            return {
              ...circle,
              isPinned: true,
              x: heroCenter.x,
              y: heroCenter.y - heroRadius - 30,
              vx: 0, vy: 0,
            };
          }
          return circle;
        });
        setCircles([...circlesRef.current]);

        // 设置当前固定的圆圈ID（用于隐藏其他圆圈的标签）
        setPinnedCircleId(currentPinnedId ?? null);

        // 清除其他圆圈的悬停和点击状态
        setHoveredCircle(null);
        setClickedCircle(null);

        // 固定显示20秒后卡片消失，圆圈也不再显示
        setTimeout(() => {
          // 直接从数组中删除该圆圈，而不是让它飘走
          circlesRef.current = circlesRef.current.filter(circle => circle.id !== currentPinnedId);
          setCircles([...circlesRef.current]);
          setPinnedCircleId(null);
        }, 20000);
      }
    }

    setDraggingCircle(null);
    dragRef.current = null;
  }, [heroCenter.x, heroCenter.y, heroRadius]);

  // Handle circle hover
  const handleCircleHover = useCallback((circleId: string) => {
    setHoveredCircle(circleId);
  }, []);

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
  }, [dimensions, hoveredCircle, clickedCircle, draggingCircle, isMobile, heroCenter.x, heroCenter.y, heroRadius]);

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

    // 不允许拖拽已固定的圆圈
    if (circle.isPinned) return;

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
            hasPinnedCircle={!!pinnedCircleId && pinnedCircleId !== circle.id}
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
  hasPinnedCircle: boolean; // 是否有其他圆圈被固定（用于隐藏此圆圈的标签）
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  containerWidth: number;
  containerHeight: number;
  heroRadius: number;
}

function QuestionCircle({
  circle, isDark, isMobile, isHovered, isClicked, isDragging, hasPinnedCircle,
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

  // 固定的圆圈不接受鼠标事件，避免干扰其他圆圈的拖拽
  const pointerClass = circle.isPinned
    ? 'absolute pointer-events-none'
    : `absolute pointer-events-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`;

  return (
    <motion.div
      className={pointerClass}
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
      {/* Glow effect - 减小光晕尺寸，避免大泡沫效果；固定时隐藏 */}
      {!circle.isPinned && (
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
      )}

      {/* Main circle - 固定时隐藏，只显示卡片 */}
      {!circle.isPinned && (
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

        {/* 固定时不再显示额外的脉动圆环，避免干扰卡片阅读 */}
      </svg>
      )}

      {/* 固定标签显示 - 当圆圈被固定在眼睛上方时显示更显著的标签 */}
      <AnimatePresence>
        {circle.isPinned && !isDragging && (
          <>
            {/* 小眼睛图标指示捕获位置 */}
            <motion.div
              className="absolute flex items-center justify-center"
              style={{
                width: 36,
                height: 36,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 999,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${withAlpha(brandColors.neonCyan, 0.2)}, transparent)`,
                  border: `1.5px solid ${withAlpha(brandColors.neonCyan, 0.5)}`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-sm">👁</span>
              </motion.div>
            </motion.div>
            <PinnedQuestionTag
              question={circle.question.question}
              explanation={circle.question.explanation}
              color={color}
              isDark={isDark}
              isMobile={isMobile}
            />
          </>
        )}
      </AnimatePresence>

      {/* Question text - 不在 isPinned 时显示，也不在有其他固定圆圈时显示（避免遮挡固定卡片） */}
      <AnimatePresence>
        {!hasPinnedCircle && ((showText && !isDragging && !circle.isPinned) || (isAutoRevealing && !isDragging && !circle.isPinned)) && (
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

// ============ Pinned Question Tag Component ============
interface PinnedQuestionTagProps {
  question: string;
  explanation: string;
  color: string;
  isDark: boolean;
  isMobile: boolean;
}

function PinnedQuestionTag({ question, explanation, color, isDark, isMobile }: PinnedQuestionTagProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        // 将卡片定位在当前位置上方，确保清晰可见
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        width: isMobile ? '300px' : '400px',
        maxWidth: '90vw',
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* 发光背景 */}
      <motion.div
        className="absolute inset-0 -m-3 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at center, ${withAlpha(brandColors.neonCyan, 0.25)}, ${withAlpha(color, 0.15)}, transparent 80%)`,
          filter: 'blur(20px)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* 主容器 */}
      <motion.div
        className="relative px-5 py-4 rounded-xl"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(14,14,20,0.98), rgba(26,26,46,0.95))`
            : `linear-gradient(135deg, rgba(255,255,255,0.99), rgba(248,250,252,0.97))`,
          backdropFilter: 'blur(24px)',
          border: `2px solid ${withAlpha(brandColors.neonCyan, 0.7)}`,
          boxShadow: `
            0 0 40px ${withAlpha(brandColors.neonCyan, 0.5)},
            0 0 80px ${withAlpha(color, 0.3)},
            inset 0 0 20px ${withAlpha(brandColors.neonCyan, 0.1)}
          `,
        }}
      >
        {/* 顶部装饰条 */}
        <motion.div
          className="absolute -top-px left-1/2 -translate-x-1/2 h-1 rounded-full"
          style={{
            width: '50%',
            background: `linear-gradient(90deg, transparent, ${brandColors.neonCyan}, ${color}, transparent)`,
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* 眼睛图标和标题 */}
        <motion.div
          className="flex items-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <motion.span
            className="text-lg"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👁
          </motion.span>
          <span
            className="text-xs font-semibold"
            style={{
              background: `linear-gradient(90deg, ${brandColors.neonCyan}, ${color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            好奇心捕获
          </span>
        </motion.div>

        {/* 问题文本 */}
        <motion.p
          className="text-sm font-medium leading-relaxed"
          style={{
            color: isDark ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)',
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {question}
        </motion.p>

        {/* 解读文本 */}
        <motion.p
          className="text-xs mt-3 pt-3 border-t leading-relaxed"
          style={{
            color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
            borderColor: withAlpha(color, 0.25),
            lineHeight: 1.7,
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {explanation}
        </motion.p>

        {/* 角落装饰点 */}
        <motion.div
          className="absolute -top-1 -left-1 w-2 h-2 rounded-full"
          style={{ background: brandColors.neonCyan }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full"
          style={{ background: color }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.25 }}
        />
        <motion.div
          className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: brandColors.neonCyan }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
        />
      </motion.div>
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
