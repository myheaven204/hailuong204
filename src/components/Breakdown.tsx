import { useState, useRef, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Play, X, Youtube, Layers, Image, Wand2, Sparkles, Grid3X3, Film, Clock, ArrowUpRight } from 'lucide-react';

// ─── CONSTANTS ─────────────────────────────────────────────────────────────
const VIDEO_CATEGORIES = [
  { id: 'all', label: 'All', icon: <Grid3X3 size={14} /> },
  { id: 'plate', label: 'Plate', icon: <Image size={14} /> },
  { id: 'cg', label: 'CG', icon: <Layers size={14} /> },
  { id: 'fx', label: 'FX', icon: <Wand2 size={14} /> },
  { id: 'comp', label: 'Comp', icon: <Sparkles size={14} /> },
];

const VIDEOS = [
  {
    id: 0,
    category: 'all',
    label: 'VFX Showreel 2026',
    thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80',
    youtubeId: 'mdgq7pWm_KE',
    duration: '1:30',
    featured: true,
    description: 'A compilation of the latest VFX work, featuring compositing, matchmoving, and visual effects across film and TVC projects.'
  },
  {
    id: 9,
    category: 'all',
    label: 'Surf TVC — SPICE fx',
    thumb: 'https://i.vimeocdn.com/video/2013472219-1cc05c26b340967db2fb55a32b728efbbf3a4201c577828464c5e7bed55ba22d-d_1280',
    vimeoUrl: 'https://vimeo.com/1082478288',
    duration: '0:15',
    featured: true,
    description: 'VFX breakdown for a surf TV commercial. Wave simulations, water foam compositing, and product integration by SPICE fx.'
  },
  {
    id: 10,
    category: 'all',
    label: 'Tiger Balm TVC 2025',
    thumb: 'https://i.vimeocdn.com/video/2091550764-a78674d2a66286adee44819774b70d4897db2fb480c0c26d6c98b5e43aaa81ec-d_1280',
    vimeoUrl: 'https://vimeo.com/1143381334',
    duration: '0:30',
    featured: true,
    description: 'VFX compositing for Tiger Balm TV commercial. Dynamic fire and heat effects integrated with product visuals.'
  },
  {
    id: 11,
    category: 'all',
    label: 'KGC Jung Kwan Jang TVC 2025',
    thumb: 'https://i.vimeocdn.com/video/2091548565-5e7f1f1edad841106400351ec77a9cf4748b24ee5adc8c2afdda31439b5f0414-d_1280',
    vimeoUrl: 'https://vimeo.com/1143379790',
    duration: '0:45',
    featured: true,
    description: 'VFX breakdown for KGC Jung Kwan Jang TV commercial. Ginseng-themed visual effects and product integration.'
  },
  {
    id: 13,
    category: 'all',
    label: 'MBBank TVC 2025',
    thumb: 'https://i.vimeocdn.com/video/2091544802-d989d3633f079e949a4cbd65e99f6def96a695866e2a250fbb97d0da5e2f2039-d_1280',
    vimeoUrl: 'https://vimeo.com/1143376830',
    duration: '0:30',
    featured: true,
    description: 'VFX breakdown for MB Bank TV commercial. Financial services visualization with dynamic motion graphics.'
  },
  {
    id: 14,
    category: 'all',
    label: 'Rihair TVC 2025',
    thumb: 'https://i.vimeocdn.com/video/2091544165-94a05c7fee77fb2829e09e080700f15927e2fe32d87357de369d689091a40723-d_1280',
    vimeoUrl: 'https://vimeo.com/1143376244',
    duration: '1:01',
    featured: true,
    description: 'VFX compositing for Rihair TV commercial. Hair care product visualization with elegant visual effects.'
  },
  {
    id: 15,
    category: 'all',
    label: 'NUVI MV 2025',
    thumb: 'https://i.vimeocdn.com/video/2064692127-16a7ba7880bba88549eedfc6e7fe891379010c3caeaea53a0300b7365a07fc15-d_1280',
    vimeoUrl: 'https://vimeo.com/1123127478',
    duration: '3:32',
    featured: true,
    description: 'Music video VFX breakdown for NUVI. Atmospheric visual effects and seamless compositing for a cinematic music video.'
  },
  {
    id: 18,
    category: 'all',
    label: 'LAVIE TVC 2025',
    thumb: 'https://i.vimeocdn.com/video/2031778422-a1cb635c0c714b9bbd53aab27ea0ed356b9c4b99692c213d1c4bccd8f08b0a4c-d_1280',
    vimeoUrl: 'https://vimeo.com/1097430196',
    duration: '0:30',
    featured: true,
    description: 'VFX compositing for LAVIE bottled water TV commercial. Natural water and nature-themed visual effects.'
  },
  {
    id: 25,
    category: 'all',
    label: 'SPICE fx Showreel 2025',
    thumb: 'https://i.vimeocdn.com/video/1989275128-2a165deb89e1b3f2cae651c8101c510191efac82a14c5efee9349b3b2d8d4ae5-d_1280',
    vimeoUrl: 'https://vimeo.com/1062372265',
    duration: '2:07',
    featured: true,
    description: 'SPICE fx 2025 showreel — best VFX work across TVC, film, and music videos.'
  },
  {
    id: 31,
    category: 'all',
    label: 'Grab Saver TVC 2024',
    thumb: 'https://i.vimeocdn.com/video/1855267569-2ec8d1429be6f7f69d06eac4582833637e1d888f6c426e63f8badaa7ea368282-d_1280',
    vimeoUrl: 'https://vimeo.com/948202733',
    duration: '0:53',
    featured: true,
    description: 'VFX for Grab Saver TV commercial. Insurance brand campaign.'
  },
  {
    id: 74,
    category: 'all',
    label: 'Showreel SPICEfx 2020',
    thumb: 'https://i.vimeocdn.com/video/946779100-724ff92439adc1f82a1c78ba03d3b0d6643b4e464e7fedbb92f529caf1f56096-d_1280',
    vimeoUrl: 'https://vimeo.com/451725378',
    duration: '2:33',
    featured: true,
    description: 'SPICE fx 2020 showreel — best VFX from films, TVC, and music videos.'
  },
];

