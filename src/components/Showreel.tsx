import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Play, X, Film } from 'lucide-react';

// ─── COUNT UP ANIMATION ───────────────────────────────────────────────────
function CountUp({ target, label, isInView }: { target: string; label: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[\d]/g, '');

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
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
  }, [isInView, numericTarget]);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="text-3xl md:text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count}{suffix}
      </motion.div>
      <span className="text-[11px] text-white/30 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── FLOATING PARTICLE ────────────────────────────────────────────────────
const FloatingParticle = memo(function FloatingParticle({
  delay,
  x,
  size
}: {
  delay: number;
  x: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        width: size,
        height: size,
        background: 'linear-gradient(135deg, hsl(43 100% 50%), hsl(35 100% 55%))',
      }}
      animate={{
        y: [0, -40, -80, -40, 0],
        opacity: [0.15, 0.55, 0.25, 0.55, 0.15],
        scale: [0.7, 1.1, 0.7],
        boxShadow: ['0 0 8px rgba(232,164,0,0.2)', '0 0 20px rgba(232,164,0,0.5)', '0 0 8px rgba(232,164,0,0.2)'],
      }}
      transition={{
        duration: 6 + delay,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ─── SHOWREEL COMPONENT ──────────────────────────────────────────────────
const ShowreelVideo = memo(function ShowreelVideo({ videoId }: { videoId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Card background */}
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: hovered
              ? 'rgba(20, 20, 24, 0.75)'
              : 'rgba(14, 14, 18, 0.65)',
            border: `1px solid ${hovered ? 'rgba(232,164,0,0.2)' : 'rgba(255,255,255,0.09)'}`,
            backdropFilter: 'blur(80px) saturate(200%)',
            WebkitBackdropFilter: 'blur(80px) saturate(200%)',
            boxShadow: hovered
              ? '0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(232,164,0,0.08), inset 0 1px 0 rgba(255,255,255,0.14)'
              : '0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
            transition: 'all 0.7s cubic-bezier(0.25,0.1,0.25,1)',
          }}
        >
          {/* Top glass rim */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)',
            }}
          />

          {/* Light sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent)' }}
            animate={{ x: hovered ? ['-100%', '200%'] : '-100%' }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          />

          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="Showreel thumbnail"
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? 'scale(1.06)' : 'scale(1)',
                transition: 'transform 0.9s cubic-bezier(0.25,0.1,0.25,1)',
              }}
              loading="lazy"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: hovered
                  ? 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, rgba(8,8,12,0.15) 50%, rgba(8,8,12,0.4) 100%)'
                  : 'linear-gradient(to top, rgba(8,8,12,0.75) 0%, rgba(8,8,12,0.05) 50%, transparent 100%)',
                transition: 'background 0.6s ease',
              }}
            />

            {/* Play button */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: hovered ? 1 : 0.7, scale: hovered ? 1 : 0.92 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  boxShadow: '0 0 40px rgba(232,164,0,0.4), 0 0 80px rgba(232,164,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
                  transition: 'box-shadow 0.4s ease',
                }}
              >
                <Play size={22} className="text-gray-900 ml-1" fill="currentColor" />
              </div>
            </motion.div>

            {/* Year badge */}
            <div className="absolute top-4 right-4 z-10">
              <div
                className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  color: '#0a0a0a',
                  boxShadow: '0 4px 16px rgba(232,164,0,0.25)',
                }}
              >
                2026
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: 'rgba(232,164,0,0.08)',
                  border: '1px solid rgba(232,164,0,0.15)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Film size={16} style={{ color: '#fbbf24' }} />
              </div>
              <div>
                <h3 className="text-base font-medium text-white/85">VFX Showreel</h3>
                <p className="text-xs text-white/30">Click to watch in fullscreen</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-white/25 font-mono">1:30</span>
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: hovered ? 'rgba(232,164,0,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hovered ? 'rgba(232,164,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.4s ease',
                }}
                animate={{ rotate: hovered ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Play size={11} style={{ color: hovered ? '#fbbf24' : 'rgba(255,255,255,0.3)' }} className="ml-0.5" fill="currentColor" />
              </motion.div>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px"
            animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%), hsl(35 100% 50%), transparent)',
              transformOrigin: 'center',
              boxShadow: '0 0 16px rgba(232,164,0,0.4)',
            }}
          />
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{
                background: 'rgba(5, 5, 8, 0.92)',
                backdropFilter: 'blur(80px) saturate(200%)',
                WebkitBackdropFilter: 'blur(80px) saturate(200%)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="relative w-full max-w-5xl"
                initial={{ scale: 0.88, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 24 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                {/* Video */}
                <div
                  className="relative rounded-2xl overflow-hidden border"
                  style={{
                    aspectRatio: '16/9',
                    boxShadow: '0 0 100px rgba(232,164,0,0.2), 0 32px 80px rgba(0,0,0,0.7)',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`}
                    title="VFX Showreel 2026"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Close button */}
                <motion.button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute -top-14 right-0 w-12 h-12 rounded-full flex items-center justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: 'rgba(14,14,18,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} className="text-white/50" />
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

function Showreel() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: (i * 6.5) % 100,
    size: 2 + (i % 3) * 2,
    delay: i * 0.4,
  }));

  return (
    <section id="showreel" className="relative overflow-hidden py-24 md:py-32" aria-labelledby="showreel-heading">
      <h2 id="showreel-heading" className="sr-only">Showreel 2026 — Latest Work</h2>
      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(232,164,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,164,0,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <FloatingParticle key={p.id} x={p.x} size={p.size} delay={p.delay} />
      ))}

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-10 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                boxShadow: '0 0 12px rgba(232,164,0,0.5)',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <span className="text-[11px] text-amber-400/80 uppercase tracking-[0.4em] font-semibold">
              Showreel 2026
            </span>
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                boxShadow: '0 0 12px rgba(232,164,0,0.5)',
              }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
            />
            <motion.div
              className="w-10 h-px"
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            Latest Work
          </h2>
        </motion.div>

        {/* Video */}
        <ShowreelVideo videoId="mdgq7pWm_KE" />

        {/* Stats */}
        <StatsSection />
      </div>
    </section>
  );
}

// ─── STATS SECTION ─────────────────────────────────────────────────────────
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.95, 1, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className="flex flex-wrap items-center justify-center gap-5 mt-12"
      style={{ y: y1, scale }}
    >
      {[
        { value: '50+', label: 'Projects' },
        { value: '5', label: 'Years Exp' },
        { value: '10+', label: 'Awards' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          className="relative flex items-center gap-3 px-6 py-3 rounded-full"
          style={{
            background: 'rgba(12, 12, 15, 0.5)',
            border: '1px solid rgba(255,255,255,0.07)',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 + i * 0.15, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{
            y: -4,
            borderColor: 'rgba(232,164,0,0.25)',
            background: 'rgba(20,20,26,0.7)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(232,164,0,0.1)',
          }}
        >
          <CountUp target={stat.value} label={stat.label} isInView={isInView} />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default Showreel;
