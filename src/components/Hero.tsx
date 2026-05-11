import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import EnhancedCTA from './EnhancedCTA';
import AnimatedStats from './AnimatedStats';
import EnhancedScrollIndicator from './EnhancedScrollIndicator';
import TextPressure from './TextPressure';

// ─── VIEWER UI CONSTANTS ──────────────────────────────────────────────────────
const CHANNELS = ['RGBA', 'R', 'G', 'B', 'A'];
const ZOOM_LEVELS = ['25%', '50%', '75%', '100%', '200%'];
const EXPOSURE_STOPS = ['-2', '-1', '0', '+1', '+2'];

// ─── TIMECODE ─────────────────────────────────────────────────────────────────
function useTimecode() {
  const [tc, setTc] = useState('00:00:00:00');
  useEffect(() => {
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
    }, 1000 / 24);
    return () => clearInterval(id);
  }, []);
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

      {/* ── CONTENT ── */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center pointer-events-none pt-20 md:pt-32 lg:pt-40"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Title */}
        <div className="relative mb-6 md:mb-10 lg:mb-12 w-full px-4 sm:px-6">
          <div className="w-full">
            <TextPressure
              text="HAI LUONG"
              textColor="hsl(43 100% 50%)"
            />
          </div>

          {/* VFX Compositor label under name */}
          <div
            className="hero-title-line flex items-center justify-center gap-3 mt-5 md:mt-7 lg:mt-8"
            style={{ opacity: 0 }}
          >
            <div className="h-[1px] w-8 md:w-14 bg-gradient-to-r from-transparent to-amber-500/50" />
            <span className="text-[10px] md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-medium text-amber-400/70 whitespace-nowrap" style={{ fontFamily: "'Space Mono', monospace" }}>
              VFX Compositor
            </span>
            <div className="h-[1px] w-8 md:w-14 bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>

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
          className="hero-subtitle text-sm md:text-base text-gray-400 mb-14 md:mb-20 lg:mb-24 max-w-xl leading-relaxed px-4"
          style={{ opacity: 0 }}
        >
          <span className="text-white/90">Ho Chi Minh City, Vietnam</span>
          <span className="mx-2 md:mx-3 text-amber-500/40">—</span>
          <span>
            5+ years crafting{' '}
            <span className="text-amber-400/80">photorealistic VFX</span>
            {' '}for film, TVC & music videos
          </span>
        </p>

        {/* CTA */}
        <div className="pointer-events-auto">
          <EnhancedCTA />
        </div>

        {/* Stats */}
        <AnimatedStats />

        {/* Divider */}
        <motion.div
          className="w-px h-10 md:h-12 bg-gradient-to-b from-amber-500/30 to-transparent mt-10 md:mt-16"
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
