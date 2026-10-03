import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryMotion } from './motion';

export default function createGalleryStack(element: HTMLElement) {
  const stack = element.querySelector<HTMLElement>('.mg-stack');
  const pin = stack?.querySelector<HTMLElement>('.mg-stack-pin');
  const surface = stack?.querySelector<HTMLElement>('.mg-stack-list');
  const cards = Array.from(stack?.querySelectorAll<HTMLElement>('.mg-stack-card') ?? []);
  if (!stack || !pin || !surface || cards.length < 2) return;
  const counter = stack.querySelector('[data-stack-count]');
  const progress = stack.querySelector('.mg-stack-progress > span');
  const seal = stack.querySelector('[data-mg-scroll-seal]');
  const originalLength = stack.style.getPropertyValue('--mg-stack-length');
  const originalPriority = stack.style.getPropertyPriority('--mg-stack-length');
  stack.style.setProperty('--mg-stack-length', String(1 + (cards.length - 1) * galleryMotion.stackScroll));
  stack.dataset.stacked = 'true';
  let viewportHeight = pin.clientHeight;
  let active = -1;
  const resetCards = () => cards.forEach((card, index) => gsap.set(card, {
    y: -index * galleryMotion.stackOffset, z: -index * galleryMotion.stackDepth,
    rotation: 0, autoAlpha: 1, zIndex: cards.length - index, force3D: true,
  }));
  const select = (time: number) => {
    const next = Math.min(cards.length - 1, Math.floor(time + 0.05));
    if (next === active) return;
    active = next;
    if (counter) counter.textContent = String(active + 1).padStart(2, '0');
    stack.dataset.activeProject = cards[active].dataset.project;
    cards.forEach((card, index) => { card.inert = index !== active; });
  };
  resetCards();
  const sequence = gsap.timeline({ paused: true, onUpdate: () => select(sequence.time()) });
  cards.forEach((card, index) => {
    if (index === cards.length - 1) return;
    sequence.fromTo(card, { y: 0 }, { y: () => viewportHeight * 0.9, duration: 1, ease: 'power2.in', immediateRender: false }, index);
    sequence.fromTo(card, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.25, ease: 'none', immediateRender: false }, index + 0.7);
    cards.slice(index + 1).forEach((nextCard, nextIndex) => {
      sequence.fromTo(nextCard, { z: -(nextIndex + 1) * galleryMotion.stackDepth, y: -(nextIndex + 1) * galleryMotion.stackOffset }, {
        z: -nextIndex * galleryMotion.stackDepth, y: -nextIndex * galleryMotion.stackOffset,
        duration: 1, ease: 'none', immediateRender: false,
      }, index);
    });
  });
  if (progress) sequence.fromTo(progress, { scaleX: 0 }, { scaleX: 1, duration: cards.length - 1, ease: 'none' }, 0);
  if (seal) sequence.fromTo(seal, { rotation: 0 }, { rotation: 180, duration: cards.length - 1, ease: 'none' }, 0);
  select(0);
  const trigger = ScrollTrigger.create({
    trigger: stack, start: 'top top', end: () => '+=' + pin.clientHeight * (cards.length - 1) * galleryMotion.stackScroll,
    pin, pinSpacing: false, anticipatePin: 1, refreshPriority: 1,
    onUpdate: state => sequence.progress(state.progress),
    onRefresh: state => {
      viewportHeight = pin.clientHeight;
      sequence.progress(0, true);
      resetCards();
      sequence.invalidate().progress(state.progress, true);
      select(sequence.time());
    },
  });
  const xTo = gsap.quickTo(surface, 'rotationX', { duration: 0.6, ease: 'power3.out' });
  const yTo = gsap.quickTo(surface, 'rotationY', { duration: 0.6, ease: 'power3.out' });
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let animation = 0;
  let bounds: DOMRect | null = null;
  let point: { x: number; y: number } | null = null;
  const tilt = () => {
    animation = 0;
    if (!point) return;
    bounds ??= pin.getBoundingClientRect();
    const horizontal = gsap.utils.clamp(-0.5, 0.5, (point.x - bounds.left) / bounds.width - 0.5);
    const vertical = gsap.utils.clamp(-0.5, 0.5, (point.y - bounds.top) / bounds.height - 0.5);
    xTo(-vertical * 6);
    yTo(horizontal * 10);
    point = null;
  };
  const move = (event: PointerEvent) => {
    if (!pointer.matches || event.pointerType === 'touch') return;
    point = { x: event.clientX, y: event.clientY };
    if (!animation) animation = requestAnimationFrame(tilt);
  };
  const leave = () => { cancelAnimationFrame(animation); animation = 0; point = null; bounds = null; xTo(0); yTo(0); };
  const resize = () => { bounds = null; };
  pin.addEventListener('pointermove', move, { passive: true });
  pin.addEventListener('pointerleave', leave);
  window.addEventListener('scroll', resize, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('blur', leave);

  return () => {
    cancelAnimationFrame(animation);
    pin.removeEventListener('pointermove', move);
    pin.removeEventListener('pointerleave', leave);
    window.removeEventListener('scroll', resize);
    window.removeEventListener('resize', resize);
    window.removeEventListener('blur', leave);
    xTo.tween.kill();
    yTo.tween.kill();
    trigger.kill();
    sequence.kill();
    gsap.killTweensOf([surface, ...cards, seal, progress].filter(Boolean));
    gsap.set([surface, ...cards, seal, progress].filter(Boolean), { clearProps: 'transform,opacity,visibility,zIndex' });
    stack.removeAttribute('data-stacked');
    stack.removeAttribute('data-active-project');
    if (originalLength) stack.style.setProperty('--mg-stack-length', originalLength, originalPriority);
    else stack.style.removeProperty('--mg-stack-length');
    cards.forEach(card => { card.inert = false; });
    if (counter) counter.textContent = '01';
  };
}
