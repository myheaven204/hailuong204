import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { Film, Tv, ArrowUpRight, ChevronDown, ArrowUpDown, X, Play, Calendar, Users, Clock, ChevronLeft, ChevronRight, Maximize2, Settings, Sparkles, Image } from 'lucide-react';
import { PROJECTS, Category, Project } from '../data/projects';

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: 'All', icon: null },
  { label: 'Film', icon: <Film size={14} /> },
  { label: 'TVC', icon: <Tv size={14} /> },
];

const ITEMS_PER_PAGE = 6;

// Accent color palette — each card cycles through these
const ACCENT_PALETTE: { accentColor: string; accentGlow: string; accentHsl: string; accentBright: string }[] = [
  { accentColor: '#E8A400', accentGlow: 'rgba(232,164,0,0.4)',  accentHsl: '43 100% 50%',  accentBright: '#FFB800' },
  { accentColor: '#4ECDC4', accentGlow: 'rgba(78,205,196,0.4)', accentHsl: '174 60% 55%', accentBright: '#6FE8DF' },
  { accentColor: '#FF6B9D', accentGlow: 'rgba(255,107,157,0.4)', accentHsl: '340 100% 65%', accentBright: '#FF8BB5' },
  { accentColor: '#A78BFA', accentGlow: 'rgba(167,139,250,0.4)', accentHsl: '262 90% 75%', accentBright: '#C4B5FD' },
  { accentColor: '#34D399', accentGlow: 'rgba(52,211,153,0.4)',  accentHsl: '160 70% 52%',  accentBright: '#6EE7B7' },
  { accentColor: '#F472B6', accentGlow: 'rgba(244,114,182,0.4)', accentHsl: '328 80% 67%', accentBright: '#F9A8D4' },
  { accentColor: '#60A5FA', accentGlow: 'rgba(96,165,250,0.4)',  accentHsl: '217 90% 70%',  accentBright: '#93C5FD' },
  { accentColor: '#FB923C', accentGlow: 'rgba(251,146,60,0.4)',  accentHsl: '27 95% 60%',  accentBright: '#FDBA74' },
];

