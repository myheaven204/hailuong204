import { PROJECTS } from '../../data/projects';
import { FILM_LIBRARY } from '../content';

export const GALLERY_PATH = '/';
export const PROJECT_COUNT = PROJECTS.length;
export const GALLERY_PROJECTS = ['lavie-tvc-2025', 'rong-do-gducke-mv', 'mbbank-priority', 'grab-dejavu']
  .map(id => PROJECTS.find(project => project.id === id)!)
  .filter(Boolean);

export type PreviewClip = { src: string };
export const PREVIEW_CLIPS: Partial<Record<string, PreviewClip>> = {};

export const GALLERY_BREAKDOWNS = [
  { projectId: 'lavie-tvc-2025', film: FILM_LIBRARY.find(film => film.title === 'LAVIE — VFX Breakdown')! },
  { projectId: 'sunlight-tvc-2024', film: FILM_LIBRARY.find(film => film.title === 'Sunlight — VFX Breakdown')! },
  { projectId: 'closeup-tvc-2025', film: FILM_LIBRARY.find(film => film.title === 'Closeup — VFX Breakdown')! },
].map(entry => ({ ...entry, project: PROJECTS.find(project => project.id === entry.projectId)! }));

const featuredBreakdownIds = new Set(GALLERY_BREAKDOWNS.map(entry => entry.film.id));
export const GALLERY_EXTRA_BREAKDOWNS = FILM_LIBRARY.filter(film => film.kind === 'Breakdown' && !featuredBreakdownIds.has(film.id));
export const GALLERY_PROJECT_FILMS = FILM_LIBRARY.filter(film => film.kind === 'Project film');
export const GALLERY_STUDIO_REELS = FILM_LIBRARY.filter(film => film.kind === 'Studio reel');
export const GALLERY_BREAKDOWN_COUNT = GALLERY_BREAKDOWNS.length + GALLERY_EXTRA_BREAKDOWNS.length;
export const GALLERY_FILM_POSTERS: Partial<Record<string, { src: string; srcSet: string; width: number; height: number }>> = {
  'Fa7U2LzL-N8': { src: '/films/qanda-breakdown.webp', srcSet: '/films/qanda-breakdown-640.webp 640w, /films/qanda-breakdown.webp 1280w', width: 1280, height: 720 },
  'mdgq7pWm_KE': { src: '/films/spice-fx-showreel-2026.webp', srcSet: '/films/spice-fx-showreel-2026-640.webp 640w, /films/spice-fx-showreel-2026.webp 1280w', width: 1280, height: 720 },
};

export const GALLERY_YEARS = [...new Set(PROJECTS.map(project => project.year))].sort().reverse();
export const archiveRange = GALLERY_YEARS[GALLERY_YEARS.length - 1] + ' — ' + GALLERY_YEARS[0];
