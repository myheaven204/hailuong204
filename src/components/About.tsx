import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Film, Users, Briefcase } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: <Film size={18} />, value: '50+', label: 'Projects', color: '#fbbf24' },
  { icon: <Users size={18} />, value: '20+', label: 'Clients', color: '#f59e0b' },
  { icon: <Briefcase size={18} />, value: '5', label: 'Years', color: '#d97706' },
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-32 overflow-hidden" aria-labelledby="about-heading">
      <h2 id="about-heading" className="sr-only">About Hai Luong</h2>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Ambient glow orbs */}
            <motion.div
              className="absolute -top-10 -left-10 w-48 h-48 rounded-full"
              animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 6, repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(232,164,0,0.18) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <motion.div
              className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full"
              animate={{ scale: [1.15, 1, 1.15], opacity: [0.18, 0.35, 0.18] }}
              transition={{ duration: 7, repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(232,164,0,0.12) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />

            {/* Image container */}
            <motion.div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden"
              style={{ y: imageY }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Hai Luong - VFX Compositor"
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,14,0.85) 0%, transparent 55%)',
                }}
              />

              {/* Glass frame */}
              <motion.div
                className="absolute inset-3 rounded-2xl pointer-events-none"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              />

              {/* Subtle scan line */}
              <motion.div
                className="absolute left-0 right-0 h-px"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(232,164,0,0.3), transparent)',
                  boxShadow: '0 0 16px rgba(232,164,0,0.25)',
                }}
              />

              {/* Top glass rim */}
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
              />
            </motion.div>

            {/* Availability badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 p-4 rounded-2xl"
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 22 }}
              whileHover={{ scale: 1.04, rotate: 2 }}
              style={{
                background: 'rgba(14, 14, 18, 0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }}
                />
                <span className="text-sm text-white/80 font-medium">Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="flex items-center gap-4 mb-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="w-12 h-px"
                style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
              <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">
                About Me
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Hai Luong <span className="text-amber-400">VFX</span>
            </h2>

            {[
              'A passionate VFX Compositor with <span class="text-amber-400/80">5 years of experience</span> in compositing, matchmoving, and visual effects.',
              'Based in Ho Chi Minh City, Vietnam. I specialize in compositing with After Effects, camera tracking with PFtrack, and video editing.',
              "I'm dedicated to delivering high-quality visual effects that seamlessly blend with live-action footage."
            ].map((text, i) => (
              <motion.p
                key={i}
                className={`text-white/40 leading-relaxed ${i === 0 ? 'text-base mb-6' : 'mb-5'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.7 }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {HIGHLIGHTS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative text-center p-4 rounded-2xl cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.12, duration: 0.7 }}
                  whileHover={{ y: -4 }}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  style={{
                    background: hoveredStat === i
                      ? 'rgba(20, 20, 24, 0.72)'
                      : 'rgba(12, 12, 15, 0.6)',
                    border: `1px solid ${hoveredStat === i ? stat.color + '30' : 'rgba(255,255,255,0.07)'}`,
                    backdropFilter: 'blur(60px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(60px) saturate(180%)',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    boxShadow: hoveredStat === i
                      ? `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${stat.color}10`
                      : '0 4px 16px rgba(0,0,0,0.25)',
                  }}
                >
                  {/* Top rim on hover */}
                  <div
                    className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)`,
                      opacity: hoveredStat === i ? 1 : 0,
                      transition: 'opacity 0.5s ease',
                    }}
                  />

                  {/* Inner glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}10 0%, transparent 65%)` }}
                    animate={{ opacity: hoveredStat === i ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />

                  <motion.div
                    className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                    style={{
                      background: hoveredStat === i ? `${stat.color}18` : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${hoveredStat === i ? stat.color + '35' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.4s ease',
                    }}
                    animate={{
                      rotate: hoveredStat === i ? [0, -10, 10, 0] : 0,
                      scale: hoveredStat === i ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <span style={{ color: hoveredStat === i ? stat.color : 'rgba(255,255,255,0.35)' }}>
                      {stat.icon}
                    </span>
                  </motion.div>

                  <motion.div
                    className="relative text-2xl font-bold"
                    style={{
                      color: hoveredStat === i ? stat.color : 'rgba(255,255,255,0.85)',
                      transition: 'color 0.4s ease',
                    }}
                    animate={{ scale: hoveredStat === i ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 280 }}
                  >
                    {stat.value}
                  </motion.div>

                  <div className="relative text-[10px] text-white/30 uppercase tracking-widest mt-1">
                    {stat.label}
                  </div>

                  {/* Bottom accent */}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-px rounded-full"
                    animate={{ scaleX: hoveredStat === i ? 1 : 0, opacity: hoveredStat === i ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
                      transformOrigin: 'center',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
