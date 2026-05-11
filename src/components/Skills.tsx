import { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { easings, timing } from '../hooks/useAnimationSystem';
import { COLOR_PALETTE } from '../utils/gradients';

const ANIMATION_CONFIG = {
  shimmerDuration: 2.5,
  shimmerRepeatDelay: 1.5,
  progressDuration: 1.4,
  lightSweepDuration: 0.9,
  cardHoverDuration: 0.6,
  rimDuration: 0.5,
};

const SOFTWARE = [
  { name: 'After Effects', category: 'Motion Graphics & VFX', level: 90, color: COLOR_PALETTE.amber[500] },
  { name: 'PFtrack', category: 'Matchmove & Tracking', level: 80, color: '#f59e0b' },
  { name: 'Premiere Pro', category: 'Video Editing', level: 70, color: '#d97706' },
  { name: 'Photoshop', category: 'Image Editing', level: 60, color: '#b45309' },
];

function ProgressBar({
  level,
  color,
  delay = 0
}: {
  level: number;
  color: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className="relative h-1.5 bg-white/5 rounded-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}80, ${color})`,
        }}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${level}%` } : { width: 0 }}
        transition={{
          duration: ANIMATION_CONFIG.progressDuration,
          delay: delay + 0.2,
          ease: easings.easeOut,
        }}
      />
      {isInView && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{
            duration: ANIMATION_CONFIG.shimmerDuration,
            repeat: 2,
            repeatDelay: ANIMATION_CONFIG.shimmerRepeatDelay,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}

function SkillCard({
  software,
  index,
  isHovered,
  onHover
}: {
  software: typeof SOFTWARE[0];
  index: number;
  isHovered: boolean;
  onHover: (hovering: boolean) => void;
}) {
  const shouldReduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onHover(!isHovered);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        delay: index * 0.1,
        duration: 0.7,
        ease: easings.easeOut,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover={{ y: -5 }}
      whileFocus={{ y: -5 }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${software.name} - ${software.category} - ${software.level}% proficiency`}
      className="relative cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
    >
      <motion.div
        className="relative p-6 rounded-3xl overflow-hidden h-full"
        animate={{
          background: isHovered
            ? 'rgba(20, 20, 24, 0.72)'
            : 'rgba(12, 12, 15, 0.6)',
          borderColor: isHovered ? `${software.color}30` : 'rgba(255, 255, 255, 0.07)',
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${software.color}12, inset 0 1px 0 rgba(255,255,255,0.1)`
            : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
        transition={{ duration: ANIMATION_CONFIG.cardHoverDuration, ease: easings.easeOut }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: ANIMATION_CONFIG.rimDuration }}
          style={{
            background: `linear-gradient(90deg, transparent, ${software.color}40, transparent)`,
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(circle at 50% 0%, ${software.color}10 0%, transparent 65%)` }}
        />

        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
            animate={isHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
            transition={{ duration: ANIMATION_CONFIG.lightSweepDuration, ease: 'easeOut' }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)' }}
          />
        )}

        <motion.div
          className="relative flex items-start justify-between mb-4"
          aria-hidden="true"
        >
          <div>
            <motion.h3
              className="text-lg font-bold"
              animate={{
                color: isHovered ? software.color : 'rgba(255,255,255,0.88)',
              }}
              transition={{ duration: 0.5 }}
            >
              {software.name}
            </motion.h3>
            <motion.span
              className="text-[10px] text-amber-400/60 uppercase tracking-wider mt-1 block"
              animate={{ color: isHovered ? `${software.color}99` : 'rgba(232,164,0,0.6)' }}
            >
              {software.category}
            </motion.span>
          </div>

          <motion.div
            animate={{
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? [0, -8, 8, 0] : 0,
            }}
            transition={{ duration: 0.5, ease: easings.easeOut }}
          >
            <motion.span
              className="text-2xl font-bold"
              animate={{
                color: isHovered ? software.color : 'rgba(255,255,255,0.3)',
              }}
              transition={{ duration: 0.5 }}
            >
              {software.level}%
            </motion.span>
          </motion.div>
        </motion.div>

        <ProgressBar level={software.level} color={software.color} delay={index * 0.15} />

        <motion.div
          className="absolute inset-x-4 bottom-0 h-px rounded-full"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: ANIMATION_CONFIG.rimDuration }}
          style={{
            background: `linear-gradient(90deg, transparent, ${software.color}20, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function Skills() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="skills"
      className="py-24 md:py-32 overflow-hidden"
      aria-labelledby="skills-heading"
    >
      <h2 id="skills-heading" className="sr-only">Skills & Expertise</h2>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: easings.easeOut }}
          className="mb-16"
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-10 h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))' }}
            />
            <motion.span
              className="text-[11px] uppercase tracking-[0.4em] font-medium text-amber-400/80"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Skills
            </motion.span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Professional Expertise
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {SOFTWARE.map((software, index) => (
            <SkillCard
              key={software.name}
              software={software}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={(hovering) => setHoveredIndex(hovering ? index : null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
