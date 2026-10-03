import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const sharp = require(process.env.CODEX_NODE_MODULES ? process.env.CODEX_NODE_MODULES + '/sharp' : 'sharp');
const manifest = JSON.parse(await readFile('src/data/media-manifest.json', 'utf8'));
const source = await readFile('src/data/projects.ts', 'utf8');
const projects = JSON.parse(source.slice(source.indexOf('= [', source.indexOf('export const PROJECTS')) + 2, source.indexOf('\n];') + 2));
const signatures = [];
const dimensions = {};
await mkdir('reports/contact-sheets', { recursive: true });
for (const [url, local] of Object.entries(manifest)) {
  const file = 'public' + local;
  const metadata = await sharp(file).metadata();
  dimensions[url] = { width: metadata.width, height: metadata.height };
  await sharp(file).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 76 }).toFile(file.replace('.webp', '-640.webp'));
  const pixels = await sharp(file).resize(9, 8, { fit: 'fill' }).greyscale().raw().toBuffer();
  let hash = 0n;
  for (let row = 0; row < 8; row += 1) for (let column = 0; column < 8; column += 1) hash = (hash << 1n) | BigInt(pixels[row * 9 + column] > pixels[row * 9 + column + 1]);
  signatures.push({ url, hash });
}
const suspicious = [];
for (let first = 0; first < signatures.length; first += 1) {
  for (let second = first + 1; second < signatures.length; second += 1) {
    let difference = signatures[first].hash ^ signatures[second].hash;
    let distance = 0;
    while (difference) { difference &= difference - 1n; distance += 1; }
    if (distance > 4) continue;
    const references = [signatures[first].url, signatures[second].url].map(url => ({ url, jobs: projects.filter(project => [project.image, ...(project.gallery ?? [])].includes(url)).map(project => project.id) }));
    suspicious.push({ distance, references });
  }
}
const tiles = [];
const label = text => Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="32"><rect width="320" height="32" fill="#111"/><text x="8" y="21" fill="white" font-size="12" font-family="sans-serif">' + text.replaceAll('&', '&amp;').replaceAll('<', '&lt;') + '</text></svg>');
for (const [index, project] of projects.entries()) {
  if (manifest[project.image]) {
    tiles.push({ input: await sharp('public' + manifest[project.image]).resize(320, 180).jpeg().toBuffer(), left: index % 4 * 320, top: Math.floor(index / 4) * 212 });
    tiles.push({ input: label((index + 1) + '. ' + project.id), left: index % 4 * 320, top: Math.floor(index / 4) * 212 + 180 });
  }
  const frames = [project.image, ...(project.gallery ?? [])].filter(url => manifest[url]);
  const parts = [];
  for (const [frameIndex, url] of frames.entries()) {
    parts.push({ input: await sharp('public' + manifest[url]).resize(320, 180).jpeg().toBuffer(), left: frameIndex % 3 * 320, top: Math.floor(frameIndex / 3) * 212 });
    parts.push({ input: label(project.id + ' / ' + (frameIndex === 0 ? 'cover' : 'frame ' + frameIndex)), left: frameIndex % 3 * 320, top: Math.floor(frameIndex / 3) * 212 + 180 });
  }
  if (parts.length) await sharp({ create: { width: 960, height: Math.ceil(frames.length / 3) * 212, channels: 3, background: '#111' } }).composite(parts).jpeg({ quality: 82 }).toFile('reports/contact-sheets/' + project.id + '.jpg');
}
await sharp({ create: { width: 1280, height: Math.ceil(projects.length / 4) * 212, channels: 3, background: '#111' } }).composite(tiles).jpeg({ quality: 85 }).toFile('reports/project-contact-sheet.jpg');
await writeFile('reports/similar-images.json', JSON.stringify(suspicious, null, 2) + '\n');
await writeFile('src/data/media-dimensions.json', JSON.stringify(dimensions, null, 2) + '\n');
console.log('Prepared ' + signatures.length + ' responsive images; ' + suspicious.length + ' visually similar pairs flagged for review.');
