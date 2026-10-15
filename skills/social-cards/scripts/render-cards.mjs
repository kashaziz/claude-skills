#!/usr/bin/env node
// Render social cards (LinkedIn / Instagram) from a cards.json + brand.json.
// Usage:
//   node render-cards.mjs <cards.json> [--brand brand.json] [--out dir] [--size card|reel|square]
//                        [--only id,id] [--pdf carousel.pdf] [--video out.mp4 --seconds 3.5 --fade 0.6] [--keep-html]
// Output: <out>/<id>.png per card, optionally a PDF (one page per card) and an MP4 slideshow.
// For an animated reel with music, use render-reel.mjs.
// Needs: Google Chrome or Chromium on PATH (or CHROME=/path), ffmpeg.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, renameSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { tmpdir } from 'node:os';
import { loadBrand, headCss, sceneHtml, FIT_SCRIPT, findChrome } from './lib/scene.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    brand: { type: 'string' }, out: { type: 'string' }, size: { type: 'string', default: 'card' },
    only: { type: 'string' }, video: { type: 'string' }, seconds: { type: 'string', default: '3.5' },
    fade: { type: 'string', default: '0.6' }, pdf: { type: 'string' }, 'keep-html': { type: 'boolean', default: false },
  },
});
if (!positionals[0]) { console.error('usage: render-cards.mjs <cards.json> [options]'); process.exit(1); }

const SIZES = { card: [1080, 1350], reel: [1080, 1920], square: [1080, 1080] };
const [W, H] = SIZES[opt.size] ?? SIZES.card;
const cardsPath = resolve(positionals[0]);
const cardsDir = dirname(cardsPath);
const outDir = resolve(opt.out ?? join(cardsDir, 'out'));
const htmlDir = join(outDir, 'html');
mkdirSync(htmlDir, { recursive: true });

const b = loadBrand(resolve(opt.brand ?? join(cardsDir, 'brand.json')));
let cards = JSON.parse(readFileSync(cardsPath, 'utf8'));
if (Array.isArray(cards.cards)) cards = cards.cards;
if (opt.only) { const ids = opt.only.split(','); cards = cards.filter((c) => ids.includes(c.id)); }
const css = readFileSync(join(HERE, '..', 'templates', 'card.css'), 'utf8');

const html = (s) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${headCss(b, css)}
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:${b.colors.ink}}
</style></head><body>${sceneHtml(s, b, cardsDir, opt.size === 'reel' ? 'reel' : 'card')}<script>${FIT_SCRIPT}</script></body></html>`;

const chrome = findChrome();
const profile = join(tmpdir(), `social-cards-${process.pid}`);
const chromeArgs = ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  `--user-data-dir=${profile}`, '--force-device-scale-factor=1', '--virtual-time-budget=3000'];
// Headless Chrome keeps some window height for itself (87px in Chrome 143). Measure it once with a
// probe page, open the window that much taller, and crop the screenshot back to W×H with ffmpeg.
function viewportOffset() {
  const probe = join(htmlDir, '_probe.html');
  writeFileSync(probe, `<!doctype html><html><head><style>html,body{margin:0;height:${H}px}</style></head><body><script>document.title=innerWidth+'x'+innerHeight</script></body></html>`);
  const r = spawnSync(chrome, [...chromeArgs, `--window-size=${W},${H}`, '--dump-dom', pathToFileURL(probe).href], { encoding: 'utf8' });
  rmSync(probe, { force: true });
  const m = r.stdout.match(/<title>(\d+)x(\d+)/);
  return m ? [W - Number(m[1]), H - Number(m[2])] : [0, 0];
}
const [dx, dy] = viewportOffset();
const pngs = [];
for (const s of cards) {
  const htmlFile = join(htmlDir, `${s.id}.html`);
  const png = join(outDir, `${s.id}.png`);
  writeFileSync(htmlFile, html(s));
  const r = spawnSync(chrome, [...chromeArgs, `--window-size=${W + dx},${H + dy}`, `--screenshot=${png}`, pathToFileURL(htmlFile).href], { encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(png)) { console.error(`chrome failed on ${s.id}\n${r.stderr}`); process.exit(1); }
  if (dx || dy) {
    const tmp = `${png}.tmp.png`;
    const f = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png, '-vf', `crop=${W}:${H}:0:0`, tmp], { encoding: 'utf8' });
    if (f.status !== 0) { console.error(`ffmpeg crop failed on ${s.id}\n${f.stderr}`); process.exit(1); }
    renameSync(tmp, png);
  }
  pngs.push(png);
  console.log(`✓ ${basename(png)}  (${s.layout}, ${s.theme ?? 'dark'})`);
}

if (opt.pdf) {
  // Carousel: one page per card, printed by Chrome at the card size (LinkedIn "document" post).
  const pdfHtml = join(htmlDir, '_carousel.html');
  writeFileSync(pdfHtml, `<!doctype html><html><head><meta charset="utf-8"><style>@page{size:${W}px ${H}px;margin:0}html,body{margin:0}img{display:block;width:${W}px;height:${H}px;page-break-after:always}img:last-child{page-break-after:auto}</style></head><body>${pngs.map((p) => `<img src="${pathToFileURL(p).href}">`).join('')}</body></html>`);
  const out = resolve(opt.pdf);
  const r = spawnSync(chrome, [...chromeArgs, '--no-pdf-header-footer', `--print-to-pdf=${out}`, pathToFileURL(pdfHtml).href], { encoding: 'utf8' });
  if (r.status !== 0 || !existsSync(out)) { console.error(`chrome pdf failed\n${r.stderr}`); process.exit(1); }
  console.log(`✓ ${basename(out)}  (${pngs.length} pages)`);
}
rmSync(profile, { recursive: true, force: true });
if (!opt['keep-html']) rmSync(htmlDir, { recursive: true, force: true });

if (opt.video) {
  // Slideshow: every card held for --seconds, crossfaded with --fade, padded to 9:16 on ink.
  const sec = Number(opt.seconds), fade = Number(opt.fade);
  const [VW, VH] = SIZES.reel;
  const inputs = pngs.flatMap((p) => ['-loop', '1', '-t', String(sec), '-i', p]);
  const pad = pngs.map((_, i) => `[${i}:v]scale=${VW}:-2:flags=lanczos,pad=${VW}:${VH}:(ow-iw)/2:(oh-ih)/2:color=${b.colors.ink},setsar=1,format=yuv420p[v${i}]`);
  let chain = '', last = 'v0';
  for (let i = 1; i < pngs.length; i++) {
    const outl = i === pngs.length - 1 ? 'vout' : `x${i}`;
    chain += `[${last}][v${i}]xfade=transition=fade:duration=${fade}:offset=${(sec * i - fade * i).toFixed(3)}[${outl}];`;
    last = outl;
  }
  const filter = pad.join(';') + ';' + (pngs.length > 1 ? chain.replace(/;$/, '') : '[v0]copy[vout]');
  const out = resolve(opt.video);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', filter, '-map', '[vout]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '22', '-r', '30', '-movflags', '+faststart', out], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(`ffmpeg failed\n${r.stderr}`); process.exit(1); }
  console.log(`✓ ${basename(out)}  (${pngs.length} cards × ${sec}s)`);
}
