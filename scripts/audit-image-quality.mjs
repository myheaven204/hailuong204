import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'reports/media-quality');
const source = await readFile(path.join(root, 'src/data/projects.ts'), 'utf8');
const projects = JSON.parse(source.slice(source.indexOf('= [', source.indexOf('export const PROJECTS')) + 2, source.indexOf('\n];') + 2));
const manifest = JSON.parse(await readFile(path.join(root, 'src/data/media-manifest.json'), 'utf8'));
const sizes = JSON.parse(await readFile(path.join(root, 'src/data/media-dimensions.json'), 'utf8'));
const issues = JSON.parse(await readFile(path.join(root, 'src/data/media-issues.json'), 'utf8'));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const usage = url => projects.flatMap(project => [project.image === url ? { id: project.id, title: project.title, position: 'Cover gốc' } : undefined, ...(project.gallery ?? []).flatMap((image, index) => image === url ? [{ id: project.id, title: project.title, position: 'Gallery ' + (index + 1) }] : [])].filter(Boolean));
const coverIndexes = { 'lavie-tvc-2025': 6, 'grab-dejavu': 2, 'mbbank-priority': 2, 'nuvi-mv': 1, 'rong-do-gducke-mv': 5, 'heineken-tvc-2023': 7 };
const isCompact = size => size && (size.width < 1280 || size.height < 600 || size.height > size.width);
await mkdir(path.join(output, 'thumbnails'), { recursive: true });
const assets = await Promise.all(Object.entries(manifest).map(async ([url, local]) => {
  const buffer = await readFile(path.join(root, 'public', local));
  const metadata = await sharp(buffer).metadata();
  return { url, local, width: metadata.width, height: metadata.height, bytes: buffer.length, sha256: createHash('sha256').update(buffer).digest('hex'), usage: usage(url) };
}));
const mismatches = assets.filter(asset => sizes[asset.url]?.width !== asset.width || sizes[asset.url]?.height !== asset.height);
const flagged = assets.filter(asset => asset.width < 1280).map((asset, index) => ({ ...asset, number: index + 1, severity: asset.width < 960 ? 'Ưu tiên thay' : 'Cân nhắc thay khi dùng khổ lớn', reason: asset.height > asset.width ? 'Ảnh dọc: không dùng làm cover ngang lớn; cần duyệt ở kích thước thật.' : 'Thiếu pixel cho hiển thị ngang lớn; không phải kết luận độ nét nghệ thuật.', thumbnail: 'thumbnails/' + String(index + 1).padStart(2, '0') + '.webp' }));
const hashes = new Map();
for (const asset of assets) hashes.set(asset.sha256, [...(hashes.get(asset.sha256) ?? []), asset]);
const duplicates = [...hashes.values()].filter(group => group.length > 1);
const repeatedWithinJob = projects.flatMap(project => {
  const frames = [project.image, ...(project.gallery ?? [])];
  const repeated = [...new Set(frames.filter((frame, index) => frames.indexOf(frame) !== index))];
  return repeated.length ? [{ id: project.id, title: project.title, repeated }] : [];
});
const missingVideos = projects.filter(project => !project.youtubeId && !project.vimeoId).map(({ id, title }) => ({ id, title }));
const visualReviewPairs = [['durex-thematic-gay-tvc-2022', 'durex-thematic-les-tvc-2022']].map(ids => ({ projects: ids.map(id => { const project = projects.find(item => item.id === id); return { id, title: project.title, url: project.image, number: flagged.find(asset => asset.url === project.image)?.number }; }), reason: 'Hai cover có hình ảnh rất giống nhau khi duyệt contact sheet, nhưng file không trùng hệt byte. Đây là hai job riêng; cần owner xác nhận cover đúng, không tự xóa hoặc đổi liên kết.' }));
const covers = projects.map(project => {
  const preferred = project.gallery?.[coverIndexes[project.id]] ?? project.image;
  const frames = [...new Set([project.image, ...(project.gallery ?? [])])].filter(frame => !issues.some(issue => issue.url === frame && issue.error === 'HTTP 404'));
  const selected = isCompact(sizes[preferred]) ? frames.find(frame => !isCompact(sizes[frame])) ?? preferred : preferred;
  return { id: project.id, title: project.title, original: project.image, preferred, selected, dimensions: sizes[selected], changed: preferred !== selected };
});
const summary = { projects: projects.length, assets: assets.length, below1280: flagged.length, below960: flagged.filter(asset => asset.width < 960).length, affectedJobs: new Set(flagged.flatMap(asset => asset.usage.map(job => job.id))).size, duplicateFileGroups: duplicates.length, repeatedWithinJob: repeatedWithinJob.length, missingVideos: missingVideos.length, previewCoverUpgrades: covers.filter(cover => cover.changed).length, dimensionMismatches: mismatches.length };
const portraitMetadata = await sharp(path.join(root, 'public/images/hai-luong-portrait.webp')).metadata();
const currentAboutPhoto = { local: '/images/hai-luong-portrait.webp', width: portraitMetadata.width, height: portraitMetadata.height, note: 'Ảnh About hiện tại được owner cung cấp; kiểm tra riêng, không nằm trong 265 ảnh archive.' };
const note = 'Đây là kiểm tra giới hạn độ phân giải của file local, không suy đoán độ nét nghệ thuật. Không xóa ảnh, đổi tên job hoặc chuyển ảnh sang job khác. Ảnh 1800px cũng không bảo đảm đủ cho Retina/4K. File -640.webp là thumbnail responsive được tạo có chủ đích, không tính là bản gốc mờ.';
await writeFile(path.join(output, 'audit.json'), JSON.stringify({ generated: new Date().toISOString(), summary, note, flagged, missingVideos, duplicates, repeatedWithinJob, visualReviewPairs, currentAboutPhoto, covers, assets }, null, 2) + '\n');
const csvCell = value => '"' + String(value).replaceAll('"', '""') + '"';
const rows = [['STT', 'Job ID', 'Tên job gốc', 'Vị trí gốc', 'Width', 'Height', 'Mức ưu tiên', 'File local', 'URL gốc'], ...flagged.flatMap(asset => (asset.usage.length ? asset.usage : [{ id: '', title: 'Chưa gắn project', position: '' }]).map(job => [asset.number, job.id, job.title, job.position, asset.width, asset.height, asset.severity, asset.local, asset.url]))];
await writeFile(path.join(output, 'images-to-replace.csv'), '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n');
await Promise.all(flagged.map(asset => sharp(path.join(root, 'public', asset.local)).resize(560, 315, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(path.join(output, asset.thumbnail))));
const cards = flagged.map(asset => '<article><a href="../../public' + escape(asset.local) + '" target="_blank" rel="noreferrer"><img src="' + asset.thumbnail + '" width="560" height="315" loading="lazy" alt="' + escape(asset.usage[0]?.title ?? 'Ảnh gốc') + '"></a><div><span class="tag">' + String(asset.number).padStart(2, '0') + ' · ' + asset.width + ' × ' + asset.height + '</span><h2>' + asset.usage.map(job => escape(job.title)).join(' / ') + '</h2><p>' + escape(asset.severity) + '</p><small>' + escape(asset.reason) + '</small><ul>' + asset.usage.map(job => '<li><a href="/concepts/motion-gallery/project/' + escape(job.id) + '">' + escape(job.id) + '</a> — ' + escape(job.position) + '</li>').join('') + '</ul><code>' + escape(asset.local) + '</code></div></article>').join('\n');
const styles = 'html{color-scheme:dark}body{margin:0;background:#0b0d0d;color:#edeee8;font-family:Arial,sans-serif;line-height:1.6}*{box-sizing:border-box}header,main,footer{max-width:1420px;margin:auto;padding:40px 30px}h1{font-size:clamp(28px,5vw,56px);line-height:1.1}h2{font-size:17px;line-height:1.4}header p{max-width:950px;color:#a5aca8}.summary{color:#acc0ff;font-weight:bold}main{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:25px}article{border:1px solid #303635;background:#151918;min-width:0}article>div{padding:20px}article img{display:block;width:100%;height:230px;object-fit:contain;background:#050707}.tag{font-size:13px;color:#acc0ff}article p{color:#e5ac86;font-weight:bold}small{color:#aeb5b1}a{color:#acc0ff}a:focus-visible{outline:3px solid #acc0ff;outline-offset:4px}ul{font-size:12px;padding-left:16px}code{font-size:11px;overflow-wrap:anywhere}footer{color:#aeb5b1}@media(max-width:1000px){main{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){main{grid-template-columns:1fr;padding:20px}header,footer{padding:30px 20px}}';
const html = '<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ảnh cần duyệt — HAI LUONG</title><style>' + styles + '</style><header><p>HAI LUONG / OWNER REVIEW / 02.10.2026</p><h1>Những ảnh cần anh duyệt lại.</h1><p class="summary">' + summary.assets + ' ảnh được đo · ' + flagged.length + ' file dưới 1280px · ' + summary.below960 + ' file ưu tiên thay · ' + summary.affectedJobs + ' project liên quan</p><p>' + escape(note) + '</p><p>Ưu tiên export frame thật từ master ở 1920px trở lên (tốt hơn: 2560px cho khổ lớn). Không upscale/AI-sharpen thay cho dữ liệu gốc. Bấm ảnh để xem file hiện tại. Cover preview đã ưu tiên frame nét hơn từ chính job đó.</p><a href="images-to-replace.csv">Tải danh sách CSV</a><p>Chưa có video: ' + missingVideos.map(project => escape(project.title) + ' (' + escape(project.id) + ')').join(', ') + '. Nhóm file trùng hệt byte: ' + duplicates.length + '. Job có lặp cùng URL: ' + repeatedWithinJob.length + ' (gallery đã deduplicate khi hiển thị).</p></header><main>' + cards + '</main><footer>Giữ nguyên tên và vị trí media của archive gốc. Chưa xóa bất kỳ file nào. Chỉ phát hiện duplicate giống hệt byte; không xác nhận mọi ảnh gần giống nhau về nội dung.</footer></html>';
const reviewNotice = '<section style="grid-column:1/-1"><h2>Cover giống nhau cần anh xác nhận</h2>' + visualReviewPairs.map(pair => '<p>' + pair.projects.map(project => escape(project.title) + ' — ảnh ' + project.number).join(' / ') + '</p><p>' + escape(pair.reason) + '</p>').join('') + '</section>';
await writeFile(path.join(output, 'index.html'), html.replace('<main>', '<main>' + reviewNotice).replaceAll('<h2></h2>', '<h2>Ảnh chưa gắn project</h2>'));
for (let start = 0; start < flagged.length; start += 16) {
  const batch = flagged.slice(start, start + 16);
  const height = 125 + Math.ceil(batch.length / 4) * 250;
  const layers = [{ input: Buffer.from('<svg width="1280" height="' + height + '" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0b0d0d"/><text x="25" y="46" fill="#eef0e8" font-family="Arial" font-size="28" font-weight="bold">HAI LUONG — IMAGE QUALITY REVIEW</text><text x="25" y="82" fill="#acc0ff" font-family="Arial" font-size="17">' + (start + 1) + '–' + (start + batch.length) + ' / ' + flagged.length + ' files below 1280px · Original project associations preserved</text></svg>'), left: 0, top: 0 }];
  for (const [index, asset] of batch.entries()) {
    const left = (index % 4) * 320;
    const top = 115 + Math.floor(index / 4) * 250;
    const image = await sharp(path.join(output, asset.thumbnail)).resize(300, 170, { fit: 'contain', background: '#151918' }).toBuffer();
    layers.push({ input: image, left: left + 10, top });
    const title = asset.usage[0]?.title ?? 'Ảnh chưa gắn project';
    const label = '<svg width="320" height="70" xmlns="http://www.w3.org/2000/svg"><text x="10" y="25" fill="#acc0ff" font-family="Arial" font-size="14">' + String(asset.number).padStart(2, '0') + ' / ' + asset.width + ' × ' + asset.height + '</text><text x="10" y="48" fill="#eef0e8" font-family="Arial" font-size="12">' + escape(title.length > 40 ? title.slice(0, 39) + '…' : title) + '</text></svg>';
    layers.push({ input: Buffer.from(label), left, top: top + 170 });
  }
  await sharp({ create: { width: 1280, height, channels: 3, background: '#0b0d0d' } }).composite(layers).jpeg({ quality: 92 }).toFile(path.join(output, 'contact-sheet-' + (Math.floor(start / 16) + 1) + '.jpg'));
}
console.log(JSON.stringify(summary, null, 2));
