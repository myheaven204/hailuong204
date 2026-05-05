import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Work', id: 'work' },
  { label: 'Breakdown', id: 'breakdown' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
    // Move focus to the target so keyboard users know where they landed
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <motion.div
        className="relative inline-flex items-center rounded-2xl px-3 py-2"
        style={{
          background: scrolled
            ? 'rgba(14, 14, 18, 0.72)'
            : 'rgba(12, 12, 15, 0.5)',
          backdropFilter: 'blur(60px) saturate(180%)',
          WebkitBackdropFilter: 'blur(60px) saturate(180%)',
          border: `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: scrolled
            ? '0 12px 48px rgba(0,0,0,0.5), 0 0 40px rgba(232,164,0,0.05)'
            : '0 8px 32px rgba(0,0,0,0.25)',
          transition: 'all 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('home')}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            boxShadow: scrolled
              ? '0 0 20px rgba(232,164,0,0.4)'
              : '0 0 0px rgba(232,164,0,0)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          <span className="font-bold text-[11px] text-gray-900 tracking-wider">
            HL
          </span>
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-2" />

        {/* Nav links */}
        <div className="relative flex">
          {NAV_LINKS.map((link, i) => (
            <motion.button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              aria-label={`Navigate to ${link.label}`}
              aria-current={activeSection === link.id ? 'page' : undefined}
              className="relative text-sm rounded-xl px-4 py-2 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
            >
              {(activeSection === link.id || hoveredLink === link.id) && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: activeSection === link.id
                      ? 'rgba(232,164,0,0.12)'
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  layoutId="navIndicator"
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                />
              )}

              <span
                className={`relative z-10 transition-colors duration-400 ${
                  activeSection === link.id
                    ? 'text-amber-400/90'
                    : hoveredLink === link.id
                    ? 'text-white/85'
                    : 'text-white/35'
                }`}
              >
                {link.label}
              </span>

              {activeSection === link.id && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-1 h-1 rounded-full bg-amber-400"
                  layoutId="activeDot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ boxShadow: '0 0 8px rgba(232,164,0,0.6)' }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/[0.08] mx-2" />

        {/* Hire me button */}
        <motion.a
          href="mailto:hailuong.vfx@gmail.com"
          className="relative text-sm rounded-xl px-5 py-2 font-semibold overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="Hire Me via email"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            color: 'hsl(0 0% 5%)',
          }}
        >
          {/* Glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: [
                '0 0 0px rgba(232,164,0,0)',
                '0 0 20px rgba(232,164,0,0.5)',
                '0 0 0px rgba(232,164,0,0)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <span className="relative z-10 font-semibold">Hire Me</span>
        </motion.a>

        {/* Scroll % indicator */}
        <motion.div
          className="hidden md:flex items-center gap-2 ml-3 pl-3"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        >
          <motion.div
            className="text-[11px] font-mono font-bold tabular-nums"
            style={{
              color: scrollPct > 0 ? 'hsl(43 100% 55%)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.4s ease',
            }}
          >
            {String(scrollPct).padStart(3, '\u2007')}
          </motion.div>
          <div className="w-8 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${scrollPct}%`,
                background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                boxShadow: '0 0 8px rgba(232,164,0,0.4)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.nav>
  );
}
