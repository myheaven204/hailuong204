/**
 * Centralized Animation System
 * 
 * Provides consistent motion design across the portfolio:
 * - Spring physics configurations
 * - Easing curves
 * - Timing constants
 * - Animation presets
 */

import { Variants } from 'framer-motion';

// ─── SPRING PHYSICS ───────────────────────────────────────────────────────────

export const springs = {
  // Gentle spring for subtle movements
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 14,
    mass: 0.8,
  },
  
  // Snappy spring for interactions
  snappy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 25,
    mass: 0.6,
  },
  
  // Bouncy spring for playful elements
  bouncy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 10,
    mass: 0.5,
  },
  
  // Smooth spring for reveals
  smooth: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },
};

// ─── EASING CURVES ───────────────────────────────────────────────────────────

export const easings = {
  // Smooth deceleration (ease-out)
  easeOut: [0.25, 0.1, 0.25, 1] as const,
  
  // Smooth acceleration (ease-in)
  easeIn: [0.55, 0, 1, 0.45] as const,
  
  // Smooth in-out
  easeInOut: [0.65, 0, 0.35, 1] as const,
  
  // Expo out - dramatic deceleration
  expoOut: [0.16, 1, 0.3, 1] as const,
  
  // Back out - slight overshoot
  backOut: [0.34, 1.56, 0.64, 1] as const,
  
  // Anticipate in - start from negative
  anticipate: [0.68, -0.55, 0.27, 1.55] as const,
};

// ─── TIMING CONSTANTS ────────────────────────────────────────────────────────

export const timing = {
  // Duration scale (in seconds)
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  verySlow: 0.8,
  
  // Stagger delays
  staggerFast: 0.04,
  staggerNormal: 0.08,
  staggerSlow: 0.12,
  staggerVerySlow: 0.2,
};

// ─── ENTRANCE ANIMATIONS ─────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.normal,
      ease: easings.backOut,
    },
  },
};

export const scaleInSoft: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.verySlow,
      ease: easings.expoOut,
    },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const lightSweep: Variants = {
  hidden: { x: '-100%' },
  visible: {
    x: '200%',
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};

// ─── STAGGER CONTAINER ────────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: timing.staggerNormal,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: timing.staggerFast,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: timing.staggerSlow,
      delayChildren: 0.2,
    },
  },
};

// ─── PAGE TRANSITIONS ────────────────────────────────────────────────────────

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: timing.fast,
      ease: easings.easeIn,
    },
  },
};

// ─── MODAL/DIALOG ─────────────────────────────────────────────────────────────

export const modalEnter: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      ...springs.gentle,
      duration: timing.normal,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: timing.fast,
      ease: easings.easeIn,
    },
  },
};

export const backdropEnter: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// ─── MICRO-INTERACTIONS ───────────────────────────────────────────────────────

export const buttonHover = {
  scale: 1.02,
  transition: springs.snappy,
};

export const buttonTap = {
  scale: 0.98,
  transition: springs.snappy,
};

export const cardHover = {
  y: -4,
  transition: springs.gentle,
};

// ─── TEXT REVEALS ─────────────────────────────────────────────────────────────

export const textReveal: Variants = {
  hidden: { 
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: timing.slow,
      ease: easings.expoOut,
    },
  },
};

export const textRevealStagger: Variants = {
  hidden: { 
    clipPath: 'inset(0 100% 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: {
      duration: timing.normal,
      ease: easings.expoOut,
      staggerChildren: timing.staggerFast,
    },
  },
};

// ─── SCROLL-LINKED ANIMATIONS ────────────────────────────────────────────────

export const scrollFadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

// ─── LIST ITEMS ─────────────────────────────────────────────────────────────

export const listItem: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20,
  },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * timing.staggerFast,
      duration: timing.normal,
      ease: easings.easeOut,
    },
  }),
};

// ─── ICON ANIMATIONS ─────────────────────────────────────────────────────────

export const iconBounce: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 500,
      damping: 15,
    },
  },
};

export const iconSpin: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: timing.normal,
      ease: easings.backOut,
    },
  },
};

// ─── PROGRESS/SKILL BAR ──────────────────────────────────────────────────────

export const progressFill: Variants = {
  hidden: { scaleX: 0 },
  visible: (progress: number) => ({
    scaleX: progress / 100,
    transition: {
      duration: 1.2,
      delay: 0.3,
      ease: easings.easeOut,
    },
  }),
};

// ─── COMBO ANIMATIONS ─────────────────────────────────────────────────────────

export const entranceWithParallax: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

export const revealFromBottom: Variants = {
  hidden: { 
    clipPath: 'inset(100% 0 0 0)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0% 0 0 0)',
    opacity: 1,
    transition: {
      duration: timing.slow,
      ease: easings.easeOut,
    },
  },
};

// ─── REDUCED MOTION ALTERNATIVE ───────────────────────────────────────────────

export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// ─── HELPER HOOKS/CONSTANTS ──────────────────────────────────────────────────

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: readonly [number, number, number, number];
  stagger?: number;
}

export const defaultAnimationConfig: AnimationConfig = {
  duration: timing.normal,
  stagger: timing.staggerNormal,
};

export const createCustomAnimation = (config: AnimationConfig) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: config.duration ?? timing.normal,
      delay: config.delay ?? 0,
      ease: config.ease ?? easings.easeOut,
    },
  },
});
