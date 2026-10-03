import { lazy, Suspense, useCallback, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getAdjacentProjects, getProjectById } from '../data/projects';
import Header from './Header';
import Contact from './Contact';
import Icon from './Icon';
import Image from './Image';
import { number, projectBrand, projectCover, projectFilm, projectFrames, projectGenre, projectSummary } from './content';
import type { MediaContent } from './MediaDialog';

const MediaDialog = lazy(() => import('./MediaDialog'));

export default function ProjectPage() {
  const { id = '' } = useParams();
  const location = useLocation();
  const requestedReturn = location.state?.returnTo;
  const returnTo = typeof requestedReturn === 'string' && /^\/(?:\?|#)/.test(requestedReturn) ? requestedReturn : '/#archive';
  const project = getProjectById(id);
  const adjacent = getAdjacentProjects(id);
  const [media, setMedia] = useState<MediaContent | null>(null);
  const closeMedia = useCallback(() => setMedia(null), []);
  if (!project) return <><Header /><main id="main-content" className="not-found section-shell"><p className="eyebrow">404 / Outside the frame</p><h1>This frame<br /><em>is missing.</em></h1><p>The project you’re looking for isn’t in this collection.</p><Link className="button button-light" to="/#archive">Back to the archive <Icon name="arrow" /></Link></main><Contact /></>;
  const frames = projectFrames(project);
  const film = projectFilm(project);
  const brand = projectBrand(project);
  const openFrame = (index: number) => setMedia({ kind: 'gallery', title: project.title, frames, index });
  return <>
    <Header />
    <main id="main-content" className="project-page gallery-project">
      <section className="project-page-intro section-shell" aria-labelledby="project-title"><Link to={returnTo} className="text-link back-link"><Icon name="left" /> Back to the collection</Link><div className="project-page-meta"><span className="eyebrow">{projectGenre(project)} / {project.year}</span><span className="eyebrow">HAI LUONG / PROJECT ARCHIVE</span></div><h1 id="project-title">{project.title}</h1><div className="project-page-subtitle"><p>{project.role}</p>{film && <button className="text-link" onClick={() => setMedia({ kind: 'film', film })}><Icon name="play" /> Watch project film <Icon name="arrow" /></button>}</div></section>
      <div className="project-page-cover"><Image src={projectCover(project)} alt={project.title + ' — featured project frame'} loading="eager" fetchPriority="high" sizes="100vw" width={1800} height={1013} /><button className="cover-expand" onClick={() => openFrame(frames.indexOf(projectCover(project)))} aria-label="Open featured frame in viewer"><Icon name="plus" /> View frame</button></div>
      <nav className="project-chapters section-shell" aria-label="Project sections"><span className="eyebrow">Explore this project</span><div><a href="#overview">Overview</a>{film && <a href="#film">Film <Icon name="play" /></a>}<a href="#frames">Frames <span>{number(frames.length)}</span></a>{project.artists?.length ? <a href="#credits">Credits</a> : null}</div></nav>
      <section id="overview" className="project-overview section-shell" aria-labelledby="overview-title"><div><span className="eyebrow">01 / Project overview</span><h2 id="overview-title">Project notes.</h2><p className="overview-description">{projectSummary(project)}</p></div><dl className="project-facts">{brand && <div><dt>Brand / production</dt><dd>{brand}</dd></div>}<div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Format</dt><dd>{projectGenre(project)}</dd></div>{project.tools?.length ? <div><dt>Project toolkit</dt><dd>{[...new Set(project.tools.map(tool => /^pftrack$/i.test(tool) ? 'PFTrack' : tool))].join(' / ')}</dd></div> : null}</dl></section>
      {film && <section id="film" className="project-film section-shell" aria-labelledby="project-film-title"><div className="compact-section-heading"><div><p className="eyebrow">02 / In motion</p><h2 id="project-film-title">The film.</h2></div><span className="eyebrow">{film.provider === 'youtube' ? 'YouTube' : 'Vimeo'} / ORIGINAL SOURCE</span></div><button className="film-poster" onClick={() => setMedia({ kind: 'film', film })}><Image src={projectCover(project)} alt={project.title + ' — video poster'} loading="lazy" sizes="100vw" width={1600} height={900} /><span className="film-poster-shade" /><span className="film-poster-play"><Icon name="play" width="26" height="26" /></span><span className="film-poster-label">PLAY PROJECT FILM</span></button></section>}
      <section id="frames" className="project-gallery section-shell" aria-labelledby="gallery-title"><div className="compact-section-heading"><div><p className="eyebrow">{film ? '03' : '02'} / Frame by frame</p><h2 id="gallery-title">Frame studies.</h2></div><span className="eyebrow">{number(frames.length)} FRAMES / CLICK TO EXPAND</span></div><div className="project-frame-grid">{frames.map((frame, index) => <button key={frame} className="gallery-frame" onClick={() => openFrame(index)} aria-label={'Open frame ' + number(index + 1) + ' from ' + project.title}><Image src={frame} alt={project.title + ' — frame ' + number(index + 1)} loading="lazy" width={1600} height={900} sizes="(max-width: 760px) 100vw, 50vw" /><span className="gallery-frame-index">FRAME {number(index + 1)}</span><span className="gallery-expand"><Icon name="plus" /></span></button>)}</div></section>
      {project.artists?.length ? <section id="credits" className="project-credits section-shell" aria-labelledby="credits-title"><div><p className="eyebrow">A collaborative production</p><h2 id="credits-title">Production<br />credits.</h2></div><dl>{project.artists.map((credit, index) => <div key={credit.role + index}><dt>{credit.role}</dt><dd>{credit.names}</dd></div>)}</dl></section> : null}
      {adjacent && <section className="project-navigation section-shell" aria-label="Adjacent projects"><Link to={'/project/' + adjacent.previous.id} state={{ returnTo }}><span className="eyebrow"><Icon name="left" /> Previous project</span><div className="project-navigation-art"><Image src={projectCover(adjacent.previous)} alt="" loading="lazy" width={1600} height={900} sizes="(max-width: 760px) 44vw, 46vw" /></div><span>{adjacent.previous.title}</span></Link><Link to={'/project/' + adjacent.next.id} state={{ returnTo }}><span className="eyebrow">Next project <Icon name="arrow" /></span><div className="project-navigation-art"><Image src={projectCover(adjacent.next)} alt="" loading="lazy" width={1600} height={900} sizes="(max-width: 760px) 44vw, 46vw" /></div><span>{adjacent.next.title}</span></Link></section>}
      <Contact />
    </main>
    {media && <Suspense fallback={<div className="viewer-opening" role="status">Opening viewer…</div>}><MediaDialog content={media} onClose={closeMedia} /></Suspense>}
  </>;
}
