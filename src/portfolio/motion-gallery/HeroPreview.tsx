import { useContext, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { gsap } from 'gsap';
import { number } from '../content';
import MotionMedia from './MotionMedia';
import { GALLERY_PROJECTS, PREVIEW_CLIPS } from './data';
import { GalleryPreferences } from './preferences';

const POINTER_QUERY = '(min-width: 992px) and (hover: hover) and (pointer: fine)';
const hasFinePointer = () => window.matchMedia(POINTER_QUERY).matches;
const noServerPointer = () => false;
const subscribeToPointer = (notify: () => void) => {
  const query = window.matchMedia(POINTER_QUERY);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};

type PointerSample = { x: number; y: number; time: number; blocked: boolean };

export default function HeroPreview({ hero }: { hero: RefObject<HTMLElement> }) {
  const cursor = useRef<HTMLDivElement>(null);
  const cursorMedia = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(0);
  const [following, setFollowing] = useState(false);
  const { enabled } = useContext(GalleryPreferences);
  const finePointer = useSyncExternalStore(subscribeToPointer, hasFinePointer, noServerPointer);
  const interactive = enabled && finePointer;
  const activeProject = GALLERY_PROJECTS[preview];

  useEffect(() => {
    const host = hero.current;
    const card = cursor.current;
    const picture = cursorMedia.current;
    if (!interactive || !host || !card || !picture) return;
    const layers = Array.from(picture.querySelectorAll<HTMLElement>('.mg-cursor-layer'));
    const letters = Array.from(host.querySelectorAll<HTMLElement>('.mg-pressure-char'));
    const faces = letters.map(letter => letter.querySelector<HTMLElement>('.mg-pressure-visual')!);
    gsap.set(card, { x: 0, y: 0, rotation: 0, scale: 0.96, opacity: 0, force3D: true });
    const xTo = gsap.quickTo(card, 'x', { duration: 1, ease: 'power4.out' });
    const yTo = gsap.quickTo(card, 'y', { duration: 1, ease: 'power4.out' });
    const rotationTo = gsap.quickTo(card, 'rotation', { duration: 1, ease: 'power4.out' });
    const mediaXTo = gsap.quickTo(picture, 'xPercent', { duration: 0.6, ease: 'power2.out' });
    const mediaYTo = gsap.quickTo(picture, 'yPercent', { duration: 0.7, ease: 'power2.out' });
    const weights = faces.map(face => gsap.quickTo(face, 'fontWeight', { duration: 0.4, ease: 'power2.out' }));
    const visibility = gsap.to(card, { opacity: 1, scale: 1, duration: 0.32, ease: 'power2.out', paused: true });
    const readiness = layers.map(() => false);
    const lastWeights = letters.map(() => 850);
    let geometry = { left: 0, top: 0, width: 0, height: 0, cardWidth: 310, cardHeight: 200 };
    let centers: Array<{ x: number; y: number }> = [];
    let pending: PointerSample | null = null;
    let previous: PointerSample | null = null;
    let currentIndex = -1;
    let pendingIndex: number | null = null;
    let distance = 0;
    let lastMove = 0;
    let resumeAfter = 0;
    let resting = true;
    let showing = false;
    let disposed = false;

    const measure = () => {
      const bounds = host.getBoundingClientRect();
      geometry = { left: bounds.left + window.scrollX, top: bounds.top + window.scrollY, width: bounds.width, height: bounds.height, cardWidth: card.offsetWidth, cardHeight: card.offsetHeight };
      centers = letters.map(letter => {
        const rect = letter.getBoundingClientRect();
        const displacement = Number(gsap.getProperty(letter, 'y')) + rect.height * Number(gsap.getProperty(letter, 'yPercent')) / 100;
        return { x: rect.left - bounds.left + rect.width / 2, y: rect.top - bounds.top + rect.height / 2 - displacement };
      });
    };
    const showFrame = (index: number) => {
      if (index === currentIndex) return;
      pendingIndex = index;
      if (!readiness[index]) return;
      const initial = currentIndex < 0 || !showing;
      currentIndex = index;
      pendingIndex = null;
      layers.forEach((layer, layerIndex) => {
        gsap.set(layer, { zIndex: layerIndex === index ? 1 : 0 });
        gsap.to(layer, { opacity: layerIndex === index ? 1 : 0, duration: initial ? 0 : 0.28, ease: 'power2.out', overwrite: 'auto' });
      });
      setPreview(index);
    };
    const neutral = () => { rotationTo(0); mediaXTo(0); mediaYTo(0); resting = true; };
    const hide = () => {
      pending = null;
      previous = null;
      distance = 0;
      if (!showing) return;
      neutral();
      lastWeights.forEach((weight, index) => {
        if (weight === 850) return;
        weights[index](850);
        lastWeights[index] = 850;
      });
      showing = false;
      setFollowing(false);
      visibility.reverse();
    };
    const renderPointer = (time: number) => {
      const point = pending;
      if (!point) {
        if (showing && !resting && time - lastMove > 0.066) neutral();
        return;
      }
      if (point.blocked) { hide(); return; }
      if (currentIndex < 0) return;
      pending = null;
      const localX = point.x - geometry.left + window.scrollX;
      const localY = point.y - geometry.top + window.scrollY;
      const destinationX = gsap.utils.clamp(24, geometry.width - geometry.cardWidth - 24, localX - geometry.cardWidth / 2);
      const destinationY = gsap.utils.clamp(100, geometry.height - geometry.cardHeight - 24, localY - 90);
      if (!showing) {
        if (visibility.progress() === 0) {
          xTo(destinationX, destinationX);
          yTo(destinationY, destinationY);
          rotationTo(0, 0);
          mediaXTo(0, 0);
          mediaYTo(0, 0);
        }
        showing = true;
        setFollowing(true);
        visibility.play();
      }
      xTo(destinationX);
      yTo(destinationY);
      if (previous) {
        const deltaX = point.x - previous.x;
        const deltaY = point.y - previous.y;
        const interval = Math.max(8, point.time - previous.time);
        const velocityX = deltaX * 16.667 / interval;
        const velocityY = deltaY * 16.667 / interval;
        distance += (Math.abs(deltaX) + Math.abs(deltaY)) / 2;
        rotationTo(gsap.utils.clamp(-8, 8, velocityX / 4));
        mediaXTo(-gsap.utils.clamp(-8, 8, velocityX / 2));
        mediaYTo(-gsap.utils.clamp(-8, 8, velocityY / 2));
        if (distance >= 300) {
          distance %= 300;
          showFrame(((pendingIndex ?? currentIndex) + 1) % layers.length);
        }
      }
      previous = point;
      centers.forEach((center, index) => {
        const proximity = Math.max(0, 1 - Math.hypot(localX - center.x, localY - center.y) / 400);
        const weight = 850 - proximity * 500;
        if (Math.abs(lastWeights[index] - weight) < 1) return;
        weights[index](weight);
        lastWeights[index] = weight;
      });
      lastMove = time;
      resting = false;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || gsap.ticker.time < resumeAfter) return;
      pending = { x: event.clientX, y: event.clientY, time: event.timeStamp, blocked: event.target instanceof Element && !!event.target.closest('a, button, input, select, textarea, summary') };
    };
    const onScroll = () => { resumeAfter = gsap.ticker.time + 0.15; hide(); };
    const imageCleanups = layers.map((layer, index) => {
      const image = layer.querySelector('img');
      const ready = () => {
        if (disposed) return;
        readiness[index] = true;
        layer.dataset.ready = 'true';
        if (currentIndex < 0 && index === 0) showFrame(index);
        else if (pendingIndex === index) showFrame(index);
      };
      if (!image) {
        if (layer.querySelector('.image-unavailable')) ready();
        return () => {};
      }
      let decoding = false;
      const decode = () => {
        if (decoding || disposed) return;
        decoding = true;
        void image.decode().then(ready).catch(() => {
          decoding = false;
          if (image.complete) ready();
        });
      };
      image.addEventListener('load', decode);
      image.addEventListener('error', ready);
      if (image.complete) {
        if (image.naturalWidth) decode();
        else if (image.currentSrc) ready();
      }
      return () => { image.removeEventListener('load', decode); image.removeEventListener('error', ready); };
    });
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    measure();
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    gsap.ticker.add(renderPointer, false, true);
    host.addEventListener('pointermove', move, { passive: true });
    host.addEventListener('pointerleave', hide);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', hide);
    document.addEventListener('visibilitychange', hide);

    return () => {
      disposed = true;
      observer.disconnect();
      imageCleanups.forEach(cleanup => cleanup());
      gsap.ticker.remove(renderPointer);
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', hide);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', hide);
      document.removeEventListener('visibilitychange', hide);
      [xTo, yTo, rotationTo, mediaXTo, mediaYTo, ...weights].forEach(quick => quick.tween.kill());
      visibility.kill();
      gsap.killTweensOf([card, picture, ...layers, ...faces]);
      gsap.set([card, picture], { clearProps: 'transform,opacity,visibility' });
      gsap.set(faces, { clearProps: 'fontWeight' });
      setFollowing(false);
    };
  }, [hero, interactive]);

  return <div ref={cursor} className="mg-hero-cursor" aria-hidden="true" data-project={activeProject.id}>
    <div className="mg-cursor-window"><div ref={cursorMedia} className="mg-cursor-visual">
      {interactive && GALLERY_PROJECTS.map((project, index) => <div key={project.id} className="mg-cursor-layer" data-project={project.id}>
        <MotionMedia project={project} active={following && preview === index} eager priority="low" sizes="320px" />
      </div>)}
    </div></div>
    <div><span>{number(preview + 1)} / {activeProject.client}</span><span>{PREVIEW_CLIPS[activeProject.id] ? 'Preview loop' : 'Selected frame'}</span></div>
  </div>;
}
