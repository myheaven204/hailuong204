import { useCallback, useEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryEase, galleryMotion } from './motion';
import { getGalleryStackBypass } from './createGalleryStack';

gsap.registerPlugin(ScrollTrigger);

export default function useGalleryScroll(root: RefObject<HTMLElement>, enabled: boolean, transitionLocked: RefObject<boolean>) {
  const scroll = useRef<Lenis | null>(null);
  const previous = useRef<{ pathname: string; hash: string } | null>(null);
  const anchorRestore = useRef<(() => void) | null>(null);
  const anchorCompress = useRef<((position: number) => number) | null>(null);
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const syncLock = useCallback(() => {
    const instance = scroll.current;
    if (!instance) return;
    const stopped = transitionLocked.current || document.body.style.overflow === 'hidden' || !!document.querySelector('dialog[open]');
    if (stopped && !instance.isStopped) instance.stop();
    else if (!stopped && instance.isStopped) instance.start();
  }, [transitionLocked]);

  const finishAnchor = useCallback(() => {
    const restore = anchorRestore.current;
    anchorRestore.current = null;
    anchorCompress.current = null;
    restore?.();
    root.current?.removeAttribute('data-mg-anchor-scrolling');
  }, [root]);

  const goTo = useCallback((target: HTMLElement | number, immediate = false, skipStack = false) => {
    const instance = scroll.current;
    if (instance) {
      instance.resize();
      if (skipStack) {
        root.current?.setAttribute('data-mg-anchor-scrolling', 'true');
        const host = root.current;
        const stack = host && getGalleryStackBypass(host);
        const originalPosition = typeof target === 'number' ? target : target.getBoundingClientRect().top + instance.actualScroll;
        const origin = instance.actualScroll;
        if (!anchorRestore.current && stack && Math.max(origin, originalPosition) > stack.start && Math.min(origin, originalPosition) < stack.end) {
          const bypass = stack.compact(typeof target !== 'number' && target.id === 'work');
          anchorCompress.current = bypass.compress;
          anchorRestore.current = () => {
            const position = bypass.restore(instance.actualScroll);
            instance.resize();
            instance.scrollTo(position, { immediate: true, force: true });
            ScrollTrigger.refresh();
            instance.resize();
            ScrollTrigger.update();
          };
          instance.resize();
          instance.scrollTo(bypass.compress(origin), { immediate: true, force: true });
          ScrollTrigger.refresh();
          instance.resize();
        }
        const margin = typeof target === 'number' ? 0 : Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        const padding = typeof target === 'number' ? 0 : Number.parseFloat(getComputedStyle(instance.rootElement).scrollPaddingTop) || 0;
        const position = typeof target === 'number' ? anchorCompress.current?.(target) ?? target : target.getBoundingClientRect().top + instance.actualScroll - margin - padding;
        const destination = gsap.utils.clamp(0, instance.limit, position);
        const animated = !immediate && Math.abs(destination - instance.animatedScroll) > 0.5;
        instance.scrollTo(destination, { immediate: !animated, force: true, lock: animated, duration: 1.25, easing: gsap.parseEase('sine.inOut'),
          onComplete: finishAnchor,
        });
      } else {
        finishAnchor();
        instance.scrollTo(target, { immediate, force: true, duration: 1.25, easing: galleryEase.settle });
      }
    } else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'instant' });
    else target.scrollIntoView({ behavior: 'instant' });
  }, [finishAnchor, root]);

  const settleLayout = useCallback(() => {
    ScrollTrigger.refresh();
    scroll.current?.resize();
    let target: HTMLElement | number = 0;
    try {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (targetId) target = document.getElementById(targetId) ?? 0;
    } catch { target = 0; }
    goTo(target, true);
    ScrollTrigger.update();
    window.dispatchEvent(new Event('mg:layout-settled'));
  }, [goTo]);

  useEffect(() => {
    if (!enabled || !root.current) return;
    const host = root.current;
    document.documentElement.classList.add('mg-smooth-scroll');
    const instance = new Lenis({
      lerp: galleryMotion.scrollLerp,
      wheelMultiplier: galleryMotion.wheelMultiplier,
      syncTouch: false,
      respectReducedMotion: false,
      prevent: node => node.matches('dialog, .mobile-menu, [data-lenis-prevent]'),
    });
    scroll.current = instance;
    let refreshPending = true;
    let refreshDue = gsap.ticker.time + 0.16;
    let refreshing = false;
    let height = host.offsetHeight;
    let width = host.offsetWidth;
    const update = () => ScrollTrigger.update();
    const unsubscribe = instance.on('scroll', update);
    const tick = (time: number) => {
      instance.raf(time * 1000);
      if (!instance.isScrolling && host.hasAttribute('data-mg-anchor-scrolling')) finishAnchor();
      refreshIfIdle(time);
    };
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    const interruptScroll = (event: KeyboardEvent) => {
      if (!event.key.match(/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| )$/) || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.target instanceof Element && event.target.closest('dialog, input, textarea, select, [contenteditable="true"]')) return;
      if (instance.isStopped) { event.preventDefault(); return; }
      instance.stop();
      instance.start();
      finishAnchor();
    };
    document.addEventListener('keydown', interruptScroll);
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    function refreshIfIdle(time: number) {
      if (instance.isStopped || transitionLocked.current || host.hasAttribute('data-mg-anchor-scrolling') || document.hidden) return;
      if (refreshing) {
        height = host.offsetHeight;
        width = host.offsetWidth;
        instance.resize();
        refreshing = false;
        return;
      }
      if (!refreshPending || time < refreshDue || instance.isScrolling) return;
      refreshPending = false;
      refreshing = true;
      ScrollTrigger.refresh();
    }
    function settled() {
      refreshPending = false;
      refreshing = false;
      height = host.offsetHeight;
      width = host.offsetWidth;
      instance.resize();
    }
    function scheduleRefresh() { refreshPending = true; refreshDue = gsap.ticker.time + 0.16; }
    const onMediaLoad = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.mg-hero-cursor')) return;
      if (event.target instanceof HTMLIFrameElement && event.target.closest('.mg-film-screen')) return;
      if (event.target instanceof HTMLImageElement && event.target.hasAttribute('width') && event.target.hasAttribute('height')) return;
      scheduleRefresh();
    };
    host.addEventListener('load', onMediaLoad, true);
    window.addEventListener('mg:layout-ready', scheduleRefresh);
    window.addEventListener('mg:layout-settled', settled);
    window.addEventListener('resize', scheduleRefresh);
    document.addEventListener('visibilitychange', scheduleRefresh);
    const resizeObserver = new ResizeObserver(() => {
      if (refreshing) return;
      const nextHeight = host.offsetHeight;
      const nextWidth = host.offsetWidth;
      if (height === nextHeight && width === nextWidth) return;
      height = nextHeight;
      width = nextWidth;
      scheduleRefresh();
    });
    resizeObserver.observe(host);
    syncLock();
    return () => {
      finishAnchor();
      host.removeEventListener('load', onMediaLoad, true);
      window.removeEventListener('mg:layout-ready', scheduleRefresh);
      window.removeEventListener('mg:layout-settled', settled);
      window.removeEventListener('resize', scheduleRefresh);
      document.removeEventListener('visibilitychange', scheduleRefresh);
      lockObserver.disconnect();
      resizeObserver.disconnect();
      unsubscribe();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      document.removeEventListener('keydown', interruptScroll);
      instance.destroy();
      if (scroll.current === instance) scroll.current = null;
      document.documentElement.classList.remove('mg-smooth-scroll');
    };
  }, [enabled, finishAnchor, root, syncLock, transitionLocked]);

  useEffect(() => {
    const last = previous.current;
    if (last?.pathname === pathname && last.hash === hash) return;
    const routeChanged = last?.pathname !== pathname;
    let cancelled = false;
    let animation = 0;
    let frames = 0;
    const findTarget = () => {
      if (cancelled) return;
      if (!hash) { if (routeChanged) goTo(0, true); previous.current = { pathname, hash }; return; }
      let targetId: string;
      try { targetId = decodeURIComponent(hash.slice(1)); } catch { return; }
      const target = document.getElementById(targetId);
      if (target) { goTo(target, routeChanged || targetId === 'main-content'); previous.current = { pathname, hash }; }
      else if (frames++ < 120) animation = requestAnimationFrame(findTarget);
    };
    void document.fonts.ready.then(() => { if (!cancelled) animation = requestAnimationFrame(findTarget); });
    return () => { cancelled = true; cancelAnimationFrame(animation); };
  }, [goTo, hash, pathname]);

  useEffect(() => {
    const onAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname !== pathname || !destination.hash) return;
      let targetId: string;
      try { targetId = decodeURIComponent(destination.hash.slice(1)); } catch { return; }
      const target = document.getElementById(targetId);
      if (!target || !root.current?.contains(target) && targetId !== 'top' && targetId !== 'main-content') return;
      event.preventDefault();
      if (link.classList.contains('skip-link')) { goTo(target, true); target.focus({ preventScroll: true }); }
      else if (event.composedPath().some(node => node instanceof Element && node.matches('.site-header'))) {
        scroll.current?.stop();
        syncLock();
        goTo(target, false, true);
        previous.current = { pathname, hash: destination.hash };
        if (destination.hash !== hash) navigate(pathname + search + destination.hash, { preventScrollReset: true });
      }
      else if (destination.hash === hash) goTo(target);
      else navigate(pathname + search + destination.hash, { preventScrollReset: true });
    };
    document.addEventListener('click', onAnchor);
    return () => document.removeEventListener('click', onAnchor);
  }, [goTo, hash, navigate, pathname, root, search, syncLock]);

  return { scroll, syncLock, goTo, settleLayout };
}
