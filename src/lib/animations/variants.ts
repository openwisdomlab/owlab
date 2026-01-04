/**
 * Framer Motion Animation Variants
 * Visual Identity System v1.0
 */

import type { Variants } from 'framer-motion';

// ========================================
// Level 1: Micro-motion
// ========================================

export const microMotion: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export const glowOnHover: Variants = {
  initial: {
    boxShadow: '0 0 0 rgba(217, 26, 122, 0)'
  },
  hover: {
    boxShadow: '0 0 20px rgba(217, 26, 122, 0.5)',
    transition: { duration: 0.3 }
  }
};

export const colorShift: Variants = {
  initial: { color: '#2563EB' }, // Blue
  hover: {
    color: '#D91A7A', // Pink
    transition: { duration: 0.3 }
  }
};

// ========================================
// Level 2: Interactive Animation
// ========================================

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const particleBurst: Variants = {
  initial: {
    scale: 0,
    opacity: 0
  },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      ease: 'easeOut'
    }
  }
};

export const pathDraw: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.5, ease: 'easeInOut' },
      opacity: { duration: 0.3 }
    }
  }
};

export const morph3D: Variants = {
  initial: {
    rotateY: 0,
    rotateX: 0
  },
  hover: {
    rotateY: 15,
    rotateX: 5,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// ========================================
// Pulse Animations
// ========================================

export const pulseSlow: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const pulseMedium: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const pulseFast: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// ========================================
// Owl States Animations
// ========================================

export const gazeState: Variants = {
  initial: {
    scale: 1,
    opacity: 0.9
  },
  animate: {
    scale: [1, 1.01, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const sparkState: Variants = {
  initial: {
    scale: 0.9,
    rotate: 0
  },
  animate: {
    scale: [0.9, 1.1, 0.9],
    rotate: [0, 360],
    transition: {
      scale: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'reverse'
      },
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};

export const connectState: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0
  },
  animate: {
    pathLength: [0, 1, 1, 0],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

export const flightState: Variants = {
  initial: {
    x: 0,
    y: 0
  },
  animate: {
    x: [0, 10, 0, -10, 0],
    y: [0, -5, -10, -5, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

export const shareState: Variants = {
  initial: {
    scale: 1,
    opacity: 1
  },
  animate: {
    scale: [1, 1.3, 1],
    opacity: [1, 0.3, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeOut'
    }
  }
};

// ========================================
// Exit Animations
// ========================================

export const particleDissolve: Variants = {
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: {
      duration: 0.6,
      ease: 'easeIn'
    }
  }
};

export const fadeOut: Variants = {
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};
