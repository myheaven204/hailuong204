import type { Project } from '../../data/projects';
import { imageDimensions, projectCover, projectFrames } from '../content';

export const frameDimensions = (source: string) => imageDimensions[source];
export const compactFrame = (source: string) => {
  const size = frameDimensions(source);
  return Boolean(size && (size.width < 1280 || size.height < 600 || size.height > size.width));
};

export function galleryProjectCover(project: Project) {
  const preferred = projectCover(project);
  if (!compactFrame(preferred)) return preferred;
  const frames = projectFrames(project);
  return frames.find(source => !compactFrame(source)) ?? frames[0] ?? preferred;
}
