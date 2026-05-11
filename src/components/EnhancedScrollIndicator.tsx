import { motion } from 'framer-motion';
import { memo } from 'react';

const EnhancedScrollIndicator = memo(function EnhancedScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-medium">
          Scroll
        </span>

        {/* Animated arrow pattern */}
        <div className="flex flex-col items-center gap-1">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-[1px] h-3 bg-gradient-to-b from-amber-500/50 to-transparent"
              animate={{ y: [0, 8, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Particle trail effect */}
        <motion.div
          className="absolute top-16 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500/60 rounded-full"
          animate={{
            y: [0, 20, 40],
            opacity: [1, 0.6, 0],
            scale: [1, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        />
      </div>
    </motion.div>
  );
});

export default EnhancedScrollIndicator;
