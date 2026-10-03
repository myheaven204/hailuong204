import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = await readFile(path.join(root, 'src/data/projects.ts'), 'utf8');
const start = source.indexOf('= [', source.indexOf('export const PROJECTS')) + 2;
const projects = JSON.parse(source.slice(start, source.indexOf('\n];') + 2));
const portrait = 'https://res.cloudinary.com/diwzqmwno/image/upload/v1778142887/ChatGPT_Image_May_7_2026_03_13_05_PM_dl4n6b.png';
const entries = projects.flatMap(project => [
  { job: project.id, title: project.title, kind: 'cover', url: project.image },
  ...(project.gallery ?? []).map((url, index) => ({ job: project.id, title: project.title, kind: 'gallery-' + (index + 1), url })),
]);
entries.push({ job: 'about', title: 'Hai Luong portrait', kind: 'portrait', url: portrait });
await mkdir(path.join(root, 'public/media'), { recursive: true });
await mkdir(path.join(root, 'reports'), { recursive: true });
const manifest = {};
const results = [];
const queue = [...new Set(entries.map(entry => entry.url))];
let processed = 0;

async function fetchImage(url) {
  const filename = createHash('sha256').update(url).digest('hex').slice(0, 16) + '.webp';
  const destination = path.join(root, 'public/media', filename);
  try {
    await access(destination);
    let bytes = await readFile(destination);
    if ((await sharp(bytes).metadata()).format !== 'webp') {
      bytes = await sharp(bytes).webp({ quality: 85 }).toBuffer();
      await writeFile(destination, bytes);
    }
    return { url, local: '/media/' + filename, bytes: bytes.length, hash: createHash('sha256').update(bytes).digest('hex') };
  } catch {}
  const remote = url.includes('res.cloudinary.com/')
    ? url.replace('/image/upload/', '/image/upload/f_webp,q_85,w_1800,c_limit/')
    : url;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(remote, { signal: AbortSignal.timeout(25000) });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      if (!response.headers.get('content-type')?.startsWith('image/')) throw new Error('Not an image');
      const originalBytes = Buffer.from(await response.arrayBuffer());
      if (originalBytes.length < 512) throw new Error('Image payload too small');
      const bytes = (await sharp(originalBytes).metadata()).format === 'webp' ? originalBytes : await sharp(originalBytes).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      await writeFile(destination, bytes);
      return { url, local: '/media/' + filename, bytes: bytes.length, hash: createHash('sha256').update(bytes).digest('hex') };
    } catch (error) {
      if (attempt === 2) return { url, error: error.message };
    }
  }
}

