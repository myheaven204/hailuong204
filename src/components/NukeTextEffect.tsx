import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type EffectMode = 'glitch' | 'scanline' | 'corruption' | 'hologram' | 'compositing';

interface GlitchState {
  active: boolean;
  intensity: number;
  offsetX: number;
  offsetY: number;
  rgbSplit: number;
}

function NukeTextEffect({ className = '' }: { className?: string }) {
  const [effectMode, setEffectMode] = useState<EffectMode>('glitch');
  const [isHovered, setIsHovered] = useState(false);
  const [glitch, setGlitch] = useState<GlitchState>({
    active: false,
    intensity: 0,
    offsetX: 0,
    offsetY: 0,
    rgbSplit: 0,
  });
  const [scanlineOffset, setScanlineOffset] = useState(0);
  const [corruptionChars, setCorruptionChars] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const LINE1 = 'HAI LUONG'.split('');
  const LINE2 = 'VFX'.split('');
  const CORRUPTION_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEF';

  const getCorruptionChar = () => CORRUPTION_CHARS[Math.floor(Math.random() * CORRUPTION_CHARS.length)];

  // Glitch effect trigger
  useEffect(() => {
    const triggerGlitch = () => {
      const intensity = 0.5 + Math.random() * 0.5;
      setGlitch({
        active: true,
        intensity,
        offsetX: (Math.random() - 0.5) * 20 * intensity,
        offsetY: (Math.random() - 0.5) * 8 * intensity,
        rgbSplit: 2 + Math.random() * 8 * intensity,
      });
      setTimeout(() => {
        setGlitch(prev => ({ ...prev, active: false, offsetX: 0, offsetY: 0, rgbSplit: 0 }));
      }, 80 + Math.random() * 120);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.6) triggerGlitch();
    }, 2000);

    if (isHovered) {
      const hoverGlitch = setInterval(() => {
        if (Math.random() > 0.3) triggerGlitch();
      }, 300);
      return () => clearInterval(hoverGlitch);
    }

    return () => clearInterval(interval);
  }, [isHovered]);

  // Scanline animation
  useEffect(() => {
    let frame: number;
    let startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      setScanlineOffset((elapsed * 0.05) % 100);
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Corruption effect
  useEffect(() => {
    if (effectMode !== 'corruption') return;

    const interval = setInterval(() => {
      const fullText = [...LINE1, ...LINE2];
      const newChars = fullText.map(() => Math.random() > 0.7 ? getCorruptionChar() : '');
      setCorruptionChars(newChars);
    }, 50);

    return () => clearInterval(interval);
  }, [effectMode]);

  const modes: { id: EffectMode; label: string; desc: string }[] = [
    { id: 'glitch', label: 'GLITCH', desc: 'Digital corruption' },
    { id: 'scanline', label: 'SCANLINE', desc: 'CRT composite' },
    { id: 'corruption', label: 'CORRUPT', desc: 'Data breakdown' },
    { id: 'hologram', label: 'HOLO', desc: 'Sci-fi projection' },
    { id: 'compositing', label: 'COMP', desc: 'Layer merge' },
  ];

  const renderText = (chars: string[]) => {
    return chars.map((char, i) => {
      return (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block relative"
          animate={
            effectMode === 'glitch' && glitch.active
              ? {
                  x: glitch.offsetX * (i % 2 === 0 ? 1 : -1),
                  y: glitch.offsetY,
                  skewX: glitch.intensity * 5 * (i % 2 === 0 ? 1 : -1),
                }
              : effectMode === 'hologram' && isHovered
              ? {
                  y: [0, -4, 2, 0][i % 4],
                }
              : {}
          }
          transition={
            effectMode === 'glitch'
              ? { duration: 0.05 }
              : { duration: 0.3, delay: i * 0.05 }
          }
          style={{ display: 'inline-block' }}
        >
          {/* RGB Split layers for glitch */}
          {effectMode === 'glitch' && glitch.active && (
            <>
              <motion.span
                className="absolute inset-0 text-white"
                style={{ left: glitch.rgbSplit, color: '#ff0000', clipPath: `inset(0 0 ${50 + i * 3}% 0)` }}
                aria-hidden="true"
              >
                {char}
              </motion.span>
              <motion.span
                className="absolute inset-0 text-white"
                style={{ left: -glitch.rgbSplit, color: '#00ffff', clipPath: `inset(${50 + i * 3}% 0 0 0)` }}
                aria-hidden="true"
              >
                {char}
              </motion.span>
            </>
          )}

          {/* Main character */}
          <span
            className="relative"
            style={{
              color: effectMode === 'scanline'
                ? `hsl(43, 100%, ${55 + Math.sin(i) * 10}%)`
                : effectMode === 'hologram'
                ? `hsl(${180 + i * 5}, 80%, 60%)`
                : '#ffffff',
            }}
          >
            {/* Scanline overlay */}
            {effectMode === 'scanline' && (
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, ${0.3 + Math.random() * 0.2}) 2px,
                    rgba(0, 0, 0, ${0.3 + Math.random() * 0.2}) 4px
                  )`,
                  backgroundPosition: `0 ${scanlineOffset}px`,
                  backgroundSize: '100% 4px',
                }}
              />
            )}

            {/* Hologram flicker */}
            {effectMode === 'hologram' && (
              <motion.span
                className="absolute inset-0"
                aria-hidden="true"
                animate={{ opacity: [0.2, 0, 0.1, 0] }}
                transition={{ duration: 0.15, repeat: Infinity }}
                style={{
                  background: 'rgba(0, 255, 255, 0.3)',
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {corruptionChars.length > 0 && corruptionChars[i]
              ? corruptionChars[i]
              : char === ' '
              ? '\u00A0'
              : char}
          </span>

          {/* Glow for hologram */}
          {effectMode === 'hologram' && (
            <span
              className="absolute inset-0 blur-md opacity-50"
              style={{ color: `hsl(${180 + i * 5}, 80%, 60%)` }}
              aria-hidden="true"
            >
              {corruptionChars.length > 0 && corruptionChars[i]
                ? corruptionChars[i]
                : char === ' '
                ? '\u00A0'
                : char}
            </span>
          )}
        </motion.span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mode selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {modes.map(mode => (
          <motion.button
            key={mode.id}
            onClick={() => setEffectMode(mode.id)}
            className="relative px-3 py-1.5 rounded text-[10px] font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer"
            style={{
              background: effectMode === mode.id ? 'rgba(232, 164, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${effectMode === mode.id ? 'rgba(232, 164, 0, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
              color: effectMode === mode.id ? '#f5a623' : 'rgba(255, 255, 255, 0.4)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{mode.label}</span>
            <span className="block text-[8px] font-normal tracking-normal opacity-50 mt-0.5">
              {mode.desc}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Main text container with effect overlay */}
      <div className="relative">
        {/* Compositing layer effect */}
        {effectMode === 'compositing' && (
          <>
            {/* Layer 1: Blur */}
            <div
              className="absolute inset-0 flex flex-col items-center blur-sm opacity-60"
              style={{ transform: 'translate(-4px, -4px)' }}
            >
              <div className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-wide">
                {LINE1.map((c, i) => (
                  <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </div>
              <div className="text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1] tracking-[0.35em]">
                {LINE2.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            </div>
            {/* Layer 2: Offset */}
            <div
              className="absolute inset-0 flex flex-col items-center opacity-40"
              style={{ transform: 'translate(6px, 6px)' }}
            >
              <div className="text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-wide" style={{ color: '#f5a623' }}>
                {LINE1.map((c, i) => (
                  <span key={i}>{c === ' ' ? '\u00A0' : c}</span>
                ))}
              </div>
              <div className="text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1] tracking-[0.35em]" style={{ color: '#f5a623' }}>
                {LINE2.map((c, i) => (
                  <span key={i}>{c}</span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Main text */}
        <div className="relative flex flex-col items-center">
          {/* Line 1 */}
          <h1
            className={`text-5xl md:text-7xl lg:text-[7rem] xl:text-[8rem] font-bold leading-[0.95] tracking-wide ${
              effectMode === 'glitch' && glitch.active ? 'text-white' : ''
            }`}
            style={{
              textShadow:
                effectMode === 'glitch'
                  ? glitch.active
                    ? `${glitch.rgbSplit}px 0 rgba(255,0,0,0.8), ${-glitch.rgbSplit}px 0 rgba(0,255,255,0.8), 0 0 30px rgba(232,164,0,0.5)`
                    : '0 0 40px rgba(232,164,0,0.3)'
                  : effectMode === 'hologram'
                  ? '0 0 30px rgba(0,255,255,0.5), 0 0 60px rgba(0,255,255,0.2)'
                  : '0 0 40px rgba(232,164,0,0.3)',
            }}
          >
            {renderText(LINE1)}
          </h1>

          {/* Line 2 */}
          <h1
            className={`text-4xl md:text-5xl lg:text-[4.5rem] xl:text-[5rem] font-bold leading-[1] tracking-[0.35em] ${
              effectMode === 'glitch' && glitch.active ? 'text-white' : ''
            }`}
            style={{
              color: effectMode === 'scanline' ? '#f5a623' : effectMode === 'hologram' ? '#00ffff' : '#f5a623',
              textShadow:
                effectMode === 'glitch'
                  ? glitch.active
                    ? `${glitch.rgbSplit}px 0 rgba(255,0,0,0.8), ${-glitch.rgbSplit}px 0 rgba(0,255,255,0.8), 0 0 40px rgba(232,164,0,0.8)`
                    : '0 0 50px rgba(232,164,0,0.5)'
                  : effectMode === 'hologram'
                  ? '0 0 40px rgba(0,255,255,0.6), 0 0 80px rgba(0,255,255,0.3)'
                  : '0 0 50px rgba(232,164,0,0.4)',
            }}
          >
            {renderText(LINE2)}
          </h1>
        </div>

        {/* Scanline overlay for scanline mode */}
        {effectMode === 'scanline' && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded"
            animate={{ backgroundPosition: ['0 0', '0 100%'] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.15) 2px,
                rgba(0, 0, 0, 0.15) 4px
              )`,
              backgroundSize: '100% 4px',
            }}
          />
        )}

        {/* Vignette for hologram */}
        {effectMode === 'hologram' && (
          <div
            className="absolute -inset-8 pointer-events-none rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,20,20,0.6) 100%)',
            }}
          />
        )}

        {/* Glitch horizontal lines */}
        {effectMode === 'glitch' && glitch.active && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-[2px] pointer-events-none"
                style={{
                  top: `${30 + i * 20 + Math.random() * 20}%`,
                  background: `rgba(255, 0, 0, ${0.3 + Math.random() * 0.4})`,
                  transform: `translateX(${(Math.random() - 0.5) * 30}%)`,
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.05 }}
              />
            ))}
          </>
        )}
      </div>

      {/* Effect description */}
      <motion.div
        className="mt-6 px-4 py-2 rounded text-center"
        style={{
          background: 'rgba(232, 164, 0, 0.05)',
          border: '1px solid rgba(232, 164, 0, 0.15)',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <p className="text-[10px] font-mono tracking-widest text-amber-400/60 uppercase">
          {effectMode === 'glitch' && 'DIGITAL CORRUPTION'}
          {effectMode === 'scanline' && 'COMPOSITE SIGNAL'}
          {effectMode === 'corruption' && 'DATA STREAM FAILURE'}
          {effectMode === 'hologram' && 'HOLOGRAPHIC PROJECTION'}
          {effectMode === 'compositing' && 'LAYER COMPOSITING'}
        </p>
      </motion.div>

      {/* Compositing layer indicators */}
      {effectMode === 'compositing' && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-1">
          {['rgba(255,255,255,0.3)', 'rgba(245,166,35,0.4)', 'rgba(255,255,255,1)'].map((c, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: c }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default NukeTextEffect;
