import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Icon from './Icon';
import Image from './Image';
import { embedUrl, filmUrl, mediaSource, number, type FilmSource } from './content';
import dimensions from '../data/media-dimensions.json';

export type MediaContent = { kind: 'film'; film: FilmSource } | { kind: 'gallery'; title: string; frames: string[]; index: number };

export default function MediaDialog({ content, onClose }: { content: MediaContent; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [frameIndex, setFrameIndex] = useState(content.kind === 'gallery' ? content.index : 0);
  const [loaded, setLoaded] = useState(false);
  const title = content.kind === 'film' ? content.film.title : content.title;
  useEffect(() => {
    const current = dialog.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    current?.showModal();
    return () => {
      current?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (content.kind !== 'gallery' || content.frames.length < 2) return;
    const neighbours = new Set([(frameIndex + content.frames.length - 1) % content.frames.length, (frameIndex + 1) % content.frames.length]);
    const previews = Array.from(neighbours).map(index => {
      const source = content.frames[index];
      const local = mediaSource(source);
      const width = (dimensions as Record<string, { width: number }>)[source]?.width ?? 1800;
      const preview = new window.Image();
      preview.decoding = 'async';
      preview.fetchPriority = 'low';
      preview.sizes = '(max-width: 760px) 100vw, 1120px';
      if (local.startsWith('/media/') && width > 640) preview.srcset = local.replace('.webp', '-640.webp') + ' 640w, ' + local + ' ' + width + 'w';
      preview.src = local;
      void preview.decode().catch(() => undefined);
      return preview;
    });
    return () => previews.forEach(preview => { preview.removeAttribute('srcset'); preview.removeAttribute('src'); });
  }, [content, frameIndex]);
  const stepFrame = (direction: number) => {
    if (content.kind === 'gallery') setFrameIndex(current => (current + direction + content.frames.length) % content.frames.length);
  };
  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  };
  return <dialog ref={dialog} className={'media-dialog ' + (content.kind === 'gallery' ? 'gallery-dialog' : '')} aria-labelledby="media-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }} onClick={onBackdropClick}
    onKeyDown={event => {
      if (content.kind !== 'gallery' || event.target instanceof HTMLButtonElement && (event.key === 'Enter' || event.key === ' ')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); stepFrame(event.key === 'ArrowRight' ? 1 : -1); }
    }}>
    <div className="dialog-heading"><div><span className="eyebrow">{content.kind === 'film' ? content.film.kind : 'Frame viewer'}</span><h2 id="media-dialog-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close viewer" autoFocus><Icon name="close" /></button></div>
    {content.kind === 'film' ? <>
      <div className="video-stage">
        {!loaded && <div className="video-loading" role="status">Opening the player…</div>}
        <iframe src={embedUrl(content.film)} title={content.film.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onLoad={() => setLoaded(true)} />
      </div>
      <div className="dialog-footer"><p>Hosted on {content.film.provider === 'youtube' ? 'YouTube' : 'Vimeo'}. If the player is unavailable, watch at the source.</p><a className="text-link" href={filmUrl(content.film)} target="_blank" rel="noreferrer">Open original <Icon name="arrow" /></a></div>
    </> : <>
      <div className="lightbox-stage"><Image src={content.frames[frameIndex]} alt={title + ' — selected frame ' + number(frameIndex + 1)} sizes="(max-width: 760px) 100vw, 1120px" /></div>
      <div className="dialog-footer"><p aria-live="polite">FRAME {number(frameIndex + 1)} / {number(content.frames.length)}</p><div className="viewer-controls"><button className="icon-button" aria-label="Previous frame" onClick={() => stepFrame(-1)}><Icon name="left" /></button><button className="icon-button" aria-label="Next frame" onClick={() => stepFrame(1)}><Icon name="right" /></button></div></div>
    </>}
  </dialog>;
}
