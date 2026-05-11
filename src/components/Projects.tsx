import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Film, Tv, ArrowUpRight, ChevronDown, ArrowUpDown, X, Play, Calendar, Users, Clock, ChevronLeft, ChevronRight, Maximize2, Settings, Sparkles, Image } from 'lucide-react';
import { PROJECTS, Category, Project } from '../data/projects';
import { springs, easings, timing, staggerContainerFast } from '../hooks/useAnimationSystem';
import OGLGallery from './OGLGallery';

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: 'All', icon: null },
  { label: 'Film', icon: <Film size={14} /> },
  { label: 'TVC', icon: <Tv size={14} /> },
];

const ITEMS_PER_PAGE = 6;

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

// ─── YOUTUBE THUMB ──────────────────────────────────────────────────────────
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
    <div 
      className="relative rounded-2xl overflow-hidden border group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '16/9',
        boxShadow: hovered
          ? `0 0 60px ${accentGlow.replace('0.4', '0.2')}, 0 16px 48px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.35)',
        borderColor: hovered ? `${accentGlow.replace('0.4', '0.3')}` : 'rgba(255,255,255,0.1)',
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
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
          <motion.img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            width={1280}
            height={720}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease: easings.easeOut }}
          />
          <motion.div 
            className="absolute inset-0"
            animate={{ background: hovered ? 'rgba(5,5,8,0.45)' : 'rgba(5,5,8,0.35)' }}
            transition={{ duration: 0.4 }}
          />
          <motion.button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true); } }}
            aria-label={`Watch ${title} on YouTube`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentBright})`,
                boxShadow: `0 0 40px ${accentGlow}, 0 0 80px ${accentGlow.replace('0.4', '0.2')}, inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}
            >
              <Play size={24} className="text-gray-900 ml-1" fill="currentColor" />
            </motion.div>
            <motion.span 
              className="text-white text-xs mt-3 font-medium tracking-wide"
              animate={{ opacity: hovered ? 1 : 0.7 }}
            >
              Click to watch
            </motion.span>
          </motion.button>
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

// ─── VIMEO THUMB ─────────────────────────────────────────────────────────
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
    <div 
      className="relative rounded-2xl overflow-hidden border group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '16/9',
        boxShadow: hovered
          ? `0 0 60px ${accentGlow.replace('0.4', '0.2')}, 0 16px 48px rgba(0,0,0,0.5)`
          : '0 8px 32px rgba(0,0,0,0.35)',
        borderColor: hovered ? `${accentGlow.replace('0.4', '0.3')}` : 'rgba(255,255,255,0.1)',
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
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
          <motion.img
            src={`https://vumbnail.com/${vimeoId}.jpg`}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = `https://i.vimeocdn.com/video/${vimeoId}-d_1920`;
            }}
            width={1920}
            height={1080}
            animate={{ scale: hovered ? 1.04 : 1 }}
            transition={{ duration: 0.7, ease: easings.easeOut }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <motion.button
            type="button"
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => setPlaying(true)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlaying(true); } }}
            aria-label={`Play ${title} on Vimeo`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              animate={{ scale: hovered ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentBright})`, boxShadow: `0 0 30px ${accentGlow}` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
              </svg>
            </motion.div>
          </motion.button>
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
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
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

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
      <motion.div 
        className="absolute inset-0 bg-black/96" 
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 py-4"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-white/50 text-xs font-mono uppercase tracking-widest">{projectTitle}</span>
        <motion.button
          ref={closeButtonRef}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Close gallery"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={16} className="text-white" />
        </motion.button>
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
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Previous image"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
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
        transition={{ duration: 0.4, ease: easings.easeOut }}
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
          whileHover={{ scale: 1.08, x: 2 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Next image"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ChevronRight size={22} className="text-white" />
        </motion.button>
      )}
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[85vw] overflow-x-auto py-1 px-1 rounded-2xl"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}
        onClick={(e) => e.stopPropagation()}
        role="tablist"
        aria-label="Gallery thumbnails"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {images.map((img, i) => (
          <motion.button
            key={i}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Image ${i + 1} of ${images.length}${i === currentIndex ? ' (current)' : ''}`}
            onClick={(e) => { e.stopPropagation(); onSelect(i); }}
            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 focus-visible:ring-offset-black ${
              i === currentIndex ? 'border-amber-400 opacity-100 scale-105' : 'border-transparent opacity-45 hover:opacity-80'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
});

