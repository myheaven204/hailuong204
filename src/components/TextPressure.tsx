import { useEffect, useRef, useState } from 'react';

interface TextPressureProps {
  text?: string;
  textColor?: string;
  className?: string;
}

const TextPressure = ({
  text = 'Text',
  textColor = '#FFFFFF',
  className = ''
}: TextPressureProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let rafId: number;

    const animate = () => {
      smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.1;
      smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.1;

      spansRef.current.forEach((span) => {
        if (!span) return;

        const rect = span.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        const dx = smoothMouse.current.x - charX;
        const dy = smoothMouse.current.y - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = 250;
        const influence = Math.max(0, 1 - distance / maxDistance);

        const weight = 400 + influence * 500;
        const letterSpacing = influence * 3;
        const scale = 1 + influence * 0.15;

        span.style.fontWeight = Math.round(weight).toString();
        span.style.letterSpacing = `${letterSpacing}px`;
        span.style.transform = `scale(${scale})`;
        span.style.transition = 'all 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center ${className}`}
    >
      <div
        style={{
          fontFamily: "'Inter Variable', sans-serif",
          fontSize: 'clamp(48px, 12vw, 180px)',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: textColor,
          lineHeight: 1,
          display: 'flex',
          gap: '0.1em',
          whiteSpace: 'nowrap',
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => (spansRef.current[i] = el)}
            style={{
              display: 'inline-block',
              willChange: 'transform, font-weight, letter-spacing',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TextPressure;
