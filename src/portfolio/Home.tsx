import { lazy, Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PROJECTS } from '../data/projects';
import Header from './Header';
import Contact from './Contact';
import Icon from './Icon';
import Image from './Image';
import ProjectCard from './ProjectCard';
import useSceneMotion from './useSceneMotion';
import { brandNames, featuredProjects, FILM_LIBRARY, heroProject, number, PORTRAIT, projectCover, projectGenre, SHOWREEL } from './content';
import type { MediaContent } from './MediaDialog';

const MediaDialog = lazy(() => import('./MediaDialog'));
const heroProjects = [heroProject, featuredProjects[3], featuredProjects[1]];
const years = [...new Set(PROJECTS.map(project => project.year))].sort().reverse();

function Archive() {
  const [parameters, setParameters] = useSearchParams();
  const [limit, setLimit] = useState(8);
  const query = parameters.get('q') ?? '';
  const year = parameters.get('year') ?? 'all';
  const format = parameters.get('format') ?? 'all';
  const updateFilter = (name: string, value: string) => {
    setLimit(8);
    setParameters(current => {
      const next = new URLSearchParams(current);
      if (!value || value === 'all') next.delete(name); else next.set(name, value);
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  const filtered = useMemo(() => {
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
    return PROJECTS.filter(project => (year === 'all' || project.year === year)
      && (format === 'all' || projectGenre(project) === format)
      && normalize(project.title + ' ' + (project.client ?? '') + ' ' + project.year).includes(normalize(query.trim())))
      .sort((first, second) => Number(second.year) - Number(first.year));
  }, [query, year, format]);
  return <section id="archive" className="archive-section section-shell" aria-labelledby="archive-title">
    <div className="section-heading" data-reveal><div><p className="eyebrow">04 / Project index</p><h2 id="archive-title">Project<br />index.</h2></div><p>Explore the full project archive.<br />Commercials, music videos and the work in between.</p></div>
    <div className="archive-toolbar"><label className="search-field"><Icon name="search" /><span className="sr-only">Search projects</span><input type="search" name="project-search" placeholder="Search a project or brand…" value={query} onChange={event => updateFilter('q', event.target.value)} /></label><div className="archive-filters"><label><span>Year</span><select value={year} onChange={event => updateFilter('year', event.target.value)}><option value="all">All years</option>{years.map(value => <option key={value}>{value}</option>)}</select></label><label><span>Format</span><select value={format} onChange={event => updateFilter('format', event.target.value)}><option value="all">All formats</option><option>Commercial</option><option>Music video</option></select></label></div></div>
    <div className="archive-results" role="status">{number(filtered.length)} projects {query || year !== 'all' || format !== 'all' ? 'found' : 'in the archive'}<span>2021 — 2026</span></div>
    {filtered.length ? <div className="archive-grid">{filtered.slice(0, limit).map((project, index) => <ProjectCard key={project.id} project={project} index={index} compact />)}</div> : <div className="empty-results"><h3>No matching projects.</h3><p>Try another brand, title or year.</p><button className="button button-outline" onClick={() => { setParameters({}); setLimit(8); }}>Reset filters <Icon name="arrow" /></button></div>}
    {limit < filtered.length && <div className="load-more"><button className="button button-outline" onClick={() => setLimit(current => current + 8)}>Explore more projects <span>{number(filtered.length - limit)}</span><Icon name="plus" /></button></div>}
  </section>;
}

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [activeHero, setActiveHero] = useState(0);
  const [media, setMedia] = useState<MediaContent | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const closeMedia = useCallback(() => setMedia(null), []);
  const currentHero = heroProjects[activeHero];
  useSceneMotion(root);
  return <>
    <Header />
    <main id="main-content" className="gallery-home" ref={root}>
      <section className="hero-section section-shell" aria-labelledby="hero-title">
        <div className="hero-intro eyebrow"><span>Hai Luong / VFX compositor</span><span>Selected portfolio / 2021 — 2026</span></div>
        <div className="hero-composition">
          <h1 id="hero-title"><span className="hero-title-line"><span>VISUAL</span></span><span className="hero-title-line"><span>EFFECTS</span></span></h1>
          <p className="hero-position-note">Compositing.<br />Matchmoving.<br />Motion design.</p>
          <Link className="hero-art" key={currentHero.id} to={'/project/' + currentHero.id} aria-label={'Explore ' + currentHero.title}>
            <Image src={projectCover(currentHero)} alt={currentHero.title + ' — selected portfolio frame'} loading="eager" fetchPriority="high" width={1800} height={1013} sizes="(max-width: 760px) 100vw, 65vw" />
            <span className="hero-frame-link">Open project <Icon name="arrow" /></span>
          </Link>
          <Link className="hero-companion" to={'/project/' + featuredProjects[2].id} aria-label={'Explore ' + featuredProjects[2].title}>
            <Image src={projectCover(featuredProjects[2])} alt={featuredProjects[2].title + ' — selected portfolio frame'} loading="eager" width={640} height={360} sizes="(max-width: 760px) 42vw, 24vw" />
            <span>{featuredProjects[2].title}<Icon name="arrow" /></span>
          </Link>
        </div>
        <div className="hero-bottom"><div className="hero-shot-details"><span className="eyebrow">ON DISPLAY / {number(activeHero + 1)}</span><Link to={'/project/' + currentHero.id}>{currentHero.title}</Link><p>{projectGenre(currentHero)} / {currentHero.year}</p></div><button className="hero-reel-link text-link" onClick={() => setMedia({ kind: 'film', film: SHOWREEL })}><span className="hero-reel-icon"><Icon name="play" /></span><span>Studio reel<span>SPICE fx / 2026</span></span></button><div className="hero-shot-selector" aria-label="Choose featured image">{heroProjects.map((project, index) => <button key={project.id} className={activeHero === index ? 'active' : ''} onClick={() => setActiveHero(index)} aria-label={'Show frame from ' + project.title} aria-pressed={activeHero === index}>{number(index + 1)}<span>{projectGenre(project)}</span></button>)}</div><a href="#work" className="hero-scroll eyebrow">Explore the collection <Icon name="down" /></a></div>
      </section>

      <section className="intro-section section-shell" aria-labelledby="intro-title"><div className="intro-meta"><span className="eyebrow">The practice</span><span className="eyebrow">COMPOSITING / MATCHMOVING / MOTION</span></div><h2 id="intro-title" data-reveal>Live action.<br /><span>Seamless compositing.</span></h2><div className="intro-bottom"><p>Compositing, matchmoving and motion design.<br />For commercials, music videos and film.</p><a className="text-link" href="#about">Meet the artist <Icon name="arrow" /></a></div></section>

      <section id="work" className="work-section section-shell" aria-labelledby="work-title"><div className="section-heading" data-reveal><div><p className="eyebrow">01 / Selected work</p><h2 id="work-title">Selected<br />work.</h2></div><div className="section-aside"><p>A selection from the portfolio.<br />Open a project for films, frames and credits.</p><a className="text-link" href="#archive">All {PROJECTS.length} projects <Icon name="arrow" /></a></div></div><div className="featured-grid">{featuredProjects.map((project, index) => <div key={project.id} className={'featured-item featured-item-' + index} data-reveal><ProjectCard project={project} index={index} /></div>)}</div></section>

      <section className="reel-section section-shell" aria-labelledby="reel-title"><div className="reel-copy"><p className="eyebrow">02 / In motion</p><h2 id="reel-title">The work.<br />In motion.</h2><button className="text-link reel-play" onClick={() => setMedia({ kind: 'film', film: SHOWREEL })}><Icon name="play" /><span>Watch studio reel</span><Icon name="arrow" /></button><div className="reel-caption"><span className="eyebrow">SPICE fx / STUDIO SHOWREEL 2026</span><p>A studio reel of collaborative productions.</p></div></div><button className="reel-window" onClick={() => setMedia({ kind: 'film', film: SHOWREEL })} aria-label="Play SPICE fx Studio Showreel 2026"><Image src={featuredProjects[1].gallery?.[2] ?? featuredProjects[1].image} alt={featuredProjects[1].title + ' — campaign frame; opens the SPICE fx studio reel'} loading="lazy" width={1600} height={900} sizes="(max-width: 760px) 100vw, 60vw" /><span><Icon name="play" /></span><span className="reel-window-caption">STUDIO REEL / SPICE fx</span></button></section>

      <section id="breakdowns" className="breakdown-section section-shell" aria-labelledby="breakdown-title"><div className="section-heading" data-reveal><div><p className="eyebrow">03 / Inside the image</p><h2 id="breakdown-title">Inside<br />the shot.</h2></div><p>A look at the layers behind the final image.<br />Explore the breakdown films from the original collection.</p></div><div className="breakdown-list">{FILM_LIBRARY.slice(0, 4).map((film, index) => <button key={film.id} className="breakdown-row" onClick={() => setMedia({ kind: 'film', film })}><span className="breakdown-number">{number(index + 1)}</span><span className="breakdown-row-name">{film.title}<small>Compositing / Visual effects</small></span><span className="breakdown-row-type eyebrow">BREAKDOWN FILM</span><span className="breakdown-play"><Icon name="play" /></span></button>)}</div><div className="library-toggle"><p>More from the original collection — including SPICE fx studio reels.</p><button className="text-link" onClick={() => setLibraryOpen(open => !open)} aria-expanded={libraryOpen} aria-controls="film-library">{libraryOpen ? 'Close film library' : 'Explore film library'} <Icon name={libraryOpen ? 'close' : 'plus'} /></button></div>{libraryOpen && <div id="film-library" className="film-library">{FILM_LIBRARY.slice(4).map(film => <button key={film.id} className="library-film" onClick={() => setMedia({ kind: 'film', film })}><span className="eyebrow">{film.kind} / Vimeo</span><span>{film.title}</span><Icon name="arrow" /></button>)}</div>}</section>

      <div className="statement-strip" aria-hidden="true"><span>COMPOSE THE IMPOSSIBLE.</span><span>✳</span><span>MAKE IT BELIEVABLE.</span><span>✳</span></div>

      <Archive />

      <section className="brands-section section-shell" aria-labelledby="brands-title"><div><p className="eyebrow">A shared creative effort</p><h2 id="brands-title">Featured<br />brands</h2></div><div className="brand-grid">{brandNames.map(brand => <span key={brand}>{brand}</span>)}</div><p className="brands-note">Selected brands featured in collaborative productions. Full project credits are listed where available.</p></section>

      <section id="about" className="about-section section-shell" aria-labelledby="about-title"><div className="about-portrait" data-reveal><Image src={PORTRAIT} srcSet="/images/hai-luong-portrait-640.webp 640w, /images/hai-luong-portrait.webp 1280w" alt="Hai Luong — VFX compositor" loading="lazy" width={1280} height={1280} sizes="(max-width: 760px) 250px, (max-width: 1100px) 30vw, 370px" /><div className="portrait-label"><span>HAI LUONG</span><span className="eyebrow">THE ARTIST / VIETNAM</span></div></div><div className="about-copy" data-reveal><p className="eyebrow">05 / About the artist</p><h2 id="about-title">The eye<br />behind the image.</h2><p className="about-lead">I’m Hai Luong, a VFX compositor based in Ho Chi Minh City.</p><p>With over five years of experience in compositing, matchmoving and motion design, I work on commercials, music videos and film. My focus is on the details that help visual effects sit naturally within a shot.</p><p>My practice brings live-action footage and digital elements together, with attention to perspective, light and movement.</p><div className="expertise"><span className="eyebrow">Practice</span><div><span>VFX compositing</span><span>Matchmoving</span><span>Motion design</span></div></div><div className="expertise"><span className="eyebrow">Toolkit</span><div><span>After Effects</span><span>PFTrack</span><span>Premiere Pro</span><span>Photoshop</span></div></div><a className="text-link" href="#contact">Discuss a project <Icon name="arrow" /></a></div></section>
      <Contact />
    </main>
    {media && <Suspense fallback={<div className="viewer-opening" role="status">Opening viewer…</div>}><MediaDialog content={media} onClose={closeMedia} /></Suspense>}
  </>;
}
