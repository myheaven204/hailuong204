import { useState } from 'react';
import { number, type FilmSource } from '../content';
import Image from '../Image';
import Icon from '../Icon';
import MotionMedia from './MotionMedia';
import { GALLERY_BREAKDOWNS, GALLERY_BREAKDOWN_COUNT, GALLERY_EXTRA_BREAKDOWNS, GALLERY_FILM_POSTERS, GALLERY_PROJECT_FILMS } from './data';

export default function MotionBreakdowns({ onPlay }: { onPlay: (film: FilmSource) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return <section id="breakdowns" className="mg-breakdowns mg-shell" aria-labelledby="mg-breakdown-title">
    <div className="mg-section-label"><span>04 / A closer look</span><span>{number(GALLERY_BREAKDOWN_COUNT)} breakdown films / Compositing in motion</span></div>
    <div className="mg-breakdown-heading"><h2 id="mg-breakdown-title" className="mg-display" data-mg-reveal>THE IMAGE.<br /><span className="mg-outline">THE CRAFT.</span></h2><div className="mg-breakdown-intro"><p>Look beyond the finished frame.<br />Watch the compositing breakdowns.</p><a href="#showreel">Explore the studio reel <Icon name="arrow" /></a></div></div>
    <div className="mg-breakdown-grid">{GALLERY_BREAKDOWNS.map(({ project, film }, index) => <button key={project.id} className={'mg-breakdown-card mg-breakdown-color-' + index} data-mg-tilt data-mg-cursor="WATCH BREAKDOWN ↗" onClick={() => onPlay(film)}
      onPointerEnter={() => setHovered(project.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(project.id)} onBlur={() => setHovered(null)}>
      <span className="mg-tilt-surface"><span className="mg-breakdown-frame"><MotionMedia project={project} active={hovered === project.id} sizes="(max-width: 760px) 90vw, 30vw" /><span className="mg-play-disc"><Icon name="play" /></span><span className="mg-breakdown-tag">Watch breakdown</span></span><span className="mg-breakdown-caption"><span>{project.client}</span><span>VFX breakdown <Icon name="arrow" /></span></span></span>
    </button>)}</div>
    {GALLERY_EXTRA_BREAKDOWNS.length > 0 && <div className="mg-breakdown-more" aria-labelledby="mg-more-breakdowns-title">
      <div className="mg-film-index-heading"><h3 id="mg-more-breakdowns-title">More to unpack.</h3><span>{number(GALLERY_EXTRA_BREAKDOWNS.length)} more breakdown {GALLERY_EXTRA_BREAKDOWNS.length === 1 ? 'film' : 'films'}</span></div>
      {GALLERY_EXTRA_BREAKDOWNS.map((film, index) => {
        const poster = GALLERY_FILM_POSTERS[film.id];
        return <button key={film.provider + film.id} className="mg-breakdown-extra" aria-label={'Watch ' + film.title} data-mg-cursor="WATCH BREAKDOWN ↗" onClick={() => onPlay(film)}>
          <span className="mg-extra-frame">{poster ? <Image {...poster} alt={'Preview frame from ' + film.title} sizes="(max-width: 760px) 90vw, 40vw" loading="lazy" /> : <span className="mg-extra-placeholder">VFX breakdown</span>}<span className="mg-play-disc"><Icon name="play" /></span><span className="mg-breakdown-tag">Watch breakdown</span></span>
          <span className="mg-extra-copy"><span className="mg-small-label">{number(GALLERY_BREAKDOWNS.length + index + 1)} / VFX breakdown</span><span className="mg-extra-name">{film.title.split(' — ')[0]}</span><span className="mg-extra-description">Another look behind the finished frame.</span><span className="mg-extra-action">Watch breakdown <Icon name="arrow" /></span></span>
        </button>;
      })}
    </div>}
    <div className="mg-film-library" aria-labelledby="mg-film-index-title">
      <div className="mg-film-index-heading"><h3 id="mg-film-index-title">The film index.</h3><span>{number(GALLERY_PROJECT_FILMS.length)} original project films</span></div>
      <div className="mg-film-items">{GALLERY_PROJECT_FILMS.map(film => <button key={film.provider + film.id} aria-label={'Watch ' + film.title} data-mg-cursor="WATCH FILM →" onClick={() => onPlay(film)}><span><span>Project film / {film.provider === 'youtube' ? 'YouTube' : 'Vimeo'}</span><span>{film.title}</span></span><Icon name="play" /></button>)}</div>
    </div>
  </section>;
}
