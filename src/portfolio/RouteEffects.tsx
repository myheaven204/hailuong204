import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import { projectSummary } from './content';

export default function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    const projectPrefix = pathname.startsWith('/concepts/motion-gallery/project/') ? '/concepts/motion-gallery/project/' : '/project/';
    const id = pathname.startsWith(projectPrefix) ? pathname.slice(projectPrefix.length) : undefined;
    const project = id ? getProjectById(id) : undefined;
    document.title = project ? project.title + ' — Hai Luong / VFX' : 'Hai Luong — VFX Compositor';
    const description = project ? projectSummary(project) : 'Hai Luong is a VFX compositor based in Ho Chi Minh City. Explore selected commercials, music videos, showreels and compositing breakdowns.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [pathname]);
  return null;
}
