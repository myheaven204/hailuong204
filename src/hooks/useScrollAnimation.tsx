import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import {
  fadeInUp as fadeInUpVariant,
  scaleIn as scaleInVariant,
  slideInLeft as slideInLeftVariant,
  slideInRight as slideInRightVariant,
  staggerContainer as staggerContainerVariant,
  timing,
  easings,
} from './useAnimationSystem';

export function useScrollAnimation(
  containerRef?: React.RefObject<HTMLElement | null>,
  options?: { offset?: [string, string] }
) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: (options?.offset ?? ['start end', 'end start']) as [`start end` | `end start`, `start end` | `end start`],
  });

  return { scrollYProgress };
}

export function useScrollTransform(
  scrollYProgress: MotionValue<number>,
  inputRange: number[],
  outputRange: (number | string)[]
) {
  return useTransform(scrollYProgress, inputRange, outputRange);
}

export const fadeInUp = {
  hidden: fadeInUpVariant.hidden,
  visible: (i: number = 0) => ({
    ...fadeInUpVariant.visible,
    transition: {
      duration: timing.slow,
      delay: i * timing.staggerNormal,
      ease: easings.easeOut,
    },
  }),
};

export const scaleIn = {
  hidden: scaleInVariant.hidden,
  visible: (i: number = 0) => ({
    ...scaleInVariant.visible,
    transition: {
      duration: timing.normal,
      delay: i * timing.staggerSlow,
      ease: easings.easeOut,
    },
  }),
};

export const slideInLeft = {
  hidden: slideInLeftVariant.hidden,
  visible: (i: number = 0) => ({
    ...slideInLeftVariant.visible,
    transition: {
      duration: timing.verySlow,
      delay: i * timing.staggerNormal,
      ease: easings.easeOut,
    },
  }),
};

export const slideInRight = {
  hidden: slideInRightVariant.hidden,
  visible: (i: number = 0) => ({
    ...slideInRightVariant.visible,
    transition: {
      duration: timing.verySlow,
      delay: i * timing.staggerNormal,
      ease: easings.easeOut,
    },
  }),
};

export const staggerContainer = staggerContainerVariant;

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