// ─── PROJECT MODAL ──────────────────────────────────────────────────────────
const ProjectModal = memo(function ProjectModal({
  project,
  projectIndex,
  onClose,
}: {
  project: Project;
  projectIndex?: number;
  onClose: () => void;
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxIndex === null) {
        onClose();
        return;
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
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
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, lightboxIndex, prevImage, nextImage]);

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
        <div className="absolute inset-0 -z-10" aria-hidden="true" style={{ background: 'rgba(3, 3, 5, 0.92)' }} />
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
          transition={{ ...springs.gentle, duration: timing.normal }}
          onClick={e => e.stopPropagation()}
        >
          {/* Cover Image */}
          <div className="relative w-full aspect-[21/9] overflow-hidden flex-shrink-0">
            <motion.img
              src={project.vimeoId ? `https://vumbnail.com/${project.vimeoId}.jpg` : project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,12,1)] via-[rgba(8,8,12,0.4)] to-[rgba(8,8,12,0.2)]" />
            <motion.div
              className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.25em] font-semibold z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: `${accentColors.accentGlow.replace('0.4', '0.18')}`,
                border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.4')}`,
                backdropFilter: 'blur(20px)',
                color: accentColors.accentColor,
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {project.category}
            </motion.div>

            {(project.youtubeId || project.vimeoId) && (
              <motion.button
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`,
                    boxShadow: `0 0 40px ${accentColors.accentGlow}, 0 0 80px ${accentColors.accentGlow.replace('0.4', '0.2')}, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  }}
                >
                  {project.vimeoId ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-black ml-0.5">
                      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/>
                    </svg>
                  ) : (
                    <Play size={22} className="text-black ml-0.5" fill="currentColor" />
                  )}
                </motion.div>
              </motion.button>
            )}

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

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <motion.p 
                className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-2 font-mono"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {project.role}
              </motion.p>
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {project.title}
              </motion.h2>
            </div>
          </div>

          {/* Content Body */}
          <motion.div 
            className="flex-1 overflow-y-auto modal-scroll p-6 sm:p-8 space-y-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Meta Pills */}
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {project.year && (
                <motion.div 
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  whileHover={{ y: -2 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                >
                  <Calendar size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Year</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.year}</p>
                  </div>
                </motion.div>
              )}
              {project.client && (
                <motion.div 
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  whileHover={{ y: -2 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                >
                  <Users size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Client</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.client}</p>
                  </div>
                </motion.div>
              )}
              {project.duration && (
                <motion.div 
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  whileHover={{ y: -2 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                >
                  <Clock size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Duration</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.duration}</p>
                  </div>
                </motion.div>
              )}
              {project.team && (
                <motion.div 
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                  whileHover={{ y: -2 }}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
                >
                  <Users size={13} className="text-amber-400/80 shrink-0" />
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-semibold leading-none mb-0.5">Team</p>
                    <p className="text-sm text-white/80 font-medium leading-none">{project.team}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-sm sm:text-base text-white/70 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {project.description}
            </motion.p>

            {/* Challenge & Solution */}
            {(project.challenge || project.solution) && (
              <motion.div 
                className="grid sm:grid-cols-2 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                {project.challenge && (
                  <motion.div 
                    className="relative p-5 rounded-2xl overflow-hidden"
                    whileHover={{ y: -2 }}
                    style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #ef4444, transparent)' }} />
                    <p className="text-[10px] text-red-400/70 uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
                      <Settings size={12} />
                      Challenge
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{project.challenge}</p>
                  </motion.div>
                )}
                {project.solution && (
                  <motion.div 
                    className="relative p-5 rounded-2xl overflow-hidden"
                    whileHover={{ y: -2 }}
                    style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.12)', backdropFilter: 'blur(20px)' }}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #22c55e, transparent)' }} />
                    <p className="text-[10px] text-green-400/70 uppercase tracking-widest mb-2 font-semibold flex items-center gap-2">
                      <Sparkles size={12} />
                      Solution
                    </p>
                    <p className="text-sm text-white/70 leading-relaxed">{project.solution}</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Tools */}
            {project.tools && project.tools.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Settings size={12} />
                  Tools Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, i) => (
                    <motion.span 
                      key={tool} 
                      className="px-4 py-2 rounded-full text-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      style={{ 
                        background: `${accentColors.accentGlow.replace('0.4', '0.12')}`, 
                        border: `1px solid ${accentColors.accentGlow.replace('0.4', '0.22')}`, 
                        color: accentColors.accentColor, 
                        backdropFilter: 'blur(10px)' 
                      }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Gallery */}
            {allImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Image size={12} />
                  Gallery
                  <span className="text-white/35 font-normal normal-case tracking-normal">({allImages.length})</span>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 -mx-6 sm:mx-0 px-6 sm:px-0">
                  {allImages.slice(0, 6).map((img, i) => (
                    <motion.button
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-xl cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(8,8,12,0.7)]"
                      onClick={() => openLightbox(i)}
                      aria-label={`View ${project.title} image ${i + 1} in full screen`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Video embed */}
            {(project.youtubeId || project.vimeoId) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,0,0,0.7)"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.5s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Watch on {project.vimeoId ? 'Vimeo' : 'YouTube'}
                </p>
                {project.vimeoId ? (
                  <VimeoThumb vimeoId={project.vimeoId} title={project.title} accentColor={accentColors.accentColor} accentBright={accentColors.accentBright} accentGlow={accentColors.accentGlow} />
                ) : (
                  <YouTubeThumb videoId={project.youtubeId!} title={project.title} accentColor={accentColors.accentColor} accentBright={accentColors.accentBright} accentGlow={accentColors.accentGlow} />
                )}
              </motion.div>
            )}

            {/* Artist Credits */}
            {project.artists && project.artists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
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
                      style={{ borderBottom: i < (project.artists?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
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
              </motion.div>
            )}

            {/* Star Rating */}
            {(project.rating != null || project.voteCount != null) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-3 font-semibold">Project Rating</p>
                <div className="flex items-end gap-5">
                  <motion.div 
                    className="flex items-baseline gap-1.5"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.75 }}
                  >
                    <span className="text-5xl font-bold leading-none"
                      style={{ background: `linear-gradient(135deg, ${accentColors.accentColor}, ${accentColors.accentBright})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                    >
                      {project.rating?.toFixed(1) ?? '—'}
                    </span>
                    <span className="text-lg text-white/40 mb-1">/ 5</span>
                  </motion.div>
                  <div className="flex flex-col gap-1.5 flex-1 pb-1">
                    <div className="flex items-center gap-1.5" role="img" aria-label={`Rating: ${project.rating?.toFixed(1) ?? '—'} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.span
                          key={star}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.75 + star * 0.05 }}
                          whileHover={{ scale: 1.2 }}
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
                            style={{ filter: star <= Math.round(project.rating ?? 0) ? `drop-shadow(0 0 5px ${accentColors.accentGlow})` : 'none', transition: 'filter 0.2s ease, opacity 0.2s ease' }}
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </motion.span>
                      ))}
                    </div>
                    <span className="text-xs text-white/45">{project.voteCount ?? 0} votes</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
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
}: {
  project: typeof PROJECTS[0];
  index: number;
  onClick: () => void;
}) {
  const cardRefInternal = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const accentColors = ACCENT_PALETTE[index % ACCENT_PALETTE.length];

  const springConfig = { stiffness: 400, damping: 30, mass: 0.8 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const imageScale = useTransform(scale, [1, 1.04], [1, 1.1]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRefInternal.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set(-(y - 0.5) * 14);
    rotateY.set((x - 0.5) * 14);
    setGlowPos({ x: x * 100, y: y * 100 });
  }, [rotateX, rotateY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    scale.set(1.04);
  }, [scale]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return (
    <motion.div
      ref={cardRefInternal}
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
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.06, 
        duration: 0.5, 
        ease: easings.easeOut 
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Card Container */}
      <motion.div
        className="rounded-2xl overflow-hidden flex flex-col"
        animate={{
          background: isHovered ? 'rgba(18,18,24,0.75)' : 'rgba(13,13,18,0.65)',
          borderColor: isHovered ? accentColors.accentGlow.replace('0.4', '0.45') : 'rgba(255,255,255,0.07)',
          boxShadow: isHovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 50px ${accentColors.accentGlow.replace('0.4', '0.15')}, inset 0 1px 0 rgba(255,255,255,0.12)`
            : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
        transition={{ duration: 0.5, ease: easings.easeOut }}
      >
        {/* Dynamic Glow Following Mouse */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          animate={{ 
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(ellipse 70% 70% at ${glowPos.x}% ${glowPos.y}%, ${accentColors.accentGlow} 0%, transparent 70%)`,
          }}
        />

        {/* Image */}
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
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
            <motion.div
              className="absolute top-0 w-40 h-full"
              animate={{
                x: isHovered ? ['-200%', '600%'] : '-200%',
              }}
              transition={{ 
                duration: isHovered ? 1.5 : 0,
                ease: 'easeOut'
              }}
              style={{
                background: `linear-gradient(to right, transparent, ${accentColors.accentGlow.replace('0.4', '0.2')}, transparent)`,
                transform: 'skewX(-20deg)',
                filter: 'blur(8px)',
                left: '-15%',
              }}
            />
          </div>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,8,12,0.9) 0%, rgba(8,8,12,0.2) 50%, transparent 100%)' }} />

          {/* Category badge */}
          <motion.div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider z-10"
            animate={{
              background: 'rgba(8,8,10,0.65)',
              borderColor: accentColors.accentGlow.replace('0.4', '0.3'),
              color: accentColors.accentColor,
            }}
            transition={{ duration: 0.3 }}
            style={{ backdropFilter: 'blur(20px)' }}
          >
            {project.category}
          </motion.div>

          {/* View Project text */}
          <motion.div
            className="absolute bottom-3 left-3 z-10"
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              x: isHovered ? 0 : -8 
            }}
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

          {/* Hover Reveal Layer */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              opacity: isHovered ? 1 : 0,
              background: isHovered ? `linear-gradient(135deg, ${accentColors.accentGlow.replace('0.4', '0.25')}, rgba(8,8,14,0.6))` : 'transparent',
            }}
            transition={{ duration: 0.4 }}
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

        {/* Content */}
        <div className="p-5 relative z-10 flex flex-col flex-1 min-h-[120px]">
          <div className="flex items-start justify-between gap-4">
            <motion.h3
              className="text-base font-medium leading-tight line-clamp-2 h-14 flex items-start"
              animate={{
                color: isHovered ? accentColors.accentColor : 'rgba(255,255,255,0.9)',
              }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: "'Unbounded', sans-serif" }}
            >
              {project.title}
            </motion.h3>
            <motion.span 
              className="text-[10px] text-white/50 font-mono shrink-0"
              animate={{ opacity: isHovered ? 0.7 : 0.5 }}
            >
              {project.year}
            </motion.span>
          </div>
          <motion.p 
            className="text-xs text-white/55 mt-1"
            animate={{ opacity: isHovered ? 0.7 : 0.55 }}
          >
            {project.role}
          </motion.p>
          <motion.p 
            className="text-xs text-white/50 mt-3 leading-relaxed line-clamp-2 flex-1"
            animate={{ opacity: isHovered ? 0.6 : 0.5 }}
          >
            {project.description}
          </motion.p>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-[2px] mx-5 mb-3 rounded-full shrink-0"
          animate={{ width: isHovered ? 'calc(100% - 2.5rem)' : '0%' }}
          transition={{ duration: 0.5, ease: easings.easeOut }}
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColors.accentColor}, ${accentColors.accentBright}, transparent)`,
            boxShadow: `0 0 12px ${accentColors.accentGlow}`,
          }}
        />
      </motion.div>
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
  const sectionAccent = ACCENT_PALETTE[0];

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

  const handleSetSelectedProject = useCallback((project: Project | null) => {
    const idx = displayedProjects.findIndex(p => p.id === project?.id);
    setSelectedProjectIndex(idx >= 0 ? idx : 0);
    setSelectedProject(project);
    if (project) {
      window.dispatchEvent(new CustomEvent('projectsModalOpen'));
    } else {
      window.dispatchEvent(new CustomEvent('projectsModalClose'));
    }
  }, [displayedProjects]);

  const handleCategoryChange = useCallback((category: Category) => {
    setActiveCategory(category);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  return (
    <motion.section
      id="work"
      className="py-24 md:py-32 overflow-hidden relative"
      aria-labelledby="projects-heading"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <h2 id="projects-heading" className="sr-only">Selected Projects</h2>


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
            <motion.div 
              className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-12 h-px"
                style={{ background: `linear-gradient(90deg, ${sectionAccent.accentColor}, ${sectionAccent.accentBright})` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">Selected Work</span>
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white"
              initial={{ y: 80 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.9, ease: easings.easeOut }}
            >
              PROJECTS
            </motion.h2>
            <motion.p 
              className="text-sm text-white/35 mt-4 max-w-md"
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
            <motion.div 
              className="flex flex-wrap gap-2"
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
                    transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease',
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
              style={{ background: 'rgba(12,12,15,0.6)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', transition: 'background 0.4s ease, border-color 0.4s ease, color 0.4s ease' }}
            >
              <motion.div animate={{ rotate: sortOrder === 'newest' ? 0 : 180 }}>
                <ArrowUpDown size={14} />
              </motion.div>
              <span className="text-xs font-medium">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Grid with staggered animation */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" 
          role="list" 
          aria-label="Project portfolio"
          variants={staggerContainerFast}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                role="listitem"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <ProjectCard
                  project={project}
                  index={i}
                  onClick={() => {
                    const cardEl = document.querySelector<HTMLElement>(`[data-project-id="${project.id}"]`);
                    if (cardEl) cardEl.setAttribute('data-last-trigger', 'true');
                    handleSetSelectedProject(project);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more */}
        <AnimatePresence>
          {hasMore && (
            <motion.div 
              className="flex justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
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
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${ACCENT_PALETTE[0].accentColor}, ${ACCENT_PALETTE[0].accentBright})`, opacity: 0, transition: 'opacity 0.4s ease' }}
                  whileHover={{ opacity: 1 }}
                />
                <span className="relative text-sm font-medium text-white/70 group-hover:text-black transition-colors">Load More</span>
                <motion.span 
                  animate={{ y: [0, 4, 0] }} 
                  transition={{ duration: 1.5, repeat: Infinity }} 
                  className="relative text-white/70 group-hover:text-black transition-colors"
                >
                  <ChevronDown size={16} />
                </motion.span>
                <span className="relative text-[11px] text-white/50 group-hover:text-black/50 transition-colors">({sortedProjects.length - visibleCount})</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count */}
        <motion.p 
          className="text-center mt-8 text-xs text-white/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Showing <span className="text-amber-400/60">{displayedProjects.length}</span> of <span className="text-amber-400/60">{sortedProjects.length}</span> projects
        </motion.p>
      </div>

      {/* OGL Gallery Section */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 mt-24 md:mt-32">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-12 h-px"
              style={{ background: `linear-gradient(90deg, ${sectionAccent.accentColor}, ${sectionAccent.accentBright})` }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
            <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">Gallery</span>
          </motion.div>
          <motion.h3
            className="text-3xl md:text-5xl font-bold text-white mb-2"
            initial={{ y: 40 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7, ease: easings.easeOut }}
          >
            Featured Work
          </motion.h3>
          <motion.p
            className="text-sm text-white/40 max-w-md"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Scroll or drag to explore our latest VFX projects and visual effects work.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <OGLGallery
            items={PROJECTS.slice(0, 12).map(p => ({
              image: p.thumbnail || `https://picsum.photos/seed/${p.id}/800/600?grayscale`,
              text: p.title
            }))}
            bend={2}
            textColor="#E8A400"
            borderRadius={0.08}
            font="bold 24px 'Space Mono'"
            scrollSpeed={2}
            scrollEase={0.05}
          />
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            projectIndex={selectedProjectIndex}
            onClose={() => handleSetSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
