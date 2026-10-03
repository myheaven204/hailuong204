import type { FilmSource } from '../content';

export type FilmController = { ready: Promise<unknown>; play: (muted?: boolean) => Promise<void>; pause: () => Promise<void>; destroy: () => void };
type PlayerEvents = { playing: () => void; paused: () => void; failed: () => void; blocked: () => void };
type YoutubePlayer = { playVideo: () => void; pauseVideo: () => void; mute: () => void; destroy: () => void };
type YoutubeApi = { Player: new (host: HTMLElement, options: Record<string, unknown>) => YoutubePlayer };
type VimeoPlayer = { ready: () => Promise<unknown>; play: () => Promise<void>; pause: () => Promise<void>; getEnded: () => Promise<boolean>; setCurrentTime: (seconds: number) => Promise<number>; setMuted: (muted: boolean) => Promise<boolean>; destroy: () => Promise<void>; on: (event: string, handler: () => void) => void };
type VimeoApi = { Player: new (host: HTMLElement, options: Record<string, unknown>) => VimeoPlayer };
type ProviderWindow = Window & { YT?: YoutubeApi; Vimeo?: VimeoApi; onYouTubeIframeAPIReady?: () => void };
const providerWindow = window as ProviderWindow;
let youtubeLoading: Promise<YoutubeApi> | undefined;
let vimeoLoading: Promise<VimeoApi> | undefined;

function loadApi<Api>(source: string, read: () => Api | undefined, youtube = false): Promise<Api> {
  const existing = read();
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const previousReady = providerWindow.onYouTubeIframeAPIReady;
    const timeout = window.setTimeout(() => finish(new Error('Player API timed out')), 15000);
    const ready = () => {
      const api = read();
      if (api) finish(undefined, api);
    };
    const callback = () => { previousReady?.(); ready(); };
    const finish = (error?: Error, api?: Api) => {
      window.clearTimeout(timeout);
      script.onload = null;
      script.onerror = null;
      if (youtube && providerWindow.onYouTubeIframeAPIReady === callback) providerWindow.onYouTubeIframeAPIReady = previousReady;
      if (error) { script.remove(); reject(error); }
      else if (api) resolve(api);
    };
    if (youtube) providerWindow.onYouTubeIframeAPIReady = callback;
    script.src = source;
    script.async = true;
    script.onload = ready;
    script.onerror = () => finish(new Error('Player API unavailable'));
    document.head.append(script);
  });
}

export async function createFilmPlayer(host: HTMLElement, film: FilmSource, events: PlayerEvents): Promise<FilmController> {
  if (film.provider === 'vimeo') {
    vimeoLoading ??= loadApi('https://player.vimeo.com/api/player.js', () => providerWindow.Vimeo).catch(error => { vimeoLoading = undefined; throw error; });
    const api = await vimeoLoading;
    if (!host.isConnected) throw new Error('Player was unmounted');
    const player = new api.Player(host, { id: Number(film.id), autoplay: false, muted: true, playsinline: true, controls: true, dnt: true, title: false, byline: false, portrait: false });
    player.on('play', events.playing);
    player.on('pause', events.paused);
    player.on('ended', events.paused);
    player.on('error', events.failed);
    return {
      ready: player.ready(),
      play: async (muted = false) => { if (muted) await player.setMuted(true); if (await player.getEnded()) await player.setCurrentTime(0); await player.play(); },
      pause: () => player.pause(),
      destroy: () => { void player.destroy().catch(() => undefined); },
    };
  }
  youtubeLoading ??= loadApi('https://www.youtube.com/iframe_api', () => providerWindow.YT?.Player ? providerWindow.YT : undefined, true).catch(error => { youtubeLoading = undefined; throw error; });
  const api = await youtubeLoading;
  if (!host.isConnected) throw new Error('Player was unmounted');
  let resolveReady: () => void = () => undefined;
  let rejectReady: () => void = () => undefined;
  const ready = new Promise<void>((resolve, reject) => { resolveReady = resolve; rejectReady = () => reject(new Error('YouTube film unavailable')); });
  const player = new api.Player(host, {
    host: 'https://www.youtube-nocookie.com', videoId: film.id, width: '100%', height: '100%',
    playerVars: { autoplay: 0, controls: 1, playsinline: 1, rel: 0, origin: window.location.origin },
    events: {
      onReady: resolveReady,
      onStateChange: (event: { data: number }) => {
        if (event.data === 1) events.playing();
        else if (event.data === 2 || event.data === 0) events.paused();
      },
      onAutoplayBlocked: events.blocked,
      onError: () => { rejectReady(); events.failed(); },
    },
  });
  return {
    ready,
    play: async (muted = false) => { if (muted) player.mute(); player.playVideo(); },
    pause: async () => player.pauseVideo(),
    destroy: () => player.destroy(),
  };
}
