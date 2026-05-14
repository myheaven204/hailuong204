import { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';

interface VolumetricLightBeam {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function VolumetricText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const beamsRef = useRef<VolumetricLightBeam[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const rafRef = useRef<number>(0);
  const beamIdRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: 35 + Math.random() * 20,
    }));
  }, []);

  const createBeam = useCallback((x: number, y: number) => {
    const beam: VolumetricLightBeam = {
      id: beamIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2 - 1,
      size: Math.random() * 80 + 40,
      opacity: Math.random() * 0.3 + 0.2,
      life: 0,
      maxLife: Math.random() * 60 + 40,
    };
    beamsRef.current.push(beam);
    
    if (beamsRef.current.length > 30) {
      beamsRef.current.shift();
    }
  }, []);

  const drawVolumetricLight = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { x, y } = mouseRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    const ambientGradient = ctx.createRadialGradient(x, y, 0, x, y, 300);
    ambientGradient.addColorStop(0, 'rgba(255, 200, 100, 0.15)');
    ambientGradient.addColorStop(0.3, 'rgba(232, 164, 0, 0.08)');
    ambientGradient.addColorStop(0.6, 'rgba(232, 164, 0, 0.03)');
    ambientGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = ambientGradient;
    ctx.fillRect(0, 0, width, height);

    beamsRef.current.forEach((beam, index) => {
      beam.life++;
      
      beam.x += beam.vx + (Math.random() - 0.5) * 0.5;
      beam.y += beam.vy + (Math.random() - 0.5) * 0.5;
      
      const lifeRatio = beam.life / beam.maxLife;
      const currentOpacity = beam.opacity * (1 - Math.pow(lifeRatio, 2));
      
      if (lifeRatio >= 1) {
        beamsRef.current.splice(index, 1);
        return;
      }

      const beamGradient = ctx.createRadialGradient(
        beam.x, beam.y, 0,
        beam.x, beam.y, beam.size
      );
      beamGradient.addColorStop(0, `rgba(255, 220, 150, ${currentOpacity})`);
      beamGradient.addColorStop(0.2, `rgba(255, 200, 100, ${currentOpacity * 0.6})`);
      beamGradient.addColorStop(0.5, `rgba(232, 164, 0, ${currentOpacity * 0.3})`);
      beamGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = beamGradient;
      ctx.beginPath();
      ctx.arc(beam.x, beam.y, beam.size, 0, Math.PI * 2);
      ctx.fill();
    });

    if (x > 0 && y > 0) {
      const numRays = 8;
      for (let i = 0; i < numRays; i++) {
        const angle = (i / numRays) * Math.PI * 2 + Date.now() * 0.0001;
        const rayLength = 150 + Math.random() * 100;
        const rayWidth = 20 + Math.random() * 30;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        const rayGradient = ctx.createLinearGradient(0, 0, rayLength, 0);
        rayGradient.addColorStop(0, 'rgba(255, 220, 150, 0.15)');
        rayGradient.addColorStop(0.5, 'rgba(232, 164, 0, 0.05)');
        rayGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = rayGradient;
        ctx.beginPath();
        ctx.moveTo(0, -rayWidth / 2);
        ctx.lineTo(rayLength, 0);
        ctx.lineTo(0, rayWidth / 2);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
      }
    }
  }, []);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const { x: mouseX, y: mouseY } = mouseRef.current;
    
    particlesRef.current.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 0) {
        const force = (150 - dist) / 150 * 0.02;
        particle.vx += (dx / dist) * force;
        particle.vy += (dy / dist) * force;
      }
      
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 2
      );
      gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 70%, ${particle.opacity})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 100%, 50%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const drawReflections = useCallback((ctx: CanvasRenderingContext2D) => {
    const { x, y } = mouseRef.current;
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    for (let i = 0; i < 5; i++) {
      const streakY = y + 50 + i * 30;
      const streakGradient = ctx.createLinearGradient(x - 100, streakY, x + 100, streakY);
      streakGradient.addColorStop(0, 'transparent');
      streakGradient.addColorStop(0.5, `rgba(255, 220, 150, ${0.1 - i * 0.015})`);
      streakGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = streakGradient;
      ctx.fillRect(x - 100, streakY, 200, 8);
    }
    
    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const { width, height } = canvas;
    
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1;
    
    drawVolumetricLight(ctx, width, height);
    drawParticles(ctx, width, height);
    drawReflections(ctx);
    
    rafRef.current = requestAnimationFrame(animate);
  }, [drawVolumetricLight, drawParticles, drawReflections]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    mouseRef.current.targetX = e.clientX - rect.left;
    mouseRef.current.targetY = e.clientY - rect.top;
    
    if (Math.random() > 0.7) {
      createBeam(mouseRef.current.targetX, mouseRef.current.targetY);
    }
  }, [createBeam]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.targetX = -100;
    mouseRef.current.targetY = -100;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glowCanvas = glowCanvasRef.current;
    if (!canvas || !glowCanvas) return;
    
    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      glowCanvas.width = rect.width;
      glowCanvas.height = rect.height;
      
      initParticles(rect.width, rect.height);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    animate();
    
    const ctx = gsap.context(() => {
      gsap.fromTo('.volumetric-text-line',
        { 
          opacity: 0, 
          y: 100, 
          filter: 'blur(20px)' 
        },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)',
          duration: 1.5, 
          stagger: 0.15, 
          ease: 'power3.out',
          delay: 0.3 
        }
      );
      
      gsap.fromTo('.volumetric-glow',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', delay: 0.5 }
      );
    }, containerRef);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      ctx.revert();
    };
  }, [animate, initParticles]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden cursor-default select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ background: '#050505' }}
    >
      {/* SVG Filter for Grid Effect */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none">
        <defs>
          <filter id="grid-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
          <pattern id="mesh-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="rgba(232, 164, 0, 0.3)" 
              strokeWidth="0.5"
            />
          </pattern>
          <pattern id="mesh-pattern-large" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
            <path 
              d="M 120 0 L 0 0 0 120" 
              fill="none" 
              stroke="rgba(232, 164, 0, 0.5)" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        
        {/* Large mesh grid */}
        <rect width="100%" height="100%" fill="url(#mesh-pattern-large)" />
        
        {/* Fine mesh grid */}
        <rect width="100%" height="100%" fill="url(#mesh-pattern)" filter="url(#grid-noise)" />
        
        {/* Concentric circles */}
        <g opacity="0.15">
          {[100, 200, 300, 400, 500].map((r, i) => (
            <circle 
              key={i}
              cx="50%" 
              cy="45%" 
              r={r}
              fill="none" 
              stroke="rgba(232, 164, 0, 0.3)" 
              strokeWidth="0.5"
            />
          ))}
        </g>
      </svg>

      {/* Canvas for volumetric light */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Canvas for glow effect */}
      <canvas
        ref={glowCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'color-dodge', filter: 'blur(30px)' }}
      />

      {/* Center glow overlay */}
      <div 
        className="volumetric-glow absolute pointer-events-none"
        style={{
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(232, 164, 0, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main Text Container */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Line 1: HAI LUONG */}
        <h1 className="volumetric-text-line text-6xl md:text-8xl lg:text-[8rem] xl:text-[10rem] font-black tracking-wider relative"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #d4d4d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(232, 164, 0, 0.3))',
          }}
        >
          <span className="relative inline-block" style={{ transformStyle: 'preserve-3d' }}>
            HAI LUONG
          </span>
          
          {/* Reflection below text */}
          <div 
            className="absolute -bottom-1 left-0 right-0 h-20 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(232, 164, 0, 0.15) 0%, transparent 100%)',
              filter: 'blur(20px)',
              transform: 'scaleY(-1)',
              opacity: 0.5,
            }}
          />
        </h1>

        {/* Line 2: VFX */}
        <h1 className="volumetric-text-line text-5xl md:text-6xl lg:text-[6rem] xl:text-[7rem] font-black tracking-[0.4em] relative mt-4 md:mt-2"
          style={{
            fontFamily: "'Unbounded', sans-serif",
            background: 'linear-gradient(180deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 40px rgba(232, 164, 0, 0.5))',
          }}
        >
          <span className="relative inline-block" style={{ transformStyle: 'preserve-3d' }}>
            VFX
          </span>
          
          {/* Glow behind VFX */}
          <div 
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.2) 0%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />
        </h1>

        {/* Animated underline */}
        <div className="volumetric-text-line mt-8 relative">
          <div 
            className="h-[2px] rounded-full"
            style={{
              width: '400px',
              background: 'linear-gradient(90deg, transparent, rgba(232, 164, 0, 0.8), rgba(251, 191, 36, 0.9), rgba(232, 164, 0, 0.8), transparent)',
              boxShadow: '0 0 20px rgba(232, 164, 0, 0.5), 0 0 40px rgba(232, 164, 0, 0.3)',
            }}
          />
        </div>
      </div>

      {/* Light streaks overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: `
            linear-gradient(135deg, transparent 40%, rgba(255, 220, 150, 0.1) 45%, transparent 50%),
            linear-gradient(225deg, transparent 40%, rgba(255, 220, 150, 0.1) 45%, transparent 50%)
          `,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Corner decorations */}
      {[
        { top: '2rem', left: '2rem', borderWidth: '2px 0 0 2px', borderStyle: 'solid', borderColor: 'rgba(232, 164, 0, 0.3)' },
        { top: '2rem', right: '2rem', borderWidth: '2px 2px 0 0', borderStyle: 'solid', borderColor: 'rgba(232, 164, 0, 0.3)' },
        { bottom: '2rem', left: '2rem', borderWidth: '0 0 2px 2px', borderStyle: 'solid', borderColor: 'rgba(232, 164, 0, 0.3)' },
        { bottom: '2rem', right: '2rem', borderWidth: '0 2px 2px 0', borderStyle: 'solid', borderColor: 'rgba(232, 164, 0, 0.3)' },
      ].map((style, i) => (
        <div
          key={i}
          className="absolute w-16 h-16 opacity-0 animate-fade-in"
          style={{
            ...style,
            animationDelay: `${1 + i * 0.2}s`,
            animation: 'fadeIn 1s ease-out forwards',
          }}
        />
      ))}

      {/* Scanlines overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(232, 164, 0, 0.1) 2px, rgba(232, 164, 0, 0.1) 4px)',
        }}
      />

      {/* CSS for fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
