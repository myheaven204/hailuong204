import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '../hooks/useLenis';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
  drift: number;
}

const ScrollParticle = memo(function ScrollParticle({
  p,
  index,
  scrollProgress,
}: {
  p: Particle;
  index: number;
  scrollProgress: number;
}) {
  const delay = p.delay + index * 0.15;
  const fadeIn = Math.min(1, scrollProgress * 4 - delay * 0.3);
  const fadeOut = Math.max(0, 1 - (scrollProgress - 0.85) * 6);
  const opacity = fadeIn * fadeOut;

  if (opacity <= 0) return null;

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        opacity,
        background: 'radial-gradient(circle, rgba(232,164,0,0.95) 0%, rgba(245,158,11,0.6) 40%, transparent 100%)',
        boxShadow: '0 0 6px rgba(232,164,0,0.7), 0 0 16px rgba(232,164,0,0.35)',
      }}
      animate={{
        y: [0, -60 * p.speed, -30 * p.speed, -80 * p.speed, 0],
        x: [0, p.drift * 15, p.drift * -10, p.drift * 20, 0],
        scale: [0.5, 1.3, 0.8, 1.1, 0.5],
      }}
      transition={{
        duration: 5 + index * 0.4,
        delay: p.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
});

const ScrollTrailDot = memo(function ScrollTrailDot({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: number;
}) {
  const pct = index / total;
  const isActive = Math.abs(scrollProgress - pct) < 0.04;
  const dist = Math.abs(scrollProgress - pct);
  const size = Math.max(1.5, 6 - dist * 60);
  const opacity = Math.max(0, 1 - dist * 12);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${20 + (index / total) * 60}%`,
        width: size,
        height: size,
        opacity,
        background: isActive ? 'hsl(43 100% 60%)' : 'hsl(43 100% 46%)',
        boxShadow: isActive
          ? '0 0 10px rgba(232,164,0,0.9), 0 0 20px rgba(232,164,0,0.4)'
          : '0 0 4px rgba(232,164,0,0.4)',
        top: '50%',
        marginTop: -size / 2,
      }}
    />
  );
});

export default function ScrollParticles() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useLenis((scroll) => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docH > 0 ? scroll / docH : 0);
  });

  const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 3 + (i * 4.7) % 94,
    y: 5 + (i * 7.3) % 90,
    size: 2 + (i % 5) * 1.2,
    delay: i * 0.25,
    speed: 0.4 + (i % 6) * 0.12,
    drift: ((i % 3) - 1) * (0.5 + (i % 4) * 0.2),
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[3] overflow-hidden">
      {particles.map((p, i) => (
        <ScrollParticle key={p.id} p={p} index={i} scrollProgress={scrollProgress} />
      ))}

      {[0.2, 0.5, 0.8].map((rowPct, ri) => (
        <div
          key={ri}
          className="absolute left-0 right-0"
          style={{ top: `${rowPct * 100}%`, height: '1px', transform: 'translateY(-50%)' }}
        >
          {Array.from({ length: 20 + ri * 4 }, (_, i) => (
            <ScrollTrailDot key={i} index={i} total={20 + ri * 4} scrollProgress={scrollProgress} />
          ))}
        </div>
      ))}

      <div className="absolute right-6 top-0 bottom-0 w-[2px] overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(232,164,0,0.06)', borderRadius: '1px' }}
        />
        <motion.div
          className="absolute left-0 w-full rounded-full"
          style={{
            top: `${scrollProgress * 100}%`,
            height: '60px',
            background: 'linear-gradient(to bottom, hsl(43 100% 46%), hsl(35 100% 55%))',
            translateY: '-50%',
          }}
          animate={{
            boxShadow: [
              '0 0 12px rgba(232,164,0,0.5)',
              '0 0 24px rgba(232,164,0,0.8)',
              '0 0 12px rgba(232,164,0,0.5)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full pointer-events-none"
          style={{
            top: `calc(${scrollProgress * 100}% - 16px)`,
            background: 'radial-gradient(circle, rgba(232,164,0,0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>
    </div>
  );
}