// ─── YOUTUBE THUMB (thumbnail + play overlay) ──────────────────────────────
const YouTubeThumb = memo(function YouTubeThumb({
  videoId,
  title,
  accentColor,
  accentBright,
  accentGlow,
}: {
  videoId: string;
  title: string;
  accentColor: string;
  accentBright: string;
  accentGlow: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border group"
      style={{
        aspectRatio: '16/9',
        boxShadow: hovered
          ? `0 0 60px ${accentGlow.replace('0.4', '0.2')}, 0 16px 48px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.35)',
        borderColor: hovered ? `${accentGlow.replace('0.4', '0.3')}` : 'rgba(255,255,255,0.1)',
        transition: 'all 0.5s cubic-bezier(0.25,0.1,0.25,1)',
      }}
    >
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.7s cubic-bezier(0.25,0.1,0.25,1)' }}
          />
          <div className="absolute inset-0"
            style={{
              background: hovered
                ? 'rgba(5,5,8,0.45)'
                : 'rgba(5,5,8,0.35)',
              transition: 'background 0.4s ease',
            }}
          />
          <button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={`Watch ${title} on YouTube`}
          >
            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentBright})`,
                boxShadow: `0 0 40px ${accentGlow}, 0 0 80px ${accentGlow.replace('0.4', '0.2')}, inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Play size={24} className="text-gray-900 ml-1" fill="currentColor" />
            </motion.div>
            <span className="text-white text-xs mt-3 font-medium tracking-wide">Click to watch</span>
          </button>
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
            </svg>
            <span className="text-[10px] font-semibold text-white uppercase tracking-wider">YouTube</span>
          </div>
        </>
      )}
    </div>
  );
});

// ─── VIMEO THUMB (thumbnail + play overlay) ─────────────────────────────────
const VimeoThumb = memo(function VimeoThumb({
  vimeoId,
  title,
  accentColor,
  accentBright,
  accentGlow,
}: {
  vimeoId: string;
  title: string;
  accentColor: string;
  accentBright: string;
  accentGlow: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden border group"
      style={{
        aspectRatio: '16/9',
        boxShadow: hovered
          ? `0 0 60px ${accentGlow.replace('0.4', '0.2')}, 0 16px 48px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.35)',
        borderColor: hovered ? `${accentGlow.replace('0.4', '0.3')}` : 'rgba(255,255,255,0.1)',
        transition: 'all 0.5s cubic-bezier(0.25,0.1,0.25,1)',
      }}
    >
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&mute=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://vumbnail.com/${vimeoId}.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = `https://i.vimeocdn.com/video/${vimeoId}-d_1920`;
            }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label={`Play ${title} on Vimeo`}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentBright})`, boxShadow: `0 0 30px ${accentGlow}` }}
              animate={{ scale: hovered ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
              </svg>
            </motion.div>
          </button>
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(255,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
            </svg>
            <span className="text-[10px] font-semibold text-white uppercase tracking-wider">Vimeo</span>
          </div>
        </>
      )}
    </div>
  );
});

// ─── LIGHTBOX ──────────────────────────────────────────────────────────────
const Lightbox = memo(function Lightbox({
  images,
  currentIndex,
  projectTitle,
  onClose,
  onPrev,
  onNext,
  onSelect,
  accentColors,
}: {
  images: string[];
  currentIndex: number;
  projectTitle: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  accentColors: { accentGlow: string };
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap + Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = document.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const modalEl = document.getElementById('lightbox-modal');
        if (!modalEl) return;
        const modalFocusable = Array.from(focusable).filter(el => modalEl.contains(el));
        if (modalFocusable.length === 0) return;

        const first = modalFocusable[0];
        const last = modalFocusable[modalFocusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Move focus to close button on open
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      id="lightbox-modal"
      className="fixed inset-0 z-[200] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery: ${projectTitle}`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/96" aria-hidden="true" />
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/50 text-xs font-mono uppercase tracking-widest">{projectTitle}</span>
        <button
          ref={closeButtonRef}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Close gallery"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <span className="text-white/30 text-[80px] font-bold tabular-nums">
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
      </div>
      {currentIndex > 0 && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous image"
        >
          <ChevronLeft size={22} className="text-white" />
        </motion.button>
      )}
      <motion.div
        key={currentIndex}
        className="relative max-w-[90vw] max-h-[75vh] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.88 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${projectTitle} ${currentIndex + 1} of ${images.length}`}
          className="max-w-full max-h-[75vh] object-contain rounded-xl"
          style={{
            boxShadow: `0 0 120px ${accentColors.accentGlow.replace('0.4', '0.12')}, 0 40px 100px rgba(0,0,0,0.6)`,
          }}
        />
        <div className="absolute -bottom-8 inset-x-0 h-24 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center bottom, ${accentColors.accentGlow.replace('0.4', '0.08')} 0%, transparent 70%)` }}
        />
      </motion.div>
      {currentIndex < images.length - 1 && (
        <motion.button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center bg-white/8 hover:bg-white/15 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next image"
        >
          <ChevronRight size={22} className="text-white" />
        </motion.button>
      )}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[85vw] overflow-x-auto py-1 px-1 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}
        onClick={(e) => e.stopPropagation()}
        role="tablist"
        aria-label="Gallery thumbnails"
      >
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Image ${i + 1} of ${images.length}${i === currentIndex ? ' (current)' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSelect(i); }}
            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black ${
              i === currentIndex ? 'border-amber-400 opacity-100 scale-105' : 'border-transparent opacity-45 hover:opacity-80'
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
});