// ─── VIDEO MODAL ───────────────────────────────────────────────────────────
const VideoModal = memo(function VideoModal({
  video,
  onClose
}: {
  video: typeof VIDEOS[0];
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'rgba(5, 5, 7, 0.88)',
          backdropFilter: 'blur(80px) saturate(200%)',
          WebkitBackdropFilter: 'blur(80px) saturate(200%)',
        }}
      />

      <motion.div
        className="relative w-full max-w-4xl"
        initial={{ scale: 0.9, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 24 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative aspect-video rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 0 80px rgba(232,164,0,0.12), 0 32px 80px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
          }}
        >
          {video.vimeoUrl ? (
            <iframe
              className="w-full h-full"
              src={`https://player.vimeo.com/video/${video.vimeoUrl.replace('https://vimeo.com/', '')}?autoplay=1&mute=1&title=0&byline=0&portrait=0`}
              title={video.label}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.label}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              allowFullScreen
            />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}>
              <Youtube size={18} style={{ color: '#fbbf24' }} />
            </div>
            <div>
              <h3 className="text-base font-medium text-white/85">{video.label}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-md" style={{
                background: 'rgba(232,164,0,0.08)',
                border: '1px solid rgba(232,164,0,0.15)',
                color: 'hsl(43 100% 50%)',
              }}>
                {video.category}
              </span>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="Close video"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={16} className="text-white/50" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
});

