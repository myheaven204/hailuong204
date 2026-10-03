import { useContext, useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { GalleryPreferences } from './preferences';

export default function useEditionMotion(root: RefObject<HTMLDivElement>, direction: string, scene: string) {
  const { enabled } = useContext(GalleryPreferences);

  useEffect(() => {
    const host = root.current;
    if (!enabled || direction !== 'b' || !host) return;
    const media = gsap.matchMedia();
    media.add('(hover: hover) and (pointer: fine)', () => {
      const touched = new Set<HTMLElement>();
      const floated = new Set<HTMLElement>();
      let frame = 0;
      let point = { horizontal: 0, vertical: 0 };
      const createMotion = (card: HTMLElement) => {
        const front = card.querySelector<HTMLElement>('.ws-front');
        const back = card.querySelector<HTMLElement>('.ws-back');
        const image = card.querySelector<HTMLElement>('.ws-visual .mg-media');
        if (!front || !back || !image) return null;
        const nodes = [front, back, image];
        nodes.forEach(node => touched.add(node));
        gsap.killTweensOf(nodes);
        card.dataset.wsFloating = 'true';
        floated.add(card);
        const angle = parseFloat(getComputedStyle(card).getPropertyValue('--ws-angle')) || 0;
        gsap.to(image, { scale: 1.028, duration: 1.05, ease: 'power3.out', overwrite: 'auto', force3D: false });
        return {
          card, front, back, image, nodes, angle, bounds: card.getBoundingClientRect(),
          frontHorizontal: gsap.quickTo(front, 'x', { duration: .7, ease: 'power3.out' }),
          frontVertical: gsap.quickTo(front, 'y', { duration: .7, ease: 'power3.out' }),
          frontPitch: gsap.quickTo(front, 'rotationX', { duration: .85, ease: 'power3.out' }),
          frontYaw: gsap.quickTo(front, 'rotationY', { duration: .85, ease: 'power3.out' }),
          frontRoll: gsap.quickTo(front, 'rotation', { duration: .85, ease: 'power3.out' }),
          backHorizontal: gsap.quickTo(back, 'x', { duration: 1, ease: 'power3.out' }),
          backVertical: gsap.quickTo(back, 'y', { duration: 1, ease: 'power3.out' }),
          backRoll: gsap.quickTo(back, 'rotation', { duration: 1, ease: 'power3.out' }),
          imageHorizontal: gsap.quickTo(image, 'x', { duration: .95, ease: 'power3.out' }),
          imageVertical: gsap.quickTo(image, 'y', { duration: .95, ease: 'power3.out' }),
        };
      };
      let active: ReturnType<typeof createMotion> = null;
      const reset = () => {
        cancelAnimationFrame(frame); frame = 0;
        if (!active) return;
        const motion = active;
        active = null;
        gsap.killTweensOf(motion.nodes);
        gsap.to(motion.front, { x: 0, y: 0, rotationX: 0, rotationY: 0, rotation: motion.angle,
          duration: .95, ease: 'power3.out', overwrite: 'auto', force3D: false,
          onComplete: () => { gsap.set(motion.front, { clearProps: 'transform' }); },
        });
        gsap.to(motion.back, { x: 5, y: -9, rotation: 2.2, duration: 1.05, ease: 'power3.out', overwrite: 'auto', force3D: false, clearProps: 'transform' });
        gsap.to(motion.image, { x: 0, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', overwrite: 'auto', force3D: false, clearProps: 'transform',
          onComplete: () => { delete motion.card.dataset.wsFloating; floated.delete(motion.card); },
        });
      };
      const render = () => {
        frame = 0;
        if (!active) return;
        const horizontal = gsap.utils.clamp(-1, 1, (point.horizontal - active.bounds.left) / active.bounds.width * 2 - 1);
        const vertical = gsap.utils.clamp(-1, 1, (point.vertical - active.bounds.top) / active.bounds.height * 2 - 1);
        active.frontHorizontal(horizontal * 2.5);
        active.frontVertical(-7 + vertical * 1.25);
        active.frontPitch(-vertical * .9);
        active.frontYaw(horizontal * 1.1);
        active.frontRoll(active.angle * .25 + horizontal * .45);
        active.backHorizontal(11 - horizontal * 1.5);
        active.backVertical(-16 - vertical * .8);
        active.backRoll(3.6 - horizontal * .4);
        active.imageHorizontal(-horizontal * 2.5);
        active.imageVertical(-vertical * 2);
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || event.buttons) { reset(); return; }
        const card = event.target instanceof Element ? event.target.closest<HTMLElement>('.ws-card') : null;
        if (!card || !host.contains(card) || card.matches(':focus-visible')) { reset(); return; }
        if (active?.card !== card) { reset(); active = createMotion(card); }
        if (!active) return;
        point = { horizontal: event.clientX, vertical: event.clientY };
        if (!frame) frame = requestAnimationFrame(render);
      };
      const leave = (event: PointerEvent) => {
        if (active && (!(event.relatedTarget instanceof Node) || !active.card.contains(event.relatedTarget))) reset();
      };
      const onFocus = () => { if (active?.card.matches(':focus-visible')) reset(); };
      const onVisibility = () => { if (document.hidden) reset(); };
      host.dataset.wsMotion = 'on';
      host.addEventListener('pointerover', move, { passive: true });
      host.addEventListener('pointermove', move, { passive: true });
      host.addEventListener('pointerout', leave);
      host.addEventListener('pointerdown', reset);
      host.addEventListener('focusin', onFocus);
      window.addEventListener('scroll', reset, { passive: true });
      window.addEventListener('resize', reset);
      window.addEventListener('blur', reset);
      document.addEventListener('visibilitychange', onVisibility);
      return () => {
        cancelAnimationFrame(frame);
        active = null;
        host.removeEventListener('pointerover', move);
        host.removeEventListener('pointermove', move);
        host.removeEventListener('pointerout', leave);
        host.removeEventListener('pointerdown', reset);
        host.removeEventListener('focusin', onFocus);
        window.removeEventListener('scroll', reset);
        window.removeEventListener('resize', reset);
        window.removeEventListener('blur', reset);
        document.removeEventListener('visibilitychange', onVisibility);
        gsap.killTweensOf([...touched]);
        if (touched.size) gsap.set([...touched], { clearProps: 'transform' });
        floated.forEach(card => { delete card.dataset.wsFloating; });
        delete host.dataset.wsMotion;
      };
    });
    return () => media.revert();
  }, [direction, enabled, root, scene]);
}