// ─── PROJECT MODAL ──────────────────────────────────────────────────────────
const ProjectModal = memo(function ProjectModal({
  project,
  projectIndex,
  onClose,
  lastTriggerId
}: {
  project: Project;
  projectIndex?: number;
  onClose: () => void;
  lastTriggerId?: string | null;
}) {
  const allImages = [project.image, ...(project.gallery || [])];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const accentColors = ACCENT_PALETTE[(projectIndex ?? 0) % ACCENT_PALETTE.length];

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex(i => i !== null ? Math.max(0, i - 1) : null);
  const nextImage = () => setLightboxIndex(i => i !== null ? Math.min(allImages.length - 1, i + 1) : null);
  const selectImage = (index: number) => setLightboxIndex(index);

  // Focus trap + Escape key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) {
        onClose();
        return;
      }
      if (e.key === 'Tab' && lightboxIndex === null) {
        const focusable = document.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const modalEl = modalRef.current;
        if (!modalEl) return;
        const modalFocusable = Array.from(focusable).filter(el => modalEl.contains(el));
        if (modalFocusable.length === 0) return;

        const first = modalFocusable[0];
        const last = modalFocusable[modalFocusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Move focus to close button on open
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Restore focus to trigger (handled in parent via lastTriggerId)
    };
  }, [onClose, lightboxIndex]);

  return (
    <>
      <motion.div
        ref={modalRef}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        {/* Inert overlay — hides background content from screen readers */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{ background: 'rgba(3, 3, 5, 0.92)' }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'rgba(3, 3, 5, 0.92)',
            backdropFilter: 'blur(100px) saturate(200%)',
            WebkitBackdropFilter: 'blur(100px) saturate(200%)',
          }}
        />

        <motion.div
          className="relative w-full h-full sm:h-auto sm:max-h-[92vh] overflow-hidden flex flex-col sm:rounded-3xl"
          style={{
            maxWidth: '860px',
            background: 'rgba(8, 8, 12, 0.7)',
            backdropFilter: 'blur(100px) saturate(200%)',
            WebkitBackdropFilter: 'blur(100px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.03)',
          }}
          initial={{ scale: 0.93, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── COVER IMAGE — Full width, edge-to-edge on top ── */}
          <div className="relative w-full aspect-[21/9] overflow-hidden flex-shrink-0">
            <img
              src={project.vimeoId ? `https://vumbnail.com/${project.vimeoId}.jpg` : project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,12,1)] via-[rgba(8,8,12,0.4)] to-[rgba(8,8,12,0.2)]" />
            {/* Category badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-semibold z-10"
              style={{
                background: `${accentColors.accentGlow.replace('0.4', '0.18')}`,
                border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.4')}`,
                backdropFilter: 'blur(20px)',
                color: accentColors.accentColor,
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {project.category}
            </div>

            {/* Video play button — YouTube or Vimeo */}
            {(project.youtubeId || project.vimeoId) && (
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                onClick={() => {
                  if (project.vimeoId) {
                    window.open(`https://vimeo.com/${project.vimeoId}`, '_blank', 'noopener,noreferrer');
                  } else {
                    window.open(`https://www.youtube.com/watch?v=${project.youtubeId}`, '_blank', 'noopener,noreferrer');
                  }
                }}
                aria-label={`Watch ${project.title} on ${project.vimeoId ? 'Vimeo' : 'YouTube'}`}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`,
                    boxShadow: `0 0 40px ${accentColors.accentGlow}, 0 0 80px ${accentColors.accentGlow.replace('0.4', '0.2')}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {project.vimeoId ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
                    </svg>
                  ) : (
                    <Play size={22} className="text-black ml-0.5" fill="currentColor" />
                  )}
                </motion.div>
              </button>
            )}

            {/* Close button */}
            <motion.button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close project details"
            >
              <X size={16} className="text-white" />
            </motion.button>

            {/* Title & meta overlaid on image bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 font-mono">{project.role}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">{project.title}</h2>
            </div>
          </div>

          {/* ── CONTENT BODY ── */}
          <div className="flex-1 overflow-y-auto modal-scroll p-6 sm:p-8 space-y-7">

            {/* Meta Pills — clean horizontal strip */}
            <div className="flex flex-wrap gap-3">
              {project.year && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                  <Calendar size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Year</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.year}</p>
                  </div>
                </div>
              )}
              {project.client && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                  <Users size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Client</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.client}</p>
                  </div>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                  <Clock size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Duration</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.duration}</p>
                  </div>
                </div>
              )}
              {project.team && (
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}>
                  <Users size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Team</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.team}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">{project.description}</p>

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <div className="grid sm:grid-cols-2 gap-3">
                {project.challenge && (
                  <div className="relative p-5 rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', backdropFilter: 'blur(20px)' }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #ef4444, transparent)' }} />
                    <p className="text-[10px] text-red-400/70 uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
                      <Settings size={12} />
                      Challenge
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{project.challenge}</p>
                  </div>
                )}
                {project.solution && (
                  <div className="relative p-5 rounded-2xl overflow-hidden"
                    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)', backdropFilter: 'blur(20px)' }}>
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #22c55e, transparent)' }} />
                    <p className="text-[10px] text-green-400/70 uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
                      <Sparkles size={12} />
                      Solution
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{project.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tools */}
            {project.tools && project.tools.length > 0 && (
              <div>
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Settings size={12} />
                  Tools Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="px-4 py-2 rounded-full text-sm"
                      style={{ background: `${accentColors.accentGlow.replace('0.4', '0.12')}`, border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.22')}`, color: accentColors.accentColor, backdropFilter: 'blur(10px)' }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery — Edge-to-edge grid */}
            {allImages.length > 0 && (
              <div>
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Image size={12} />
                  Gallery
                  <span className="text-white/35 font-normal normal-case tracking-normal">({allImages.length})</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 -mx-6 sm:mx-0 px-6 sm:px-0">
                  {allImages.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-xl cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,8,12,0.7)]"
                      onClick={() => openLightbox(i)}
                      aria-label={`View ${project.title} image ${i + 1} in full screen`}
                    >
                      <img
                        src={img}
                        alt={`${project.title} ${i + 1} of ${allImages.length}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.4)' }}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                        >
                          <Maximize2 size={14} className="text-white" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Video embed — YouTube or Vimeo */}
            {(project.youtubeId || project.vimeoId) && (
              <div>
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  {project.vimeoId ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,0,0,0.7)"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.5s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,0,0,0.7)"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  )}
                  Watch on {project.vimeoId ? 'Vimeo' : 'YouTube'}
                </p>
                {project.vimeoId ? (
                  <VimeoThumb vimeoId={project.vimeoId} title={project.title} accentColor={accentColors.accentColor} accentBright={accentColors.accentBright} accentGlow={accentColors.accentGlow} />
                ) : (
                  <YouTubeThumb videoId={project.youtubeId!} title={project.title} accentColor={accentColors.accentColor} accentBright={accentColors.accentBright} accentGlow={accentColors.accentGlow} />
                )}
              </div>
            )}

            {/* Artist Credits */}
            {project.artists && project.artists.length > 0 && (
              <div>
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Users size={12} />
                  Artist Credits
                </p>
                <div className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  <div className="flex items-center gap-3 px-5 py-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Role</span>
                    <div className="flex-1" />
                    <span className="text-[10px] text-white/35 uppercase tracking-widest font-semibold">Artist</span>
                  </div>
                  {project.artists.map((artist, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 px-5 py-3.5 cursor-default"
                      style={{ borderBottom: i < project.artists.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 min-w-[140px]">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`, boxShadow: `0 0 6px ${accentColors.accentGlow}` }}
                        />
                        <span className="text-[11px] text-white/50 uppercase tracking-wider leading-tight">{artist.role}</span>
                      </div>
                      <div className="w-px h-4 shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                      <div className="flex-1">
                        <span className="text-sm text-white/75 font-medium">{artist.names}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Star Rating — display only */}
            {(project.rating != null || project.voteCount != null) && (
              <div>
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold">Project Rating</p>
                <div className="flex items-end gap-5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-5xl font-bold leading-none"
                      style={{ background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      {project.rating?.toFixed(1) ?? '—'}
                    </span>
                    <span className="text-lg text-white/40 mb-1">/ 5</span>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 pb-1">
                    <div className="flex items-center gap-1.5" role="img" aria-label={`Rating: ${project.rating?.toFixed(1) ?? '—'} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={star <= Math.round(project.rating ?? 0) ? accentColors.accentColor : 'none'}
                            stroke={star <= Math.round(project.rating ?? 0) ? accentColors.accentColor : 'rgba(255,255,255,0.2)'}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ filter: star <= Math.round(project.rating ?? 0) ? `drop-shadow(0 0 5px ${accentColors.accentGlow})` : 'none', transition: 'all 0.2s ease' }}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-white/45">{project.voteCount ?? 0} votes</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            projectTitle={project.title}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
            onSelect={selectImage}
            accentColors={accentColors}
          />
        )}
      </AnimatePresence>
    </>
  );
});

// ─── PROJECT CARD ───────────────────────────────────────────────────────────
const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onClick,
  cardRef
}: {
  project: typeof PROJECTS[0];
  index: number;
  onClick: () => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRefInternal = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const accentColors = ACCENT_PALETTE[index % ACCENT_PALETTE.length];

  // Physics-based springs — no useMotionValue for transform
  const springConfig = { stiffness: 400, damping: 30, mass: 0.8 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Derived spring for image scale
  const imageScale = useTransform(scale, [1, 1.04], [1, 1.1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRefInternal.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set(-(y - 0.5) * 14);
    rotateY.set((x - 0.5) * 14);
    setGlowPos({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.04);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={(el) => {
        (cardRefInternal as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (typeof cardRef === 'function') cardRef(el);
        else if (cardRef) (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className="group relative cursor-pointer"
      style={{ rotateX, rotateY, scale, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${project.title.split(',')[0]}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Card Container */}
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: isHovered
            ? 'rgba(18,18,24,0.75)'
            : 'rgba(13,13,18,0.65)',
          border: `1px solid ${isHovered ? accentColors.accentGlow.replace('0.4', '0.45') : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${accentColors.accentGlow.replace('0.4', '0.15')}, inset 0 1px 0 rgba(255,255,255,0.12)`
            : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'background 0.5s cubic-bezier(0.25,0.1,0.25,1), border-color 0.5s cubic-bezier(0.25,0.1,0.25,1)',
        }}
      >
        {/* Dynamic Glow Following Mouse */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 70% 70% at ${glowPos.x}% ${glowPos.y}%, ${accentColors.accentGlow} 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Image with Physics-based Scale on Hover — fixed aspect ratio 16/10 */}
        <div className="relative overflow-hidden rounded-2xl shrink-0" style={{ aspectRatio: '16 / 10' }}>
          <motion.img
            src={project.vimeoId ? `https://vumbnail.com/${project.vimeoId}.jpg` : project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{ scale: imageScale, objectPosition: project.imagePosition || 'center' }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            loading="lazy"
          />

          {/* Light sweep effect */}
          <div
            className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl"
          >
            <div
              className="absolute top-0 w-40 h-full"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColors.accentGlow.replace('0.4', '0.2')}, transparent)`,
                transform: 'skewX(-20deg) translateX(-200%)',
                animation: isHovered ? 'lightSweep 1.5s ease-out forwards' : 'none',
                left: '-15%',
                filter: 'blur(8px)',
              }}
            />
          </div>
          <style>{`
            @keyframes lightSweep {
              0% { transform: skewX(-20deg) translateX(-200%); }
              100% { transform: skewX(-20deg) translateX(600%); }
            }
          `}</style>

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, rgba(8,8,12,0.2) 50%, transparent 100%)' }}
          />

          {/* Category badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider z-10"
            style={{
              background: 'rgba(8,8,10,0.65)',
              border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.3')}`,
              backdropFilter: 'blur(20px)',
              color: accentColors.accentColor,
            }}
          >
            {project.category}
          </div>

          {/* View Project text — bottom left */}
          <motion.div
            className="absolute bottom-3 left-3 z-10"
            initial={{ opacity: 0, x: -8 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: `${accentColors.accentGlow.replace('0.4', '0.3')}`,
                border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.5')}`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: accentColors.accentColor,
              }}
            >
              <ArrowUpRight size={10} />
              <span>View Project</span>
            </div>
          </motion.div>

          {/* Hover Reveal Layer — physics spring on play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            style={{
              background: isHovered
                ? `linear-gradient(135deg, ${accentColors.accentGlow.replace('0.4', '0.25')}, rgba(8,8,14,0.6))`
                : 'transparent',
              transition: 'background 0.4s ease',
            }}
          >
            <motion.div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              initial={{ scale: 0.5, rotate: -30, opacity: 0 }}
              animate={isHovered ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.5, rotate: -30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`,
                boxShadow: `0 0 40px 10px ${accentColors.accentGlow.replace('0.4', '0.3')}, 0 0 80px ${accentColors.accentGlow.replace('0.4', '0.15')}`,
              }}
            >
              <ArrowUpRight size={22} className="text-black" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content — flex-1 ensures all cards stretch to same height */}
        <div className="p-5 relative z-10 flex flex-col flex-1 min-h-[120px]">
          <div className="flex items-start justify-between gap-4">
            <h3
              className="text-base font-medium leading-tight line-clamp-2 h-14 flex items-start"
              style={{
                color: isHovered ? accentColors.accentColor : 'rgba(255,255,255,0.9)',
                transition: 'color 0.5s cubic-bezier(0.25,0.1,0.25,1)',
                fontFamily: "'Unbounded', sans-serif",
              }}
            >
              {project.title}
            </h3>
            <span className="text-[10px] text-white/50 font-mono shrink-0">{project.year}</span>
          </div>
          <p className="text-xs text-white/55 mt-1">{project.role}</p>
          <p className="text-xs text-white/50 mt-3 leading-relaxed line-clamp-2 flex-1">{project.description}</p>
        </div>

        {/* Bottom Accent Line — springs to full width */}
        <motion.div
          className="h-[2px] mx-5 mb-3 rounded-full shrink-0"
          animate={{ width: isHovered ? 'calc(100% - 2.5rem)' : '0%' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColors.accentColor}, ${accentColors.accentBright}, transparent)`,
            boxShadow: `0 0 12px ${accentColors.accentGlow}`,
          }}
        />
      </div>

      {/* Top shimmer line */}
      <motion.div
        className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none rounded-t-2xl overflow-hidden"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColors.accentGlow.replace('0.4', '0.7')}, transparent)`,
        }}
      />
    </motion.div>
  );
});

// ─── PROJECTS SECTION ───────────────────────────────────────────────────────
export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number>(0);
  const [lastTriggerId, setLastTriggerId] = useState<string | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sectionAccent = ACCENT_PALETTE[0];

  // Dispatch event when modal opens/closes
  const handleSetSelectedProject = (project: Project | null) => {
    if (selectedProject === null && project !== null) {
      // Modal is opening — capture active element for focus restoration
      setLastTriggerId(document.activeElement?.id || null);
    }
    // Capture the grid index of the selected project
    const idx = displayedProjects.findIndex(p => p.id === project?.id);
    setSelectedProjectIndex(idx >= 0 ? idx : 0);
    setSelectedProject(project);
    if (project) {
      window.dispatchEvent(new CustomEvent('projectsModalOpen'));
    } else {
      window.dispatchEvent(new CustomEvent('projectsModalClose'));
      // Restore focus
      const trigger = document.querySelector<HTMLElement>('[data-last-trigger="true"]');
      if (trigger) {
        trigger.focus();
        trigger.removeAttribute('data-last-trigger');
      } else if (lastTriggerId) {
        const el = document.getElementById(lastTriggerId);
        if (el) el.focus();
      }
    }
  };

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeCategory);

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    return sortOrder === 'newest' ? yearB - yearA : yearA - yearB;
  });

  const displayedProjects = sortedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProjects.length;

  const handleCategoryChange = (category: Category) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <section
      id="work"
      className="py-24 md:py-32 overflow-hidden relative"
      aria-labelledby="projects-heading"
      style={{
        ['--mx' as string]: 0,
        ['--my' as string]: 0,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        mouseX.set(mx);
        mouseY.set(my);
        e.currentTarget.style.setProperty('--mx', `${mx}px`);
        e.currentTarget.style.setProperty('--my', `${my}px`);
      }}
    >
      <h2 id="projects-heading" className="sr-only">Selected Projects</h2>
      {/* ── Futuristic grid: revealed around cursor via mask ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(0deg, ${sectionAccent.accentGlow.replace('0.4', '0.08')} 0px, ${sectionAccent.accentGlow.replace('0.4', '0.08')} 1px, transparent 1px, transparent 80px)`,
            `repeating-linear-gradient(90deg, ${sectionAccent.accentGlow.replace('0.4', '0.08')} 0px, ${sectionAccent.accentGlow.replace('0.4', '0.08')} 1px, transparent 1px, transparent 80px)`,
          ].join(', '),
          WebkitMaskImage: `radial-gradient(ellipse 160px 160px at var(--mx) var(--my), black 0%, transparent 70%)`,
          maskImage: `radial-gradient(ellipse 160px 160px at var(--mx) var(--my), black 0%, transparent 70%)`,
        }}
      />
      {/* Secondary grid cell highlight */}
      <div
        className="absolute pointer-events-none z-[1]"
        style={{
          width: 80,
          height: 80,
          left: 'calc(var(--mx) - 40px)',
          top: 'calc(var(--my) - 40px)',
          background: `radial-gradient(ellipse 80px 80px at center, ${sectionAccent.accentGlow.replace('0.4', '0.08')} 0%, transparent 100%)`,
          border: `1px solid ${sectionAccent.accentGlow.replace('0.4', '0.2')}`,
          boxShadow: `0 0 12px ${sectionAccent.accentGlow.replace('0.4', '0.1')}, inset 0 0 12px ${sectionAccent.accentGlow.replace('0.4', '0.05')}`,
          backdropFilter: 'blur(2px)',
          transition: 'left 0.08s ease, top 0.08s ease',
        }}
      />

      {/* ── Spotlight glow ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 700,
          height: 700,
          background: `radial-gradient(circle, ${sectionAccent.accentGlow.replace('0.4', '0.1')} 0%, ${sectionAccent.accentGlow.replace('0.4', '0.04')} 40%, transparent 70%)`,
          filter: 'blur(40px)',
          x: useTransform(mouseX, (v) => v - 350),
          y: useTransform(mouseY, (v) => v - 350),
        }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(200,120,255,0.05) 0%, rgba(120,60,200,0.02) 50%, transparent 70%)',
          filter: 'blur(60px)',
          x: useTransform(mouseX, (v) => v - 250),
          y: useTransform(mouseY, (v) => v - 150),
        }}
      />
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 180,
          height: 180,
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%)',
          filter: 'blur(20px)',
          x: useTransform(mouseX, (v) => v - 90),
          y: useTransform(mouseY, (v) => v - 90),
        }}
      />

      {/* ── Cursor: soft dot + trailing ring ── */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 32,
          height: 32,
          border: `1.5px solid ${sectionAccent.accentGlow.replace('0.4', '0.5')}`,
          borderRadius: '50%',
          left: 'calc(var(--mx) - 16px)',
          top: 'calc(var(--my) - 16px)',
          transition: 'left 0.1s cubic-bezier(0.25,0.1,0.25,1), top 0.1s cubic-bezier(0.25,0.1,0.25,1)',
          backdropFilter: 'blur(1px)',
        }}
      />
      {/* Cursor inner dot */}
      <div
        className="absolute pointer-events-none z-[2]"
        style={{
          width: 5,
          height: 5,
          background: sectionAccent.accentColor,
          borderRadius: '50%',
          left: 'calc(var(--mx) - 2.5px)',
          top: 'calc(var(--my) - 2.5px)',
          transition: 'left 0.05s ease, top 0.05s ease',
          boxShadow: `0 0 10px 3px ${sectionAccent.accentGlow}`,
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div>
            <motion.div className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div className="w-12 h-px"
                style={{ background: `linear-gradient(90deg, ${sectionAccent.accentColor}, ${sectionAccent.accentBright})` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">Selected Work</span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              <motion.span
                initial={{ y: 80 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ display: 'inline-block' }}
              >
                PROJECTS
              </motion.span>
            </h2>
            <motion.p className="text-sm text-white/35 mt-4 max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              A curated selection of VFX work across film and TVC projects.
            </motion.p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {CATEGORIES.map(({ label, icon }) => (
                <motion.button
                  key={label}
                  onClick={() => handleCategoryChange(label)}
                  aria-pressed={activeCategory === label}
                  className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium overflow-hidden"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: activeCategory === label ? `linear-gradient(135deg, ${ACCENT_PALETTE[0].accentColor}, ${ACCENT_PALETTE[0].accentBright})` : 'rgba(12,12,15,0.6)',
                    border: `1px solid ${activeCategory === label ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                    color: activeCategory === label ? 'hsl(0 0% 5%)' : 'rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    transition: 'all 0.4s cubic-bezier(0.25,0.1,0.25,1)',
                  }}
                >
                  {icon}
                  {label}
                </motion.button>
              ))}
            </motion.div>

            <motion.button
              onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
              aria-label={`Sort by ${sortOrder === 'newest' ? 'oldest first' : 'newest first'}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{ background: 'rgba(12,12,15,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', transition: 'all 0.4s cubic-bezier(0.25,0.1,0.25,1)' }}
            >
              <motion.div animate={{ rotate: sortOrder === 'newest' ? 0 : 180 }}>
                <ArrowUpDown size={14} />
              </motion.div>
              <span className="text-xs font-medium">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list" aria-label="Project portfolio">
          {displayedProjects.map((project, i) => (
            <div key={project.id} role="listitem">
              <ProjectCard
                project={project}
                index={i}
                onClick={() => {
                  // Mark this card as the trigger before opening modal
                  const cardEl = document.querySelector<HTMLElement>(`[data-project-id="${project.id}"]`);
                  if (cardEl) cardEl.setAttribute('data-last-trigger', 'true');
                  handleSetSelectedProject(project);
                }}
                cardRef={{ current: null } as React.RefObject<HTMLDivElement>}
              />
            </div>
          ))}
        </div>

        {/* Load more */}
        {hasMore && (
          <motion.div className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={() => setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredProjects.length))}
              aria-label={`Load more projects. ${sortedProjects.length - visibleCount} remaining`}
              className="group relative flex items-center gap-3 px-8 py-4 rounded-full overflow-hidden"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: 'rgba(12,12,15,0.6)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)' }}
            >
              <motion.div className="absolute inset-0 rounded-full"
                style={{ background: `linear-gradient(135deg, ${ACCENT_PALETTE[0].accentColor}, ${ACCENT_PALETTE[0].accentBright})`, opacity: 0, transition: 'opacity 0.4s ease' }}
                whileHover={{ opacity: 1 }}
              />
              <span className="relative text-sm font-medium text-white/70 group-hover:text-black transition-colors">Load More</span>
              <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="relative text-white/70 group-hover:text-black transition-colors">
                <ChevronDown size={16} />
              </motion.span>
              <span className="relative text-[11px] text-white/50 group-hover:text-black/50 transition-colors">({sortedProjects.length - visibleCount})</span>
            </motion.button>
          </motion.div>
        )}

        {/* Count */}
        <motion.p className="text-center mt-8 text-xs text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Showing <span className="text-amber-400/60">{displayedProjects.length}</span> of <span className="text-amber-400/60">{sortedProjects.length}</span> projects
        </motion.p>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            projectIndex={selectedProjectIndex}
            onClose={() => handleSetSelectedProject(null)}
            lastTriggerId={lastTriggerId}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
