import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Clock,
  Users,
  Award,
  X,
  Play,
  Pause,
  Film,
  Image,
  Clapperboard,
  Sparkles,
  ChevronDown,
  Youtube,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Star,
  MessageSquare,
  Grid3X3,
  Eye,
  Tag,
} from 'lucide-react';
import { getProjectById, getAdjacentProjects } from '../data/projects';
import YouTubePlayer from '../components/YouTubePlayer';

// ─── INTERACTIVE PROJECT TITLE ────────────────────────────────────────────────
function InteractiveProjectTitle({ title }: { title: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  const chars = title.split('');

  return (
    <span
      ref={ref}
      className="relative"
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          background: `radial-gradient(ellipse 200px 150px at ${mousePos.x}% ${mousePos.y}%, rgba(232,164,0,0.12) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {chars.map((char, i) => {
        const dx = (mousePos.x - 50) * 0.1;
        const dy = (mousePos.y - 50) * 0.1;
        const rX = -dy * 1.5;
        const rY = dx * 1.5;
        return (
          <motion.span
            key={i}
            className="inline-block"
            style={{ display: 'inline-block', whiteSpace: 'pre', transformStyle: 'preserve-3d' }}
            animate={
              isHovered
                ? {
                    rotateX: [0, rX * 0.5, rX, 0],
                    rotateY: [0, rY * 0.5, rY, 0],
                    y: [0, dy * 2, 0],
                    color: ['#f5f5f5', '#e8a400', '#ff6b6b', '#e8a400'],
                    textShadow: [
                      '0 0 0px rgba(232,164,0,0)',
                      '0 0 20px rgba(232,164,0,0.8)',
                      '0 0 40px rgba(255,107,107,0.6)',
                      '0 0 20px rgba(232,164,0,0.8)',
                      '0 0 0px rgba(232,164,0,0)',
                    ],
                  }
                : {}
            }
            whileHover={{ scale: 1.2, y: -4, transition: { duration: 0.2, delay: i * 0.03 } }}
            transition={{
              duration: isHovered ? 0.8 : 0,
              delay: isHovered ? i * 0.04 : 0,
              ease: 'easeInOut',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </span>
  );
}

type ProjectVideo = {
  id: number;
  label: string;
  youtubeId: string;
  duration: string;
  thumbnail: string;
};

const TABS = [
  { id: 'overview', label: 'Tổng Quan', icon: <Eye size={15} /> },
  { id: 'videos', label: 'Videos', icon: <Play size={15} /> },
  { id: 'gallery', label: 'Hình Ảnh', icon: <Image size={15} /> },
  { id: 'behind', label: 'Behind The Scenes', icon: <Clapperboard size={15} /> },
  { id: 'awards', label: 'Giải Thưởng', icon: <Award size={15} /> },
];

const DEFAULT_ARTISTS = [
  { role: 'GI and VFX', names: 'SPICE fx' },
  { role: 'CG Director', names: 'Quoc Duy Ngo' },
  { role: 'VFX Producer', names: 'Nhi Truong, Tran Thi Tuyet Nhung' },
  { role: 'CG Artists', names: 'Viet Nguyen, Dat Duong' },
  { role: 'VFX Artists', names: 'Luong Minh Hai, Nguyen Thanh Duy, Ly Cam Bieu, Le My Tam' },
];

function buildProjectVideos(project: ReturnType<typeof getProjectById>): ProjectVideo[] {
  if (!project?.youtubeId) return [];

  const thumbnails = [project.image, ...(project.gallery ?? [])];
  return thumbnails.slice(0, 6).map((thumb, index) => ({
    id: index + 1,
    label: index === 0 ? `${project.title} - Official` : `${project.title} - Shot ${index}`,
    youtubeId: project.youtubeId!,
    duration: '--:--',
    thumbnail: thumb,
  }));
}

const SAMPLE_BTS = [
  { id: 1, label: 'Green Screen Setup', thumb: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80', desc: 'Setting up the tracking markers and lighting' },
  { id: 2, label: 'CG Pipeline', thumb: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=600&q=80', desc: 'Maya to Houdini workflow' },
  { id: 3, label: 'FX Simulation', thumb: 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&q=80', desc: 'Houdini pyro simulations' },
  { id: 4, label: 'Compositing', thumb: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600&q=80', desc: 'Nuke multi-pass comp' },
  { id: 5, label: 'Color Grading', thumb: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80', desc: 'DaVinci Resolve workflow' },
  { id: 6, label: 'Final Output', thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80', desc: 'Delivery specifications' },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProjectById(id) : undefined;
  const adjacent = id ? getAdjacentProjects(id) : null;
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<ProjectVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — VFX Portfolio`;
    } else {
      document.title = 'Project not found — VFX Portfolio';
    }
  }, [project]);

  useEffect(() => {
    setActiveVideo(null);
    setIsPlaying(false);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-xs text-accent uppercase tracking-[0.4em] mb-4">404</p>
          <h1 className="text-3xl md:text-5xl font-display text-text-primary mb-4">
            Project not found
          </h1>
          <p className="text-sm text-muted mb-8">
            The project you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg-deep font-medium text-sm"
          >
            <ArrowLeft size={14} /> Back to portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* ─── HERO ─── Full-bleed image with header overlaid */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Full-bleed cover image — top, left, right all edge-to-edge */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <img
            src={project.image}
            alt=""
            aria-hidden
            className="w-full h-full object-cover"
          />
          {/* Gradient overlays: darken sides and bottom, keep top edge free */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
        </motion.div>

        {/* Header — overlaid on hero, full width */}
        <header className="absolute top-0 left-0 right-0 z-40">
          <div className="flex items-center justify-between px-8 md:px-12 lg:px-16 h-16">
            <Link
              to="/"
              aria-label="Back to portfolio"
              className="group inline-flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors duration-300"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1 duration-300"
              />
              <span className="tracking-wide font-medium">Quay Lại</span>
            </Link>

            <div className="hidden md:flex items-center gap-3 text-xs text-white/40 font-mono uppercase tracking-[0.3em]">
              <span>{project.category}</span>
              <span className="w-1 h-1 rounded-full bg-accent" />
              <span>{project.year}</span>
            </div>
          </div>
        </header>

        {/* Hero Content — centered, overlaid on the image */}
        <div className="relative h-full flex flex-col justify-end px-8 md:px-12 lg:px-16 pb-16 md:pb-20">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Category + role pill */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <span className="px-3.5 py-1.5 rounded-full border border-accent/50 text-accent text-[11px] uppercase tracking-[0.3em] font-semibold backdrop-blur-md bg-black/30">
                {project.category}
              </span>
              <span className="text-xs text-white/40 font-mono">{project.role}</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-wide leading-[1.0] mb-6">
              <InteractiveProjectTitle title={project.title} />
            </h1>

            {/* Description */}
            <motion.p
              className="text-base md:text-lg text-white/50 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {project.description}
            </motion.p>

            {/* Meta strip */}
            <motion.div
              className="flex flex-wrap gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <MetaPill icon={<Calendar size={13} />} label="Năm" value={project.year} />
              <MetaPill icon={<Clock size={13} />} label="Thời Gian" value={project.duration ?? '—'} />
              <MetaPill icon={<Users size={13} />} label="Team" value={project.team ?? '—'} />
              <MetaPill icon={<Award size={13} />} label="Khách Hàng" value={project.client ?? '—'} />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={16} className="text-white/30" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── TAB NAVIGATION ─── Sticky, clean, minimal */}
      <section className="sticky top-0 z-30 bg-bg/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-0">
            {TABS.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-white/35 hover:text-white/70'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
                    layoutId="tabIndicatorNew"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.icon}</span>
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TAB CONTENT ─── Centered, max-width, clean padding */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-14 md:py-20"
        >
          {activeTab === 'overview' && (
            <OverviewTab project={project} />
          )}
          {activeTab === 'videos' && (
            <VideosTab
              videos={buildProjectVideos(project)}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab project={project} onImageClick={setLightboxImage} />
          )}
          {activeTab === 'behind' && (
            <BehindTab btsItems={SAMPLE_BTS} onImageClick={setLightboxImage} />
          )}
          {activeTab === 'awards' && (
            <AwardsTab project={project} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ─── ADJACENT NAVIGATION ─── Full-bleed cards */}
      {adjacent && (
        <section className="border-t border-white/5">
          <div className="grid md:grid-cols-2">
            <AdjacentCard direction="prev" project={adjacent.prev} />
            <AdjacentCard direction="next" project={adjacent.next} />
          </div>
        </section>
      )}

      {/* ─── FOOTER CTA ─── */}
      <section className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-sm text-white/35">
            Có dự án cần hợp tác? Hãy cùng nhau tạo nên điều tuyệt vời.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg-deep font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
          >
            Liên hệ ngay <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── VIDEO LIGHTBOX ─── */}
      <AnimatePresence>
        {activeVideo && (
          <VideoLightbox
            video={activeVideo}
            onClose={() => { setActiveVideo(null); setIsPlaying(false); }}
          />
        )}
      </AnimatePresence>

      {/* ─── IMAGE LIGHTBOX ─── */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.button
              type="button"
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
              onClick={() => setLightboxImage(null)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              aria-label="Close"
            >
              <X size={18} />
            </motion.button>
            <motion.img
              src={lightboxImage}
              alt=""
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── META PILL ───────────────────────────────────────────────────────────────
function MetaPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/8">
      <span className="text-accent">{icon}</span>
      <div>
        <p className="text-[9px] text-white/30 uppercase tracking-[0.25em] font-semibold leading-none mb-1">{label}</p>
        <p className="text-sm text-white/80 font-medium leading-none">{value}</p>
      </div>
    </div>
  );
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────────────────────
function OverviewTab({ project }: { project: ReturnType<typeof getProjectById> }) {
  if (!project) return null;
  const artistCredits = project.artists && project.artists.length > 0 ? project.artists : DEFAULT_ARTISTS;

  return (
    <div className="space-y-12">
      {/* Main Video Player */}
      {project.youtubeId && (
        <motion.div
          className="rounded-2xl overflow-hidden border border-white/8 bg-black"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <YouTubePlayer videoId={project.youtubeId} title={project.title} />
        </motion.div>
      )}

      {/* Challenge & Solution */}
      {(project.challenge || project.solution) && (
        <div className="grid md:grid-cols-2 gap-5">
          {project.challenge && (
            <motion.div
              className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #ef4444, transparent)' }} />
              <div className="flex items-center gap-3 mb-5">
                <Settings size={18} className="text-red-400" />
                <p className="text-[11px] text-red-400 uppercase tracking-[0.35em] font-semibold">Thách Thức</p>
              </div>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {project.challenge}
              </p>
            </motion.div>
          )}
          {project.solution && (
            <motion.div
              className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: 'linear-gradient(to bottom, #22c55e, transparent)' }} />
              <div className="flex items-center gap-3 mb-5">
                <Sparkles size={18} className="text-green-400" />
                <p className="text-[11px] text-green-400 uppercase tracking-[0.35em] font-semibold">Giải Pháp</p>
              </div>
              <p className="text-base md:text-lg text-white/80 leading-relaxed">
                {project.solution}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Tools */}
      {project.tools && project.tools.length > 0 && (
        <motion.div
          className="p-8 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Settings size={18} className="text-accent" />
            <p className="text-[11px] text-accent uppercase tracking-[0.35em] font-semibold">Công Cụ Sử Dụng</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {project.tools.map((tool, i) => (
              <motion.span
                key={tool}
                className="px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white/70 hover:border-accent/40 hover:text-accent transition-all duration-300 cursor-default"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.04 }}
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Artist Credits */}
      {artistCredits.length > 0 && (
        <motion.div
          className="p-8 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-7">
            <Users size={18} className="text-accent" />
            <p className="text-[11px] text-accent uppercase tracking-[0.35em] font-semibold">Artist Credits</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {artistCredits.map((artist, i) => (
              <ArtistCreditCard
                key={`${artist.role}-${i}`}
                role={artist.role}
                names={artist.names}
                delay={i * 0.05}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Testimonial */}
      {project.testimonial && (
        <motion.div
          className="p-10 rounded-2xl bg-gradient-to-br from-accent/8 to-transparent border border-accent/15 backdrop-blur-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare size={18} className="text-accent" />
            <p className="text-[11px] text-accent uppercase tracking-[0.35em] font-semibold">Đánh Giá</p>
          </div>
          <blockquote className="text-xl md:text-2xl font-display text-white/90 leading-snug mb-8">
            &ldquo;{project.testimonial.text}&rdquo;
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-display text-lg">
              {project.testimonial.author.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-white/90">{project.testimonial.author}</p>
              <p className="text-sm text-white/35">{project.testimonial.position}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── ARTIST CREDIT CARD ───────────────────────────────────────────────────────
function ArtistCreditCard({ role, names, delay }: { role: string; names: string; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-xl border border-white/8 bg-white/[0.02] p-5 overflow-hidden cursor-default"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      whileHover={{ y: -3, borderColor: 'rgba(232, 164, 0, 0.35)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(232,164,0,0.1) 0%, transparent 55%)`,
        }}
      />
      <p className="relative text-[10px] text-accent uppercase tracking-[0.28em] mb-2 font-semibold">{role}</p>
      <p className="relative text-sm text-white/70 leading-relaxed">{names}</p>
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-px"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
      />
    </motion.div>
  );
}

// ─── VIDEOS TAB ───────────────────────────────────────────────────────────────
function VideosTab({ videos, activeVideo, setActiveVideo, isPlaying, setIsPlaying }: {
  videos: ProjectVideo[];
  activeVideo: ProjectVideo | null;
  setActiveVideo: (v: ProjectVideo | null) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-20 rounded-2xl bg-white/[0.03] border border-white/8">
        <Youtube size={48} className="mx-auto text-white/15 mb-4" />
        <p className="text-white/35">Project này chưa có video YouTube.</p>
      </div>
    );
  }

  const mainVideo = activeVideo || videos[0];

  return (
    <div className="space-y-8">
      {/* Main Video Player */}
      <motion.div
        className="rounded-2xl overflow-hidden border border-white/8 bg-black"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative aspect-video">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${mainVideo.youtubeId}?autoplay=${isPlaying ? 1 : 0}&rel=0&modestbranding=1`}
            title={mainVideo.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Controls Bar */}
        <div className="bg-white/[0.02] backdrop-blur-md p-4 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-accent text-bg-deep flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </motion.button>
            <div>
              <h3 className="font-medium text-white/90">{mainVideo.label}</h3>
              <p className="text-xs text-white/35 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] uppercase tracking-wider">YouTube</span>
                {mainVideo.duration}
              </p>
            </div>
          </div>
          <a
            href={`https://youtube.com/watch?v=${mainVideo.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-500 active:scale-95 transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Mở YouTube
          </a>
        </div>
      </motion.div>

      {/* Video Thumbnails */}
      <div>
        <h3 className="text-lg font-display text-white/90 mb-5 flex items-center gap-2">
          <Grid3X3 size={16} className="text-accent" />
          Tất Cả Videos ({videos.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {videos.map((video, i) => (
            <motion.button
              key={video.id}
              onClick={() => { setActiveVideo(video); setIsPlaying(true); }}
              className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                mainVideo.id === video.id ? 'border-accent' : 'border-transparent hover:border-white/20'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4 }}
            >
              <div className="aspect-video bg-white/[0.04]">
                <img
                  src={video.thumbnail}
                  alt={video.label}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-9 h-9 rounded-full bg-accent/90 flex items-center justify-center">
                  <Play size={14} className="text-bg-deep ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white/70">
                {video.duration}
              </div>

              <div className="p-2.5 bg-white/[0.02]">
                <p className="text-xs font-medium text-white/60 truncate">{video.label}</p>
              </div>

              {mainVideo.id === video.id && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded-full bg-accent text-[10px] text-bg-deep font-bold uppercase tracking-wider">
                    Playing
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GALLERY TAB ──────────────────────────────────────────────────────────────
function GalleryTab({ project, onImageClick }: {
  project: ReturnType<typeof getProjectById>;
  onImageClick: (img: string) => void;
}) {
  const gallery = project?.gallery || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-display text-white/90 flex items-center gap-2">
          <Image size={16} className="text-accent" />
          Hình Ảnh ({gallery.length})
        </h3>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Eye size={13} />
          Click để phóng to
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gallery.map((src, i) => (
          <motion.button
            key={src + i}
            onClick={() => onImageClick(src)}
            className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 cursor-pointer"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
          >
            <img
              src={src}
              alt={`${project?.title} still ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-white/70">
                  {String(i + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-1 text-accent text-sm font-medium">
                  Phóng to <ArrowUpRight size={13} />
                </span>
              </div>
            </div>

            <div className="absolute inset-0 rounded-2xl border-2 border-accent/0 group-hover:border-accent/40 transition-colors duration-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── BEHIND THE SCENES TAB ────────────────────────────────────────────────────
function BehindTab({ btsItems, onImageClick }: {
  btsItems: typeof SAMPLE_BTS;
  onImageClick: (img: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display text-white/90 flex items-center gap-2">
          <Clapperboard size={16} className="text-accent" />
          Behind The Scenes ({btsItems.length})
        </h3>
        <span className="text-xs text-white/30">Quy trình làm việc thực tế</span>
      </div>

      {/* BTS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {btsItems.map((item, i) => (
          <motion.div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-white/[0.03] border border-white/8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={item.thumb}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-accent text-bg-deep font-display text-sm flex items-center justify-center shadow-lg">
                {i + 1}
              </div>

              <motion.button
                onClick={() => onImageClick(item.thumb)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                whileTap={{ scale: 0.9 }}
              >
                <Maximize2 size={13} />
              </motion.button>
            </div>

            <div className="p-5">
              <h4 className="font-medium text-white/90 mb-1">{item.label}</h4>
              <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
            </div>

            <motion.div
              className="h-0.5 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Process Timeline */}
      <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/8 backdrop-blur-md">
        <h4 className="text-lg font-display text-white/90 mb-7 flex items-center gap-2">
          <Settings size={16} className="text-accent" />
          Quy Trình Làm Việc
        </h4>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/8" />

          <div className="space-y-6">
            {[
              { step: 1, title: 'Thu Thập Tài Liệu', desc: 'Thu thập reference, tracking markers, và lighting data' },
              { step: 2, title: 'Xây Dựng CG', desc: 'Modeling, texturing, và rigging trong Maya/Houdini' },
              { step: 3, title: 'FX Simulation', desc: 'Tạo các hiệu ứng particle, fluid, và pyro' },
              { step: 4, title: 'Compositing', desc: 'Ghép các layer trong Nuke với multi-pass workflow' },
              { step: 5, title: 'Final Output', desc: 'Color grading và xuất file theo yêu cầu' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative flex items-start gap-6 pl-12"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="absolute left-0 w-8 h-8 rounded-full bg-accent text-bg-deep font-display text-sm flex items-center justify-center z-10 shadow-lg">
                  {item.step}
                </div>
                <div className="flex-1 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                  <h5 className="font-medium text-white/90 mb-1">{item.title}</h5>
                  <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AWARDS TAB ───────────────────────────────────────────────────────────────
function AwardsTab({ project }: { project: ReturnType<typeof getProjectById> }) {
  const awards = project?.awards || [];

  return (
    <div className="space-y-10">
      <h3 className="text-lg font-display text-white/90 flex items-center gap-2">
        <Award size={16} className="text-accent" />
        Giải Thưởng & Đánh Giá ({awards.length})
      </h3>

      {awards.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {awards.map((award, i) => (
            <motion.div
              key={award}
              className="flex items-center gap-5 p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/25 flex items-center justify-center flex-shrink-0">
                <Star size={22} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-medium text-white/90">{award}</h4>
                <p className="text-sm text-white/30 mt-1">Giải thưởng danh giá trong ngành VFX</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-2xl bg-white/[0.03] border border-white/8">
          <Award size={48} className="mx-auto text-white/12 mb-4" />
          <p className="text-white/30">Chưa có giải thưởng cho dự án này</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { value: '100%', label: 'Client Hài Lòng' },
          { value: '50+', label: 'Projects Hoàn Thành' },
          { value: '5+', label: 'Năm Kinh Nghiệm' },
          { value: '10+', label: 'Awards Đạt Được' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:-translate-y-1 transition-transform duration-300"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
          >
            <p className="text-3xl font-display text-accent mb-2">{stat.value}</p>
            <p className="text-sm text-white/35">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── VIDEO LIGHTBOX ───────────────────────────────────────────────────────────
function VideoLightbox({ video, onClose }: { video: ProjectVideo; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
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
      <motion.div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />

      <motion.div
        className="relative max-w-5xl w-full"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.label}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-display text-white/90">{video.label}</h3>
            <p className="text-sm text-white/30 mt-1">{video.duration}</p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200"
          >
            <X size={18} className="text-white/60" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ADJACENT CARD ───────────────────────────────────────────────────────────
function AdjacentCard({
  direction,
  project,
}: {
  direction: 'prev' | 'next';
  project: ReturnType<typeof getProjectById>;
}) {
  if (!project) return null;
  const isNext = direction === 'next';

  return (
    <Link
      to={`/project/${project.id}`}
      className="group relative overflow-hidden bg-white/[0.02] border border-white/5 aspect-[16/9] md:aspect-auto md:min-h-[280px] block"
    >
      <img
        src={project.image}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-20 transition-all duration-700 group-hover:opacity-35 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/50" />
      <div className={`relative h-full p-8 md:p-12 flex flex-col justify-between ${isNext ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-2 text-[10px] text-accent uppercase tracking-[0.4em] font-semibold ${isNext ? 'flex-row-reverse' : ''}`}>
          {isNext ? <ArrowRight size={12} className="transition-transform group-hover:translate-x-1 duration-300" /> : <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1 duration-300" />}
          <span>{isNext ? 'Dự Án Tiếp' : 'Dự Án Trước'}</span>
        </div>
        <div className={isNext ? 'text-right' : 'text-left'}>
          <p className="text-xs text-white/30 font-mono mb-2">{project.year}</p>
          <h3 className="text-2xl md:text-3xl font-display text-white/90 group-hover:text-accent transition-colors duration-300">
            {project.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
