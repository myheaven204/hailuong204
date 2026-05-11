import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springs, easings, timing } from '../hooks/useAnimationSystem';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 md:pt-5 px-3 md:px-4"
      aria-label="Main navigation"
    >
      <motion.div
        className="relative inline-flex items-center rounded-xl px-1.5 sm:px-2 py-1 sm:py-1.5 max-w-[calc(100vw-24px)]"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: easings.easeOut,
          delay: 0.3,
        }}
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
          transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
        }}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollTo('home')}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            boxShadow: scrolled
              ? '0 0 16px rgba(232,164,0,0.3)'
              : '0 0 0px rgba(232,164,0,0)',
            transition: 'box-shadow 0.3s ease',
          }}
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <span className="font-bold text-[10px] text-gray-900 tracking-wider">HL</span>
        </motion.button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/[0.06] mx-2" />

        {/* Nav links - shown on sm and larger screens */}
        <div className="hidden sm:flex items-center">
          {NAV_LINKS.map((link) => (
            <motion.button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
              aria-label={`Navigate to ${link.label}`}
              aria-current={activeSection === link.id ? 'page' : undefined}
              className="relative text-[13px] sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{
                color: activeSection === link.id
                  ? 'rgba(232,164,0,0.95)'
                  : 'rgba(255,255,255,0.4)',
                transition: 'color 0.3s ease',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Hover background */}
              <AnimatePresence>
                {hoveredLink === link.id && (
                  <motion.div
                    className="absolute inset-0 rounded-lg -z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      background: 'rgba(232,164,0,0.08)',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Active indicator */}
              <AnimatePresence>
                {activeSection === link.id && (
                  <motion.div
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400"
                    layoutId="navIndicator"
                    transition={springs.gentle}
                    style={{ boxShadow: '0 0 8px rgba(232,164,0,0.6)' }}
                  />
                )}
              </AnimatePresence>

              <span className="relative z-10">{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/[0.06] mx-2" />

        {/* Hire Me button */}
        <motion.a
          href="mailto:hailuong.vfx@gmail.com"
          className="relative text-[13px] sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black overflow-hidden"
          aria-label="Hire me via email"
          style={{
            background: 'linear-gradient(135deg, hsl(43 100% 46%), hsl(35 100% 50%))',
            color: 'hsl(0 0% 5%)',
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0"
            initial={{ x: '-100%' }}
            whileHover={{ 
              x: '100%',
              transition: { duration: 0.6, ease: easings.easeOut },
            }}
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
          />
          <span className="relative z-10">Hire Me</span>
        </motion.a>

        {/* Mobile menu button */}
        <motion.button
          className="sm:hidden ml-2 w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          style={{
            background: 'rgba(255,255,255,0.05)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className="w-4 h-0.5 bg-white/60 rounded-full"
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 6 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-4 h-0.5 bg-white/60 rounded-full"
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.15 }}
          />
          <motion.span
            className="w-4 h-0.5 bg-white/60 rounded-full"
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -6 : 0,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden sm:hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: easings.easeOut }}
              style={{
                background: 'rgba(10, 10, 14, 0.95)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="w-full text-left px-4 py-3 text-sm font-medium border-b border-white/[0.05] last:border-b-0"
                  style={{
                    color: activeSection === link.id
                      ? 'rgba(232,164,0,0.95)'
                      : 'rgba(255,255,255,0.7)',
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll progress indicator */}
        <div className="hidden md:flex items-center gap-2 ml-3 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <motion.span
            className="text-[10px] font-mono font-medium tabular-nums"
            animate={{
              color: scrollPct > 0 ? 'hsl(43 100% 55%)' : 'rgba(255,255,255,0.2)',
            }}
            transition={{ duration: 0.3 }}
          >
            {String(scrollPct).padStart(3, '\u2007')}
          </motion.span>
          <div className="w-7 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${scrollPct}%`,
                background: 'linear-gradient(90deg, hsl(43 100% 46%), hsl(35 100% 50%))',
              }}
              transition={{ width: { duration: 0.15, ease: 'linear' } }}
            />
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
