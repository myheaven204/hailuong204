import { readFile, writeFile } from 'node:fs/promises';

const source = await readFile('src/data/projects.ts', 'utf8');
const projects = JSON.parse(source.slice(source.indexOf('= [', source.indexOf('export const PROJECTS')) + 2, source.indexOf('\n];') + 2));
const library = (await readFile('src/components/Breakdown.tsx', 'utf8')).split('const BREAKDOWN_VIDEOS')[0];
const references = projects.flatMap(project => [
  ...(project.youtubeId ? [{ provider: 'youtube', id: project.youtubeId, job: project.id, title: project.title }] : []),
  ...(project.vimeoId ? [{ provider: 'vimeo', id: project.vimeoId, job: project.id, title: project.title }] : []),
]);
for (const match of library.matchAll(/youtubeId:\s*'([^']+)'/g)) references.push({ provider: 'youtube', id: match[1], job: 'original-film-library' });
for (const match of library.matchAll(/vimeoUrl:\s*'https:\/\/vimeo.com\/(\d+)'/g)) references.push({ provider: 'vimeo', id: match[1], job: 'original-film-library' });
references.push({ provider: 'youtube', id: 'mdgq7pWm_KE', job: 'studio-showreel-2026' });
const queue = [...new Map(references.map(reference => [reference.provider + ':' + reference.id, reference])).values()];
const results = [];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    const videoUrl = item.provider === 'youtube' ? 'https://www.youtube.com/watch?v=' + item.id : 'https://vimeo.com/' + item.id;
    const endpoint = item.provider === 'youtube' ? 'https://www.youtube.com/oembed?format=json&url=' : 'https://vimeo.com/api/oembed.json?url=';
    try {
      const response = await fetch(endpoint + encodeURIComponent(videoUrl), { signal: AbortSignal.timeout(20000) });
      const data = response.ok ? await response.json() : {};
      results.push({ provider: item.provider, id: item.id, url: videoUrl, status: response.status, title: data.title, author: data.author_name, references: references.filter(reference => reference.provider === item.provider && reference.id === item.id) });
    } catch (error) { results.push({ provider: item.provider, id: item.id, url: videoUrl, error: error.message, references: references.filter(reference => reference.provider === item.provider && reference.id === item.id) }); }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
results.sort((first, second) => first.provider.localeCompare(second.provider) || first.id.localeCompare(second.id));
await writeFile('reports/video-audit.json', JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({ checked: results.length, metadataAvailable: results.filter(result => result.status === 200).length, unavailable: results.filter(result => result.status !== 200) }, null, 2));
