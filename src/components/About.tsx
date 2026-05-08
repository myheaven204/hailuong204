import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Film, Users, Clock } from 'lucide-react';

// Stats that communicate expertise
const EXPERTISE = [
  {
    icon: <Film size={18} aria-hidden="true" />,
    value: '50+',
    label: 'Projects',
    sublabel: 'Film & TVC',
    color: '#fbbf24'
  },
  {
    icon: <Users size={18} aria-hidden="true" />,
    value: '20+',
    label: 'Clients',
    sublabel: 'Global brands',
    color: '#f59e0b'
  },
  {
    icon: <Clock size={18} aria-hidden="true" />,
    value: '5+',
    label: 'Years',
    sublabel: 'Industry exp.',
    color: '#d97706'
  },
];

// Skills grid
const SKILLS = [
  'Compositing', 'Matchmoving', 'Rotoscoping', 'Cleanup'
];

export default function About() {
  const containerRef = useRef<HTMLElement>(null);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const contentY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-32 overflow-hidden" aria-labelledby="about-heading">
      <h2 id="about-heading" className="sr-only">About Hai Luong — VFX Compositor</h2>
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Ambient glow */}
            <div
              className="absolute -top-8 -left-8 w-48 h-48 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, rgba(232,164,0,0.15) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />

            {/* Image container */}
            <motion.div
              className="relative aspect-[4/5] rounded-2xl overflow-hidden"
              style={{ y: imageY }}
            >
              <motion.img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                alt="Hai Luong - VFX Compositor & Motion Designer"
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,14,0.9) 0%, transparent 55%)',
                }}
              />

              {/* Glass frame */}
              <div
                aria-hidden="true"
                className="absolute inset-3 rounded-xl pointer-events-none"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              />
            </motion.div>

            {/* Availability badge */}
            <motion.div
              className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 p-4 rounded-xl"
              initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                background: 'rgba(14, 14, 18, 0.85)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(40px) saturate(150%)',
                WebkitBackdropFilter: 'blur(40px) saturate(150%)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.5)' }}
                />
                <span className="text-sm text-white/80 font-medium">Available</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Section label */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-10 h-px"
                style={{ background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))' }}
              />
              <span className="text-[11px] uppercase tracking-[0.4em] font-medium text-amber-400/80">
                About
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              VFX Compositor crafting<br />
              <span className="text-amber-400">cinematic visuals</span>
            </h2>

            {/* Value proposition */}
            <div className="space-y-5 mb-8">
              <p className="text-base text-white/60 leading-relaxed">
                I'm a VFX Compositor with <span className="text-white/80">5+ years of experience</span> in compositing, matchmoving, and visual effects for film, television commercials, and music videos.
              </p>
              <p className="text-sm text-white/45 leading-relaxed">
                Based in Ho Chi Minh City, I work with studios worldwide to deliver photorealistic visual effects that enhance storytelling and exceed client expectations.
              </p>
            </div>

            {/* Skills */}
            <div className="mb-10">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Core Expertise</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: 'rgba(232,164,0,0.06)',
                      border: '1px solid rgba(232,164,0,0.15)',
                      color: 'rgba(232,164,0,0.8)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {EXPERTISE.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="relative text-center p-4 rounded-xl cursor-default"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  style={{
                    background: hoveredStat === i
                      ? 'rgba(18, 18, 22, 0.8)'
                      : 'rgba(12, 12, 15, 0.5)',
                    border: `1px solid ${hoveredStat === i ? stat.color + '25' : 'rgba(255,255,255,0.06)'}`,
                    backdropFilter: 'blur(40px)',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  }}
                >
                  <div
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-2"
                    style={{
                      background: hoveredStat === i ? `${stat.color}12` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${hoveredStat === i ? stat.color + '25' : 'rgba(255,255,255,0.05)'}`,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <span style={{ color: hoveredStat === i ? stat.color : 'rgba(255,255,255,0.3)' }}>
                      {stat.icon}
                    </span>
                  </div>

                  <div
                    className="text-xl font-bold mb-0.5"
                    style={{
                      color: hoveredStat === i ? stat.color : 'rgba(255,255,255,0.9)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {stat.value}
                  </div>

                  <div className="text-[10px] text-white/40 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
