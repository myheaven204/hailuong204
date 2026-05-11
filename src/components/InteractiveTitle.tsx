import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE TITLE — 6 Mouse-Driven Title Effects
// ═══════════════════════════════════════════════════════════════════════════════
// Effects: wave | scramble | magnetic | reveal | neon | hologram
// Usage: <InteractiveTitle effect="wave">YOUR TEXT</InteractiveTitle>
// ═══════════════════════════════════════════════════════════════════════════════

type EffectType = 'wave' | 'scramble' | 'magnetic' | 'reveal' | 'neon' | 'hologram';

interface InteractiveTitleProps {
  children: React.ReactNode;
  effect?: EffectType;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'div';
  staggerDelay?: number;
  scrambleSpeed?: number;
  enableHover?: boolean;
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#________▓░█';

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

// ─── WAVE EFFECT ─────────────────────────────────────────────────────────────
function WaveTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const chars = String(children).split('');
  return (
    <span className={`inline-flex ${className || ''}`}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block origin-center"
          whileHover={{
            y: [0, -12, -6, -14, -8, -16, -4, 0],
            color: ['#f5f5f5', '#e8a400', '#ff6b6b', '#00d4ff', '#e8a400', '#f5f5f5'],
            textShadow: [
              '0 0 0px rgba(232,164,0,0)',
              '0 0 20px rgba(232,164,0,0.8)',
              '0 0 40px rgba(0,212,255,0.6)',
              '0 0 60px rgba(232,164,0,0.8)',
              '0 0 20px rgba(232,164,0,0.8)',
              '0 0 40px rgba(232,164,0,0.6)',
              '0 0 0px rgba(232,164,0,0)',
            ],
            transition: {
              duration: 0.8,
              delay: i * 0.04,
              ease: 'easeInOut',
            },
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── SCRAMBLE EFFECT ──────────────────────────────────────────────────────────
function ScrambleTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const [displayText, setDisplayText] = useState(String(children));
  const [isHovered, setIsHovered] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = String(children);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);
    let iterations = 0;
    const maxIterations = text.length * 2;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iterations / 2) return text[i];
            return randomChar();
          })
          .join('')
      );
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);
  }, [text, isScrambling]);

  useEffect(() => {
    if (isHovered && !isScrambling) {
      scramble();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isHovered, scramble, isScrambling]);

  return (
    <motion.span
      className={`inline-block cursor-pointer ${className || ''}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {displayText.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── MAGNETIC EFFECT ──────────────────────────────────────────────────────────
function MagneticTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    const rotateX = -deltaY * 8;
    const rotateY = deltaX * 8;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)');
  };

  const chars = String(children).split('');

  return (
    <span
      ref={ref}
      className={`inline-flex ${className || ''}`}
      style={{ transform, transition: transform ? 'transform 0.15s ease-out' : 'none' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block origin-center"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          whileHover={{
            scale: 1.3,
            color: '#e8a400',
            textShadow: '0 0 30px rgba(232,164,0,0.8)',
            transition: { duration: 0.2, delay: i * 0.03 },
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── REVEAL EFFECT ────────────────────────────────────────────────────────────
function RevealTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const chars = String(children).split('');

  return (
    <span
      className={`inline-flex relative ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block relative overflow-hidden"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          whileHover={{
            y: [0, -20, 0],
            transition: { duration: 0.6, delay: i * 0.05 },
          }}
        >
          <motion.span
            className="inline-block"
            animate={{
              y: isHovered ? [-20, 0] : [0, -20, 0],
              opacity: isHovered ? [0, 1] : [1, 0, 1],
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.06,
              times: isHovered ? [0, 1] : [0, 0.4, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
          {/* Shimmer overlay */}
          <motion.span
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(232,164,0,0.4) 50%, transparent 100%)',
              transform: 'translateX(-100%)',
            }}
            animate={isHovered ? { transform: ['translateX(-100%)', 'translateX(100%)'] } : {}}
            transition={{ duration: 0.6, delay: i * 0.05 }}
          />
        </motion.span>
      ))}
    </span>
  );
}

