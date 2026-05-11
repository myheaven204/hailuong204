import { useEffect, useRef, useState, useCallback } from 'react';

interface TextPressureEffectProps {
  text: string;
  className?: string;
  textColor?: string;
  intensity?: number;
}

const TextPressureEffect = ({
  text,
  className = '',
  textColor = '#FFFFFF',
  intensity = 1
}: TextPressureEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const animate = () => {
      // Smooth mouse tracking
      smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.1;
      smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.1;

      charsRef.current.forEach((char) => {
        if (!char) return;

        const rect = char.getBoundingClientRect();
        const charX = rect.left + rect.width / 2;
        const charY = rect.top + rect.height / 2;

        // Distance from mouse to character
        const dx = smoothMouse.current.x - charX;
        const dy = smoothMouse.current.y - charY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Maximum influence distance
        const maxDistance = 300 * intensity;
        const influence = Math.max(0, 1 - distance / maxDistance);

        // Calculate font weight (100-900)
        const weight = 700 + influence * 200;

        // Calculate letter spacing
        const letterSpacing = influence * 2;

        // Calculate scale
        const scale = 1 + influence * 0.1;

        // Apply styles
        char.style.fontWeight = Math.round(weight).toString();
        char.style.letterSpacing = `${letterSpacing}px`;
        char.style.transform = `scale(${scale})`;
        char.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)';
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mounted, intensity]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        cursor: 'none',
      }}
    >
      <div
        className="inline-block"
        style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: 'inherit',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: textColor,
          lineHeight: 1,
        }}
      >
        {text.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => (charsRef.current[i] = el)}
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

export default TextPressureEffect;
