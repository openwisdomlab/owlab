"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { brandColors } from "@/lib/brand/colors";
import { useTheme } from "@/components/ui/ThemeProvider";

interface EinsteinQuoteProps {
  locale?: string;
}

// Interactive E=MC² Formula Component
function InteractiveFormula({ isDark }: { isDark: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const primaryColor = isDark ? brandColors.neonCyan : brandColors.blue;
  const accentColor = isDark ? brandColors.neonPink : brandColors.violet;
  const energyColor = isDark ? brandColors.violet : brandColors.neonPink;

  const handleClick = useCallback(() => {
    setIsActivated(true);
    setTimeout(() => setIsActivated(false), 1500);
  }, []);

  // Generate particle positions
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30) * (Math.PI / 180),
    delay: i * 0.1,
    size: 2 + Math.random() * 3,
  }));

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(circle, ${energyColor}30 0%, transparent 70%)`,
          filter: 'blur(20px)',
          transform: 'scale(1.5)',
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0.3,
          scale: isActivated ? [1.5, 2, 1.5] : 1.5,
        }}
        transition={{ duration: isActivated ? 0.5 : 0.3 }}
      />

      {/* Formula container */}
      <div
        className="relative px-6 py-4 md:px-8 md:py-5 rounded-2xl backdrop-blur-xl"
        style={{
          background: isDark
            ? 'rgba(14, 14, 20, 0.6)'
            : 'rgba(255, 255, 255, 0.7)',
          border: `2px solid ${isHovered ? energyColor : primaryColor}40`,
          boxShadow: isHovered
            ? `0 0 40px ${energyColor}40, inset 0 0 30px ${energyColor}10`
            : `0 0 20px ${primaryColor}20`,
          transition: 'border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Energy particles around formula */}
        <AnimatePresence>
          {(isHovered || isActivated) && particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                width: particle.size,
                height: particle.size,
                background: particle.id % 2 === 0 ? primaryColor : accentColor,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.id % 2 === 0 ? primaryColor : accentColor}`,
              }}
              initial={{
                opacity: 0,
                x: '50%',
                y: '50%',
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: `calc(50% + ${Math.cos(particle.angle) * (isActivated ? 100 : 60)}px)`,
                y: `calc(50% + ${Math.sin(particle.angle) * (isActivated ? 100 : 60)}px)`,
                scale: [0, 1.5, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: isActivated ? 1 : 2,
                delay: particle.delay,
                repeat: isActivated ? 0 : Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* The formula itself */}
        <div className="relative flex items-baseline gap-1 md:gap-2">
          {/* E */}
          <motion.span
            className="text-3xl md:text-4xl lg:text-5xl font-bold italic"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: primaryColor,
              textShadow: isHovered ? `0 0 20px ${primaryColor}80` : 'none',
            }}
            animate={{
              scale: isActivated ? [1, 1.2, 1] : 1,
              color: isActivated ? [primaryColor, energyColor, primaryColor] : primaryColor,
            }}
            transition={{ duration: 0.5 }}
          >
            E
          </motion.span>

          {/* = with energy flow effect */}
          <motion.span
            className="text-2xl md:text-3xl lg:text-4xl font-bold mx-1 md:mx-2 relative"
            style={{
              color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
            }}
          >
            <span className="relative z-10">=</span>
            {/* Energy flow through equals sign */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <motion.div
                className="w-full h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${energyColor}, transparent)`,
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.span>

          {/* M */}
          <motion.span
            className="text-3xl md:text-4xl lg:text-5xl font-bold italic"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: accentColor,
              textShadow: isHovered ? `0 0 20px ${accentColor}80` : 'none',
            }}
            animate={{
              scale: isActivated ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            M
          </motion.span>

          {/* C with superscript 2 */}
          <motion.span
            className="text-3xl md:text-4xl lg:text-5xl font-bold italic relative"
            style={{
              fontFamily: "'Times New Roman', 'Georgia', serif",
              color: energyColor,
              textShadow: isHovered ? `0 0 20px ${energyColor}80` : 'none',
            }}
            animate={{
              scale: isActivated ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            C
            {/* Superscript 2 with special animation */}
            <motion.sup
              className="absolute -top-1 md:-top-2 -right-3 md:-right-4 text-lg md:text-xl lg:text-2xl"
              style={{
                color: primaryColor,
                fontStyle: 'normal',
              }}
              animate={{
                scale: isHovered ? [1, 1.3, 1] : 1,
                rotate: isActivated ? [0, 360] : 0,
                color: isActivated
                  ? [primaryColor, energyColor, accentColor, primaryColor]
                  : primaryColor,
              }}
              transition={{
                scale: { duration: 1.5, repeat: Infinity },
                rotate: { duration: 0.5 },
                color: { duration: 1.5 },
              }}
            >
              2
            </motion.sup>
          </motion.span>
        </div>

        {/* Light speed indicator */}
        <motion.div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          style={{
            fontSize: '10px',
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)',
            fontFamily: 'monospace',
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 5,
          }}
          transition={{ duration: 0.3 }}
        >
          c = 299,792,458 m/s
        </motion.div>
      </div>

      {/* Activation burst effect */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.8, 0], scale: [1, 2.5, 3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              border: `2px solid ${energyColor}`,
              boxShadow: `0 0 30px ${energyColor}`,
            }}
          />
        )}
      </AnimatePresence>
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
        transition={{ duration: 4, repeat: Infinity }}
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
    <section className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `linear-gradient(135deg, ${brandColors.dark} 0%, rgba(20, 20, 35, 1) 50%, ${brandColors.dark} 100%)`
            : `linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F8FAFC 100%)`
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? brandColors.neonCyan : brandColors.blue} 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Quote content - Left side */}
          <motion.div
            className="flex-1 text-left order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Quote mark */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span
                className="text-6xl md:text-8xl font-serif leading-none"
                style={{
                  color: isDark ? brandColors.violet : brandColors.blue,
                  opacity: 0.3
                }}
              >
                "
              </span>
            </motion.div>

            {/* Quote text */}
            <motion.blockquote
              className="text-lg md:text-xl lg:text-2xl leading-relaxed font-medium mb-6"
              style={{
                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)',
                fontFamily: "'Source Han Serif CN', 'Noto Serif SC', 'STSong', serif",
                letterSpacing: '0.02em',
                lineHeight: '1.8'
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {quote}
            </motion.blockquote>

            {/* Author - Right aligned */}
            <motion.div
              className="flex justify-end"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-px w-12"
                  style={{
                    background: `linear-gradient(to right, transparent, ${isDark ? brandColors.neonPink : brandColors.violet})`
                  }}
                />
                <span
                  className="text-base md:text-lg font-semibold tracking-wide"
                  style={{
                    color: isDark ? brandColors.neonPink : brandColors.violet,
                    fontFamily: "'PingFang SC', 'Microsoft YaHei', sans-serif"
                  }}
                >
                  {author}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Einstein portrait + Interactive Formula - Right side */}
          <motion.div
            className="flex flex-col items-center gap-6 md:gap-8 flex-shrink-0 order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {/* Interactive E=MC² Formula */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <InteractiveFormula isDark={isDark} />
            </motion.div>

            {/* Einstein Portrait */}
            <motion.div
              className="relative w-40 h-40 md:w-52 md:h-52 lg:w-60 lg:h-60"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              {/* Glow effect behind portrait */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: isDark
                    ? `radial-gradient(circle, ${brandColors.violet}40 0%, ${brandColors.neonPink}20 40%, transparent 70%)`
                    : `radial-gradient(circle, ${brandColors.blue}30 0%, ${brandColors.violet}15 40%, transparent 70%)`,
                  filter: 'blur(40px)',
                  transform: 'scale(1.3)'
                }}
              />

              {/* Edge blur effect */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle, transparent 40%, ${isDark ? brandColors.dark : '#F8FAFC'} 100%)`,
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              />

              {/* Portrait container */}
              <div className="relative w-full h-full">
                <EinsteinSilhouette isDark={isDark} />
              </div>

              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{
                  borderColor: isDark ? brandColors.neonCyan : brandColors.blue,
                  opacity: 0.3
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Second animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: isDark ? brandColors.neonPink : brandColors.violet,
                  opacity: 0.2
                }}
                animate={{
                  scale: [1.1, 1.25, 1.1],
                  opacity: [0.2, 0.05, 0.2]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${isDark ? brandColors.violet : brandColors.blue}40, transparent)`
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </section>
  );
}
