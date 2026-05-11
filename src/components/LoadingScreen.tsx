import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STAGES = [
  { label: 'CREATE', color: '#e8a400' },
  { label: 'SIMULATE', color: '#e8a400' },
  { label: 'COMPOSITE', color: '#e8a400' },
  { label: 'RENDER', color: '#e8a400' },
];

const DURATION = 3000;

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [activeKeyframes, setActiveKeyframes] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const currentProgress = Math.min((elapsed / DURATION) * 100, 100);

      setProgress(currentProgress);
      setDisplayProgress(currentProgress);
      setActiveKeyframes(Math.floor((currentProgress / 100) * 8));

      if (currentProgress < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setDisplayProgress(100);
        setActiveKeyframes(8);
        setTimeout(() => onComplete(), 500);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const keyframePositions = [5, 15, 28, 42, 55, 68, 82, 95];
  const timelineHeight = 120;

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col bg-[#0a0a0a]"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      exit={{
        opacity: 0,
        transition: { duration: 0.6, ease: 'easeOut' }
      }}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(232, 164, 0, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(232, 164, 0, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Top bar - Timecode style */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-[#0d0d0d] border-b border-[#1a1a1a] flex items-center px-8">
        <div className="flex items-center gap-6">
          <span className="text-[#e8a400] text-xs font-mono tracking-wider">
            VFX PORTFOLIO
          </span>
          <span className="text-[#333] text-xs font-mono">
            |
          </span>
          <span className="text-[#555] text-xs font-mono">
            00:00:00:00
          </span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#e8a400] animate-pulse" />
          <span className="text-[#555] text-xs font-mono">LOADING</span>
        </div>
      </div>

      {/* Main content - Timeline centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-20">
        {/* Timeline container */}
        <div className="w-full max-w-5xl">
          {/* Timeline header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#555] text-xs font-mono tracking-widest">
              COMPOSITING TIMELINE
            </span>
            <span className="text-[#e8a400] text-xs font-mono tracking-widest">
              {STAGES.map((s, i) => (
                <span key={i}>
                  <span className={i < Math.floor(progress / 25) ? 'text-[#e8a400]' : 'text-[#333]'}>
                    {s.label}
                  </span>
                  {i < STAGES.length - 1 && ' / '}
                </span>
              ))}
            </span>
          </div>

          {/* Timeline track */}
          <div className="relative h-[120px] bg-[#0d0d0d] rounded border border-[#1a1a1a] overflow-hidden">
            {/* Track background with tick marks */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex items-center">
              {/* Main track line */}
              <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#222]" />

              {/* Progress fill */}
              <motion.div
                className="absolute left-0 top-1/2 h-[2px] bg-gradient-to-r from-[#e8a400] to-[#ffd700]"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />

              {/* Time markers */}
              {[0, 25, 50, 75, 100].map((mark) => (
                <div
                  key={mark}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${mark}%` }}
                >
                  <div className="w-[1px] h-3 bg-[#333]" />
                  <span className="text-[#444] text-[10px] font-mono mt-1">{mark}</span>
                </div>
              ))}
            </div>

            {/* Keyframes */}
            {keyframePositions.map((pos, index) => (
              <motion.div
                key={index}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${pos}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: activeKeyframes > index ? 1 : 0,
                  opacity: activeKeyframes > index ? 1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.05,
                }}
              >
                {/* Keyframe diamond */}
                <div
                  className="relative"
                  style={{
                    transform: `translateX(-50%) rotate(45deg)`,
                  }}
                >
                  <div
                    className="w-4 h-4 bg-[#e8a400] shadow-[0_0_10px_rgba(232,164,0,0.5)]"
                    style={{
                      boxShadow: activeKeyframes > index
                        ? '0 0 15px rgba(232, 164, 0, 0.8), 0 0 30px rgba(232, 164, 0, 0.4)'
                        : 'none',
                    }}
                  />
                </div>

                {/* Keyframe number */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 text-[10px] font-mono mt-2 whitespace-nowrap"
                  style={{
                    transform: 'translateX(-50%)',
                    color: activeKeyframes > index ? '#e8a400' : '#333',
                  }}
                >
                  KF{index + 1}
                </span>
              </motion.div>
            ))}

            {/* Active indicator - Playhead */}
            <motion.div
              className="absolute top-0 bottom-0 w-[2px] bg-[#fff] z-10"
              style={{ left: `${Math.max(progress, 2)}%` }}
              animate={{ left: `${progress}%` }}
              transition={{ ease: 'linear', type: 'tween' }}
            >
              {/* Playhead triangle */}
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '8px solid #fff',
                }}
              />
            </motion.div>
          </div>

          {/* Bottom info bar */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-6">
              <span className="text-[#444] text-xs font-mono">
                FPS: <span className="text-[#666]">24</span>
              </span>
              <span className="text-[#444] text-xs font-mono">
                RES: <span className="text-[#666]">1920x1080</span>
              </span>
              <span className="text-[#444] text-xs font-mono">
                FRAMES: <span className="text-[#666]">{Math.floor(progress * 2.4)}/240</span>
              </span>
            </div>
            <span className="text-[#444] text-xs font-mono">
              NODE GRAPH
            </span>
          </div>
        </div>

        {/* Big progress counter with subtle neon glow */}
        <div className="mt-16 flex items-baseline gap-2">
          <motion.span
            className="text-8xl md:text-9xl font-bold font-mono relative"
            style={{
              color: '#e8a400',
              textShadow: `
                0 0 8px rgba(232, 164, 0, 0.6),
                0 0 20px rgba(232, 164, 0, 0.3)
              `,
            }}
            animate={{
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {Math.floor(displayProgress)}
          </motion.span>
          <motion.span
            className="text-4xl font-mono"
            style={{
              color: '#b88800',
              textShadow: `0 0 5px rgba(232, 164, 0, 0.4)`,
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            %
          </motion.span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#0d0d0d] border-t border-[#1a1a1a] flex items-center px-8">
        <div className="flex items-center gap-4">
          {['◀◀', '▶', '▶▶', '⏹'].map((icon, i) => (
            <span key={i} className="text-[#444] text-xs cursor-pointer hover:text-[#e8a400] transition-colors">
              {icon}
            </span>
          ))}
        </div>

        {/* Mini waveform/progress visualization */}
        <div className="flex-1 mx-8 h-4 flex items-center gap-[2px]">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[2px] bg-[#333] rounded-full"
              animate={{
                height: activeKeyframes > i / 7.5 ? [4, 12 + Math.random() * 8, 4] : 4,
                backgroundColor: i / 60 * 100 < progress ? '#e8a400' : '#333',
              }}
              transition={{
                duration: 0.3,
                repeat: activeKeyframes > i / 7.5 ? Infinity : 0,
                delay: i * 0.02,
              }}
              style={{
                backgroundColor: i / 60 * 100 < progress ? '#e8a400' : '#333',
              }}
            />
          ))}
        </div>

        <span className="text-[#444] text-xs font-mono">
          v1.0.0
        </span>
      </div>

      {/* Corner decorations */}
      {[
        { pos: 'top-12 left-4', border: 'border-l border-t' },
        { pos: 'top-12 right-4', border: 'border-r border-t' },
        { pos: 'bottom-10 left-4', border: 'border-l border-b' },
        { pos: 'bottom-10 right-4', border: 'border-r border-b' },
      ].map((corner, i) => (
        <div
          key={i}
          className={`absolute ${corner.pos} w-8 h-8 ${corner.border} border-[#222]`}
        />
      ))}
    </motion.div>
  );
}
