import { lazy, Suspense, useCallback, useContext, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CHRONOLOGICAL_PROJECTS, getAdjacentProjects, getProjectById } from '../../data/projects';
import { number, projectBrand, projectFilm, projectFrames, projectGenre, projectPublishedDate, projectSummary } from '../content';
import type { MediaContent } from '../MediaDialog';
import Icon from '../Icon';
import Image from '../Image';
import MotionLink from './MotionLink';
import MotionContact from './MotionContact';
import useGalleryMotion from './useGalleryMotion';
import { GALLERY_PATH } from './data';
import { GalleryPreferences } from './preferences';
import { galleryEase } from './motion';
import ProjectFilm from './ProjectFilm';
import { compactFrame, frameDimensions, galleryProjectCover } from './mediaQuality';

const MediaDialog = lazy(() => import('../MediaDialog'));

function frameStyle(source: string): CSSProperties {
  const dimensions = frameDimensions(source);
  return dimensions ? {
    '--mg-frame-ratio': dimensions.width / dimensions.height,
    '--mg-frame-width': dimensions.width + 'px',
  } as CSSProperties : {};
}

export default function MotionProject() {
  const { id = '' } = useParams();
  const project = getProjectById(id);
  const root = useRef<HTMLElement>(null);
  const story = useRef<HTMLDivElement>(null);
  const [media, setMedia] = useState<MediaContent | null>(null);
  const closeMedia = useCallback(() => setMedia(null), []);
  const { enabled } = useContext(GalleryPreferences);
  useGalleryMotion(root, id);
  const frames = project ? projectFrames(project) : [];

  useEffect(() => { setMedia(null); }, [id]);
  useEffect(() => {
    const host = story.current;
    if (!host || !enabled) return;
    const context = gsap.context(() => {
      const match = gsap.matchMedia();
      match.add('(min-width: 992px)', () => {
        host.dataset.animated = 'true';
        const pictures = Array.from(host.querySelectorAll<HTMLElement>('.mg-story-picture'));
        const steps = Array.from(host.querySelectorAll<HTMLElement>('.mg-story-step'));
        let active = -1;
        const select = (index: number) => {
          if (active === index) return;
          const direction = active < index ? 1 : -1;
          const first = active < 0;
          active = index;
          pictures.forEach((picture, pictureIndex) => {
            if (first) { gsap.set(picture, { opacity: pictureIndex === index ? 1 : 0 }); return; }
            if (pictureIndex === index) {
              gsap.set(picture, { y: direction * 18, scale: 1.025, zIndex: 2 });
              gsap.to(picture, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: galleryEase.move, overwrite: 'auto' });
            } else {
              gsap.set(picture, { zIndex: 1 });
              gsap.to(picture, { opacity: 0, duration: 0.55, ease: galleryEase.move, overwrite: 'auto' });
            }
          });
          steps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
        };
        pictures.forEach((picture, index) => gsap.set(picture, { opacity: index === 0 ? 1 : 0 }));
        steps.forEach((step, index) => ScrollTrigger.create({ trigger: step, start: 'top 55%', end: 'bottom 55%', onEnter: () => select(index), onEnterBack: () => select(index) }));
        select(0);
        return () => {
          gsap.killTweensOf(pictures);
          gsap.set(pictures, { clearProps: 'opacity,transform,zIndex' });
          host.removeAttribute('data-animated');
          steps.forEach(step => step.classList.remove('is-active'));
        };
      });
      return () => match.revert();
    }, host);
    return () => context.revert();
  }, [enabled, id]);

  if (!project) return <main id="main-content" className="mg-page mg-missing"><h1 id="mg-page-title" tabIndex={-1}>Project not found.</h1><MotionLink to={GALLERY_PATH} className="mg-button">Back to the gallery <Icon name="arrow" /></MotionLink></main>;
  const film = projectFilm(project);
  const client = projectBrand(project);
  const next = getAdjacentProjects(id)?.next;
  const cover = galleryProjectCover(project);
  const sharpFrames = frames.filter(frame => !compactFrame(frame));
  const storyFrames = [cover, sharpFrames[1] ?? cover, sharpFrames[3] ?? sharpFrames[1] ?? cover];
  const wideFrame = frames[0] && !compactFrame(frames[0]) ? 0 : -1;
  const steps = [
    { title: 'THE PROJECT.', body: projectSummary(project) },
    { title: 'MY CONTRIBUTION.', body: project.role + '. ' + (client ? 'Selected work for ' + client + '. ' : '') + (film ? 'The original film appears above; project credits are listed below.' : 'Project credits are listed below.') },
    { title: 'A CLOSER LOOK.', body: 'A selection of final frames from this project. Open any frame below to explore the image at full size.' },
  ];
  const openFrame = (index: number) => setMedia({ kind: 'gallery', title: project.title, frames, index });

  return <main id="main-content" className="mg-page mg-case" ref={root} tabIndex={-1}>
    <section className="mg-case-hero mg-shell">
      <div className="mg-section-label"><MotionLink to={GALLERY_PATH + '#archive'} className="mg-back-link"><Icon name="left" /> Back to the collection</MotionLink><span>{number(CHRONOLOGICAL_PROJECTS.findIndex(item => item.id === id) + 1)} / {number(CHRONOLOGICAL_PROJECTS.length)}</span></div>
      <h1 id="mg-page-title" className="mg-display mg-case-title" tabIndex={-1}><span className="mg-line"><span className="mg-line-inner">{project.title}</span></span></h1>
      <div className="mg-case-meta"><span>{projectGenre(project)}</span><span>{project.year}</span><span>{project.role}</span></div>
      <ProjectFilm key={project.id} film={film} poster={cover} title={project.title} />
    </section>
    <section className="mg-case-story mg-shell" aria-label="Project overview">
      <div className="mg-section-label"><span>Inside the project</span><span>{client}</span></div>
      <div className="mg-story" ref={story}>
        <div className="mg-story-copy">{steps.map((step, index) => <div className="mg-story-step" key={step.title}><span className="mg-small-label">{number(index + 1)} / Project notes</span><h2 className="mg-display">{step.title}</h2><p>{step.body}</p><div className="mg-story-inline-image" style={frameStyle(storyFrames[index])}><Image src={storyFrames[index]} alt={project.title + ' — project frame ' + number(index + 1)} loading="lazy" sizes="90vw" /></div></div>)}</div>
        <div className="mg-story-visual" aria-hidden="true">{storyFrames.map((frame, index) => <div className="mg-story-picture" style={frameStyle(frame)} key={index}><Image src={frame} alt="" loading="lazy" sizes="45vw" /><span>Selected frame / {number(index + 1)}</span></div>)}</div>
      </div>
    </section>
    <section id="mg-frames" className="mg-case-frames mg-shell" aria-labelledby="mg-frames-title"><div className="mg-section-label"><span>Selected frames</span><span>{number(frames.length)} images</span></div><h2 id="mg-frames-title" className="mg-display" data-mg-reveal>FRAME BY <span className="mg-outline">FRAME.</span></h2><div className="mg-case-grid">{frames.map((frame, index) => <button key={frame} className={'mg-case-frame' + (compactFrame(frame) ? ' mg-case-frame-compact' : '') + (index === wideFrame ? ' mg-case-frame-wide' : '')} style={frameStyle(frame)} onClick={() => openFrame(index)} aria-label={'Open ' + project.title + ' frame ' + number(index + 1)}><Image src={frame} alt={project.title + ' — final frame ' + number(index + 1)} loading="lazy" sizes={index === wideFrame ? '90vw' : '(max-width: 760px) 90vw, 44vw'} /><span>{number(index + 1)} <Icon name="plus" /></span></button>)}</div></section>
    <section className="mg-case-credits mg-shell" aria-labelledby="mg-credits-title"><div><p className="mg-small-label">The people behind the image</p><h2 id="mg-credits-title" className="mg-display">PROJECT<br /><span className="mg-outline">CREDITS.</span></h2><p className="mg-credit-note">Production credits supplied by the portfolio owner. My contribution: {project.role}.</p></div><dl><div><dt>Project</dt><dd>{project.title}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div>{project.publishedAt && <div><dt>Video published</dt><dd><time dateTime={project.publishedAt}>{projectPublishedDate(project)}</time></dd></div>}{client && <div><dt>Client</dt><dd>{client}</dd></div>}{project.artists?.map((credit, index) => <div key={credit.role + index}><dt>{credit.role}</dt><dd>{credit.names}</dd></div>)}</dl></section>
    {next && <section className="mg-next-project mg-shell"><p className="mg-small-label">Next in the collection</p><MotionLink to={GALLERY_PATH + 'project/' + next.id}><h2 className="mg-display">{next.title}</h2><Icon name="arrow" /></MotionLink></section>}
    <MotionContact />
    {media && <Suspense fallback={<div className="viewer-opening" role="status">Opening the viewer…</div>}><MediaDialog content={media} onClose={closeMedia} /></Suspense>}
  </main>;
}
