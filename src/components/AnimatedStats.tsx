import { motion, useInView } from 'framer-motion';
import { memo, useRef, useEffect, useState } from 'react';

interface Stat {
  value: number;
  label: string;
  accent: boolean;
}

const AnimatedStats = memo(function AnimatedStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [counts, setCounts] = useState([0, 0, 0]);

  const stats: Stat[] = [
    { value: 50, label: 'Projects', accent: true },
    { value: 5, label: 'Years Exp', accent: true },
    { value: 20, label: 'Clients', accent: false },
  ];

  useEffect(() => {
    if (!isInView) return;

    const intervals = stats.map((stat, i) => {
      let current = 0;
      const increment = Math.ceil(stat.value / 30);
      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(intervals[i]);
        }
        setCounts(prev => {
          const newCounts = [...prev];
          newCounts[i] = current;
          return newCounts;
        });
      }, 30);
    });

    return () => intervals.forEach(clearInterval);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      className="hero-stats flex items-center justify-center gap-6 md:gap-12 lg:gap-16"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: i * 0.1, duration: 0.6 }}
        >
          <div className="flex items-baseline gap-0.5 md:gap-1">
            <span
              className="text-2xl sm:text-3xl md:text-4xl font-bold"
              style={{
                background: stat.accent
                  ? 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))'
                  : 'linear-gradient(135deg, hsl(0 0% 90%), hsl(0 0% 70%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {counts[i]}
            </span>
            <span className="text-base md:text-lg text-amber-500/60">+</span>
          </div>
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-gray-500 mt-1.5 md:mt-1">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
});

export default AnimatedStats;
