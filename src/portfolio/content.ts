import { PROJECTS, type Project } from '../data/projects';
import manifest from '../data/media-manifest.json';
import issues from '../data/media-issues.json';
import dimensions from '../data/media-dimensions.json';
import supplemental from '../data/supplemental-frames.json';

type SupplementalFrame = { src: string; width: number; height: number; timestamp: number; provider: string; videoId: string };
const supplementalFrames = supplemental as Record<string, SupplementalFrame[]>;
export const imageDimensions: Record<string, { width: number; height: number }> = {
  ...dimensions,
  ...Object.fromEntries(Object.values(supplementalFrames).flat().map(frame => [frame.src, { width: frame.width, height: frame.height }])),
};

export const EMAIL = 'hailuong.vfx@gmail.com';
export const PORTRAIT = '/images/hai-luong-portrait.webp';
export const mediaSource = (source: string) => (manifest as Record<string, string>)[source] ?? source;
export const number = (value: number) => String(value).padStart(2, '0');

export type FilmSource = {
  title: string;
  provider: 'youtube' | 'vimeo';
  id: string;
  kind: 'Showreel' | 'Breakdown' | 'Studio reel' | 'Project film';
};

export const SHOWREEL: FilmSource = { title: 'SPICE fx — Studio Showreel 2026', provider: 'youtube', id: 'mdgq7pWm_KE', kind: 'Studio reel' };
export const FILM_LIBRARY: FilmSource[] = [
  ...[{ id: '8gOTa_S-3Tc', title: 'Sunlight — VFX Breakdown' }, { id: '9sF7bsbNBuA', title: 'Closeup — VFX Breakdown' }, { id: '2sFMS0KIjTg', title: 'LAVIE — VFX Breakdown' }, { id: 'Fa7U2LzL-N8', title: 'QANDA — VFX Breakdown' }].map(({ id, title }): FilmSource => ({
    title, provider: 'youtube', id, kind: 'Breakdown',
  })),
  { title: 'Surf TVC — SPICE fx', provider: 'vimeo', id: '1082478288', kind: 'Project film' },
  { title: 'Tiger Balm TVC 2025', provider: 'vimeo', id: '1143381334', kind: 'Project film' },
  { title: 'KGC Jung Kwan Jang TVC 2025', provider: 'vimeo', id: '1143379790', kind: 'Project film' },
  { title: 'MB Bank TVC 2025', provider: 'vimeo', id: '1143376830', kind: 'Project film' },
  { title: 'Rihair TVC 2025', provider: 'vimeo', id: '1143376244', kind: 'Project film' },
  { title: 'NUVI MV 2025', provider: 'vimeo', id: '1123127478', kind: 'Project film' },
  { title: 'LAVIE TVC 2025', provider: 'vimeo', id: '1097430196', kind: 'Project film' },
  { title: 'SPICE fx Showreel 2025', provider: 'vimeo', id: '1062372265', kind: 'Studio reel' },
  { title: 'Grab Saver TVC 2024', provider: 'vimeo', id: '948202733', kind: 'Project film' },
  { title: 'SPICE fx Showreel 2020', provider: 'vimeo', id: '451725378', kind: 'Studio reel' },
];

const summaries: Record<string, string> = {
  'grab-dejavu': 'Compositing and motion design for Grab’s “Chuyến DejaVu Nhớ Đời” campaign.',
  'dejavu-2026': 'Compositing and motion design for Comfort’s colourful collaboration with Tóc Tiên.',
  'nuvi-mv': 'VFX compositing for NUVI’s music video featuring Quang Hùng MasterD.',
  '7up-fun': 'VFX compositing for a 7UP Vietnam commercial.',
  'lays-gi-on-chan-dong': 'VFX compositing for Lay’s “Giòn Chấn Động” campaign.',
  'all-new-nmax': 'VFX compositing for Yamaha’s All New NMAX commercial, “Max Uy Thế”.',
  'rihair-film': 'VFX compositing for Rihair’s Vietnam commercial.',
  'surf-tvc-2025': 'VFX compositing for the 2025 Surf commercial. Project footage and selected frames below.',
  'tiger-balm-tvc-2025': 'VFX compositing for Tiger Balm’s 2025 commercial.',
  'kgc-tvc-2025': 'VFX compositing for KGC Jung Kwan Jang’s 2025 commercial.',
  'vim-cgi-2025': 'VFX compositing for Vim’s 2025 CGI campaign.',
  'takeda-tvc-2025': 'VFX compositing for Takeda’s 2025 commercial.',
  'clear-tvc-2025': 'VFX compositing for CLEAR’s 2025 hair-care campaign.',
  'lavie-tvc-2025': 'VFX compositing for LAVIE’s 2025 bottled-water campaign.',
  'wanda-study-tvc-2025': 'VFX compositing for Wanda Study’s 2025 commercial.',
  'closeup-tvc-2025': 'VFX compositing for Close Up’s 2025 commercial.',
  'boncha-ooh-2025': 'VFX compositing for Boncha’s 2025 out-of-home campaign.',
  'kiri-minisweet-tvc-2025': 'VFX compositing for Kiri Minisweet’s 2025 commercial.',
  'kitkat-tvc-2025': 'VFX compositing for KitKat’s 2025 commercial.',
  'vinacapital-tvc-2025': 'VFX compositing for VinaCapital’s 2025 commercial.',
  'shinhan-tvc-2024': 'VFX compositing for Shinhan Bank’s 2024 commercial.',
  'sunlight-tvc-2024': 'VFX compositing for Sunlight’s 2024 commercial.',
  'surf-bumper-ads-2024': 'VFX compositing for Surf’s short-form 2024 campaign.',
  'tiki-bumper-ads-2024': 'VFX compositing for Tiki’s short-form 2024 campaign.',
  'lays-tvc-2024': 'VFX compositing for Lay’s 2024 commercial.',
  'king-koil-tvc-2024': 'VFX compositing for King Koil’s 2024 commercial.',
  'vietcombank-visa-infinity-tvc-2024': 'VFX compositing for Vietcombank’s Visa Infinity campaign.',
  'rong-do-gducke-mv': 'VFX compositing for Rồng Đỏ and GDUCKY’s “Cháy Chất Riêng” music video.',
  'surf-tvc-2023': 'VFX compositing for Surf’s 2023 commercial.',
  'larue-tvc-2023': 'VFX compositing for Larue’s 2023 commercial.',
  'air-asia-viral-2023': 'VFX compositing for Air Asia’s 2023 viral campaign.',
  'tvc-maggi-2023': 'VFX compositing for Maggi’s 2023 commercial.',
  'visa-tvc-2023': 'VFX compositing for Visa’s 2023 commercial.',
  'twister-tvc-2023': 'VFX compositing for Twister’s 2023 commercial.',
  '7up-tvc-2023': 'VFX compositing for 7UP’s 2023 commercial.',
  'durex-thematic-gay-tvc-2022': 'VFX compositing for Durex’s 2022 thematic campaign.',
  'durex-thematic-les-tvc-2022': 'VFX compositing for Durex’s 2022 thematic campaign.',
  'knorr-tvc-2023': 'VFX compositing for Knorr’s 2023 commercial.',
  'rejoice-viral-2022': 'VFX compositing for Rejoice’s 2022 viral campaign.',
  'omo-tvc-2022': 'VFX compositing for OMO’s 2022 commercial.',
  'heineken-tvc-2023': 'VFX compositing for Heineken’s 2023 commercial.',
  'warrior-tvc-2021': 'VFX compositing for Warrior’s 2021 commercial.',
  'mbbank-priority': 'VFX compositing for MB Bank’s Priority campaign, “Creative Breakthrough”.',
};

