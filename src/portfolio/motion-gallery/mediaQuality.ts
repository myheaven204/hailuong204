import type { Project } from '../../data/projects';
import dimensions from '../../data/media-dimensions.json';
import { projectCover, projectFrames } from '../content';

export const frameDimensions = (source: string) => (dimensions as Record<string, { width: number; height: number }>)[source];
export const compactFrame = (source: string) => {
  const size = frameDimensions(source);
  return Boolean(size && (size.width < 1280 || size.height < 600 || size.height > size.width));
};

export function galleryProjectCover(project: Project) {
  const preferred = projectCover(project);
  if (!compactFrame(preferred)) return preferred;
  return projectFrames(project).find(source => !compactFrame(source)) ?? preferred;
}
