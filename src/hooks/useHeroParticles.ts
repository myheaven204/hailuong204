import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

const PARTICLE_CONFIG = {
  MAX_PARTICLES: 500,
  PARTICLES_PER_MOVE: 2,
  SPAWN_RADIUS: 20,
  VELOCITY_RANGE: 2,
  GRAVITY: 0.1,
  DECAY_RATE: 0.02,
  ALPHA_MULTIPLIER: 0.6,
  SIZE_RANGE: { min: 1, max: 3 },
  HUE_RANGE: { min: 35, max: 55 },
};

export function useHeroParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (particlesRef.current.length >= PARTICLE_CONFIG.MAX_PARTICLES) {
        particlesRef.current.splice(0, PARTICLE_CONFIG.PARTICLES_PER_MOVE);
      }

      for (let i = 0; i < PARTICLE_CONFIG.PARTICLES_PER_MOVE; i++) {
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * PARTICLE_CONFIG.SPAWN_RADIUS,
          y: e.clientY + (Math.random() - 0.5) * PARTICLE_CONFIG.SPAWN_RADIUS,
          vx: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE,
          vy: (Math.random() - 0.5) * PARTICLE_CONFIG.VELOCITY_RANGE - 1,
          life: 1,
          maxLife: 1,
          size: Math.random() * (PARTICLE_CONFIG.SIZE_RANGE.max - PARTICLE_CONFIG.SIZE_RANGE.min) + PARTICLE_CONFIG.SIZE_RANGE.min,
          hue: PARTICLE_CONFIG.HUE_RANGE.min + Math.random() * (PARTICLE_CONFIG.HUE_RANGE.max - PARTICLE_CONFIG.HUE_RANGE.min),
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter(p => {
        p.life -= PARTICLE_CONFIG.DECAY_RATE;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += PARTICLE_CONFIG.GRAVITY;

        if (p.life > 0) {
          const alpha = p.life * PARTICLE_CONFIG.ALPHA_MULTIPLIER;
          ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef, shouldReduceMotion]);
}
