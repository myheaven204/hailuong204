import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import EnhancedCTA from './EnhancedCTA';
import AnimatedStats from './AnimatedStats';
import EnhancedScrollIndicator from './EnhancedScrollIndicator';
import { ContainerTextFlip } from './ui/modern-animated-multi-words';

// ─── VIEWER UI CONSTANTS ──────────────────────────────────────────────────────
const CHANNELS = ['RGBA', 'R', 'G', 'B', 'A'];
const ZOOM_LEVELS = ['25%', '50%', '75%', '100%', '200%'];
const EXPOSURE_STOPS = ['-2', '-1', '0', '+1', '+2'];

// ─── TIMECODE ─────────────────────────────────────────────────────────────────
function useTimecode() {
  const [tc, setTc] = useState('00:00:00:00');
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );

    const element = document.querySelector('[data-timecode]');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const f = frame % 24;
      const s = Math.floor(frame / 24) % 60;
      const m = Math.floor(frame / (24 * 60)) % 60;
      const h = Math.floor(frame / (24 * 60 * 60)) % 24;
      setTc(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
      );
    }, 1000 / 10);
    timerRef.current = id;
    return () => clearInterval(id);
  }, [isVisible]);

  return tc;
}

// ─── SCANLINE OVERLAY ─────────────────────────────────────────────────────────
function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-20"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.06) 2px,
          rgba(0,0,0,0.06) 4px
        )`,
        backgroundSize: '100% 4px',
      }}
    />
  );
}

// ─── VIEWER CHROME TOP BAR ────────────────────────────────────────────────────
function ViewerTopBar({
  activeChannel,
  onChannel,
  zoom,
  onZoom,
  timecode,
}: {
  activeChannel: string;
  onChannel: (c: string) => void;
  zoom: string;
  onZoom: (z: string) => void;
  timecode: string;
}) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-1.5"
      style={{
        background: 'rgba(8,8,10,0.92)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Left: comp name + status */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase">
          COMP_v001
        </span>
        <span
          className="text-[8px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm"
          style={{
            background: 'rgba(0,200,83,0.15)',
            border: '1px solid rgba(0,200,83,0.4)',
            color: '#00c853',
          }}
        >
          APPROVED
        </span>
      </div>

      {/* Center: channel buttons */}
      <div className="flex items-center gap-1">
        {CHANNELS.map(ch => (
          <button
            key={ch}
            onClick={() => onChannel(ch)}
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-150 cursor-pointer"
            style={{
              background: activeChannel === ch ? 'rgba(232,164,0,0.2)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${activeChannel === ch ? 'rgba(232,164,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
              color: activeChannel === ch ? '#f5a623' : 'rgba(255,255,255,0.35)',
            }}
          >
            {ch}
          </button>
        ))}
      </div>

      {/* Right: timecode */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-amber-400/50 tracking-widest">
          {timecode}
        </span>
      </div>
    </div>
  );
}

// ─── VIEWER CHROME BOTTOM BAR ─────────────────────────────────────────────────
function ViewerBottomBar({
  zoom,
  onZoom,
  exposure,
  onExposure,
}: {
  zoom: string;
  onZoom: (z: string) => void;
  exposure: string;
  onExposure: (e: string) => void;
}) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-1.5"
      style={{
        background: 'rgba(8,8,10,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Left: resolution + frame info */}
      <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-white/25 tracking-wider">1920×1080</span>
        <span className="text-[9px] font-mono text-white/20">|</span>
        <span className="text-[9px] font-mono text-white/25 tracking-wider">24fps</span>
        <span className="text-[9px] font-mono text-white/20">|</span>
        <span className="text-[9px] font-mono text-white/25 tracking-wider">EXR 16bit</span>
      </div>

      {/* Center: zoom */}
      <div className="flex items-center gap-1">
        <span className="text-[8px] font-mono text-white/20 mr-1 tracking-wider">ZOOM</span>
        {ZOOM_LEVELS.map(z => (
          <button
            key={z}
            onClick={() => onZoom(z)}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm transition-all duration-150 cursor-pointer"
            style={{
              background: zoom === z ? 'rgba(232,164,0,0.15)' : 'transparent',
              color: zoom === z ? '#f5a623' : 'rgba(255,255,255,0.25)',
            }}
          >
            {z}
          </button>
        ))}
      </div>

      {/* Right: exposure */}
      <div className="flex items-center gap-1">
        <span className="text-[8px] font-mono text-white/20 mr-1 tracking-wider">EXP</span>
        {EXPOSURE_STOPS.map(e => (
          <button
            key={e}
            onClick={() => onExposure(e)}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm transition-all duration-150 cursor-pointer"
            style={{
              background: exposure === e ? 'rgba(232,164,0,0.15)' : 'transparent',
              color: exposure === e ? '#f5a623' : 'rgba(255,255,255,0.25)',
            }}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CHANNEL TINT ─────────────────────────────────────────────────────────────
function ChannelTint({ channel }: { channel: string }) {
  if (channel === 'RGBA') return null;
  const tints: Record<string, string> = {
    R: 'rgba(255,60,60,0.08)',
    G: 'rgba(60,255,60,0.08)',
    B: 'rgba(60,60,255,0.08)',
    A: 'rgba(255,255,255,0.06)',
  };
  return (
    <motion.div
      key={channel}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ background: tints[channel] }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    />
  );
}

// ─── CORNER CROSSHAIRS ────────────────────────────────────────────────────────
function ViewerCrosshairs() {
  const corners = [
    { top: 8, left: 8, rotate: 0 },
    { top: 8, right: 8, rotate: 90 },
    { bottom: 8, right: 8, rotate: 180 },
    { bottom: 8, left: 8, rotate: 270 },
  ];
  return (
    <>
      {corners.map((pos, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 pointer-events-none z-20"
          style={{
            ...pos,
            transform: `rotate(${pos.rotate}deg)`,
            borderTop: '1px solid rgba(232,164,0,0.35)',
            borderLeft: '1px solid rgba(232,164,0,0.35)',
          }}
        />
      ))}
    </>
  );
}

// ─── MAIN HERO ────────────────────────────────────────────────────────────────
function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const timecode = useTimecode();

  const [activeChannel, setActiveChannel] = useState('RGBA');
  const [zoom, setZoom] = useState('100%');
  const [exposure, setExposure] = useState('0');
  const [titleVariant, setTitleVariant] = useState<"gradient" | "primary" | "neon" | "glass">("gradient");

  const contentY = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [0, 0])
    : useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const contentOpacity = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [1, 1])
    : useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (shouldReduceMotion) {
      gsap.set('.viewer-chrome, .hero-title-line, .hero-subtitle', { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo('.viewer-chrome',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      .fromTo('.hero-title-line',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15 },
        '-=0.1'
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { opacity: 0, y: 16, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.5)' },
        '-=0.4'
      )
      .fromTo('.hero-stats',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.3'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ overflowX: 'hidden' }}
      aria-labelledby="hero-heading"
    >
      <h2 id="hero-heading" className="sr-only">VFX Compositor Portfolio — Hai Luong</h2>

      {/* ── VIEWER FRAME ── */}
      <div
        className="viewer-chrome absolute left-4 right-4 bottom-4 md:left-8 md:right-8 md:bottom-8 lg:left-12 lg:right-12 lg:bottom-12 rounded-sm z-10"
        data-timecode
        style={{
          top: 80,
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.8), inset 0 0 80px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top bar */}
        <ViewerTopBar
          activeChannel={activeChannel}
          onChannel={setActiveChannel}
          zoom={zoom}
          onZoom={setZoom}
          timecode={timecode}
        />

        {/* Bottom bar */}
        <ViewerBottomBar
          zoom={zoom}
          onZoom={setZoom}
          exposure={exposure}
          onExposure={setExposure}
        />

        {/* Corner crosshairs */}
        <ViewerCrosshairs />

        {/* Scanlines */}
        <ScanlineOverlay />

        {/* Channel tint */}
        <AnimatePresence>
          <ChannelTint key={activeChannel} channel={activeChannel} />
        </AnimatePresence>

        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative w-6 h-6">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-500/20" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-amber-500/20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full border border-amber-500/30" />
          </div>
        </div>

        {/* Safe area guides (subtle) */}
        <div
          className="absolute pointer-events-none z-10 hidden md:block"
          style={{
            inset: '8%',
            border: '1px dashed rgba(255,255,255,0.04)',
          }}
        />
      </div>

      {/* ── ANIMATED BACKGROUND ELEMENTS ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
      >
        {/* Floating orb 1 */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,164,0,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            left: '10%',
            top: '15%',
          }}
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating orb 2 */}
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,164,0,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            right: '5%',
            top: '25%',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Floating orb 3 */}
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(232,164,0,0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
            left: '50%',
            bottom: '10%',
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </motion.div>

      {/* ── CONTENT ── */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-6xl mx-auto flex flex-col items-center pt-0 md:pt-0 lg:pt-0"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Title */}
        <div className="relative w-full px-4 sm:px-6 flex flex-col items-center pointer-events-none" style={{ marginTop: 'clamp(32px, 7vh, 96px)', marginBottom: 'clamp(12px, 1.5vh, 24px)' }}>
          <ContainerTextFlip
            words={["HAI LUONG", "HAI LUONG", "HAI LUONG", "HAI LUONG"]}
            interval={3500}
            animationDuration={800}
            variant={titleVariant}
            className="px-4 py-2 md:px-6 md:py-3"
            textClassName="text-5xl md:text-7xl lg:text-8xl"
          />

          {/* Variant switcher */}
          <motion.div
            className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-6 justify-center flex-wrap pointer-events-auto px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {(["gradient", "primary", "neon", "glass"] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => setTitleVariant(variant)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-xs md:text-sm font-medium transition-all duration-300 border backdrop-blur-sm whitespace-nowrap ${
                  titleVariant === variant
                    ? "bg-amber-500/30 text-amber-300 border-amber-400/60"
                    : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/70"
                }`}
              >
                {variant}
              </button>
            ))}
          </motion.div>

          {/* Role badge */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <span className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] font-semibold text-amber-400/70" style={{ fontFamily: "'Space Mono', monospace" }}>
              VFX Compositor
            </span>
          </motion.div>

          {/* Location badge */}
          <motion.div
            className="flex items-center justify-center gap-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <span className="text-[10px] md:text-[11px] text-white/50" style={{ fontFamily: "'Space Mono', monospace" }}>
              📍 Ho Chi Minh City, Vietnam
            </span>
          </motion.div>

          {/* Vertical label — desktop */}
          <motion.div
            className="absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.5em] text-white/10 font-bold"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              VFX · COMPOSITOR · MOTION
            </span>
          </motion.div>
        </div>

        {/* Subtitle */}
        <p
          className="hero-subtitle text-sm md:text-base text-gray-400 max-w-2xl leading-relaxed px-4"
          style={{ opacity: 0, marginTop: 'clamp(16px, 2.8vh, 40px)', marginBottom: 'clamp(20px, 3.2vh, 40px)' }}
        >
          <span>
            5+ years crafting{' '}
            <span className="text-amber-400/80 font-medium">photorealistic VFX</span>
            {' '}for film, TVC & music videos
          </span>
        </p>

        {/* CTA */}
        <div className="pointer-events-auto" style={{ marginBottom: 'clamp(20px, 2.8vh, 32px)' }}>
          <EnhancedCTA />
        </div>

        {/* Stats */}
        <div style={{ marginBottom: 'clamp(28px, 3.8vh, 48px)' }}>
          <AnimatedStats />
        </div>

        {/* Divider */}
        <motion.div
          className="w-px h-10 md:h-12 bg-gradient-to-b from-amber-500/30 to-transparent"
          style={{ marginTop: 'clamp(16px, 2.2vh, 32px)' }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <EnhancedScrollIndicator />
    </section>
  );
}

export default Hero;
