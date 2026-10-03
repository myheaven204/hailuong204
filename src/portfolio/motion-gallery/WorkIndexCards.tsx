import { memo } from 'react';
import type { Project } from '../../data/projects';
import { number, projectFrames, projectGenre } from '../content';
import Icon from '../Icon';
import Image from '../Image';
import MotionLink from './MotionLink';
import MotionMedia from './MotionMedia';
import { GALLERY_PATH } from './data';
import { compactFrame, galleryProjectCover } from './mediaQuality';
import './work-index-cards.css';

export type WorkIndexLayout = 'a' | 'b' | 'c';

export const WorkIndexCard = memo(function WorkIndexCard({ project, index, direction, active, onActiveChange, eager = false }: {
  project: Project; index: number; direction: WorkIndexLayout; eager?: boolean; active: boolean; onActiveChange: (id: string | null) => void;
}) {
  const cover = galleryProjectCover(project);
  const alternate = direction === 'b' ? projectFrames(project).find(frame => frame !== cover && !compactFrame(frame)) : undefined;
  const sizes = direction === 'a' && index === 0 ? '(max-width: 760px) 90vw, (max-width: 1100px) 92vw, 62vw'
    : direction === 'c' ? '(max-width: 760px) 90vw, 43vw' : '(max-width: 760px) 90vw, (max-width: 1100px) 44vw, 30vw';

  return <MotionLink to={GALLERY_PATH + 'project/' + project.id} className="ws-card" data-mg-cursor="VIEW PROJECT →" data-study-project={project.id}
    onPointerEnter={() => onActiveChange(project.id)} onPointerLeave={() => onActiveChange(null)} onFocus={() => onActiveChange(project.id)} onBlur={() => onActiveChange(null)}>
    {direction === 'b' && <div className="ws-back" aria-hidden="true">{alternate && <Image src={alternate} alt="" loading="lazy" sizes={sizes} />}<span>Same project / Another frame</span></div>}
    <article className="ws-front">
      {direction === 'c' && <div className="ws-spine" aria-hidden="true"><span>{number(index + 1)}</span><span>HL / FRAME ARCHIVE</span></div>}
      <div className="ws-visual"><MotionMedia project={project} active={active} eager={eager} sizes={sizes} />
        {direction !== 'c' && <span className="ws-number" aria-hidden="true">{number(index + 1)}</span>}
        <span className="ws-frame-label" aria-hidden="true">{direction === 'a' && index === 0 ? 'The opening frame' : 'Selected frame'}</span>
      </div>
      <div className="ws-caption"><div className="ws-meta"><span>{projectGenre(project)}</span><span>{project.year}</span></div><h3>{project.title}</h3><div className="ws-card-footer"><p>{project.role}</p><span className="ws-card-arrow" aria-hidden="true"><Icon name="arrow" /></span></div></div>
    </article>
  </MotionLink>;
});
