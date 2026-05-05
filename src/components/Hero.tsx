import { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import MagneticButton from './MagneticButton';

const ROLES = ['VFX Artist', 'Compositor', 'Motion Designer', 'Visual Effects'];

// ─── FLOATING PARTICLE ───────────────────────────────────────────────────
const FloatingParticle = memo(function FloatingParticle({ 
  delay, 
  x, 
  size,
  reducedMotion
}: { 
  delay: number; 
  x: number; 
  size: number;
  reducedMotion?: boolean;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ 
        left: `${x}%`, 
        width: size, 
        height: size,
      }}
      animate={reducedMotion ? {} : {
        y: [0, -40, -80, -40, 0],
        opacity: [0.2, 0.7, 0.3, 0.7, 0.2],
        scale: [0.7, 1.2, 0.7],
        boxShadow: ['0 0 10px rgba(232, 164, 0, 0.3)', '0 0 25px rgba(232, 164, 0, 0.6)', '0 0 10px rgba(232, 164, 0, 0.3)'],
      }}
      transition={reducedMotion ? {} : {
        duration: 5 + delay,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

// ─── INTERACTIVE NAME TITLE ───────────────────────────────────────────────────
const InteractiveNameTitle = memo(function InteractiveNameTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const LINE1 = 'HAI LUONG'.split('');
  const LINE2 = 'VFX'.split('');

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const spawnSparkles = useCallback(() => {
    const newSparkles = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1200);
  }, []);

  const dx = (mousePos.x - 50) * 0.1;
  const dy = (mousePos.y - 50) * 0.1;

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center mb-8 cursor-default select-none"
      style={{ perspective: '1400px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setIsHovered(true); spawnSparkles(); }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none transition-all duration-200 rounded-full"
        style={{
          background: `radial-gradient(ellipse 500px 400px at ${mousePos.x}% ${mousePos.y}%, rgba(232,164,0,0.15) 0%, transparent 70%)`,
          opacity: isHovered ? 1 : 0.5,
          inset: '-100px -150px',
          filter: 'blur(40px)',
        }}
      />

      {/* Line 1 */}
      <h1 className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-wide text-white">
        {LINE1.map((char, i) => (
          <motion.span
            key={`l1-${i}`}
            className="hero-char inline-block"
            animate={{
              y: isHovered ? dy * (i % 2 === 0 ? -1 : 1) * 12 : 0,
              scale: isHovered ? 1.15 : 1,
              color: isHovered 
                ? ['#ffffff', '#fbbf24', '#f59e0b', '#fbbf24', '#ffffff']
                : '#ffffff',
              textShadow: isHovered
                ? ['0 0 0px rgba(232,164,0,0)', '0 0 30px rgba(232,164,0,0.9)', '0 0 60px rgba(232,164,0,0.6)', '0 0 30px rgba(232,164,0,0.9)', '0 0 0px rgba(232,164,0,0)']
                : '0 0 0px transparent',
            }}
            transition={{ duration: isHovered ? 0.8 : 0, delay: isHovered ? i * 0.05 : 0 }}
            style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </h1>

      {/* Line 2 */}
      <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1] tracking-[0.35em]">
        {LINE2.map((char, i) => (
          <motion.span
            key={`l2-${i}`}
            className="hero-char inline-block"
            animate={{
              y: isHovered ? -dy * 8 : 0,
              scale: isHovered ? 1.25 : 1,
              color: isHovered 
                ? ['#fbbf24', '#f59e0b', '#fcd34d', '#f59e0b', '#fbbf24']
                : '#fbbf24',
              textShadow: isHovered
                ? ['0 0 0px rgba(232,164,0,0)', '0 0 40px rgba(232,164,0,1)', '0 0 80px rgba(232,164,0,0.7)', '0 0 40px rgba(232,164,0,1)', '0 0 0px rgba(232,164,0,0)']
                : '0 0 15px rgba(232, 164, 0, 0.4)',
            }}
            transition={{ duration: isHovered ? 1 : 0, delay: isHovered ? 0.1 + i * 0.1 : 0 }}
            style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
          >
            {char}
          </motion.span>
        ))}
      </h1>

      {/* Sparkles */}
      {sparkles.map((s) => (
        <motion.span
          key={s.id}
          className="absolute w-2 h-2 rounded-full pointer-events-none"
          style={{ 
            left: `${s.x}%`, 
            top: `${s.y}%`,
            background: 'linear-gradient(135deg, hsl(43 100% 50%), hsl(35 100% 55%))',
            boxShadow: '0 0 15px rgba(232, 164, 0, 0.8)',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            x: [(Math.random() - 0.5) * 160, (Math.random() - 0.5) * 240],
            y: [(Math.random() - 0.5) * 160, (Math.random() - 0.5) * 240],
          }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      ))}

      {/* Underline */}
      <motion.div
        className="h-[3px] mt-5 rounded-full"
        animate={{ 
          scaleX: isHovered ? 1 : 0.3,
          opacity: isHovered ? 1 : 0.5 
        }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          width: '70%',
          background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%), hsl(35 100% 50%), transparent)',
          boxShadow: '0 0 25px rgba(232, 164, 0, 0.5)',
          transformOrigin: 'center',
        }}
      />
    </div>
  );
});

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [roleIndex, setRoleIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const opacity = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [1, 1]) : useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  const gridScale = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [1, 1]) : useTransform(scrollYProgress, [0, 0.4], [1, 1.15]);
  const gridOpacity = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [0, 0]) : useTransform(scrollYProgress, [0, 0.3, 0.6], [0.06, 0.06, 0]);
  const particleDrift = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [0, 0]) : useTransform(scrollYProgress, [0, 1], [0, -80]);
  const orb1Y = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [0, 0]) : useTransform(scrollYProgress, [0, 1], [0, -180]);
  const orb2Y = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [0, 0]) : useTransform(scrollYProgress, [0, 1], [0, -80]);
  const contentScale = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [1, 1]) : useTransform(scrollYProgress, [0, 0.2], [1, 0.92]);
  const cornerRotate = shouldReduceMotion ? useTransform(scrollYProgress, [0, 1], [0, 0]) : useTransform(scrollYProgress, [0, 0.3], [0, -8]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setRoleIndex(i => (i + 1) % ROLES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-char',
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.04, ease: 'power3.out', delay: 0.3 }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [shouldReduceMotion]);

  // Particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + (i * 11) % 85,
    size: 3 + (i % 3) * 2,
    delay: i * 0.5,
  }));

  return (
    <section id="home" ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" aria-labelledby="hero-heading">
      <h2 id="hero-heading" className="sr-only">VFX Artist Portfolio — Hai Luong</h2>

      {/* Parallax background orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-40"
        style={{
          y: orb1Y,
          background: 'radial-gradient(circle, rgba(232,164,0,0.25) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-30"
        style={{
          y: orb2Y,
          background: 'radial-gradient(circle, rgba(232,164,0,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Parallax grid pattern */}
      <motion.div className="absolute inset-0" style={{ opacity: gridOpacity }}>
        <motion.div
          className="absolute inset-0"
          style={{
            scale: gridScale,
            backgroundImage: 'linear-gradient(rgba(232, 164, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 164, 0, 0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </motion.div>

      {/* Scroll-reactive floating particles */}
      <motion.div className="absolute inset-0" style={shouldReduceMotion ? {} : { y: particleDrift }}>
        {particles.map((p) => (
          <FloatingParticle key={p.id} x={p.x} size={p.size} delay={p.delay} reducedMotion={shouldReduceMotion} />
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
        style={{ opacity, scale: contentScale }}
      >
        {/* Role badge */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div 
            className="relative px-6 py-2.5 rounded-full"
            style={{
              background: 'rgba(232, 164, 0, 0.08)',
              border: '1px solid rgba(232, 164, 0, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              }}
              animate={shouldReduceMotion ? {} : { x: ['-100%', '200%'] }}
              transition={shouldReduceMotion ? {} : { duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span 
              key={roleIndex}
              className="relative text-xs uppercase tracking-[0.4em] font-semibold text-amber-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {ROLES[roleIndex]}
            </motion.span>
          </div>
        </motion.div>

        {/* Name title */}
        <InteractiveNameTitle />

        <p className="text-base md:text-lg mb-4 max-w-xl text-gray-400">
          VFX Compositor based in <span className="text-amber-400 font-medium">Ho Chi Minh City</span>
        </p>

        <motion.p 
          className="text-sm max-w-md mb-12 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          5 years of experience in compositing, matchmoving, and visual effects.
        </motion.p>

        <MagneticButton
          onClick={() => {
            const el = document.getElementById('showreel');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
              el.setAttribute('tabindex', '-1');
              el.focus({ preventScroll: true });
            }
          }}
          aria-label="Watch showreel"
          className="group relative flex items-center gap-4 px-10 py-4 rounded-full overflow-hidden"
          strength={0.4}
        >
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'rgba(18, 18, 18, 0.9)',
              border: '2px solid rgba(232, 164, 0, 0.4)',
              backdropFilter: 'blur(20px)',
            }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            }}
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.4 }}
          />
          
          <div 
            className="relative w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              boxShadow: '0 0 30px rgba(232, 164, 0, 0.5)',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ 
                scale: [1, 1.4, 1], 
                opacity: [0.5, 0, 0.5] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              }}
            />
            <Play size={20} className="text-gray-900 ml-0.5" fill="currentColor" />
          </div>
          
          <span className="relative text-white font-medium tracking-wide">
            Watch Showreel
          </span>
        </MagneticButton>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">
          Scroll
        </span>
        <div 
          className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{
            background: 'rgba(18, 18, 18, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.div 
            className="w-1 h-2.5 rounded-full"
            style={{
              background: 'linear-gradient(180deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              boxShadow: '0 0 10px rgba(232, 164, 0, 0.6)',
            }}
            animate={{ y: [0, 14, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Corner frames */}
      {[
        'top-8 left-8 border-l-2 border-t-2',
        'top-8 right-8 border-r-2 border-t-2',
        'bottom-8 left-8 border-l-2 border-b-2',
        'bottom-8 right-8 border-r-2 border-b-2',
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-16 h-16 border-amber-400/30`}
          style={{ rotateZ: cornerRotate }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        />
      ))}
    </section>
  );
}

export default Hero;
