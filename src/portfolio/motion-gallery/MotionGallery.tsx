import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Header from '../Header';
import MotionHome from './MotionHome';
import MotionProject from './MotionProject';
import MotionLink from './MotionLink';
import { GalleryNavigation } from './navigation';
import { GALLERY_PATH } from './data';
import { GalleryPreferences, type MotionMode } from './preferences';
import useGalleryScroll from './useGalleryScroll';
import { galleryMotion } from './motion';
import GalleryCursor from './GalleryCursor';
import '@fontsource-variable/archivo/standard.css';
import './motion-gallery.css';

const WorkIndexStudies = lazy(() => import('./WorkIndexStudies'));

export default function MotionGallery() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline>();
  const locked = useRef(false);
  const covered = useRef(false);
  const pending = useRef<string | null>(null);
  const entranceDelay = useRef(galleryMotion.entranceDelay);
  const [mode, setMode] = useState<MotionMode>('full');
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const enabled = mode === 'full' || (mode === 'system' && !systemReduced);
  const { syncLock, goTo, settleLayout } = useGalleryScroll(root, enabled, locked);
  const preferences = useMemo(() => ({ enabled, entranceDelay }), [enabled]);

  const transition = useCallback((destination: string) => {
    if (locked.current) return;
    const target = new URL(destination, window.location.href);
    if (target.pathname === pathname) {
      if (target.hash && target.hash === window.location.hash && target.search === window.location.search) {
        try {
          const anchor = document.getElementById(decodeURIComponent(target.hash.slice(1)));
          if (anchor) goTo(anchor);
        } catch { return; }
      } else navigate(destination);
      return;
    }
    if (!enabled || !surface.current) {
      navigate(destination);
      return;
    }
    locked.current = true;
    syncLock();
    pending.current = destination;
    root.current?.setAttribute('data-mg-transition', 'leaving');
    timeline.current?.kill();
    timeline.current = gsap.timeline()
      .set(surface.current, { y: 0, yPercent: 115, willChange: 'transform', force3D: true })
      .set(overlay.current, { visibility: 'visible', pointerEvents: 'auto' })
      .to(surface.current, { yPercent: 0, duration: 0.78, ease: 'power2.inOut' })
      .call(() => { covered.current = true; entranceDelay.current = 0.12; navigate(destination); });
  }, [enabled, goTo, navigate, pathname, syncLock]);

  useEffect(() => {
    if (!enabled) return;
    if (!covered.current) {
      entranceDelay.current = galleryMotion.entranceDelay;
      if (locked.current) {
        timeline.current?.kill();
        pending.current = null;
        locked.current = false;
        gsap.set(overlay.current, { visibility: 'hidden', pointerEvents: 'none' });
        gsap.set(surface.current, { clearProps: 'transform,willChange' });
        root.current?.setAttribute('data-mg-transition', 'idle');
        syncLock();
      }
      return;
    }
    covered.current = false;
    pending.current = null;
    timeline.current?.kill();
    root.current?.setAttribute('data-mg-transition', 'preparing');
    let cancelled = false;
    let started = false;
    let frame = 0;
    const reveal = () => {
      if (cancelled || started) return;
      started = true;
      window.clearTimeout(fallback);
      window.removeEventListener('mg:layout-ready', onReady);
      settleLayout();
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (cancelled) return;
          root.current?.setAttribute('data-mg-transition', 'entering');
          window.dispatchEvent(new Event('mg:route-reveal'));
          timeline.current = gsap.timeline()
            .to(surface.current, { yPercent: -115, duration: 0.94, ease: 'power2.inOut' })
            .set(overlay.current, { visibility: 'hidden', pointerEvents: 'none' })
            .set(surface.current, { force3D: false, clearProps: 'willChange' })
            .call(() => {
              locked.current = false;
              root.current?.setAttribute('data-mg-transition', 'idle');
              syncLock();
              document.getElementById('mg-page-title')?.focus({ preventScroll: true });
            });
        });
      });
    };
    const onReady = () => {
      if (root.current?.querySelector('main[data-mg-ready="true"]')) reveal();
    };
    const fallback = window.setTimeout(reveal, 1200);
    window.addEventListener('mg:layout-ready', onReady);
    onReady();
    if (root.current?.querySelector('.mg-missing')) reveal();
    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      cancelAnimationFrame(frame);
      window.removeEventListener('mg:layout-ready', onReady);
      timeline.current?.kill();
    };
  }, [enabled, pathname, settleLayout, syncLock]);

  useEffect(() => {
    const internalHeaderLink = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.site-header a[href]') : null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || !destination.pathname.startsWith(GALLERY_PATH) || destination.pathname === pathname) return;
      event.preventDefault();
      transition(destination.pathname + destination.search + destination.hash);
    };
    document.addEventListener('click', internalHeaderLink, true);
    return () => document.removeEventListener('click', internalHeaderLink, true);
  }, [pathname, transition]);

  useEffect(() => {
    document.body.classList.add('mg-gallery-active');
    const existing = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existing ?? document.createElement('meta');
    const previous = existing?.content;
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    if (!existing) document.head.append(robots);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setSystemReduced(preference.matches);
    preference.addEventListener('change', updatePreference);
    return () => {
      timeline.current?.kill();
      preference.removeEventListener('change', updatePreference);
      document.body.classList.remove('mg-gallery-active');
      if (existing) robots.content = previous ?? ''; else robots.remove();
    };
  }, []);

  useEffect(() => {
    if (enabled) return;
    timeline.current?.kill();
    gsap.set(overlay.current, { visibility: 'hidden', pointerEvents: 'none' });
    gsap.set(surface.current, { clearProps: 'transform,willChange' });
    window.dispatchEvent(new Event('mg:route-reveal'));
    if (pending.current) navigate(pending.current);
    pending.current = null;
    covered.current = false;
    locked.current = false;
    root.current?.setAttribute('data-mg-transition', 'idle');
    syncLock();
  }, [enabled, navigate, syncLock]);

  return <GalleryNavigation.Provider value={transition}><GalleryPreferences.Provider value={preferences}>
    <div ref={root} className="mg-layout" data-mg-motion={enabled ? 'on' : 'off'}>
      <Header homePath={GALLERY_PATH} onHomeScroll={() => goTo(0)} />
      <GalleryCursor root={root} />
      <Routes>
        <Route index element={<MotionHome />} />
        <Route path="work-index-studies" element={<Suspense fallback={<main id="main-content" className="mg-page mg-missing"><p>Opening the card studies…</p></main>}><WorkIndexStudies /></Suspense>} />
        <Route path="project/:id" element={<MotionProject key={pathname} />} />
        <Route path="*" element={<main id="main-content" className="mg-page mg-missing"><h1 id="mg-page-title" tabIndex={-1}>Frame not found.</h1><MotionLink to={GALLERY_PATH} className="mg-button">Back to the gallery ↗</MotionLink></main>} />
      </Routes>
      <div ref={overlay} className="mg-route-wipe" aria-hidden="true">
        <div ref={surface} className="mg-route-surface"><svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><path d="M0 190 C200 190 260 10 500 90 S780 10 1000 0 V810 C800 810 740 990 500 910 S220 990 0 1000 Z" /></svg></div>
      </div>
      <label className="mg-motion-control"><span>Motion</span><select aria-label="Motion preference" value={mode} onChange={event => setMode(event.target.value as MotionMode)}><option value="system">Device setting</option><option value="full">Full motion</option><option value="reduced">Reduced motion</option></select></label>
    </div>
  </GalleryPreferences.Provider></GalleryNavigation.Provider>;
}