// ─── NEON EFFECT ─────────────────────────────────────────────────────────────
function NeonTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const chars = String(children).split('');

  return (
    <span
      className={`inline-flex ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
          animate={
            isHovered
              ? {
                  textShadow: [
                    '0 0 5px rgba(232,164,0,0.5)',
                    '0 0 20px rgba(232,164,0,0.8)',
                    '0 0 40px rgba(232,164,0,1)',
                    '0 0 60px rgba(232,164,0,0.8)',
                    '0 0 20px rgba(232,164,0,0.5)',
                  ],
                  color: ['#f5f5f5', '#e8a400', '#fff8e1', '#e8a400', '#f5f5f5'],
                  scale: [1, 1.2, 1.3, 1.2, 1],
                  y: [0, -8, -4, -12, 0],
                }
              : {
                  textShadow: [
                    '0 0 5px rgba(232,164,0,0.2)',
                    '0 0 10px rgba(232,164,0,0.1)',
                    '0 0 5px rgba(232,164,0,0.2)',
                  ],
                }
          }
          transition={{
            duration: isHovered ? 0.8 : 3,
            delay: isHovered ? i * 0.05 : i * 0.2,
            ease: 'easeInOut',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── HOLOGRAM EFFECT ──────────────────────────────────────────────────────────
function HologramTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const chars = String(children).split('');

  const rainbowColors = [
    '#e8a400', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3',
    '#54a0ff', '#5f27cd', '#c8d6e5', '#00d2d3', '#1dd1a1',
    '#e8a400',
  ];

  return (
    <span
      className={`inline-flex ${className || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block relative"
          style={{ display: 'inline-block', whiteSpace: 'pre', position: 'relative' }}
          animate={
            isHovered
              ? {
                  y: [0, -10, -5, -15, 0],
                  scale: [1, 1.15, 1.2, 1.15, 1],
                }
              : {}
          }
          transition={{
            duration: isHovered ? 0.8 : 4,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        >
          {/* Rainbow color layer */}
          <motion.span
            className="inline-block"
            animate={
              isHovered
                ? {
                    color: Array.from({ length: 10 }, () =>
                      rainbowColors[Math.floor(Math.random() * rainbowColors.length)]
                    ),
                  }
                : {}
            }
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>

          {/* Glitch shadow layers */}
          {isHovered && (
            <>
              <motion.span
                className="absolute inset-0 text-cyan-400/60 pointer-events-none"
                style={{ clipPath: 'inset(0 0 50% 0)', left: 2 }}
                animate={{ x: [-2, 3, -1, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.15, repeat: Infinity }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
              <motion.span
                className="absolute inset-0 text-red-500/60 pointer-events-none"
                style={{ clipPath: 'inset(50% 0 0 0)', left: -2 }}
                animate={{ x: [2, -3, 1, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            </>
          )}
        </motion.span>
      ))}
    </span>
  );
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function InteractiveTitle({
  children,
  effect = 'wave',
  className,
  as: Tag = 'span',
}: InteractiveTitleProps) {
  const props = { className };

  switch (effect) {
    case 'wave':
      return (
        <Tag {...props}>
          <WaveTitle className={className}>{children}</WaveTitle>
        </Tag>
      );
    case 'scramble':
      return (
        <Tag {...props}>
          <ScrambleTitle className={className}>{children}</ScrambleTitle>
        </Tag>
      );
    case 'magnetic':
      return (
        <Tag {...props}>
          <MagneticTitle className={className}>{children}</MagneticTitle>
        </Tag>
      );
    case 'reveal':
      return (
        <Tag {...props}>
          <RevealTitle className={className}>{children}</RevealTitle>
        </Tag>
      );
    case 'neon':
      return (
        <Tag {...props}>
          <NeonTitle className={className}>{children}</NeonTitle>
        </Tag>
      );
    case 'hologram':
      return (
        <Tag {...props}>
          <HologramTitle className={className}>{children}</HologramTitle>
        </Tag>
      );
    default:
      return <Tag {...props}>{children}</Tag>;
  }
}
