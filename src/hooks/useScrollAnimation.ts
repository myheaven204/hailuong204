import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

/**
 * Hook chuẩn cho scroll-driven animations dùng framer-motion.
 */
export function useScrollAnimation(
  containerRef?: React.RefObject<HTMLElement | null>,
  options?: { offset?: [string, string] }
) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: options?.offset ?? ['start end', 'end start'],
  });

  return { scrollYProgress };
}

/**
 * Tạo transform value từ scroll progress.
 */
export function useScrollTransform(
  scrollYProgress: MotionValue<number>,
  inputRange: number[],
  outputRange: (number | string)[]
) {
  return useTransform(scrollYProgress, inputRange, outputRange);
}

/**
 * Fade in từ dưới lên khi cuộn vào viewport.
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Scale in animation.
 */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.12,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Slide in từ bên trái.
 */
export const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Slide in từ bên phải.
 */
export const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

/**
 * Stagger container cho children.
 */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Parallax wrapper - dùng motion.div với y transform dựa trên scroll.
 */
export function ParallaxSection({
  children,
  speed = 0.5,
  className,
  style,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100]);

  return (
    <motion.div ref={ref} className={className} style={style}>
      <motion.div style={{ y }}>{children}</motion.div>
    </motion.div>
  );
}
