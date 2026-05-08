import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Work', id: 'work' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

interface NavbarProps {
  activeSection: string;
}

export default function Navbar({ activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
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
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-5 px-3 md:px-4"
      aria-label="Main navigation"
    >
      <motion.div
        className="relative inline-flex items-center rounded-xl px-1.5 sm:px-2 py-1 sm:py-1.5 max-w-[calc(100vw-24px)]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: scrolled
            ? 'rgba(10, 10, 14, 0.85)'
            : 'rgba(8, 8, 12, 0.6)',
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
          border: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'}`,
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.4)'
            : '0 4px 16px rgba(0,0,0,0.2)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('home')}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform hover:scale-105 active:scale-95"
          aria-label="Back to top"
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            boxShadow: scrolled
              ? '0 0 16px rgba(232,164,0,0.3)'
              : '0 0 0px rgba(232,164,0,0)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <span className="font-bold text-[10px] text-gray-900 tracking-wider">HL</span>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/[0.06] mx-2" />

        {/* Nav links - shown on sm and larger screens */}
        <div className="hidden sm:flex items-center">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              aria-label={`Navigate to ${link.label}`}
              aria-current={activeSection === link.id ? 'page' : undefined}
              className="relative text-[13px] sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-colors"
              style={{
                color: activeSection === link.id
                  ? 'rgba(232,164,0,0.95)'
                  : 'rgba(255,255,255,0.4)',
                background: activeSection === link.id
                  ? 'rgba(232,164,0,0.08)'
                  : 'transparent',
                transition: 'all 0.3s ease',
              }}
            >
              <span className="relative z-10">{link.label}</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/[0.06] mx-2" />

        {/* Hire Me button */}
        <a
          href="mailto:hailuong.vfx@gmail.com"
          className="relative text-[13px] sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Hire me via email"
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            color: 'hsl(0 0% 5%)',
          }}
        >
          <span className="relative z-10">Hire Me</span>
        </a>

        {/* Scroll progress indicator */}
        <div className="hidden md:flex items-center gap-2 ml-3 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <span
            className="text-[10px] font-mono font-medium tabular-nums"
            style={{
              color: scrollPct > 0 ? 'hsl(43 100% 55%)' : 'rgba(255,255,255,0.2)',
              transition: 'color 0.3s ease',
            }}
          >
            {String(scrollPct).padStart(3, '\u2007')}
          </span>
          <div className="w-7 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${scrollPct}%`,
                background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))',
                transition: 'width 0.15s ease',
              }}
            />
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
