import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Film, Users, Clock } from 'lucide-react';
import { easings } from '../hooks/useAnimationSystem';
import { GRADIENTS, gradientTextStyle, COLOR_PALETTE } from '../utils/gradients';

const EXPERTISE = [
  {
    icon: <Film size={18} aria-hidden="true" />,
    value: '50+',
    label: 'Projects',
    sublabel: 'Film & TVC',
    color: COLOR_PALETTE.amber[500]
  },
  {
    icon: <Users size={18} aria-hidden="true" />,
    value: '20+',
    label: 'Clients',
    sublabel: 'Global brands',
    color: '#f59e0b'
  },
  {
    icon: <Clock size={18} aria-hidden="true" />,
    value: '5+',
    label: 'Years',
    sublabel: 'Industry exp.',
    color: '#d97706'
  },
];

const SKILLS = [
  'Compositing', 'Matchmoving', 'Rotoscoping', 'Cleanup'
];

function AnimatedCounter({ target, duration = 2000 }: { target: string; duration?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const numericTarget = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[\d]/g, '');

  const count = useMotionValue(0);
  const displayCount = useMotionTemplate`${count.get().toFixed(0)}`;

  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const animatedCount = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    [0, 0, numericTarget]
  );

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        value={animatedCount}
        onUpdate={(latest) => {
          if (!shouldReduceMotion) {
            count.set(latest);
          }
        }}
      >
        {shouldReduceMotion ? numericTarget : Math.floor(animatedCount.get())}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

// Animated stat card
function StatCard({ 
  stat, 
  index, 
  isHovered, 
  onHover 
}: { 
  stat: typeof EXPERTISE[0]; 
  index: number;
  isHovered: boolean;
  onHover: (hovering: boolean) => void;
}) {
  return (
    <motion.div
      className="relative text-center p-4 rounded-xl cursor-default"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ 
        delay: 0.3 + index * 0.1, 
        duration: 0.5,
        ease: easings.easeOut,
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover={{ y: -3 }}
      animate={{
        background: isHovered
          ? 'rgba(18, 18, 22, 0.8)'
          : 'rgba(12, 12, 15, 0.5)',
        borderColor: isHovered 
          ? `${stat.color}25` 
          : 'rgba(255,255,255,0.06)',
      }}
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(40px)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {/* Icon container */}
      <motion.div
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2"
        animate={{
          background: isHovered ? `${stat.color}12` : 'rgba(255,255,255,0.03)',
          borderColor: isHovered ? `${stat.color}25` : 'rgba(255,255,255,0.05)',
        }}
        transition={{ duration: 0.3 }}
        style={{ border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <motion.span
          animate={{ color: isHovered ? stat.color : 'rgba(255,255,255,0.3)' }}
          transition={{ duration: 0.3 }}
        >
          {stat.icon}
        </motion.span>
      </motion.div>

      {/* Value */}
      <motion.div
        className="text-xl font-bold mb-0.5"
        animate={{
          color: isHovered ? stat.color : 'rgba(255,255,255,0.9)',
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedCounter target={stat.value} />
      </motion.div>

      {/* Label */}
      <div className="text-[10px] text-white/40 uppercase tracking-wider">
        {stat.label}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        style={{
          background: `radial-gradient(ellipse at center, ${stat.color}08 0%, transparent 70%)`,
          transition: 'opacity 0.3s ease',
        }}
      />
    </motion.div>
  );
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Parallax transforms
  const imageY = useTransform(
    scrollYProgress, 
    shouldReduceMotion ? [0, 1, 1, 1] : [0, 1], 
    shouldReduceMotion ? [0, 0, 0, 0] : [40, -40]
  );
  
  const contentY = useTransform(
    scrollYProgress, 
    shouldReduceMotion ? [0, 1, 1, 1] : [0, 1], 
    shouldReduceMotion ? [0, 0, 0, 0] : [20, -20]
  );

  return (
    <section 
      id="about" 
      ref={containerRef} 
      className="py-24 md:py-32 overflow-hidden" 
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className="sr-only">About Hai Luong — VFX Compositor</h2>
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: easings.easeOut }}
          >
            {/* Ambient glow */}
            <motion.div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full"
              animate={{
                opacity: [0.2, 0.3, 0.2],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'radial-gradient(circle, rgba(232,164,0,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Image container with parallax */}
            <motion.div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden"
              style={{ y: imageY }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Hai Luong - VFX Compositor & Motion Designer"
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: easings.easeOut }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,14,0.9) 0%, transparent 55%)',
                }}
              />

              {/* Glass frame effect */}
              <motion.div
                aria-hidden="true"
                className="absolute inset-3 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </motion.div>

            {/* Availability badge with entrance animation */}
            <motion.div
              className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 p-4 rounded-xl"
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5, ease: easings.backOut }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              style={{
                background: 'rgba(14, 14, 18, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              <motion.div 
                className="flex items-center gap-2.5"
                initial={{ x: -10, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
              >
                {/* Pulsing availability dot */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      '0 0 8px rgba(52,211,153,0.5)',
                      '0 0 16px rgba(52,211,153,0.8)',
                      '0 0 8px rgba(52,211,153,0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm text-white/80 font-medium">Available</span>
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24"
              initial={{ opacity: 0, rotate: -45 }}
              whileInView={{ opacity: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{
                background: 'linear-gradient(135deg, rgba(232,164,0,0.1) 0%, transparent 50%)',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              }}
            />
          </motion.div>

          {/* Content side */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: easings.easeOut }}
          >
            {/* Section label with animated line */}
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
                style={{ background: GRADIENTS.amberPrimary }}
              />
              <motion.span 
                className="text-[11px] uppercase tracking-[0.4em] font-medium text-amber-400/80"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                About
              </motion.span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              VFX Compositor crafting<br />
              <motion.span
                className="text-amber-400"
                initial={{ backgroundPosition: '0% 50%' }}
                whileInView={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5,
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{
                  background: GRADIENTS.amberPrimary,
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                cinematic visuals
              </motion.span>
            </motion.h2>

            {/* Value proposition */}
            <motion.div 
              className="space-y-5 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                I'm a VFX Compositor with <motion.span 
                  className="text-white/80 font-medium"
                  whileHover={{ color: '#fbbf24' }}
                  transition={{ duration: 0.2 }}
                >
                  5+ years of experience
                </motion.span> in compositing, matchmoving, and visual effects for film, television commercials, and music videos.
              </p>
              <p className="text-sm text-white/45 leading-relaxed">
                Based in Ho Chi Minh City, I work with studios worldwide to deliver photorealistic visual effects that enhance storytelling and exceed client expectations.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Core Expertise</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill, i) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ 
                      y: -2, 
                      scale: 1.05,
                      backgroundColor: 'rgba(232,164,0,0.1)',
                      borderColor: 'rgba(232,164,0,0.25)',
                    }}
                    style={{
                      background: 'rgba(232,164,0,0.06)',
                      border: '1px solid rgba(232,164,0,0.15)',
                      color: 'rgba(232,164,0,0.8)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {EXPERTISE.map((stat, i) => (
                <StatCard
                  key={stat.label}
                  stat={stat}
                  index={i}
                  isHovered={hoveredStat === i}
                  onHover={(hovering) => setHoveredStat(hovering ? i : null)}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
