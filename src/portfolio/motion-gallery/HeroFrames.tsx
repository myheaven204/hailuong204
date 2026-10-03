import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from '../Image';

type FrameLoad = { index: number; resolve: (ready: boolean) => void };

export default function HeroFrames({ frames, index, running, sizes }: {
  frames: readonly string[]; index: number; running: boolean; sizes: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const front = useRef(0);
  const currentSource = useRef(frames[0]);
  const queue = useRef<string[]>([]);
  const loading = useRef<FrameLoad | null>(null);
  const playback = useRef<((playing: boolean) => void) | null>(null);
  const [layers, setLayers] = useState<Array<string | null>>(() => [frames[0], null]);

  const finishLoading = useCallback(async (layerIndex: number, image: HTMLImageElement) => {
    const request = loading.current;
    if (!request || request.index !== layerIndex) return;
    try {
      await image.decode();
      if (loading.current === request) request.resolve(image.naturalWidth > 0);
    } catch {
      if (loading.current === request) request.resolve(false);
    }
  }, []);

  useEffect(() => {
    const request = loading.current;
    if (!request) return;
    const image = host.current?.children[request.index].querySelector('img');
    if (image?.complete) void finishLoading(request.index, image);
  }, [layers, finishLoading]);

  useEffect(() => {
    const element = host.current;
    if (!element || frames.length < 2) return;
    const surfaces = Array.from(element.children);
    const failed = new Set<string>();
    let disposed = false;
    let playing = false;
    let timer = 0;
    let loadTimer = 0;
    let transition: gsap.core.Tween | undefined;
    const delay = 7000 + index * 1100;
    const schedule = () => {
      window.clearTimeout(timer);
      if (playing && !disposed) timer = window.setTimeout(() => { void advance(); }, delay);
    };
    const advance = async () => {
      if (disposed || !playing) return;
      if (!queue.current.length) {
        queue.current = frames.filter(source => source !== currentSource.current && !failed.has(source));
        for (let position = queue.current.length - 1; position > 0; position--) {
          const randomPosition = Math.floor(Math.random() * (position + 1));
          [queue.current[position], queue.current[randomPosition]] = [queue.current[randomPosition], queue.current[position]];
        }
      }
      const source = queue.current.shift();
      if (!source) return;
      const incoming = 1 - front.current;
      const outgoing = front.current;
      gsap.set(surfaces[incoming], { opacity: 0, zIndex: 2 });
      const ready = await new Promise<boolean>(resolve => {
        loading.current = { index: incoming, resolve };
        loadTimer = window.setTimeout(() => resolve(false), 10000);
        setLayers(previous => previous.map((value, layerIndex) => layerIndex === incoming ? source : value));
      });
      window.clearTimeout(loadTimer);
      if (disposed) return;
      loading.current = null;
      if (!playing) {
        queue.current.unshift(source);
        return;
      }
      if (!ready) {
        failed.add(source);
        queue.current = queue.current.filter(candidate => candidate !== source);
        schedule();
        return;
      }
      gsap.set(surfaces[incoming], { willChange: 'opacity' });
      transition = gsap.to(surfaces[incoming], {
        opacity: 1, duration: 1.5, ease: 'sine.inOut',
        onComplete: () => {
          gsap.set(surfaces[outgoing], { opacity: 0, zIndex: 0 });
          gsap.set(surfaces[incoming], { zIndex: 1, clearProps: 'willChange' });
          front.current = incoming;
          currentSource.current = source;
          transition = undefined;
          schedule();
        },
      });
    };
    playback.current = value => {
      playing = value;
      window.clearTimeout(timer);
      if (!transition && !loading.current) schedule();
    };
    return () => {
      disposed = true;
      playback.current = null;
      window.clearTimeout(timer);
      window.clearTimeout(loadTimer);
      loading.current?.resolve(false);
      loading.current = null;
      transition?.kill();
      surfaces.forEach((surface, layerIndex) => gsap.set(surface, {
        opacity: layerIndex === front.current ? 1 : 0,
        zIndex: layerIndex === front.current ? 1 : 0,
        clearProps: 'willChange',
      }));
    };
  }, [frames, index]);

  useEffect(() => { playback.current?.(running); }, [running, frames, index]);

  return <div ref={host} className="mg-media mg-hero-frames" aria-hidden="true">
    {layers.map((source, layerIndex) => <div className="mg-hero-frame" key={layerIndex} style={{ opacity: layerIndex === 0 ? 1 : 0 }}>
      {source && <Image src={source} alt="" width={1800} height={1013} sizes={sizes}
        loading="eager" fetchPriority={layerIndex === 0 && index === 1 ? 'high' : 'low'}
        onLoad={event => { void finishLoading(layerIndex, event.currentTarget); }}
        onError={() => { if (loading.current?.index === layerIndex) loading.current.resolve(false); }} />}
    </div>)}
  </div>;
}
