import { useState, useEffect, useRef, memo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play, X, Film } from 'lucide-react';
import { springs, easings, timing } from '../hooks/useAnimationSystem';

// ─── COUNT UP ANIMATION ───────────────────────────────────────────────────
function CountUp({ target, label, isInView }: { target: string; label: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const numericTarget = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[\d]/g, '');

  useEffect(() => {
    if (!isInView) return;
    
    if (shouldReduceMotion) {
      setCount(numericTarget);
      return;
    }

    let start = 0;
    const duration = 1500;
    const step = 16;
    const increment = numericTarget / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, step);
    return () => clearInterval(timer);
  }, [isInView, numericTarget, shouldReduceMotion]);

  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: easings.easeOut }}
    >
      <motion.div
        className="text-2xl md:text-3xl font-bold"
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: 0.2, duration: 0.5, ease: easings.backOut }}
        style={{
          background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count}{suffix}
      </motion.div>
      <motion.span 
        className="text-[10px] text-white/30 uppercase tracking-wider"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

// ─── SHOWREEL VIDEO CARD ──────────────────────────────────────────────────
const ShowreelVideo = memo(function ShowreelVideo({ videoId }: { videoId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isModalOpen]);

  return (
    <>
      {/* Video Card */}
      <motion.div
        className="relative w-full max-w-3xl mx-auto cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsModalOpen(true); }}}
        role="button"
        tabIndex={0}
        aria-label="Open VFX Showreel 2026 video"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: easings.easeOut }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Card background */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          animate={{
            background: hovered
              ? 'rgba(16, 16, 20, 0.8)'
              : 'rgba(12, 12, 16, 0.7)',
            borderColor: hovered ? 'rgba(232,164,0,0.2)' : 'rgba(255,255,255,0.08)',
            boxShadow: hovered
              ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(232,164,0,0.08)'
              : '0 8px 32px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.5, ease: easings.easeOut }}
          style={{
            border: `1px solid ${hovered ? 'rgba(232,164,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
          }}
        >
          {/* Top glass rim */}
          <motion.div
            className="absolute inset-x-0 top-0 h-px"
            animate={{ opacity: hovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />

          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <motion.img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="VFX Showreel 2026 - visual effects compilation thumbnail"
              className="w-full h-full object-cover"
              animate={{ 
                scale: hovered ? 1.04 : 1,
              }}
              transition={{ duration: 0.7, ease: easings.easeOut }}
              loading="lazy"
            />

            {/* Overlay */}
            <motion.div
              className="absolute inset-0"
              animate={{
                background: hovered ? 'rgba(8,8,12,0.5)' : 'rgba(8,8,12,0.35)',
              }}
              transition={{ duration: 0.5 }}
            />

            {/* Play button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: hovered ? 1 : 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
                animate={{
                  scale: hovered ? 1.08 : 1,
                  boxShadow: hovered 
                    ? '0 0 40px rgba(232,164,0,0.5)' 
                    : '0 0 30px rgba(232,164,0,0.35)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  boxShadow: '0 0 30px rgba(232,164,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                <motion.div
                  animate={hovered && !shouldReduceMotion ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
                >
                  <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" aria-hidden="true" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Year badge */}
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase"
                whileHover={{ scale: 1.05 }}
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  color: '#0a0a0a',
                }}
              >
                2026
              </motion.div>
            </motion.div>
          </div>

          {/* Info */}
          <div className="p-5 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ x: hovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-2 rounded-xl"
                animate={{
                  background: hovered ? 'rgba(232,164,0,0.12)' : 'rgba(232,164,0,0.08)',
                  borderColor: hovered ? 'rgba(232,164,0,0.2)' : 'rgba(232,164,0,0.12)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  border: '1px solid rgba(232,164,0,0.12)',
                }}
              >
                <Film size={14} style={{ color: '#fbbf24' }} aria-hidden="true" />
              </motion.div>
              <div>
                <h3 className="text-sm font-medium text-white/85">VFX Showreel 2026</h3>
                <motion.p 
                  className="text-xs text-white/30"
                  animate={{ opacity: hovered ? 0.5 : 0.3 }}
                >
                  Click to watch
                </motion.p>
              </div>
            </motion.div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25 font-mono">1:30</span>
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                animate={{
                  background: hovered ? 'rgba(232,164,0,0.12)' : 'rgba(255,255,255,0.04)',
                  borderColor: hovered ? 'rgba(232,164,0,0.25)' : 'rgba(255,255,255,0.06)',
                }}
                transition={{ duration: 0.3 }}
                style={{
                  border: `1px solid ${hovered ? 'rgba(232,164,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <Play 
                  size={10} 
                  style={{ color: hovered ? '#fbbf24' : 'rgba(255,255,255,0.3)' }} 
                  className="ml-0.5" 
                  fill="currentColor" 
                  aria-hidden="true" 
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsModalOpen(false)}
            style={{
              background: 'rgba(4, 4, 6, 0.92)',
              backdropFilter: 'blur(60px)',
            }}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="relative w-full max-w-4xl"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ ...springs.gentle, duration: timing.normal }}
            >
              {/* Video */}
              <motion.div
                className="relative rounded-xl overflow-hidden"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                style={{
                  aspectRatio: '16/9',
                  boxShadow: '0 0 80px rgba(232,164,0,0.15), 0 24px 60px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`}
                  title="VFX Showreel 2026"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>

              {/* Close button */}
              <motion.button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'rgba(14,14,18,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                aria-label="Close video"
              >
                <X size={14} className="text-white/50" />
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
});

function Showreel() {
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="showreel" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="showreel-heading">
      <h2 id="showreel-heading" className="sr-only">Showreel 2026 — Latest Work</h2>

      {/* Subtle animated grid */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.015 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(232,164,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,164,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </motion.div>

      {/* Ambient glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={shouldReduceMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background: 'radial-gradient(circle, rgba(232,164,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: easings.easeOut }}
        >
          {/* Decorative line */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-8 h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
            />
            <motion.span 
              className="text-[10px] text-amber-400/70 uppercase tracking-[0.35em] font-medium"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Showreel
            </motion.span>
            <motion.div
              className="w-8 h-px"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
            />
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Latest Work
          </motion.h2>
          
          <motion.p 
            className="text-sm text-white/40 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            A selection of recent VFX work across film, TVC, and music video projects.
          </motion.p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <ShowreelVideo videoId="mdgq7pWm_KE" />
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[
            { value: '50+', label: 'Projects' },
            { value: '5', label: 'Years Exp' },
            { value: '20+', label: 'Clients' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="px-5 py-3 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -3, scale: 1.02 }}
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(40px)',
              }}
            >
              <CountUp target={stat.value} label={stat.label} isInView={isStatsInView} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Showreel;