async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const result = await fetchImage(url);
    results.push(result);
    if (result.local) manifest[url] = result.local;
    processed += 1;
    if (processed % 20 === 0 || result.error) console.log(processed + '/' + entries.length + ': ' + (result.error ?? 'cached'));
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
await writeFile(path.join(root, 'src/data/media-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const byUrl = new Map();
for (const entry of entries) {
  if (!byUrl.has(entry.url)) byUrl.set(entry.url, []);
  byUrl.get(entry.url).push(entry);
}
const urlDuplicates = [...byUrl.entries()].filter(([, references]) => references.length > 1);
const byHash = new Map();
for (const result of results.filter(result => result.hash)) {
  if (!byHash.has(result.hash)) byHash.set(result.hash, []);
  byHash.get(result.hash).push(result.url);
}
const byteDuplicates = [...byHash.values()].filter(urls => urls.length > 1);
const failures = results.filter(result => result.error);
await writeFile(path.join(root, 'src/data/media-issues.json'), JSON.stringify(failures.map(failure => ({ url: failure.url, error: failure.error })), null, 2) + '\n');
const report = {
  generatedAt: new Date().toISOString(), jobs: projects.length, references: entries.length,
  uniqueUrls: byUrl.size, downloaded: results.filter(result => result.local).length, failed: failures,
  urlDuplicates: urlDuplicates.map(([url, references]) => ({ url, references })),
  byteDuplicates: byteDuplicates.map(urls => ({ urls, references: urls.flatMap(url => byUrl.get(url) ?? []) })),
  missingGallery: projects.filter(project => !project.gallery?.length).map(project => ({ id: project.id, title: project.title })),
  missingVideo: projects.filter(project => !project.youtubeId && !project.vimeoId && !project.video).map(project => ({ id: project.id, title: project.title })),
  jobsInventory: projects.map(project => ({ id: project.id, title: project.title, cover: project.image, gallery: project.gallery ?? [], youtubeId: project.youtubeId, vimeoId: project.vimeoId })),
};
await writeFile(path.join(root, 'reports/media-audit.json'), JSON.stringify(report, null, 2) + '\n');
const lines = [
  '# Báo cáo dữ liệu hình ảnh — Beyond the Frame', '',
  '- Giữ nguyên ' + projects.length + ' job và quan hệ job → hình ảnh/video từ dữ liệu cũ.',
  '- ' + entries.length + ' lượt tham chiếu; ' + byUrl.size + ' URL riêng; ' + report.downloaded + ' ảnh đã lưu local; ' + failures.length + ' ảnh tải lỗi.',
  '- Phát hiện trùng URL và trùng byte; ảnh gần giống cần kiểm tra trực quan.',
  '- Ảnh được tối ưu từ nguồn, không chuyển ảnh sang job khác.', '',
  '## URL được sử dụng nhiều lần', '',
  ...(urlDuplicates.length ? urlDuplicates.flatMap(([url, references]) => ['- ' + references.map(reference => reference.title + ' (' + reference.kind + ')').join(' / '), '  ' + url]) : ['Không có URL trùng.']), '',
  '## Ảnh khác URL nhưng trùng nội dung', '',
  ...(byteDuplicates.length ? byteDuplicates.flatMap(urls => ['- ' + urls.flatMap(url => byUrl.get(url) ?? []).map(reference => reference.title + ' (' + reference.kind + ')').join(' / '), ...urls.map(url => '  ' + url)]) : ['Không phát hiện ảnh trùng byte khác URL.']), '',
  '## Media tải lỗi', '',
  ...(failures.length ? failures.map(failure => '- ' + byUrl.get(failure.url).map(reference => reference.title).join(' / ') + ': ' + failure.error + ' — ' + failure.url) : ['Không có ảnh tải lỗi.']), '',
  '## Job chưa có gallery riêng', '', ...report.missingGallery.map(project => '- ' + project.title + ' (' + project.id + ')'), '',
  '## Job chưa có video', '',
  ...(report.missingVideo.length ? report.missingVideo.map(project => '- ' + project.title + ' (' + project.id + ')') : ['Mọi job đều có video.']), '',
  '## Các nội dung cần anh xác nhận trước khi phát hành', '',
  '- NMAX: dữ liệu cũ ghi client Aether Motors, cần xác nhận; tên job và ảnh giữ nguyên.',
  '- Một số video breakdown ghi năm 2025 nhưng job tương ứng ghi 2026; không tự gộp khi chưa xác nhận.',
  '- Chân dung About có tên file ChatGPT_Image: cần xác nhận ảnh dùng công khai.',
  '- Roles, năm, credits và quyền sử dụng cần anh duyệt lại.',
  '- Không công khai rating/vote/testimonial chưa có chứng cứ, ảnh BTS Unsplash hoặc social dẫn đến homepage nền tảng.',
  '- Không giả lập plate/final bằng ảnh khác shot. Chưa có cặp before/after xác nhận.',
];
await writeFile(path.join(root, 'reports/media-audit.md'), lines.join('\n') + '\n');
console.log(JSON.stringify({ jobs: report.jobs, cached: report.downloaded, failures: failures.length, repeatedUrls: urlDuplicates.length, duplicateBytes: byteDuplicates.length }, null, 2));
if (failures.length) process.exitCode = 1;
