import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { compareProjectDates, PROJECTS } from '../../data/projects';
import { number, projectGenre } from '../content';
import Icon from '../Icon';
import { archiveRange, GALLERY_YEARS } from './data';
import { WorkIndexCard, type WorkIndexLayout } from './WorkIndexCards';
import useEditionMotion from './useEditionMotion';
import './work-index-archive.css';

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
const pageSize = 12;
const initialCount = 11;
const layouts = [
  { id: 'a', label: 'Editorial', description: 'A featured frame with an editorial grid' },
  { id: 'b', label: 'Editions', description: 'Layered prints with another frame on hover' },
  { id: 'c', label: 'Cinema', description: 'Wide film windows with numbered spines' },
] as const;

export default function MotionArchive() {
  const [parameters, setParameters] = useSearchParams();
  const [limit, setLimit] = useState(initialCount);
  const [hovered, setHovered] = useState<string | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const grid = useRef<HTMLDivElement>(null);
  const selectedLayout = layouts.find(layout => layout.id === parameters.get('layout')) ?? layouts[1];
  const query = parameters.get('q') ?? '';
  const year = parameters.get('year') ?? 'all';
  const format = parameters.get('format') ?? 'all';
  const filtered = useMemo(() => PROJECTS.filter(project =>
    (year === 'all' || project.year === year) && (format === 'all' || projectGenre(project) === format)
    && normalize(project.title + ' ' + (project.client ?? '') + ' ' + project.year).includes(normalize(query.trim()))
  ).sort(compareProjectDates), [format, query, year]);
  const shown = filtered.slice(0, limit);
  useEditionMotion(grid, selectedLayout.id, shown.map(project => project.id).join('|'));
  const filtering = Boolean(query || year !== 'all' || format !== 'all');
  useEffect(() => { window.dispatchEvent(new Event('mg:layout-ready')); }, [selectedLayout.id, shown.length]);
  const selectLayout = (layout: WorkIndexLayout) => {
    setHovered(null);
    setParameters(current => {
      const next = new URLSearchParams(current);
      if (layout === 'b') next.delete('layout'); else next.set('layout', layout);
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  const moveLayout = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % layouts.length;
    else if (event.key === 'ArrowLeft') next = (index + layouts.length - 1) % layouts.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = layouts.length - 1;
    else return;
    event.preventDefault(); selectLayout(layouts[next].id); tabs.current[next]?.focus();
  };
  const update = (name: string, value: string) => {
    setLimit(initialCount);
    setParameters(current => {
      const next = new URLSearchParams(current);
      if (!value || value === 'all') next.delete(name); else next.set(name, value);
      return next;
    }, { replace: true, preventScrollReset: true });
  };
  const reset = () => {
    setParameters(current => {
      const next = new URLSearchParams(current);
      ['q', 'year', 'format'].forEach(name => next.delete(name));
      return next;
    }, { replace: true, preventScrollReset: true });
    setLimit(initialCount); setHovered(null);
  };

  return <section id="archive" className="mg-archive mg-shell" aria-labelledby="mg-archive-title">
    <div className="mg-section-label"><span>05 / The collection</span><span>{archiveRange}</span></div>
    <div className="mg-archive-heading"><h2 id="mg-archive-title" className="mg-display" data-mg-reveal>WORK <span className="mg-outline">INDEX.</span></h2><p>The full project archive.<br />Commercials, music videos and films.</p></div>
    <div className="mg-archive-layouts" role="tablist" aria-label="Work Index layout">
      {layouts.map((layout, index) => <button key={layout.id} ref={node => { tabs.current[index] = node; }} role="tab" id={'mg-archive-layout-' + layout.id} aria-selected={selectedLayout.id === layout.id} aria-controls="mg-archive-grid" tabIndex={selectedLayout.id === layout.id ? 0 : -1} onKeyDown={event => moveLayout(event, index)} onClick={() => selectLayout(layout.id)}>
        <span className="mg-layout-letter" aria-hidden="true">{layout.id.toUpperCase()}</span><span>{layout.label}<small>{layout.id === 'a' ? 'An editorial cut' : layout.id === 'b' ? 'Frame editions' : 'Cinema ledger'}</small></span><span className="sr-only">{layout.description}</span><Icon name="arrow" />
      </button>)}
    </div>
    <div className="mg-archive-tools">
      <label className="mg-search"><Icon name="search" /><span className="sr-only">Search projects</span><input type="search" value={query} placeholder="A project, a brand, a year…" onChange={event => update('q', event.target.value)} /></label>
      <label className="mg-filter"><span>Year</span><select aria-label="Year" value={year} onChange={event => update('year', event.target.value)}><option value="all">All years</option>{GALLERY_YEARS.map(value => <option key={value}>{value}</option>)}</select></label>
      <label className="mg-filter"><span>Format</span><select aria-label="Format" value={format} onChange={event => update('format', event.target.value)}><option value="all">All formats</option><option>Commercial</option><option>Music video</option><option>Film</option></select></label>
    </div>
    <div className="mg-result-count" role="status"><span>{number(Math.min(limit, filtered.length))} / {number(filtered.length)} {filtered.length === 1 ? 'project' : 'projects'} {filtering ? 'found' : 'in the archive'}</span>{filtering ? <button onClick={reset}>Reset filters <Icon name="close" /></button> : <span className="mg-archive-hint" aria-hidden="true">Hover to explore / Click to view</span>}</div>
    <div ref={grid} key={selectedLayout.id} id="mg-archive-grid" className={'ws-card-grid ws-grid-' + selectedLayout.id} role="tabpanel" aria-labelledby={'mg-archive-layout-' + selectedLayout.id} tabIndex={0}>
      {filtered.length ? shown.map((project, index) => <WorkIndexCard key={project.id} project={project} index={index} direction={selectedLayout.id} active={hovered === project.id} onActiveChange={setHovered} />) : <div className="mg-empty"><h3>No matching projects.</h3><p>Try another title, brand or year.</p><button className="mg-button" onClick={reset}>Clear filters <Icon name="arrow" /></button></div>}
    </div>
    {limit < filtered.length && <div className="mg-archive-more"><button className="mg-button mg-button-outline" aria-controls="mg-archive-grid" onClick={() => setLimit(value => value + pageSize)}>Load {number(Math.min(pageSize, filtered.length - limit))} more projects <Icon name="plus" /></button><button className="mg-archive-show-all" aria-controls="mg-archive-grid" onClick={() => setLimit(filtered.length)}>View all {number(filtered.length)} projects <Icon name="arrow" /></button></div>}
  </section>;
}
