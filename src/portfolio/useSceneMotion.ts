import { useEffect, type RefObject } from 'react';

export default function useSceneMotion(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let cleanupAnimation: (() => void) | undefined;
    let cancelled = false;
    const start = () => {
      if (preference.matches) return;
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      element.querySelectorAll('[data-reveal]').forEach(target => observer?.observe(target));
      void import('gsap').then(({ gsap }) => {
        if (cancelled || preference.matches) return;
        const context = gsap.context(() => {
          gsap.from('.hero-title-line > span', { yPercent: 100, duration: 1.05, stagger: 0.13, ease: 'power3.out', clearProps: 'transform' });
          gsap.from('.hero-intro, .hero-position-note, .hero-bottom', { y: 18, opacity: 0, duration: 0.8, stagger: 0.12, delay: 0.35, clearProps: 'all' });
          gsap.from('.hero-art, .hero-companion', { y: 32, opacity: 0, duration: 1, stagger: 0.16, delay: 0.15, ease: 'power3.out', clearProps: 'transform,opacity' });
        }, element);
        cleanupAnimation = () => context.revert();
      }).catch(() => { element.querySelectorAll('[data-reveal]').forEach(target => target.classList.add('is-visible')); });
    };
    const onChange = () => {
      observer?.disconnect();
      cleanupAnimation?.();
      element.querySelectorAll('[data-reveal]').forEach(target => target.classList.add('is-visible'));
    };
    start();
    preference.addEventListener('change', onChange);
    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanupAnimation?.();
      preference.removeEventListener('change', onChange);
    };
  }, [root]);
}
