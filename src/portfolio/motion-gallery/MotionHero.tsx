import { useContext, useEffect, useRef, useState } from 'react';
import { mediaSource, projectFrames } from '../content';
import Icon from '../Icon';
import HeroPreview from './HeroPreview';
import MotionLink from './MotionLink';
import HeroFrames from './HeroFrames';
import { compactFrame, galleryProjectCover } from './mediaQuality';
import { GalleryPreferences } from './preferences';
import { archiveRange, GALLERY_PATH, GALLERY_PROJECTS } from './data';

const HERO_PRINTS = [GALLERY_PROJECTS[2], GALLERY_PROJECTS[0], GALLERY_PROJECTS[1]].map(project => ({
  project,
  frames: [...new Map([galleryProjectCover(project), ...projectFrames(project).filter(source => !compactFrame(source))]
    .map(source => [mediaSource(source), source])).values()],
}));

function PressureWord({ word }: { word: string }) {
  return <>{Array.from(word).map((character, index) => <span className="mg-pressure-char" key={index}>
    <span className="mg-pressure-solid">{character === ' ' ? ' ' : character}</span>
    <span className="mg-pressure-visual">{character === ' ' ? ' ' : character}</span>
  </span>)}</>;
}

export default function MotionHero() {
  const hero = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const { enabled } = useContext(GalleryPreferences);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = hero.current;
    if (!element) return;
    let intersects = false;
    const updateVisibility = () => setVisible(intersects && !document.hidden);
    const observer = new IntersectionObserver(entries => {
      intersects = entries[0].isIntersecting;
      updateVisibility();
    });
    observer.observe(element);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return <section ref={hero} className="mg-hero mg-shell" aria-labelledby="mg-page-title">
    <div className="mg-hero-kicker mg-section-label"><span>Hai Luong / VFX compositor</span><span>Selected portfolio / {archiveRange}</span></div>
    <h1 id="mg-page-title" className="mg-hero-title mg-display" aria-label="Beyond the frame." tabIndex={-1}>
      <span className="mg-line" aria-hidden="true"><span className="mg-line-inner"><PressureWord word="BEYOND" /></span></span>
      <span className="mg-line mg-outline" aria-hidden="true"><span className="mg-line-inner"><PressureWord word="THE FRAME." /></span></span>
    </h1>
    <div className="mg-hero-gallery">
      {HERO_PRINTS.map(({ project, frames }, index) => <MotionLink key={project.id} to={GALLERY_PATH + 'project/' + project.id}
        className={'mg-hero-print mg-print-' + index} aria-label={'Explore ' + project.title} data-mg-cursor="VIEW PROJECT →"
        onPointerEnter={() => setHovered(project.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(project.id)} onBlur={() => setHovered(null)}>
        <HeroFrames frames={frames} index={index} running={enabled && visible && !paused && hovered !== project.id} sizes={index === 1 ? '(max-width: 760px) 75vw, 40vw' : '(max-width: 760px) 28vw, 22vw'} />
        <span className="mg-print-caption"><span>{project.client}</span><span>{project.year} ↗</span></span>
      </MotionLink>)}
    </div>
    <div className="mg-hero-bottom"><div className="mg-hero-info"><p>Compositing.<br />Matchmoving. Motion design.</p>{enabled && <button type="button" className="mg-frame-control" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label="Pause automatic hero images"><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>{paused ? 'Play frames' : 'Pause frames'}</button>}</div><a href="#work" className="mg-scroll-link"><span>Scroll to explore</span><span className="mg-round-arrow"><Icon name="down" /></span></a><p>Ho Chi Minh City<br />Vietnam</p></div>
    <HeroPreview hero={hero} />
  </section>;
}
