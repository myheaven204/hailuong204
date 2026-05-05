import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_024928_1efd0b0d-6c02-45a8-8847-1030900c4f63.mp4';

interface LoadingScreenProps {
  onComplete: () => void;
}

const WORDS = ['Create', 'Simulate', 'Composite', 'Render'];
const DURATION = 2700;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / DURATION, 1);
      const currentCount = Math.floor(progress * 100);
      setCount(currentCount);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(100);
        setTimeout(() => onComplete(), 400);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(100);
      return;
    }
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % WORDS.length);
    }, 700);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.log('Autoplay blocked, waiting for user interaction');
      }
    };

    playVideo();

    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      exit={{
        clipPath: 'circle(0% at 50% 50%)',
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Cinematic vignette */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none" />

      {/* Animated grid background */}
      {!shouldReduceMotion && (
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        animate={{
          backgroundPosition: ['0px 0px', '60px 60px'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'linear-gradient(rgba(232, 164, 0, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232, 164, 0, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      )}

      {/* Scanning line effect */}
      {!shouldReduceMotion && (
      <motion.div
        className="absolute left-0 right-0 h-px bg-accent/50"
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 20px rgba(232, 164, 0, 0.5)' }}
      />
      )}

      {/* Top-left label */}
      <motion.div
        className="absolute top-8 left-8 text-xs text-accent uppercase tracking-[0.4em] font-medium"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          VFX Portfolio
        </motion.span>
      </motion.div>

      {/* Center rotating words with 3D effect */}
      <div className="flex-1 flex items-center justify-center" style={{ perspective: '1000px' }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-5xl md:text-7xl lg:text-8xl font-display text-accent/80 select-none tracking-wider"
            initial={{
              rotateX: 90,
              y: 50,
              opacity: 0,
              filter: 'blur(10px)'
            }}
            animate={{
              rotateX: 0,
              y: 0,
              opacity: 1,
              filter: 'blur(0px)'
            }}
            exit={{
              rotateX: -90,
              y: -50,
              opacity: 0,
              filter: 'blur(10px)'
            }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Animated particles around counter */}
      <div className="absolute bottom-12 right-8">
        {/* Orbiting dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * (Math.PI * 2 / 3)) * 80, 0],
              y: [0, Math.sin(i * (Math.PI * 2 / 3)) * 80, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Counter with glitch effect */}
        <motion.span
          className="relative text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums"
          animate={count > 90 ? {
            x: [0, -2, 2, 0],
            textShadow: [
              '0 0 0 transparent',
              '-2px 0 #e8a400, 2px 0 #00d4ff',
              '2px 0 #e8a400, -2px 0 #00d4ff',
              '0 0 0 transparent',
            ],
          } : {}}
          transition={{ duration: 0.1, repeat: count > 90 ? Infinity : 0 }}
        >
          {String(count).padStart(3, '0')}
        </motion.span>
      </div>

      {/* Bottom progress bar with glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/30">
        <motion.div
          className="h-full bg-accent origin-left"
          style={{
            scaleX: count / 100,
          }}
        />
        {/* Animated glow point at the end of progress */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-accent"
          style={{
            left: `${count}%`,
            boxShadow: '0 0 20px rgba(232, 164, 0, 0.8), 0 0 40px rgba(232, 164, 0, 0.4)',
          }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>

      {/* Film frame corners with stagger animation */}
      {[
        { pos: 'top-8 left-8', border: 'border-l-2 border-t-2' },
        { pos: 'top-8 right-8', border: 'border-r-2 border-t-2' },
        { pos: 'bottom-8 left-8', border: 'border-l-2 border-b-2' },
        { pos: 'bottom-8 right-8', border: 'border-r-2 border-b-2' },
      ].map((corner, i) => (
        <motion.div
          key={i}
          className={`absolute w-16 h-16 ${corner.pos} ${corner.border} border-accent/30`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4, ease: 'backOut' }}
        />
      ))}
    </motion.div>
  );
}
