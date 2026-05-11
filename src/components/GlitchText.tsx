import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number;
  effect?: 'glitch' | 'wave' | 'bounce' | 'neon';
  revealDelay?: number;
  showScanline?: boolean;
  showChromaticAberration?: boolean;
}

const GLITCH_CHARS = '!<>-_\\/[]{}=+*^?#________▓░█▄▀■□';

export default function GlitchText({
  text,
  className = '',
  glitchInterval = 50,
  effect = 'glitch',
  revealDelay = 0,
  showScanline = false,
  showChromaticAberration = false,
}: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);
  const [randomGlitch, setRandomGlitch] = useState(false);
  const [revealedChars, setRevealedChars] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Character reveal animation
  useEffect(() => {
    if (revealDelay === 0) {
      setRevealedChars(text.length);
      return;
    }

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setRevealedChars(charIndex);
      if (charIndex >= text.length) clearInterval(interval);
    }, revealDelay);

    return () => clearInterval(interval);
  }, [text, revealDelay]);

  // Random glitch trigger every 3-7 seconds
  useEffect(() => {
    const triggerRandomGlitch = () => {
      const delay = 3000 + Math.random() * 4000;
      timeoutRef.current = setTimeout(() => {
        setRandomGlitch(true);
        setTimeout(() => setRandomGlitch(false), 600);
        triggerRandomGlitch();
      }, delay);
    };
    triggerRandomGlitch();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Glitch effect animation
  useEffect(() => {
    if (!isGlitching && !randomGlitch) {
      setDisplayText(text);
      return;
    }

    const intervalRef = { current: null as ReturnType<typeof setInterval> | null };
    let iteration = 0;
    const maxIterations = text.length * 3;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iteration / 3) return text[i];
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join('')
      );

      iteration++;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsGlitching(false);
        setRandomGlitch(false);
      }
    }, glitchInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, isGlitching, randomGlitch, glitchInterval]);

  // Effect-specific animations
  if (effect === 'wave') {
    const chars = text.split('');
    return (
      <motion.span
        className={`relative inline-block ${className}`}
        onHoverStart={() => setIsGlitching(true)}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            whileHover={{
              y: [0, -10, -5, -12, 0],
              color: ['#f5f5f5', '#e8a400', '#ff6b6b', '#00d4ff', '#f5f5f5'],
              textShadow: [
                '0 0 0px rgba(232,164,0,0)',
                '0 0 20px rgba(232,164,0,0.8)',
                '0 0 40px rgba(255,107,107,0.6)',
                '0 0 20px rgba(0,212,255,0.8)',
                '0 0 0px rgba(232,164,0,0)',
              ],
              transition: { duration: 0.7, delay: i * 0.05, ease: 'easeInOut' },
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (effect === 'bounce') {
    const chars = text.split('');
    return (
      <motion.span
        className={`relative inline-block ${className}`}
        onHoverStart={() => setIsGlitching(true)}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            animate={isGlitching ? {} : {
              y: [0, -8, -4, -12, 0],
              scale: [1, 1.2, 1.3, 1.2, 1],
            }}
            whileHover={{
              y: [0, -10, -5, -15, 0],
              scale: [1, 1.3, 1.4, 1.3, 1],
              color: '#e8a400',
              textShadow: [
                '0 0 0px rgba(232,164,0,0)',
                '0 0 20px rgba(232,164,0,0.8)',
                '0 0 40px rgba(232,164,0,1)',
                '0 0 20px rgba(232,164,0,0.8)',
                '0 0 0px rgba(232,164,0,0)',
              ],
            }}
            transition={{
              duration: 0.7,
              delay: i * 0.06,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (effect === 'neon') {
    const chars = text.split('');
    return (
      <motion.span
        className={`relative inline-block ${className}`}
        onHoverStart={() => setIsGlitching(true)}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
            animate={
              isGlitching
                ? {
                    textShadow: [
                      '0 0 5px rgba(232,164,0,0.5)',
                      '0 0 30px rgba(232,164,0,1)',
                      '0 0 60px rgba(232,164,0,0.8)',
                      '0 0 30px rgba(232,164,0,1)',
                      '0 0 5px rgba(232,164,0,0.5)',
                    ],
                    color: ['#f5f5f5', '#fff8e1', '#ffffff', '#fff8e1', '#f5f5f5'],
                    scale: [1, 1.2, 1.3, 1.2, 1],
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
              duration: isGlitching ? 0.8 : 3,
              delay: isGlitching ? i * 0.05 : i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  // Default: Enhanced Glitch effect
  return (
    <motion.span
      className={`relative inline-block cursor-pointer ${className}`}
      onHoverStart={() => setIsGlitching(true)}
      onHoverEnd={() => setIsGlitching(false)}
    >
      <span className="relative z-10">{displayText}</span>

      {/* Cyan glitch layer */}
      <AnimatePresence>
        {(isGlitching || randomGlitch) && (
          <motion.span
            className="absolute inset-0 text-cyan-400/70 pointer-events-none"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [-3, 4, -2, 3, 0],
              opacity: [0, 0.8, 0.6, 0.4, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, repeat: Infinity }}
            style={{ clipPath: 'inset(0 0 50% 0)' }}
          >
            {displayText}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Red glitch layer */}
      <AnimatePresence>
        {(isGlitching || randomGlitch) && (
          <motion.span
            className="absolute inset-0 text-red-500/70 pointer-events-none"
            initial={{ x: 0, opacity: 0 }}
            animate={{
              x: [3, -4, 2, -3, 0],
              opacity: [0, 0.8, 0.6, 0.4, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
            style={{ clipPath: 'inset(50% 0 0 0)' }}
          >
            {displayText}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Yellow glitch layer */}
      <AnimatePresence>
        {(isGlitching || randomGlitch) && (
          <motion.span
            className="absolute inset-0 text-yellow-400/50 pointer-events-none"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [-2, 2, -1, 0],
              opacity: [0, 0.6, 0.3, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12, repeat: Infinity, delay: 0.08 }}
          >
            {displayText}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