export const PROJECT_COPY = summaries;
export const FEATURED_IDS = ['lavie-tvc-2025', 'grab-dejavu', 'rong-do-gducke-mv', 'mbbank-priority', 'nuvi-mv', 'heineken-tvc-2023'];
export const featuredProjects = FEATURED_IDS.map(id => PROJECTS.find(project => project.id === id)!).filter(Boolean);
export const heroProject = featuredProjects[0];
const coverFrameIndexes: Record<string, number> = { 'lavie-tvc-2025': 6, 'grab-dejavu': 2, 'mbbank-priority': 2, 'nuvi-mv': 1, 'rong-do-gducke-mv': 5, 'heineken-tvc-2023': 7 };
export const projectCover = (project: Project) => project.gallery?.[coverFrameIndexes[project.id]] ?? project.image;
export const brandNames = ['Grab', 'Comfort', '7UP', 'NUVI', 'MB Bank', 'Heineken', 'KitKat', 'LAVIE'];
const publicationDateFormat = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const projectPublishedDate = (project: Project) => project.publishedAt ? publicationDateFormat.format(new Date(project.publishedAt)) : '';
export const projectSummary = (project: Project) => summaries[project.id] ?? project.description;
export const projectGenre = (project: Project) => /-mv$/.test(project.id) ? 'Music video' : project.category === 'Film' ? 'Film' : 'Commercial';
export const projectBrand = (project: Project) => project.client;
export const projectFrames = (project: Project) => {
  const extraFrames = supplementalFrames[project.id] ?? [];
  const frames = [...new Set([project.image, ...(project.gallery ?? []), ...extraFrames.map(frame => frame.src)])]
    .filter(frame => !issues.some(issue => issue.url === frame && issue.error === 'HTTP 404'));
  const coverDimensions = imageDimensions[project.image];
  const hasDetailedFrames = frames.some(frame => {
    const dimensions = imageDimensions[frame];
    return frame !== project.image && dimensions && Math.min(dimensions.width, dimensions.height) >= 720 && Math.max(dimensions.width, dimensions.height) >= 1280;
  });
  const omitThumbnail = hasDetailedFrames && coverDimensions && (Math.min(coverDimensions.width, coverDimensions.height) < 720 || Math.max(coverDimensions.width, coverDimensions.height) < 1280);
  return omitThumbnail ? frames.filter(frame => frame !== project.image) : frames;
};
export const projectFilm = (project: Project): FilmSource | undefined => {
  if (project.youtubeId) return { title: project.title, provider: 'youtube', id: project.youtubeId, kind: 'Project film' };
  if (project.vimeoId) return { title: project.title, provider: 'vimeo', id: project.vimeoId, kind: 'Project film' };
  return undefined;
};
export const filmUrl = (film: FilmSource) => film.provider === 'youtube' ? 'https://www.youtube.com/watch?v=' + film.id : 'https://vimeo.com/' + film.id;
export const embedUrl = (film: FilmSource) => film.provider === 'youtube'
  ? 'https://www.youtube-nocookie.com/embed/' + film.id + '?autoplay=1&rel=0'
  : 'https://player.vimeo.com/video/' + film.id + '?autoplay=1&dnt=1';
