"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { brandColors } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";

interface EinsteinQuoteProps {
  locale?: string;
}

// Interactive E=MC² Formula Component with enhanced physics-inspired animations
function InteractiveFormula({ isDark }: { isDark: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const primaryColor = isDark ? brandColors.neonCyan : brandColors.blue;
  const accentColor = isDark ? brandColors.neonPink : brandColors.violet;
  const energyColor = isDark ? brandColors.violet : brandColors.neonPink;

  const handleClick = useCallback(() => {
    setClickCount(prev => prev + 1);
    setIsActivated(true);
    setTimeout(() => setIsActivated(false), 1500);
  }, []);

  // Energy wave ripples on click
  const ripples = Array.from({ length: 4 }, (_, i) => i);
  // Orbiting particles
  const orbitingParticles = Array.from({ length: 6 }, (_, i) => i);

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      {/* Orbiting electron particles */}
      {orbitingParticles.map((i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute pointer-events-none"
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: i % 2 === 0 ? primaryColor : accentColor,
            boxShadow: `0 0 6px ${i % 2 === 0 ? primaryColor : accentColor}`,
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: [
              Math.cos((i * Math.PI * 2) / 6) * (isHovered ? 35 : 25) - 2,
              Math.cos((i * Math.PI * 2) / 6 + Math.PI) * (isHovered ? 35 : 25) - 2,
              Math.cos((i * Math.PI * 2) / 6) * (isHovered ? 35 : 25) - 2,
            ],
            y: [
              Math.sin((i * Math.PI * 2) / 6) * (isHovered ? 25 : 18) - 2,
              Math.sin((i * Math.PI * 2) / 6 + Math.PI) * (isHovered ? 25 : 18) - 2,
              Math.sin((i * Math.PI * 2) / 6) * (isHovered ? 25 : 18) - 2,
            ],
            opacity: isHovered || isActivated ? [0.4, 0.9, 0.4] : [0.2, 0.4, 0.2],
            scale: isActivated ? [1, 2, 0] : isHovered ? [1, 1.3, 1] : 1,
          }}
          transition={{
            duration: isActivated ? 0.8 : 3 + i * 0.3,
            repeat: isActivated ? 0 : Infinity,
            ease: "linear",
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Persistent subtle pulse - the formula is "alive" */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
          filter: 'blur(10px)',
        }}
        animate={{
          scale: isHovered ? [1, 1.3, 1] : [1, 1.15, 1],
          opacity: isHovered ? [0.5, 0.8, 0.5] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: isHovered ? 1.5 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Outer glow ring on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border: `1px solid ${energyColor}`,
        }}
        animate={{
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0,
          scale: isHovered ? [1.1, 1.2, 1.1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Formula container */}
      <div
        className="relative px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg"
        style={{
          background: isDark
            ? 'rgba(14, 14, 20, 0.85)'
            : 'rgba(255, 255, 255, 0.9)',
          border: `1.5px solid ${isHovered ? energyColor : primaryColor}60`,
          boxShadow: isHovered
            ? `0 0 25px ${energyColor}40, inset 0 0 15px ${primaryColor}10`
            : `0 0 12px ${primaryColor}20`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Energy field background effect */}
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${primaryColor}08 50%, transparent 70%)`,
          }}
          animate={{
            backgroundPosition: isHovered ? ['0% 0%', '200% 200%'] : '0% 0%',
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />

        {/* The formula */}
        <div className="relative flex items-baseline">
          {/* E - Energy */}
          <motion.span
            className="text-base md:text-lg lg:text-xl font-bold italic"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: primaryColor,
            }}
            animate={{
              textShadow: isHovered
                ? `0 0 15px ${primaryColor}, 0 0 25px ${primaryColor}50`
                : isActivated
                  ? [`0 0 0px ${primaryColor}`, `0 0 30px ${primaryColor}`, `0 0 10px ${primaryColor}`]
                  : `0 0 5px ${primaryColor}70`,
              scale: isActivated ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.4 }}
          >
            E
          </motion.span>

          {/* = with energy transfer animation */}
          <motion.span
            className="text-sm md:text-base lg:text-lg font-bold mx-0.5 relative overflow-hidden"
            style={{
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
              width: '14px',
              textAlign: 'center',
            }}
          >
            <span className="relative z-10">=</span>
            {/* Energy flow line */}
            <motion.div
              className="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2"
              style={{
                background: `linear-gradient(90deg, transparent, ${energyColor}, transparent)`,
              }}
              animate={{
                x: isHovered || isActivated ? ['-100%', '100%'] : '-100%',
                opacity: isHovered || isActivated ? 1 : 0,
              }}
              transition={{
                x: { duration: 0.5, repeat: isHovered ? Infinity : 0, ease: "linear" },
                opacity: { duration: 0.2 },
              }}
            />
          </motion.span>

          {/* M - Mass */}
          <motion.span
            className="text-base md:text-lg lg:text-xl font-bold italic"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: accentColor,
            }}
            animate={{
              textShadow: isHovered
                ? `0 0 15px ${accentColor}, 0 0 25px ${accentColor}50`
                : isActivated
                  ? [`0 0 0px ${accentColor}`, `0 0 30px ${accentColor}`, `0 0 10px ${accentColor}`]
                  : `0 0 5px ${accentColor}70`,
              scale: isActivated ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.4, delay: isActivated ? 0.1 : 0 }}
          >
            M
          </motion.span>

          {/* C² - Speed of light squared */}
          <motion.span
            className="text-base md:text-lg lg:text-xl font-bold italic relative"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: energyColor,
            }}
            animate={{
              textShadow: isHovered
                ? `0 0 15px ${energyColor}, 0 0 25px ${energyColor}50`
                : isActivated
                  ? [`0 0 0px ${energyColor}`, `0 0 35px ${energyColor}`, `0 0 12px ${energyColor}`]
                  : `0 0 5px ${energyColor}70`,
              scale: isActivated ? [1, 1.25, 1] : 1,
            }}
            transition={{ duration: 0.4, delay: isActivated ? 0.2 : 0 }}
          >
            C
            {/* Superscript 2 with spinning animation */}
            <motion.sup
              className="absolute -top-0.5 -right-2.5 text-[10px] md:text-xs font-bold"
              style={{
                color: primaryColor,
                fontStyle: 'normal',
              }}
              animate={{
                rotate: isActivated ? [0, 720] : isHovered ? [0, 360] : 0,
                scale: isHovered ? [1, 1.3, 1] : isActivated ? [1, 1.5, 1] : 1,
                textShadow: isHovered ? `0 0 8px ${primaryColor}` : 'none',
              }}
              transition={{
                rotate: { duration: isActivated ? 0.8 : 2, ease: "easeOut", repeat: isHovered && !isActivated ? Infinity : 0 },
                scale: { duration: 1, repeat: isHovered ? Infinity : 0 },
              }}
            >
              2
            </motion.sup>
          </motion.span>
        </div>
      </div>

      {/* Click ripple effects - energy release waves */}
      <AnimatePresence>
        {isActivated && ripples.map((i) => (
          <motion.div
            key={`${clickCount}-${i}`}
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 2.5 + i * 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: i * 0.12, ease: "easeOut" }}
            style={{
              border: `2px solid ${i === 0 ? energyColor : i === 1 ? accentColor : i === 2 ? primaryColor : energyColor}`,
              boxShadow: `0 0 10px ${i === 0 ? energyColor : i === 1 ? accentColor : primaryColor}50`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Energy burst particles on click */}
      <AnimatePresence>
        {isActivated && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`burst-${clickCount}-${i}`}
            className="absolute pointer-events-none"
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: i % 3 === 0 ? energyColor : i % 3 === 1 ? accentColor : primaryColor,
              boxShadow: `0 0 6px ${i % 3 === 0 ? energyColor : i % 3 === 1 ? accentColor : primaryColor}`,
              left: '50%',
              top: '50%',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos((i * Math.PI * 2) / 8) * 60,
              y: Math.sin((i * Math.PI * 2) / 8) * 45,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Hover tooltip - light speed with enhanced styling */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none px-2 py-0.5 rounded"
        style={{
          fontSize: '8px',
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          fontFamily: 'monospace',
          background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
          border: `1px solid ${primaryColor}30`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 5,
        }}
        transition={{ duration: 0.25 }}
      >
        c = 299,792,458 m/s
      </motion.div>
    </motion.div>
  );
}

// Artistic Einstein silhouette SVG component
function EinsteinSilhouette({ isDark }: { isDark: boolean }) {
  const primaryColor = isDark ? brandColors.neonCyan : brandColors.blue;
  const accentColor = isDark ? brandColors.neonPink : brandColors.violet;

  return (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      style={{ filter: isDark ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))' : 'none' }}
    >
      <defs>
        <linearGradient id="einstein-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.9" />
          <stop offset="50%" stopColor={accentColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={primaryColor} stopOpacity="0.5" />
        </linearGradient>
        <radialGradient id="einstein-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-edge">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="100" r="95" fill="url(#einstein-glow)" />

      {/* Einstein iconic wild hair silhouette */}
      <g transform="translate(30, 15) scale(0.7)">
        {/* Wild hair - the iconic Einstein look */}
        <path
          d="M100 20
             C60 10, 30 30, 25 60
             C20 80, 25 90, 30 95
             C20 100, 15 120, 20 140
             C25 160, 40 175, 60 180
             C70 182, 80 183, 100 183
             C120 183, 130 182, 140 180
             C160 175, 175 160, 180 140
             C185 120, 180 100, 170 95
             C175 90, 180 80, 175 60
             C170 30, 140 10, 100 20Z"
          fill="url(#einstein-gradient)"
          opacity="0.9"
        />

        {/* Hair texture - wild strands */}
        <g stroke={primaryColor} strokeWidth="1.5" fill="none" opacity="0.6">
          <path d="M40 50 Q30 30, 50 25 Q70 20, 60 40" />
          <path d="M70 30 Q65 15, 85 15 Q100 15, 95 35" />
          <path d="M110 25 Q120 10, 140 20 Q155 30, 145 50" />
          <path d="M150 45 Q165 35, 170 55 Q175 70, 160 75" />
          <path d="M30 70 Q15 60, 20 80 Q22 95, 35 90" />
        </g>

        {/* Face outline */}
        <ellipse
          cx="100"
          cy="115"
          rx="45"
          ry="55"
          fill={isDark ? brandColors.dark : '#F8FAFC'}
          stroke="url(#einstein-gradient)"
          strokeWidth="2"
          opacity="0.95"
        />

        {/* Eyes - wise and contemplative */}
        <g transform="translate(0, 5)">
          <ellipse cx="82" cy="105" rx="8" ry="5" fill={primaryColor} opacity="0.8" />
          <ellipse cx="118" cy="105" rx="8" ry="5" fill={primaryColor} opacity="0.8" />
          <circle cx="82" cy="105" r="2" fill={isDark ? '#fff' : brandColors.dark} />
          <circle cx="118" cy="105" r="2" fill={isDark ? '#fff' : brandColors.dark} />
        </g>

        {/* Eyebrows - expressive */}
        <path
          d="M70 95 Q82 88, 92 95"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M108 95 Q118 88, 130 95"
          stroke={primaryColor}
          strokeWidth="2"
          fill="none"
          opacity="0.7"
        />

        {/* Nose */}
        <path
          d="M100 110 L100 130 Q95 135, 100 138 Q105 135, 100 130"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
        />

        {/* Mustache - iconic */}
        <path
          d="M75 145 Q85 155, 100 152 Q115 155, 125 145"
          stroke={primaryColor}
          strokeWidth="3"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M78 147 Q88 158, 100 155 Q112 158, 122 147"
          stroke={accentColor}
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />

        {/* Gentle smile */}
        <path
          d="M85 160 Q100 168, 115 160"
          stroke={primaryColor}
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* Animated thought particles */}
      <motion.circle
        cx="160"
        cy="40"
        r="3"
        fill={accentColor}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
          y: [0, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      />
      <motion.circle
        cx="170"
        cy="60"
        r="2"
        fill={primaryColor}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
          y: [0, -8, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      <motion.circle
        cx="155"
        cy="55"
        r="2.5"
        fill={accentColor}
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.3, 1],
          y: [0, -12, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      />

      {/* E=mc² formula floating */}
      <motion.text
        x="155"
        y="30"
        fontSize="12"
        fontFamily="serif"
        fontStyle="italic"
        fill={accentColor}
        opacity="0.7"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          y: [30, 25, 30]
        }}
        transition={{ duration: 4, repeat: Infinity, type: "tween" }}
      >
        E=mc²
      </motion.text>
    </svg>
  );
}

export function EinsteinQuote({ locale }: EinsteinQuoteProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const quote = "提出一个问题往往比解决一个问题更重要。因为解决问题也许仅是一个数学上或实验上的技能而已，而提出新的问题，却需要有创造性的想象力，标志着科学的真正进步。";
  const author = "阿尔伯特·爱因斯坦";

  return (
    <section className="relative py-1 md:py-1.5 px-3 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${brandColors.dark} 0%, rgba(20, 20, 35, 1) 50%, ${brandColors.dark} 100%)`
            : `linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)`
        }}
      />

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-row items-center gap-1.5 md:gap-2">
          {/* Einstein portrait + Formula - Left side (compact) */}
          <motion.div
            className="flex flex-col items-center gap-0.5 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Einstein Portrait - smaller */}
            <motion.div
              className="relative w-12 h-12 md:w-14 md:h-14"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative w-full h-full">
                <EinsteinSilhouette isDark={isDark} />
              </div>
            </motion.div>

            {/* Interactive E=MC² Formula - smaller */}
            <InteractiveFormula isDark={isDark} />
          </motion.div>

          {/* Quote content - Right side with boundary */}
          <motion.div
            className="flex-1 rounded-lg px-2 py-1 md:px-2.5 md:py-1.5"
            style={{
              background: isDark
                ? 'rgba(255, 255, 255, 0.03)'
                : 'rgba(0, 0, 0, 0.02)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Quote text - using div instead of blockquote to avoid global CSS interference */}
            <div
              className="text-xs md:text-sm leading-relaxed font-medium"
              style={{
                color: isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.8)',
                fontFamily: "'Source Han Serif CN', 'Noto Serif SC', 'STSong', serif",
                letterSpacing: '0.01em',
                lineHeight: '1.55',
              }}
            >
              <span
                className="text-base md:text-lg font-serif"
                style={{
                  color: isDark ? brandColors.violet : brandColors.blue,
                  opacity: 0.4
                }}
              >
                "
              </span>
              {quote}
              <span
                className="text-base md:text-lg font-serif"
                style={{
                  color: isDark ? brandColors.violet : brandColors.blue,
                  opacity: 0.4
                }}
              >
                "
              </span>
            </div>

            {/* Author - inline right aligned */}
            <div className="flex justify-end mt-0.5">
              <span
                className="text-[10px] md:text-xs font-medium"
                style={{
                  color: isDark ? brandColors.neonPink : brandColors.violet,
                }}
              >
                — {author}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
