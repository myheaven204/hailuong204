import { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const ROLE = 'VFX Compositor & Motion Designer';

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const contentY = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [0, 0])
    : useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  const contentOpacity = shouldReduceMotion
    ? useTransform(scrollYProgress, [0, 1], [1, 1])
    : useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      
      tl.fromTo('.hero-badge',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo('.hero-title-line',
        { opacity: 0, y: 50, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.5)' },
        '-=0.4'
      )
      .fromTo('.hero-stats',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo('.hero-line-left, .hero-line-right',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.2, ease: 'power3.inOut' },
        '-=0.8'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [shouldReduceMotion]);

  return (
    <section 
      id="home" 
      ref={sectionRef} 
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0"
      style={{ overflowX: 'hidden' }}
      aria-labelledby="hero-heading"
    >
      <h2 id="hero-heading" className="sr-only">VFX Compositor Portfolio — Hai Luong</h2>

      {/* Decorative Lines */}
      <motion.div 
        className="hero-line-left absolute top-1/2 left-0 w-[15%] h-[1px] origin-left hidden md:block"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46% / 0.6))' }}
      />
      <motion.div 
        className="hero-line-right absolute top-1/2 right-0 w-[15%] h-[1px] origin-right hidden md:block"
        style={{ background: 'linear-gradient(270deg, transparent, hsl(43 100% 46% / 0.6))' }}
      />

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        {/* Role Badge - Redesigned */}
        <motion.div 
          className="hero-badge mb-10 md:mb-14"
          initial={{ opacity: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/60" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-medium text-amber-400/80">
              {ROLE}
            </span>
            <div className="hidden md:block w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>
        </motion.div>

        {/* Main Title - New Layout */}
        <div className="relative mb-8 md:mb-14 w-full min-w-0 px-2 overflow-hidden">
          <motion.h1 
            className="hero-title-line text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[8rem] xl:text-[9rem] font-bold leading-[1] tracking-tight text-white min-w-0"
            style={{ 
              textWrap: 'balance', 
              wordBreak: 'break-word',
              display: 'block',
              maxWidth: '100%',
            }}
          >
            HAI
          </motion.h1>
          <motion.h1 
            className="hero-title-line text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[8rem] xl:text-[9rem] font-bold leading-[1] tracking-tight min-w-0"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 50%), hsl(35 100% 55%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textWrap: 'balance',
              wordBreak: 'break-word',
              display: 'block',
              maxWidth: '100%',
            }}
          >
            LUONG
          </motion.h1>
          
          {/* Decorative VFX text - Desktop only */}
          <motion.div 
            className="absolute -right-4 lg:-right-16 top-1/2 -translate-y-1/2 hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <span 
              className="text-[10px] uppercase tracking-[0.5em] text-white/10 font-bold"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              VFX · COMPOSITOR · MOTION
            </span>
          </motion.div>
        </div>

        {/* VFX Badge */}
        <motion.div 
          className="hero-badge mb-10 md:mb-14"
          initial={{ opacity: 0 }}
        >
          <span 
            className="inline-block px-5 md:px-6 py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-semibold rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46% / 0.15), hsl(35 100% 50% / 0.1))',
              border: '1px solid hsl(43 100% 46% / 0.3)',
              color: 'hsl(43 100% 60%)',
            }}
          >
            VFX ARTIST
          </span>
        </motion.div>

        {/* Subtitle - Location & Description */}
        <motion.p 
          className="hero-subtitle text-sm md:text-base text-gray-400 mb-12 md:mb-18 max-w-xl leading-relaxed px-4"
          initial={{ opacity: 0 }}
        >
          <span className="text-white/90">Ho Chi Minh City, Vietnam</span>
          <span className="mx-2 md:mx-3 text-amber-500/40">—</span>
          <span>
            5+ years crafting{' '}
            <span className="text-amber-400/80">photorealistic VFX</span>
            {' '}for film, TVC & music videos
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="hero-cta flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-14 md:mb-22"
          initial={{ opacity: 0 }}
        >
          <a
            href="#showreel"
            className="group relative flex items-center gap-2.5 xs:gap-3 px-6 xs:px-8 py-3.5 xs:py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              boxShadow: '0 4px 30px rgba(232, 164, 0, 0.3)',
            }}
          >
            <span className="relative text-[13px] xs:text-sm font-semibold text-gray-900 tracking-wide">
              Watch Showreel
            </span>
            <Play size={16} className="relative text-gray-900 ml-1" fill="currentColor" />
            
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
                filter: 'blur(20px)',
              }}
            />
          </a>

          <a
            href="#projects"
            className="group relative flex items-center gap-2.5 xs:gap-3 px-6 xs:px-8 py-3.5 xs:py-4 rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span className="text-[13px] xs:text-sm font-medium text-white/80 tracking-wide">
              View Projects
            </span>
            <ArrowRight 
              size={16} 
              className="text-white/50 group-hover:text-amber-400 group-hover:translate-x-1 transition-all duration-300" 
            />
          </a>
        </motion.div>

        {/* Stats Row - Redesigned */}
        <motion.div 
          className="hero-stats flex items-center justify-center gap-6 md:gap-12 lg:gap-16"
          initial={{ opacity: 0 }}
        >
          {[
            { value: '50+', label: 'Projects', accent: true },
            { value: '5+', label: 'Years Exp', accent: true },
            { value: '20+', label: 'Clients', accent: false },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <div className="flex items-baseline gap-0.5 md:gap-1">
                <span 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold"
                  style={{
                    background: stat.accent 
                      ? 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))'
                      : 'linear-gradient(135deg, hsl(0 0% 90%), hsl(0 0% 70%))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-base md:text-lg text-amber-500/60">+</span>
              </div>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-gray-500 mt-1.5 md:mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div 
          className="w-px h-10 md:h-12 bg-gradient-to-b from-amber-500/30 to-transparent mt-10 md:mt-16"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        />
      </motion.div>

      {/* Scroll Indicator - Minimal */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-medium">
            Scroll
          </span>
          <motion.div 
            className="w-[1px] h-8 bg-gradient-to-b from-amber-500/50 to-transparent"
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* Corner Accents - Desktop only */}
      <div 
        className="absolute top-8 left-8 w-16 h-16 border-l border-t border-amber-500/20 pointer-events-none hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
      <div 
        className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-amber-500/20 pointer-events-none hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      />
    </section>
  );
}

export default Hero;
