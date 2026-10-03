import { useContext, useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { GalleryPreferences } from './preferences';

export default function GalleryCursor({ root }: { root: RefObject<HTMLElement> }) {
  const cursor = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { enabled } = useContext(GalleryPreferences);
  const { pathname } = useLocation();

  useEffect(() => {
    const host = root.current;
    const card = cursor.current;
    const marquee = track.current;
    if (!enabled || !host || !card || !marquee) return;
    const media = gsap.matchMedia();
    media.add('(min-width: 992px) and (hover: hover) and (pointer: fine)', () => {
      const labels = Array.from(marquee.querySelectorAll('span'));
      const xTo = gsap.quickTo(card, 'x', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(card, 'y', { duration: 0.4, ease: 'power3.out' });
      const appearance = gsap.fromTo(card, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.24, ease: 'power2.out', paused: true });
      let point: { x: number; y: number; target: EventTarget | null } | null = null;
      let target: Element | null = null;
      let dirty = false;
      let hitTest = false;
      let seeded = false;
      let active = false;
      let caption = '';
      const hide = () => {
        if (!active) return;
        active = false;
        target = null;
        card.dataset.active = 'false';
        host.removeAttribute('data-mg-cursor-active');
        appearance.reverse();
      };
      const render = () => {
        if (!point || !dirty) return;
        dirty = false;
        const state = host.dataset.mgTransition;
        if (state === 'leaving' || state === 'entering' || document.body.style.overflow === 'hidden') { hide(); return; }
        const hovered = hitTest ? document.elementFromPoint(point.x, point.y) : point.target;
        hitTest = false;
        target = hovered instanceof Element ? hovered.closest('[data-mg-cursor]') : null;
        if (!target || !host.contains(target) || target.closest('[inert], dialog, [disabled]')) { hide(); return; }
        const text = target.getAttribute('data-mg-cursor') || 'EXPLORE →';
        if (text !== caption) {
          caption = text;
          labels.forEach(label => { label.textContent = text; });
          marquee.style.setProperty('--mg-cursor-duration', Math.max(2.6, text.length / 5) + 's');
        }
        const horizontal = gsap.utils.clamp(90, window.innerWidth - 90, point.x);
        const vertical = gsap.utils.clamp(24, window.innerHeight - 24, point.y);
        if (!seeded || appearance.progress() === 0) {
          xTo(horizontal, horizontal);
          yTo(vertical, vertical);
          seeded = true;
        }
        xTo(horizontal);
        yTo(vertical);
        if (!active) {
          active = true;
          card.dataset.active = 'true';
          host.dataset.mgCursorActive = 'true';
          appearance.play();
        }
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === 'touch') return;
        point = { x: event.clientX, y: event.clientY, target: event.target };
        dirty = true;
      };
      const scroll = () => { hitTest = true; dirty = true; };
      const leave = (event: PointerEvent) => {
        if (!event.relatedTarget || event.relatedTarget instanceof HTMLIFrameElement) hide();
      };
      const keyboard = (event: KeyboardEvent) => { if (event.key === 'Tab' || event.key === 'Escape') hide(); };
      const observer = new MutationObserver(() => { hide(); hitTest = true; dirty = true; });
      observer.observe(host, { attributes: true, attributeFilter: ['data-mg-transition'] });
      observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      window.addEventListener('pointermove', move, { passive: true });
      window.addEventListener('pointerout', leave);
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('blur', hide);
      document.addEventListener('visibilitychange', hide);
      document.addEventListener('keydown', keyboard);
      gsap.ticker.add(render, false, true);
      return () => {
        observer.disconnect();
        gsap.ticker.remove(render);
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerout', leave);
        window.removeEventListener('scroll', scroll);
        window.removeEventListener('blur', hide);
        document.removeEventListener('visibilitychange', hide);
        document.removeEventListener('keydown', keyboard);
        xTo.tween.kill();
        yTo.tween.kill();
        appearance.kill();
        host.removeAttribute('data-mg-cursor-active');
        card.dataset.active = 'false';
        gsap.set(card, { clearProps: 'transform,opacity,visibility' });
      };
    });
    return () => media.revert();
  }, [enabled, pathname, root]);

  return createPortal(<div ref={cursor} className="mg-mouse-cursor" aria-hidden="true" data-active="false">
    <div className="mg-cursor-label"><div ref={track} className="mg-cursor-label-track"><span>VIEW PROJECT →</span><span>VIEW PROJECT →</span></div></div>
  </div>, document.body);
}
