import { motion } from 'framer-motion';
import { memo } from 'react';
import { ArrowRight, Play } from 'lucide-react';

const EnhancedCTA = memo(function EnhancedCTA() {
  return (
    <motion.div
      className="hero-cta flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-14 md:mb-22"
      initial={{ opacity: 0 }}
    >
      {/* Watch Showreel Button */}
      <motion.a
        href="#showreel"
        className="group relative flex items-center gap-2.5 xs:gap-3 px-6 xs:px-8 py-3.5 xs:py-4 rounded-full overflow-hidden transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0, opacity: 0.5 }}
          whileHover={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          }}
        />

        <span className="relative text-[13px] xs:text-sm font-semibold text-gray-900 tracking-wide">
          Watch Showreel
        </span>
        <Play size={16} className="relative text-gray-900 ml-1" fill="currentColor" />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 55%), hsl(35 100% 60%))',
            filter: 'blur(20px)',
          }}
        />
      </motion.a>

      {/* View Projects Button */}
      <motion.a
        href="#projects"
        className="group relative flex items-center gap-2.5 xs:gap-3 px-6 xs:px-8 py-3.5 xs:py-4 rounded-full overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        whileHover={{ scale: 1.05, borderColor: 'rgba(232, 164, 0, 0.5)' }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="relative text-[13px] xs:text-sm font-medium text-white/80 tracking-wide">
          View Projects
        </span>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight
            size={16}
            className="text-white/50 group-hover:text-amber-400 transition-colors duration-300"
          />
        </motion.div>
      </motion.a>
    </motion.div>
  );
});

export default EnhancedCTA;
