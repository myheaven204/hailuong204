import { useState } from 'react';
import { motion } from 'framer-motion';

const SOFTWARE = [
  { name: 'After Effects', category: 'Motion Graphics & VFX', level: 90, color: '#fbbf24' },
  { name: 'PFtrack', category: 'Matchmove & Tracking', level: 80, color: '#f59e0b' },
  { name: 'Premiere Pro', category: 'Video Editing', level: 70, color: '#d97706' },
  { name: 'Photoshop', category: 'Image Editing', level: 60, color: '#b45309' },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  return (
    <section id="skills" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="w-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">
              Expertise
            </span>
            <motion.div
              className="w-12 h-px"
              style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), transparent)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
            Skills & Software
          </h2>
          <motion.p
            className="text-sm text-white/35 mt-4 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Industry-standard tools and techniques honed through years of experience.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOFTWARE.map((software, i) => (
            <motion.div
              key={software.name}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onMouseEnter={() => setHoveredSkill(i)}
              onMouseLeave={() => setHoveredSkill(null)}
              whileHover={{ y: -5 }}
              whileFocus={{ y: -5 }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setHoveredSkill(hoveredSkill === i ? null : i); }}}
              tabIndex={0}
              role="button"
              aria-label={`${software.name} - ${software.category} - ${software.level}% proficiency`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-2xl"
            >
              <motion.div
                className="relative p-6 rounded-3xl overflow-hidden cursor-pointer h-full"
                style={{
                  background: hoveredSkill === i
                    ? 'rgba(20, 20, 24, 0.72)'
                    : 'rgba(12, 12, 15, 0.6)',
                  border: `1px solid ${hoveredSkill === i ? software.color + '30' : 'rgba(255, 255, 255, 0.07)'}`,
                  backdropFilter: 'blur(60px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                  transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  boxShadow: hoveredSkill === i
                    ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${software.color}12, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                {/* Top glass rim */}
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-3xl"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${software.color}40, transparent)`,
                    opacity: hoveredSkill === i ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                />

                {/* Inner glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${software.color}10 0%, transparent 65%)` }}
                  animate={{ opacity: hoveredSkill === i ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Light sweep */}
                <motion.div
                  className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent)' }}
                  animate={{ x: hoveredSkill === i ? ['-100%', '200%'] : '-100%' }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />

                <motion.div
                  className="relative flex items-start justify-between mb-4"
                  aria-hidden="true"
                >
                  <div>
                    <motion.h3
                      className="text-lg font-bold"
                      style={{
                        color: hoveredSkill === i ? software.color : 'rgba(255,255,255,0.88)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {software.name}
                    </motion.h3>
                    <span className="text-[10px] text-amber-400/60 uppercase tracking-wider mt-1 block">
                      {software.category}
                    </span>
                  </div>
                  <motion.div
                    animate={{
                      scale: hoveredSkill === i ? 1.15 : 1,
                      rotate: hoveredSkill === i ? [0, -8, 8, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span
                      className="text-2xl font-bold"
                      style={{
                        color: hoveredSkill === i ? software.color : 'rgba(255,255,255,0.3)',
                        transition: 'color 0.5s ease',
                      }}
                    >
                      {software.level}%
                    </span>
                  </motion.div>
                </motion.div>

                {/* Progress bar */}
                <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${software.color}80, ${software.color})`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${software.level}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.4,
                      delay: i * 0.15,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  />
                  {/* Shimmer on progress bar */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, delay: i * 0.2 }}
                  />
                </div>

                {/* Bottom glass rim */}
                <div
                  className="absolute inset-x-4 bottom-0 h-px rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${software.color}20, transparent)`,
                    opacity: hoveredSkill === i ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
