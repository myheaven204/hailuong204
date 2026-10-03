import { lazy, Suspense, useCallback, useRef, useState } from 'react';
import { brandNames, number, PORTRAIT, projectGenre, type FilmSource } from '../content';
import type { MediaContent } from '../MediaDialog';
import Image from '../Image';
import Icon from '../Icon';
import MotionHero from './MotionHero';
import MotionMedia from './MotionMedia';
import MotionLink from './MotionLink';
import MotionArchive from './MotionArchive';
import MotionContact from './MotionContact';
import MotionBreakdowns from './MotionBreakdowns';
import MotionShowreel from './MotionShowreel';
import ScrollSeal from './ScrollSeal';
import useGalleryMotion from './useGalleryMotion';
import { GALLERY_PATH, GALLERY_PROJECTS, PROJECT_COUNT } from './data';

const MediaDialog = lazy(() => import('../MediaDialog'));

export default function MotionHome() {
  const root = useRef<HTMLElement>(null);
  const [media, setMedia] = useState<MediaContent | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const closeMedia = useCallback(() => setMedia(null), []);
  const openFilm = useCallback((film: FilmSource) => setMedia({ kind: 'film', film }), []);
  useGalleryMotion(root, 'home');

  return <main id="main-content" className="mg-page mg-home" ref={root} tabIndex={-1}>
    <MotionHero />
    <div className="mg-brand-strip"><p>Selected brands in the project archive</p><div className="mg-brand-window"><div className="mg-brand-track">{[0, 1].map(copy => <div className="mg-brand-set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined}>{brandNames.map(brand => <span key={brand}>{brand}<span className="mg-brand-dot" aria-hidden="true">✳</span></span>)}</div>)}</div></div></div>
    <section id="about" className="mg-intro mg-shell" aria-labelledby="mg-about-title">
      <div className="mg-intro-portrait"><div className="mg-portrait-frame" data-mg-parallax><Image src={PORTRAIT} alt="Hai Luong — VFX compositor" loading="lazy" sizes="(max-width: 760px) 90vw, 40vw" width={1400} height={1867} /><span className="mg-portrait-caption">Hai Luong / The artist</span></div><span className="mg-portrait-note">Behind the frame.<br />Inside the detail.</span></div>
      <div className="mg-intro-copy"><p className="mg-small-label">01 / The artist</p><h2 id="mg-about-title" className="mg-display" data-mg-reveal>I MAKE THE<br />IMPOSSIBLE<br /><span className="mg-outline">FEEL REAL.</span></h2><p className="mg-intro-description">I’m Hai Luong, a VFX Compositor based in Ho Chi Minh City. I specialize in compositing, cleanup, camera tracking, and motion design for commercials and music videos.</p><a href="#contact" className="mg-button">Let’s talk <Icon name="arrow" /></a></div>
    </section>
    <MotionShowreel onPlay={openFilm} />
    <section id="work" className="mg-stack" aria-labelledby="mg-work-title"><div className="mg-stack-pin mg-shell">
      <div className="mg-section-label"><span>03 / Selected work</span><a href="#archive" className="mg-work-archive">The full archive <span>{PROJECT_COUNT}</span><Icon name="arrow" /></a></div>
      <h2 id="mg-work-title" className="mg-display mg-stack-title">SELECTED <span className="mg-outline">WORK.</span></h2>
      <div className="mg-stack-list">
        {GALLERY_PROJECTS.map((project, index) => <article className={'mg-stack-card mg-stack-color-' + index} key={project.id} data-project={project.id}>
          <MotionLink className="mg-tilt-surface" to={GALLERY_PATH + 'project/' + project.id}
            data-mg-cursor="VIEW PROJECT →"
            onPointerEnter={() => setHovered(project.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(project.id)} onBlur={() => setHovered(null)}>
            <div className="mg-stack-image"><MotionMedia project={project} active={hovered === project.id} /><span className="mg-stack-open">Explore project <Icon name="arrow" /></span></div>
            <div className="mg-stack-caption"><div><p>{number(index + 1)} / {projectGenre(project)} / {project.year}</p><h3>{project.title}</h3></div><div className="mg-stack-role"><span>{project.role}</span><Icon name="arrow" /></div></div>
          </MotionLink>
        </article>)}
      </div>
      <ScrollSeal />
      <div className="mg-stack-footer"><div className="mg-stack-count"><span data-stack-count>01</span><span>/ {number(GALLERY_PROJECTS.length)}</span><div className="mg-stack-progress"><span /></div></div><span className="mg-stack-instruction">Scroll through the frames</span></div>
    </div></section>
    <MotionBreakdowns onPlay={openFilm} />
    <MotionArchive />
    <MotionContact />
    {media && <Suspense fallback={<div className="viewer-opening" role="status">Opening the viewer…</div>}><MediaDialog content={media} onClose={closeMedia} /></Suspense>}
  </main>;
}
