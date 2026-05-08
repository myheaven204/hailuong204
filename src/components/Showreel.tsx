import { useState, useEffect, useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, X, Film } from 'lucide-react';

// ─── COUNT UP ANIMATION ───────────────────────────────────────────────────
function CountUp({ target, label, isInView }: { target: string; label: string; isInView: boolean }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[\d]/g, '');

  useEffect(() => {
    if (!isInView) return;
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
  }, [isInView, numericTarget]);

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className="text-2xl md:text-3xl font-bold"
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {count}{suffix}
      </motion.div>
      <span className="text-[10px] text-white/30 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── SHOWREEL VIDEO CARD ──────────────────────────────────────────────────
const ShowreelVideo = memo(function ShowreelVideo({ videoId }: { videoId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Card background */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: hovered
              ? 'rgba(16, 16, 20, 0.8)'
              : 'rgba(12, 12, 16, 0.7)',
            border: `1px solid ${hovered ? 'rgba(232,164,0,0.2)' : 'rgba(255,255,255,0.08)'}`,
            backdropFilter: 'blur(60px) saturate(150%)',
            WebkitBackdropFilter: 'blur(60px) saturate(150%)',
            boxShadow: hovered
              ? '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(232,164,0,0.08)'
              : '0 8px 32px rgba(0,0,0,0.3)',
            transition: 'all 0.5s cubic-bezier(0.25,0.1,0.25,1)',
          }}
        >
          {/* Top glass rim */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            }}
          />

          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden">
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt="VFX Showreel 2026 - visual effects compilation thumbnail"
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.25,0.1,0.25,1)',
              }}
              loading="lazy"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: hovered
                  ? 'rgba(8,8,12,0.5)'
                  : 'rgba(8,8,12,0.35)',
                transition: 'background 0.5s ease',
              }}
            />

            {/* Play button */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: hovered ? 1 : 0.8 }}
            >
              <div
                className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  boxShadow: '0 0 30px rgba(232,164,0,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
                  transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                  transform: hovered ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" aria-hidden="true" />
              </div>
            </div>

            {/* Year badge */}
            <div className="absolute top-4 right-4 z-10">
              <div
                className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  color: '#0a0a0a',
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
                className="p-2 rounded-xl"
                style={{
                  background: 'rgba(232,164,0,0.08)',
                  border: '1px solid rgba(232,164,0,0.12)',
                }}
              >
                <Film size={14} style={{ color: '#fbbf24' }} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white/85">VFX Showreel 2026</h3>
                <p className="text-xs text-white/30">Click to watch</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/25 font-mono">1:30</span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: hovered ? 'rgba(232,164,0,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${hovered ? 'rgba(232,164,0,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.3s ease',
                }}
              >
                <Play size={10} style={{ color: hovered ? '#fbbf24' : 'rgba(255,255,255,0.3)' }} className="ml-0.5" fill="currentColor" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
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
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {/* Video */}
              <div
                className="relative rounded-xl overflow-hidden"
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
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                style={{
                  background: 'rgba(14,14,18,0.8)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                aria-label="Close video"
              >
                <X size={14} className="text-white/50" />
              </button>
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

  return (
    <section id="showreel" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="showreel-heading">
      <h2 id="showreel-heading" className="sr-only">Showreel 2026 — Latest Work</h2>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(232,164,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,164,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-8 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
            />
            <span className="text-[10px] text-amber-400/70 uppercase tracking-[0.35em] font-medium">
              Showreel
            </span>
            <div
              className="w-8 h-px"
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
            />
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
            Latest Work
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            A selection of recent VFX work across film, TVC, and music video projects.
          </p>
        </motion.div>

        {/* Video */}
        <ShowreelVideo videoId="mdgq7pWm_KE" />

        {/* Stats */}
        <motion.div
          ref={statsRef}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          {[
            { value: '50+', label: 'Projects' },
            { value: '5', label: 'Years Exp' },
            { value: '20+', label: 'Clients' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="px-5 py-3 rounded-xl"
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(40px)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
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
