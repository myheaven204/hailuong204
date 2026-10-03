import { filmUrl, SHOWREEL, type FilmSource } from '../content';
import Image from '../Image';
import Icon from '../Icon';
import { GALLERY_FILM_POSTERS, GALLERY_STUDIO_REELS } from './data';

export default function MotionShowreel({ onPlay }: { onPlay: (film: FilmSource) => void }) {
  const poster = GALLERY_FILM_POSTERS[SHOWREEL.id];

  return <section id="showreel" className="mg-showreel mg-shell" aria-labelledby="mg-showreel-title">
    <div className="mg-section-label"><span>02 / The studio reel</span><span>SPICE fx / 2026</span></div>
    <div className="mg-showreel-heading"><h2 id="mg-showreel-title" className="mg-display" data-mg-reveal>SHOW<span className="mg-outline">REEL</span></h2><div className="mg-showreel-intro"><span className="mg-showreel-year">2026</span><p>A collection of the studio’s work,<br />presented in its original form.</p></div></div>
    <button className="mg-showreel-screen" aria-label={'Watch ' + SHOWREEL.title} data-mg-cursor="WATCH STUDIO REEL →" onClick={() => onPlay(SHOWREEL)}>
      {poster && <Image {...poster} alt="Preview frame from SPICE fx — Studio Showreel 2026" sizes="(max-width: 760px) 90vw, 92vw" loading="lazy" />}
      <span className="mg-showreel-screen-meta" aria-hidden="true"><span>SPICE fx / Studio showreel</span><span>2026</span></span>
      <span className="mg-showreel-play" aria-hidden="true"><span><Icon name="play" /></span><span>Play the studio reel</span></span>
      <span className="mg-showreel-screen-caption" aria-hidden="true">THE STUDIO.<br />IN MOTION.</span>
    </button>
    <div className="mg-showreel-footer"><p>Studio reel · credited to SPICE fx.<br /><span>Presented separately from Hai Luong’s individual project credits.</span></p><a href={filmUrl(SHOWREEL)} target="_blank" rel="noreferrer">Open original film <Icon name="arrow" /></a></div>
    {GALLERY_STUDIO_REELS.length > 0 && <div className="mg-earlier-reels" aria-labelledby="mg-earlier-reels-title"><h3 id="mg-earlier-reels-title">Earlier studio reels</h3><div>{GALLERY_STUDIO_REELS.map(film => <button key={film.provider + film.id} aria-label={'Watch ' + film.title} data-mg-cursor="WATCH STUDIO REEL →" onClick={() => onPlay(film)}><span>{film.title}</span><Icon name="play" /></button>)}</div></div>}
  </section>;
}
