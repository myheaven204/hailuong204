import { useContext, useEffect, useRef, useState } from 'react';
import { filmUrl, type FilmSource } from '../content';
import Icon from '../Icon';
import Image from '../Image';
import { createFilmPlayer, type FilmController } from './filmPlayer';
import { GalleryPreferences } from './preferences';

type FilmStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'error';

export default function ProjectFilm({ film, poster, title }: { film?: FilmSource; poster: string; title: string }) {
  const root = useRef<HTMLElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<FilmController>();
  const [status, setStatus] = useState<FilmStatus>('loading');
  const [presented, setPresented] = useState(false);
  const { enabled } = useContext(GalleryPreferences);
  const provider = film?.provider;
  const videoId = film?.id;

  useEffect(() => {
    const target = host.current;
    const figure = root.current;
    if (!provider || !videoId || !target || !figure) return;
    let cancelled = false;
    let failed = false;
    let visible = false;
    let started = false;
    let timeout = 0;
    let ready = false;
    let autoplayAttempted = false;
    let player: FilmController | undefined;
    setStatus('loading');
    setPresented(false);
    const usable = () => {
      const phase = figure.closest('.mg-layout')?.getAttribute('data-mg-transition');
      return visible && !document.hidden && document.body.style.overflow !== 'hidden' && (!phase || phase === 'idle');
    };
    const syncPlayback = () => {
      if (cancelled || failed) return;
      if (!started && usable()) initialize();
      if (!ready || !player) return;
      if (!usable()) void player.pause().catch(() => undefined);
      else if (enabled && !autoplayAttempted) {
        autoplayAttempted = true;
        void player.play(true).catch(() => { if (!cancelled && !failed) setStatus('paused'); });
      }
    };
    const fail = () => { if (!cancelled) { failed = true; setPresented(false); setStatus('error'); void player?.pause().catch(() => undefined); } };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncPlayback(); }, { threshold: 0.15 });
    observer.observe(figure);
    document.addEventListener('visibilitychange', syncPlayback);
    const lockObserver = new MutationObserver(syncPlayback);
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    const layout = figure.closest('.mg-layout');
    if (layout) lockObserver.observe(layout, { attributes: true, attributeFilter: ['data-mg-transition'] });
    function initialize() {
      if (!provider || !videoId || !target) return;
      started = true;
      const child = document.createElement('div');
      target.append(child);
      timeout = window.setTimeout(fail, 30000);
      void createFilmPlayer(child, { provider, id: videoId, title, kind: 'Project film' }, {
        playing: () => { if (!cancelled && !failed) { setPresented(true); setStatus('playing'); syncPlayback(); } },
        paused: () => { if (!cancelled && !failed) setStatus('paused'); },
        failed: fail,
        blocked: () => { if (!cancelled && !failed) setStatus('paused'); },
      }).then(async instance => {
        if (cancelled) { void instance.ready.catch(() => undefined); instance.destroy(); return; }
        player = instance;
        controller.current = instance;
        await instance.ready;
        if (cancelled || failed) return;
        ready = true;
        window.clearTimeout(timeout);
        const iframe = target.querySelector('iframe');
        if (iframe) {
          iframe.title = title + ' — original project film';
          iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        }
        setStatus('ready');
        if (!enabled) setPresented(true);
        syncPlayback();
      }).catch(() => { if (!cancelled) fail(); });
      }
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      observer.disconnect();
      lockObserver.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      if (controller.current === player) controller.current = undefined;
      player?.destroy();
      target.replaceChildren();
    };
  }, [enabled, provider, videoId, title]);

  useEffect(() => {
    const iframe = host.current?.querySelector('iframe');
    if (iframe) iframe.tabIndex = presented ? 0 : -1;
  }, [presented, status]);

  const togglePlayback = () => {
    if (status === 'playing') void controller.current?.pause().catch(() => setStatus('paused'));
    else void controller.current?.play().catch(() => setStatus('paused'));
  };
  const loaded = status === 'ready' || status === 'playing' || status === 'paused';

  return <figure className="mg-project-film" ref={root} data-film-status={film ? status : 'missing'} data-film-provider={provider}>
    <div className="mg-film-screen" aria-label={title + ' — ' + (film ? 'original film' : 'selected project frame')}>
      <Image src={poster} alt={loaded ? '' : title + ' — selected project frame'} loading="eager" fetchPriority="high" sizes="(max-width: 760px) 92vw, 80vw" />
      {film && <div className="mg-film-host" ref={host} data-ready={loaded} data-presented={presented} />}
      {film && !loaded && <div className="mg-film-loading" role="status">{status === 'error' ? 'Preview unavailable here. Open the original film below.' : 'Loading original film…'}</div>}
    </div>
    <figcaption className="mg-film-toolbar">
      <span className="mg-film-caption">{film ? 'THE ORIGINAL FILM' : 'SELECTED PROJECT FRAME'}<small>{film ? 'Use player controls for sound & fullscreen.' : 'Film will be added to this project.'}</small></span>
      {film && <div className="mg-film-actions">{loaded && <button type="button" onClick={togglePlayback} aria-label={status === 'playing' ? 'Pause project film' : 'Play project film'}>{status === 'playing' ? <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg> : <Icon name="play" />}{status === 'playing' ? 'Pause' : 'Play'}</button>}<a href={filmUrl(film)} target="_blank" rel="noreferrer">Open original film <Icon name="arrow" /></a></div>}
      {!film && <a href="#mg-frames">Explore the frames <Icon name="arrow" /></a>}
    </figcaption>
  </figure>;
}
