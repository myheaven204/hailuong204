import { useEffect, useRef } from 'react';

interface Wave {
  y: number;
  amplitude: number;
  baseAmplitude: number;
  frequency: number;
  baseFrequency: number;
  speed: number;
  phase: number;
  thickness: number;
  hue: number;
  baseHue: number;
  opacity: number;
  targetHue: number;
  hueLerpSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  twinkleOffset: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  life: number;
  maxLife: number;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  hue: number;
  opacity: number;
  life: number;
  maxLife: number;
  speedX: number;
  speedY: number;
}

export default function AuroraBorealisBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wavesRef = useRef<Wave[]>([]);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const lastShootingStarRef = useRef<number>(0);
  const lastNebulaRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initWaves();
      initStars();
    };

    const initWaves = () => {
      const colors = [
        { hue: 35, opacity: 0.15 },
        { hue: 55, opacity: 0.12 },
        { hue: 200, opacity: 0.10 },
        { hue: 42, opacity: 0.12 },
        { hue: 280, opacity: 0.08 },
        { hue: 15, opacity: 0.10 },
        { hue: 170, opacity: 0.09 },
        { hue: 38, opacity: 0.14 },
      ];
      wavesRef.current = colors.map((c, i) => {
        const amplitude = 30 + Math.random() * 50;
        const frequency = 0.002 + Math.random() * 0.003;
        return {
          y: canvas.height * (0.05 + i * 0.03),
          amplitude,
          baseAmplitude: amplitude,
          frequency,
          baseFrequency: frequency,
          speed: 0.0003 + Math.random() * 0.0004,
          phase: Math.random() * Math.PI * 2,
          thickness: 80 + Math.random() * 100,
          hue: c.hue,
          baseHue: c.hue,
          opacity: c.opacity,
          targetHue: c.hue,
          hueLerpSpeed: 0.00005 + Math.random() * 0.0001,
        };
      });
    };

    const initStars = () => {
      const stars: Star[] = [];
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.7,
          size: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.6 + 0.1,
          twinkleSpeed: 0.001 + Math.random() * 0.003,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleOffset: Math.random() * 1000,
        });
      }
      starsRef.current = stars;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const drawWave = (
      ctx: CanvasRenderingContext2D,
      wave: Wave,
      time: number,
      w: number,
      h: number,
      mouseX: number
    ) => {
      const {
        y, amplitude, frequency, phase, speed, thickness, hue, opacity
      } = wave;

      ctx.save();

      const gradient = ctx.createLinearGradient(0, y - thickness, 0, y + thickness * 3);
      gradient.addColorStop(0, `hsla(${hue}, 60%, 50%, 0)`);
      gradient.addColorStop(0.2, `hsla(${hue}, 65%, 48%, ${opacity})`);
      gradient.addColorStop(0.45, `hsla(${hue + 20}, 70%, 55%, ${opacity * 1.2})`);
      gradient.addColorStop(0.65, `hsla(${hue + 40}, 60%, 45%, ${opacity * 0.6})`);
      gradient.addColorStop(0.85, `hsla(${hue + 40}, 50%, 25%, ${opacity * 0.15})`);
      gradient.addColorStop(1, `hsla(${hue}, 40%, 5%, 0.05)`);

      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x <= w; x += 2) {
        const t = time * speed;
        const waveY =
          y +
          Math.sin(x * frequency + t + phase) * amplitude +
          Math.sin(x * frequency * 1.7 + t * 0.8 + phase * 1.3) * amplitude * 0.4 +
          Math.sin(x * frequency * 0.5 + t * 1.2 + phase * 0.7) * amplitude * 0.3;

        let finalY = waveY;

        if (mouseRef.current.active) {
          const dx = x - mouseX;
          const dist = Math.abs(dx);
          if (dist < 300) {
            const influence = (1 - dist / 300) * 60;
            const push = Math.sin((dx / 300) * Math.PI) * influence;
            finalY = waveY - push;
          }
        }

        ctx.lineTo(x, finalY);
      }

      ctx.lineTo(w, h);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      const shimmerGradient = ctx.createLinearGradient(0, y - 10, 0, y + 15);
      shimmerGradient.addColorStop(0, `hsla(${hue}, 100%, 95%, 0)`);
      shimmerGradient.addColorStop(0.5, `hsla(${hue + 15}, 100%, 98%, ${opacity * 0.6})`);
      shimmerGradient.addColorStop(1, `hsla(${hue + 30}, 80%, 50%, 0)`);
      ctx.fillStyle = shimmerGradient;
      ctx.fill();

      ctx.restore();
    };

    const drawStars = (ctx: CanvasRenderingContext2D, time: number) => {
      starsRef.current.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase + star.twinkleOffset) * 0.3 + 0.5;
        const alpha = star.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 180, ${alpha})`;
        ctx.fill();

        if (star.size > 0.8) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 3
          );
          glow.addColorStop(0, `rgba(255, 230, 180, ${alpha * 0.3})`);
          glow.addColorStop(1, 'rgba(255, 230, 180, 0)');
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });
    };

    const drawShootingStars = (ctx: CanvasRenderingContext2D) => {
      shootingStarsRef.current.forEach(star => {
        const progress = star.life / star.maxLife;
        const alpha = star.opacity * Math.min(progress * 3, 1) * Math.min(progress, 1);

        const tailX = star.x - Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.6, `rgba(200, 230, 255, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.speed * 0.5;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.speed * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 200, 180, ${alpha})`;
        ctx.fill();
      });
    };

    const drawNebulae = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      nebulaeRef.current.forEach(nebula => {
        const lifeRatio = nebula.life / nebula.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = Math.max(0, Math.min((1 - lifeRatio) * 4, 1));
        const alpha = nebula.opacity * fadeIn * fadeOut;

        const gradient = ctx.createRadialGradient(
          nebula.x, nebula.y, 0,
          nebula.x, nebula.y, nebula.radius
        );
        gradient.addColorStop(0, `hsla(${nebula.hue}, 60%, 50%, ${alpha * 0.3})`);
        gradient.addColorStop(0.4, `hsla(${nebula.hue + 20}, 50%, 40%, ${alpha * 0.15})`);
        gradient.addColorStop(0.7, `hsla(${nebula.hue + 40}, 40%, 30%, ${alpha * 0.05})`);
        gradient.addColorStop(1, `hsla(${nebula.hue}, 30%, 20%, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      });
    };

    const drawMouseGlow = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      if (!mouseRef.current.active) return;

      const { x, y } = mouseRef.current;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, 200);
      glow.addColorStop(0, 'rgba(232, 164, 0, 0.08)');
      glow.addColorStop(0.5, 'rgba(200, 140, 50, 0.04)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    };

    const animate = () => {
      const dt = 16;
      timeRef.current += dt;
      const t = timeRef.current;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      drawNebulae(ctx, w, h);
      drawStars(ctx, t);
      drawMouseGlow(ctx, w, h);

      wavesRef.current.forEach(wave => {
        const hueDiff = wave.targetHue - wave.hue;
        if (Math.abs(hueDiff) > 0.1) {
          wave.hue += hueDiff * wave.hueLerpSpeed * dt;
        } else {
          wave.targetHue = wave.baseHue + (Math.random() - 0.5) * 60;
        }

        wave.amplitude = wave.baseAmplitude + Math.sin(t * 0.0003 + wave.phase) * 5;

        drawWave(ctx, wave, t, w, h, mouseRef.current.x);
      });

      if (t - lastShootingStarRef.current > 3000 + Math.random() * 8000) {
        shootingStarsRef.current.push({
          x: Math.random() * w * 0.7 + w * 0.15,
          y: Math.random() * h * 0.3,
          length: 80 + Math.random() * 120,
          speed: 8 + Math.random() * 12,
          angle: Math.PI * 0.15 + Math.random() * Math.PI * 0.25,
          opacity: 0.6 + Math.random() * 0.4,
          life: 1,
          maxLife: 1,
        });
        lastShootingStarRef.current = t;
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(ss => {
        ss.life -= 0.015;
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        return ss.life > 0;
      });
      drawShootingStars(ctx);

      if (t - lastNebulaRef.current > 8000 + Math.random() * 15000) {
        nebulaeRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.5,
          radius: 150 + Math.random() * 250,
          hue: 20 + Math.random() * 280,
          opacity: 0.08 + Math.random() * 0.12,
          life: 1,
          maxLife: 1,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.15,
        });
        lastNebulaRef.current = t;
      }

      nebulaeRef.current = nebulaeRef.current.filter(nb => {
        nb.life -= 0.003;
        nb.x += nb.speedX;
        nb.y += nb.speedY;
        return nb.life > 0;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[-15]"
    />
  );
}