// ─── VIDEO CARD ────────────────────────────────────────────────────────────
const VideoCard = memo(function VideoCard({
  video,
  index,
  onClick
}: {
  video: typeof VIDEOS[0];
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  // Physics-based springs — same as ProjectCard
  const springConfig = { stiffness: 400, damping: 30, mass: 0.8 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);

  // Derived spring for image scale
  const imageScale = useTransform(scale, [1, 1.04], [1, 1.1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
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
      ref={cardRef}
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
      aria-label={video.vimeoUrl ? `View ${video.label} on Vimeo` : `Watch ${video.label}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Card Container */}
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: isHovered
            ? 'rgba(18,18,24,0.75)'
            : 'rgba(13,13,18,0.65)',
          border: `1px solid ${isHovered ? 'rgba(232,164,0,0.45)' : 'rgba(255,255,255,0.07)'}`,
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          boxShadow: isHovered
            ? '0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(232,164,0,0.15), inset 0 1px 0 rgba(255,255,255,0.12)'
            : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          transition: 'background 0.5s cubic-bezier(0.25,0.1,0.25,1), border-color 0.5s cubic-bezier(0.25,0.1,0.25,1)',
        }}
      >

        {/* Dynamic Glow Following Mouse */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 70% 70% at ${glowPos.x}% ${glowPos.y}%, rgba(232,164,0,0.25) 0%, transparent 70%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Thumbnail with light sweep */}
        <div className="relative overflow-hidden rounded-2xl shrink-0" style={{ aspectRatio: '16 / 10' }}>
          <motion.img
            src={video.thumb}
            alt={video.label}
            className="w-full h-full object-cover"
            style={{ scale: imageScale }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            loading="lazy"
          />

          {/* Light sweep effect */}
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-2xl">
            <div
              className="absolute top-0 w-40 h-full"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(232,164,0,0.2), transparent)',
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
              border: '1px solid rgba(232,164,0,0.3)',
              backdropFilter: 'blur(20px)',
              color: 'hsl(43 100% 50%)',
            }}
          >
            {video.category}
          </div>

          {/* Featured badge */}
          {video.featured && (
            <div className="absolute top-3 right-3 z-10">
              <div
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase"
                style={{
                  background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                  color: '#0a0a0a',
                  boxShadow: '0 4px 16px rgba(232,164,0,0.3)',
                }}
              >
                Showreel
              </div>
            </div>
          )}

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
                background: 'rgba(232,164,0,0.2)',
                border: '1px solid rgba(232,164,0,0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: 'hsl(43 100% 60%)',
              }}
            >
              <ArrowUpRight size={10} />
              <span>Watch</span>
            </div>
          </motion.div>

          {/* Play button */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
            style={{
              background: isHovered
                ? 'linear-gradient(135deg, rgba(232,164,0,0.15), rgba(8,8,14,0.5))'
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
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 55%))',
                boxShadow: '0 0 40px 10px rgba(232,164,0,0.3), 0 0 80px rgba(232,164,0,0.15)',
              }}
            >
              <Play size={20} style={{ color: '#0a0a0a', marginLeft: 2 }} />
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5 relative z-10 flex flex-col flex-1 min-h-[120px]">
          <div className="flex items-start justify-between gap-4">
            <h4
              className="text-base font-medium leading-tight line-clamp-2 h-14 flex items-start"
              style={{
                color: isHovered ? 'hsl(43 100% 60%)' : 'rgba(255,255,255,0.9)',
                transition: 'color 0.5s cubic-bezier(0.25,0.1,0.25,1)',
                fontFamily: "'Unbounded', sans-serif",
              }}
            >
              {video.label}
            </h4>
            <div className="flex items-center gap-1 text-white/25 mt-0.5 shrink-0">
              <Clock size={11} />
              <span className="text-[10px] font-mono">{video.duration}</span>
            </div>
          </div>

          <p className="text-xs text-white/50 mt-3 leading-relaxed line-clamp-2 flex-1">{video.description}</p>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          className="h-[2px] mx-5 mb-3 rounded-full shrink-0"
          animate={{ width: isHovered ? 'calc(100% - 2.5rem)' : '0%' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%), hsl(35 100% 55%), transparent)',
            boxShadow: '0 0 12px rgba(232,164,0,0.4)',
          }}
        />
      </div>

      {/* Top shimmer line - disabled */}
      {/* <motion.div
        className="absolute inset-x-0 top-0 h-px z-20 pointer-events-none rounded-t-2xl overflow-hidden"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(232,164,0,0.5), transparent)',
        }}
      /> */}
    </motion.div>
  );
});

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function Breakdown() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<typeof VIDEOS[0] | null>(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === 'all') return VIDEOS;
    return VIDEOS.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="breakdown" className="py-24 md:py-32 overflow-hidden" aria-labelledby="breakdown-heading">
      <h2 id="breakdown-heading" className="sr-only">VFX Tutorials & Breakdowns</h2>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
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
                style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">
                Tutorials
              </span>
            </motion.div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              <motion.span
                initial={{ y: 80 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ display: 'inline-block' }}
              >
                VFX BREAKDOWN
              </motion.span>
            </h2>
            <motion.p
              className="text-sm text-white/35 mt-4 max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Watch tutorials and breakdowns of VFX techniques and workflows.
            </motion.p>
          </div>

          {/* Category filters */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {VIDEO_CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  background: activeCategory === cat.id
                    ? 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))'
                    : 'rgba(12, 12, 15, 0.6)',
                  border: `1px solid ${activeCategory === cat.id ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                  color: activeCategory === cat.id ? 'hsl(0 0% 5%)' : 'rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  transition: 'all 0.4s cubic-bezier(0.25,0.1,0.25,1)',
                }}
              >
                {cat.icon}
                {cat.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              onClick={() => {
                if (video.vimeoUrl) {
                  window.open(video.vimeoUrl, '_blank', 'noopener,noreferrer');
                } else {
                  setSelectedVideo(video);
                }
              }}
            />
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {[
            { label: 'Videos', value: filteredVideos.length, icon: <Film size={16} /> },
            { label: 'Pipeline Steps', value: 4, icon: <Layers size={16} /> },
            { label: 'Categories', value: VIDEO_CATEGORIES.length - 1, icon: <Grid3X3 size={16} /> },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: 'rgba(12, 12, 15, 0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  color: 'hsl(43 100% 50%)',
                }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-white/85">{stat.value}</p>
                <p className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
