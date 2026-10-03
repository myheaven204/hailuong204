import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

export default function Header({ homePath = '/', onHomeScroll }: { homePath?: string; onHomeScroll?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); toggle.current?.focus(); }
    };
    const closeOnOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target) && !toggle.current?.contains(event.target)) setMenuOpen(false);
    };
    const breakpoint = window.matchMedia('(min-width: 761px)');
    const closeOnResize = () => { if (breakpoint.matches) setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutside);
    breakpoint.addEventListener('change', closeOnResize);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutside);
      breakpoint.removeEventListener('change', closeOnResize);
    };
  }, [menuOpen]);
  const destination = (section: string) => pathname === homePath ? '#' + section : homePath + '#' + section;
  return <header className={'site-header ' + (scrolled ? 'is-scrolled' : '')}>
    <Link to={homePath} className="wordmark" aria-label="Hai Luong — home" onClick={() => { setMenuOpen(false); if (pathname === homePath) { if (onHomeScroll) onHomeScroll(); else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); } }}><span className="brand-symbol" aria-hidden="true">h<span>l</span><i /></span><span className="wordmark-name">HAI LUONG<span>VISUAL EFFECTS</span></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation"><a href={destination('archive')}>Work Index</a><a href={destination('breakdowns')}>Breakdowns</a><a href={destination('showreel')}>Showreel</a><a href={destination('about')}>About</a></nav>
    <div className="header-right"><a className="header-contact" href={destination('contact')}>Let’s talk <Icon name="arrow" /></a><button ref={toggle} className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(open => !open)}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div>
    {menuOpen && <div ref={menu} id="mobile-navigation" className="mobile-menu"><nav aria-label="Mobile navigation">{[['archive', 'Work Index'], ['breakdowns', 'Breakdowns'], ['showreel', 'Showreel'], ['about', 'About'], ['contact', 'Contact']].map(([id, label], index) => <a href={destination(id)} key={id} onClick={() => setMenuOpen(false)}><span className="eyebrow">0{index + 1}</span>{label}<Icon name="arrow" /></a>)}</nav></div>}
  </header>;
}
