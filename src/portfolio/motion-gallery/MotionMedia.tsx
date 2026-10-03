import { useContext, useEffect, useRef, useState } from 'react';
import type { Project } from '../../data/projects';
import Image from '../Image';
import { galleryProjectCover } from './mediaQuality';
import { PREVIEW_CLIPS } from './data';
import { GalleryPreferences } from './preferences';

export default function MotionMedia({ project, active = false, eager = false, sizes = '(max-width: 760px) 90vw, 70vw', priority = eager ? 'high' : 'auto' }: {
  project: Project; active?: boolean; eager?: boolean; sizes?: string; priority?: 'high' | 'low' | 'auto';
}) {
  const host = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const { enabled } = useContext(GalleryPreferences);
  const clip = PREVIEW_CLIPS[project.id];

  useEffect(() => {
    if (!clip) return;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { rootMargin: '80px' });
    if (host.current) observer.observe(host.current);
    return () => observer.disconnect();
  }, [clip]);

  useEffect(() => {
    if (!clip || failed) return;
    const shouldPlay = active && visible && enabled;
    if (shouldPlay && !activated) { setActivated(true); return; }
    if (shouldPlay) void video.current?.play().catch(() => setPlaying(false));
    else {
      video.current?.pause();
      if (video.current && video.current.readyState > 0) video.current.currentTime = 0;
      setPlaying(false);
    }
  }, [active, activated, clip, enabled, failed, visible]);

  return <div ref={host} className={'mg-media' + (playing ? ' is-playing' : '')}>
    <Image src={galleryProjectCover(project)} alt={project.title + ' — selected project frame'}
      loading={eager ? 'eager' : 'lazy'} fetchPriority={priority}
      width={1800} height={1013} sizes={sizes} />
    {clip && !failed && <video ref={video} src={activated ? clip.src : undefined} muted loop playsInline preload="none"
      aria-hidden="true" tabIndex={-1} disablePictureInPicture
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />}
  </div>;
}
