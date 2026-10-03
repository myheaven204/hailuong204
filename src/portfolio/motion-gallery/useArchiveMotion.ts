import { useContext, useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GalleryPreferences } from './preferences';

gsap.registerPlugin(ScrollTrigger);

export default function useArchiveMotion(root: RefObject<HTMLDivElement>, scene: string, list: boolean) {
  const { enabled } = useContext(GalleryPreferences);

  useEffect(() => {
    const host = root.current;
    if (!enabled || !host || list) return;
    const cards = Array.from(host.querySelectorAll<HTMLElement>('.mg-archive-card'));
    if (!cards.length) return;
    const touched = new Set<HTMLElement>();
    const context = gsap.context(() => {
      const entering = cards.filter(card => card.getBoundingClientRect().top >= window.innerHeight);
      if (!entering.length) return;
      gsap.set(entering, { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch(entering, {
        start: 'top bottom-=24', once: true, interval: 0.07, batchMax: 3,
        onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', overwrite: 'auto' }),
      });
    }, host);
    const media = gsap.matchMedia();
    media.add('(min-width: 992px) and (hover: hover) and (pointer: fine)', () => {
      const motionFor = (card: HTMLElement) => {
        const surface = card.querySelector<HTMLElement>('.mg-archive-surface');
        const image = card.querySelector<HTMLElement>('.mg-archive-frame .mg-media');
        if (!surface || !image) return null;
        touched.add(surface); touched.add(image);
        const ease = 'power3.out';
        return {
          card, surface, image, bounds: card.getBoundingClientRect(),
          horizontal: gsap.quickTo(surface, 'x', { duration: 0.65, ease }),
          vertical: gsap.quickTo(surface, 'y', { duration: 0.65, ease }),
          rotateHorizontal: gsap.quickTo(surface, 'rotationX', { duration: 0.65, ease }),
          rotateVertical: gsap.quickTo(surface, 'rotationY', { duration: 0.65, ease }),
          imageHorizontal: gsap.quickTo(image, 'x', { duration: 0.8, ease }),
          imageVertical: gsap.quickTo(image, 'y', { duration: 0.8, ease }),
        };
      };
      let active: ReturnType<typeof motionFor> = null;
      let point = { horizontal: 0, vertical: 0 };
      let dirty = false;
      let ticking = false;
      const render = () => {
        if (!active || !dirty) return;
        dirty = false;
        const horizontal = gsap.utils.clamp(-0.5, 0.5, (point.horizontal - active.bounds.left) / active.bounds.width - 0.5);
        const vertical = gsap.utils.clamp(-0.5, 0.5, (point.vertical - active.bounds.top) / active.bounds.height - 0.5);
        active.horizontal(horizontal * 4);
        active.vertical(-8 + vertical * 4);
        active.rotateHorizontal(-vertical * 2.2);
        active.rotateVertical(horizontal * 2.8);
        active.imageHorizontal(-horizontal * 10);
        active.imageVertical(-vertical * 8);
      };
      const reset = () => {
        if (ticking) { gsap.ticker.remove(render); ticking = false; }
        if (!active) return;
        Object.values(active).forEach(value => { if (typeof value === 'function' && 'tween' in value) value.tween.kill(); });
        gsap.to(active.surface, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(active.image, { x: 0, y: 0, scale: 1.055, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
        active = null;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.mg-archive-card') : null;
        if (!card || !host.contains(card)) { reset(); return; }
        if (active?.card !== card) {
          reset(); active = motionFor(card);
          if (!active) return;
          gsap.to(active.image, { scale: 1.07, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
        }
        point = { horizontal: event.clientX, vertical: event.clientY };
        dirty = true;
        if (!ticking) { gsap.ticker.add(render); ticking = true; }
      };
      const leave = (event: PointerEvent) => {
        if (!(event.relatedTarget instanceof Node) || !host.contains(event.relatedTarget)) reset();
      };
      const visibility = () => { if (document.hidden) reset(); };
      host.dataset.archiveInteractive = 'on';
      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerout', leave);
      window.addEventListener('scroll', reset, { passive: true });
      window.addEventListener('resize', reset);
      window.addEventListener('blur', reset);
      document.addEventListener('visibilitychange', visibility);
      return () => {
        reset();
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerout', leave);
        window.removeEventListener('scroll', reset);
        window.removeEventListener('resize', reset);
        window.removeEventListener('blur', reset);
        document.removeEventListener('visibilitychange', visibility);
        delete host.dataset.archiveInteractive;
      };
    });
    return () => {
      media.revert();
      gsap.killTweensOf([...cards, ...touched]);
      context.revert();
      if (touched.size) gsap.set([...touched], { clearProps: 'transform' });
    };
  }, [enabled, list, root, scene]);
}
