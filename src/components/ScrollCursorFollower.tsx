import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from '../hooks/useLenis';

interface SectionStep {
  id: string;
  label: string;
}

const STEPS: SectionStep[] = [
  { id: 'home', label: 'Intro' },
  { id: 'showreel', label: 'Showreel' },
  { id: 'work', label: 'Work' },
  { id: 'breakdown', label: 'Breakdown' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const ScrollCursorFollower = memo(function ScrollCursorFollower({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed pointer-events-none z-[2]"
        style={{
          width: 400,
          height: 400,
          left: mousePos.x - 200,
          top: mousePos.y - 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,164,0,0.04) 0%, rgba(232,164,0,0.01) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: 1 + scrollProgress * 0.3,
          opacity: 0.6 + scrollProgress * 0.4,
        }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="fixed pointer-events-none z-[2]"
        style={{
          width: 120,
          height: 120,
          left: mousePos.x - 60,
          top: mousePos.y - 60,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,164,0,0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
    </>
  );
});

export default function ScrollCursorFollowerComponent() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useLenis((scroll) => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress(docH > 0 ? scroll / docH : 0);
    const stepIndex = Math.min(
      Math.floor((scroll / (docH || 1)) * STEPS.length),
      STEPS.length - 1
    );
    setActiveStep(Math.max(0, stepIndex));
  });

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <ScrollCursorFollower scrollProgress={scrollProgress} />

      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-2 pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : 20 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {STEPS.map((step, i) => {
          const isActive = i === activeStep;
          const isPast = i < activeStep;

          return (
            <div key={step.id} className="flex items-center gap-3">
              <motion.span
                className="text-[10px] uppercase tracking-widest font-medium whitespace-nowrap"
                style={{
                  color: isActive
                    ? 'hsl(43 100% 55%)'
                    : isPast
                    ? 'rgba(255,255,255,0.3)'
                    : 'rgba(255,255,255,0.12)',
                  transition: 'color 0.4s ease',
                }}
              >
                {step.label}
              </motion.span>

              <div className="relative flex flex-col items-center">
                <div
                  className="w-[1px] h-3"
                  style={{
                    background: isPast
                      ? 'hsl(43 100% 46%)'
                      : 'rgba(255,255,255,0.08)',
                  }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full relative z-10"
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    background: isActive
                      ? 'hsl(43 100% 55%)'
                      : isPast
                      ? 'hsl(43 100% 40%)'
                      : 'rgba(255,255,255,0.2)',
                    boxShadow: isActive
                      ? '0 0 12px rgba(232,164,0,0.8), 0 0 24px rgba(232,164,0,0.3)'
                      : 'none',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'hsl(43 100% 55%)' }}
                      animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <div
                  className="w-[1px] h-3"
                  style={{
                    background:
                      i < STEPS.length - 1
                        ? isPast
                          ? 'hsl(43 100% 46%)'
                          : 'rgba(255,255,255,0.08)'
                        : 'transparent',
                  }}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        className="fixed bottom-6 right-6 z-40 pointer-events-none hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex flex-col items-end">
          <span
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{ color: 'rgba(255,255,255,0.15)' }}
          >
            Scroll
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="text-3xl font-bold tabular-nums"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {Math.round(scrollProgress * 100)}
            </span>
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.2)' }}>
              %
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}
