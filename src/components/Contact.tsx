import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, Linkedin, Instagram, Video, Palette, ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  { name: 'LinkedIn', icon: <Linkedin size={16} />, url: 'https://linkedin.com', color: '#0A66C2' },
  { name: 'ArtStation', icon: <Palette size={16} />, url: 'https://artstation.com', color: '#13AFF0' },
  { name: 'Instagram', icon: <Instagram size={16} />, url: 'https://instagram.com', color: '#E4405F' },
  { name: 'Vimeo', icon: <Video size={16} />, url: 'https://vimeo.com', color: '#1AB7EA' },
];

const MARQUEE_TEXT = 'AVAILABLE FOR FREELANCE ';

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!marqueeRef.current || shouldReduceMotion) return;
    const tween = gsap.to(marqueeRef.current, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
    return () => tween.kill();
  }, [shouldReduceMotion]);

  return (
    <footer id="contact" className="pt-20 md:pt-32 pb-8 overflow-hidden relative" aria-label="Contact section">
      <h2 id="contact-heading" className="sr-only">Get in Touch</h2>
      {/* Background radial gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(232,164,0,0.06) 0%, transparent 55%)',
            'radial-gradient(circle at 80% 50%, rgba(232,164,0,0.06) 0%, transparent 55%)',
            'radial-gradient(circle at 20% 50%, rgba(232,164,0,0.06) 0%, transparent 55%)',
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(232,164,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(232,164,0,0.6) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10">
        {/* Marquee */}
        <motion.div
          className="overflow-hidden mb-16 md:mb-24 py-4"
          style={{
            background: 'rgba(12, 12, 15, 0.5)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(60px) saturate(180%)',
            WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div ref={marqueeRef} className="flex whitespace-nowrap" whileHover={{ animationPlayState: 'paused' }}>
            {Array.from({ length: 20 }, (_, i) => (
              <motion.span
                key={i}
                className="text-4xl md:text-6xl lg:text-7xl font-bold px-4 text-amber-400/[0.08]"
                whileHover={{
                  color: 'rgba(232,164,0,0.45)',
                  transition: { duration: 0.2 },
                }}
              >
                {MARQUEE_TEXT}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center px-6 mb-16 md:mb-24"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              className="w-12 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, hsl(43 100% 46%))' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            />
            <span className="text-[11px] uppercase tracking-[0.4em] font-semibold text-amber-400/80">
              Get in Touch
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

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
            Let&apos;s Create
          </h2>

          <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              Something Epic
            </span>
          </h3>

          <motion.p
            className="max-w-md mx-auto mb-10 text-white/35"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            Have a project in mind? Looking for a VFX artist to bring your vision to life?
          </motion.p>

          {/* CTA Button */}
          <motion.a
            href="mailto:hailuong.vfx@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-3 text-base rounded-full px-10 py-4 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(14, 14, 18, 0.75)',
                border: '1px solid rgba(232,164,0,0.2)',
                backdropFilter: 'blur(60px) saturate(180%)',
                WebkitBackdropFilter: 'blur(60px) saturate(180%)',
              }}
            />

            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              }}
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            />

            <Mail
              size={18}
              className="relative z-10 text-amber-400 transition-colors"
            />
            <span className="relative z-10 text-white/80 transition-colors">hailuong.vfx@gmail.com</span>
            <ArrowUpRight
              size={14}
              className="relative z-10 opacity-0 group-hover:opacity-100 transition-all -ml-3 group-hover:ml-0 text-black"
            />
          </motion.a>
        </motion.div>

        {/* Footer */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-16">
          <motion.div
            className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="relative p-3 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, type: 'spring', stiffness: 280, damping: 22 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(12, 12, 15, 0.5)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    transition: 'all 0.5s cubic-bezier(0.25,0.1,0.25,1)',
                  }}
                >
                  <span className="relative z-10 text-white/35" style={{ color: 'inherit' }}>
                    {social.icon}
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <motion.div
              className="flex items-center gap-3 text-xs text-white/20"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span>&copy; 2026 Hai Luong</span>
              <motion.span
                className="w-1 h-1 rounded-full bg-amber-400/50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <span>VFX Compositor</span>
            </motion.div>

            {/* Available status */}
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                background: 'rgba(12, 12, 15, 0.5)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/60"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(52,211,153,0.4)' }} />
              </span>
              <span className="text-[11px] text-white/30">Available for projects</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Corner decorations */}
      {[
        'bottom-8 left-8 border-l border-b',
        'bottom-8 right-8 border-r border-b',
      ].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-14 h-14 border-white/10`}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
        />
      ))}
    </footer>
  );
}
