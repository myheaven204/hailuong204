import { useContext, useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { GalleryPreferences } from './preferences';
import { galleryEase, galleryMotion } from './motion';
import createGalleryStack from './createGalleryStack';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function useGalleryMotion(root: RefObject<HTMLElement>, scene: string) {
  const { enabled, entranceDelay } = useContext(GalleryPreferences);
  useEffect(() => {
    const element = root.current;
    if (!element || !enabled) return;
    let cancelled = false;
    let context: gsap.Context | undefined;
    const setup = () => {
      if (cancelled) return;
      context = gsap.context(() => {
        const splits: SplitText[] = [];
        const waiting = element.closest('.mg-layout')?.getAttribute('data-mg-transition');
        const entrance = gsap.timeline({ delay: entranceDelay.current ?? galleryMotion.entranceDelay, paused: waiting === 'leaving' || waiting === 'preparing' });
        const revealEntrance = () => { entrance.play(0); };
        window.addEventListener('mg:route-reveal', revealEntrance);
        element.querySelectorAll<HTMLElement>('.mg-line-inner').forEach((line, index) => {
          const characters = line.querySelectorAll('.mg-pressure-char');
          if (characters.length) entrance.fromTo(characters, { yPercent: 135, y: 0 }, { yPercent: 0, y: 0, duration: galleryMotion.textDuration, stagger: galleryMotion.characterStagger, ease: 'expo.out', clearProps: 'transform' }, index * galleryMotion.lineStagger);
          else {
            const split = SplitText.create(line, { type: 'lines', mask: 'lines', linesClass: 'mg-reveal-line', aria: 'none' });
            splits.push(split);
            entrance.fromTo(split.lines, { yPercent: 135, y: 0 }, { yPercent: 0, y: 0, duration: galleryMotion.textDuration, stagger: galleryMotion.lineStagger, ease: 'expo.out', clearProps: 'transform' }, index * galleryMotion.lineStagger);
          }
        });
        const metadata = element.querySelectorAll('.mg-hero-kicker, .mg-hero-bottom, .mg-case-meta');
        if (metadata.length) entrance.fromTo(metadata, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.2);
        const prints = element.querySelectorAll('.mg-hero-print');
        if (prints.length) entrance.fromTo(prints, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: galleryEase.settle, clearProps: 'transform,opacity' }, 0.25);
        const cover = element.querySelector('.mg-case-cover, .mg-project-film');
        if (cover) entrance.fromTo(cover, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: galleryEase.move, clearProps: 'transform,opacity' }, 0.3);
        element.querySelectorAll<HTMLElement>('[data-mg-reveal]').forEach(target => {
          if (target.matches('h1, h2, h3')) {
            splits.push(SplitText.create(target, {
              type: 'lines', mask: 'lines', linesClass: 'mg-reveal-line', autoSplit: true, aria: 'none',
              onSplit: split => gsap.from(split.lines, { yPercent: 135, duration: galleryMotion.textDuration, stagger: galleryMotion.lineStagger, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: target, start: 'top 85%', once: true, refreshPriority: -1 } }),
            }));
          } else gsap.from(target, { y: 24, opacity: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity', scrollTrigger: { trigger: target, start: 'top 85%', once: true, refreshPriority: -1 } });
        });
        const media = gsap.matchMedia();
        media.add('(min-width: 992px) and (min-height: 650px)', () => createGalleryStack(element));
        media.add('(max-width: 991px), (max-height: 649px)', () => {
          const seal = element.querySelector('[data-mg-scroll-seal]');
          const stack = element.querySelector('.mg-stack');
          if (seal && stack) gsap.fromTo(seal, { rotation: 0 }, { rotation: 180, ease: 'none', scrollTrigger: { trigger: stack, start: 'top bottom', end: 'bottom top', scrub: true } });
        });
        media.add('(min-width: 992px) and (hover: hover) and (pointer: fine)', () => {
          const cleanups: Array<() => void> = [];
          element.querySelectorAll<HTMLElement>('[data-mg-tilt]').forEach(card => {
            const surface = card.querySelector<HTMLElement>('.mg-tilt-surface');
            if (!surface) return;
            const xTo = gsap.quickTo(surface, 'rotationX', { duration: 0.6, ease: 'power3.out' });
            const yTo = gsap.quickTo(surface, 'rotationY', { duration: 0.6, ease: 'power3.out' });
            let animation = 0;
            let bounds: DOMRect | null = null;
            let point: { x: number; y: number } | null = null;
            const render = () => {
              animation = 0;
              if (!point) return;
              bounds ??= card.getBoundingClientRect();
              xTo(-gsap.utils.clamp(-0.5, 0.5, (point.y - bounds.top) / bounds.height - 0.5) * 6);
              yTo(gsap.utils.clamp(-0.5, 0.5, (point.x - bounds.left) / bounds.width - 0.5) * 10);
              point = null;
            };
            const move = (event: PointerEvent) => {
              if (event.pointerType === 'touch') return;
              point = { x: event.clientX, y: event.clientY };
              if (!animation) animation = requestAnimationFrame(render);
            };
            const invalidate = () => { bounds = null; };
            const leave = () => { cancelAnimationFrame(animation); animation = 0; point = null; bounds = null; xTo(0); yTo(0); };
            card.addEventListener('pointermove', move, { passive: true });
            card.addEventListener('pointerleave', leave);
            window.addEventListener('scroll', invalidate, { passive: true });
            window.addEventListener('resize', invalidate);
            cleanups.push(() => {
              cancelAnimationFrame(animation);
              card.removeEventListener('pointermove', move);
              card.removeEventListener('pointerleave', leave);
              window.removeEventListener('scroll', invalidate);
              window.removeEventListener('resize', invalidate);
              xTo.tween.kill(); yTo.tween.kill();
              gsap.set(surface, { clearProps: 'transform' });
            });
          });
          const collage = element.querySelector<HTMLElement>('.mg-breakdown-grid');
          if (collage) {
            const cards = Array.from(collage.querySelectorAll<HTMLElement>('.mg-breakdown-card'));
            const surfaces = cards.map(card => card.querySelector<HTMLElement>('.mg-tilt-surface'));
            let reset: gsap.core.Tween | undefined;
            const restore = () => { gsap.to(surfaces, { scale: 1, xPercent: 0, rotation: 0, duration: 0.8, ease: galleryEase.move, overwrite: 'auto' }); };
            cards.forEach((card, cardIndex) => {
              const focus = () => {
                reset?.kill();
                surfaces.forEach((surface, index) => {
                  const direction = Math.sign(index - cardIndex);
                  gsap.to(surface, { scale: index === cardIndex ? 1.075 : 0.9, xPercent: direction * 2, rotation: direction * 2.5, duration: 0.8, ease: galleryEase.move, overwrite: 'auto' });
                });
              };
              const blur = () => { reset?.kill(); reset = gsap.delayedCall(0.08, restore); };
              card.addEventListener('pointerenter', focus);
              card.addEventListener('pointerleave', blur);
              card.addEventListener('focus', focus);
              card.addEventListener('blur', blur);
              cleanups.push(() => { card.removeEventListener('pointerenter', focus); card.removeEventListener('pointerleave', blur); card.removeEventListener('focus', focus); card.removeEventListener('blur', blur); });
            });
            cleanups.push(() => { reset?.kill(); gsap.killTweensOf(surfaces); gsap.set(surfaces, { clearProps: 'transform' }); });
          }
          return () => cleanups.forEach(cleanup => cleanup());
        });
        media.add({ desktop: '(min-width: 992px)', tablet: '(min-width: 760px) and (max-width: 991px)', mobile: '(max-width: 759px)' }, match => {
          const distance = match.conditions?.desktop ? 80 : match.conditions?.tablet ? 45 : 25;
          element.querySelectorAll<HTMLElement>('[data-mg-parallax]').forEach(target => {
            gsap.fromTo(target, { y: distance }, { y: -distance, ease: 'none', scrollTrigger: { trigger: target.parentElement, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true, invalidateOnRefresh: true, refreshPriority: -1 } });
          });
        });
        const strip = element.querySelector<HTMLElement>('.mg-brand-strip');
        const track = strip?.querySelector<HTMLElement>('.mg-brand-track');
        const sets = track?.querySelectorAll<HTMLElement>('.mg-brand-set');
        if (strip && track && sets?.length) {
          const multiplier = window.innerWidth < 480 ? 0.25 : window.innerWidth < 992 ? 0.5 : 1;
          const duration = 30 * (sets[0].offsetWidth / window.innerWidth) * multiplier;
          const loop = gsap.to(sets, { xPercent: -100, repeat: -1, duration, ease: 'none', onReverseComplete: function (this: gsap.core.Tween) { this.totalTime(this.rawTime() + this.duration() * 100); } }).totalProgress(0.5);
          let direction = 1;
          ScrollTrigger.create({ trigger: strip, start: 'top bottom', end: 'bottom top', onToggle: trigger => { loop.paused(!trigger.isActive); }, onUpdate: trigger => {
            if (trigger.direction === direction) return;
            direction = trigger.direction;
            gsap.to(loop, { timeScale: direction, duration: 0.6, ease: 'power2.out', overwrite: true });
          } });
          gsap.fromTo(track, { x: '10vw' }, { x: '-10vw', ease: 'none', scrollTrigger: { trigger: strip, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
          loop.paused(strip.getBoundingClientRect().top > window.innerHeight);
          cleanupsForMarquee = () => gsap.killTweensOf(loop);
        }
        element.dataset.mgReady = 'true';
        window.dispatchEvent(new Event('mg:layout-ready'));
        return () => {
          delete element.dataset.mgReady;
          window.removeEventListener('mg:route-reveal', revealEntrance);
          media.revert(); splits.forEach(split => split.revert()); cleanupsForMarquee?.();
        };
      }, element);
    };
    let cleanupsForMarquee: (() => void) | undefined;
    void document.fonts.ready.then(setup);
    return () => { cancelled = true; context?.revert(); };
  }, [enabled, entranceDelay, root, scene]);
}
