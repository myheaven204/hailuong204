import { Link, useLocation } from 'react-router-dom';
import type { Project } from '../data/projects';
import Icon from './Icon';
import Image from './Image';
import { number, projectBrand, projectCover, projectGenre } from './content';

export default function ProjectCard({ project, index, compact = false }: { project: Project; index: number; compact?: boolean }) {
  const location = useLocation();
  return <Link to={'/project/' + project.id} state={{ returnTo: '/' + location.search + (compact ? '#archive' : '#work') }} className={'project-card ' + (compact ? 'compact-card' : '')} aria-label={'View project: ' + project.title}>
    <div className="project-artwork"><Image src={projectCover(project)} alt={project.title + ' — project frame'} loading="lazy" width={1600} height={900} sizes={compact ? '(max-width: 760px) 100vw, 33vw' : '(max-width: 760px) 100vw, 62vw'} style={{ objectPosition: project.imagePosition ?? 'center' }} /><span className="project-index">{number(index + 1)} / {project.year}</span><span className="project-open"><Icon name="arrow" /></span><span className="artwork-view">Explore project <Icon name="arrow" /></span></div>
    <div className="project-caption">{!compact && <span className="project-serial" aria-hidden="true">{number(index + 1)}</span>}<div><p className="eyebrow">{projectBrand(project) ?? projectGenre(project)} <span> / {projectGenre(project)}</span></p><h3>{project.title}</h3>{!compact && <p className="project-card-role">{project.role} / {project.year}</p>}</div><span className="caption-arrow"><span>View project</span><Icon name="arrow" /></span></div>
  </Link>;
}
