#!/usr/bin/env node
// Render an animated 9:16 reel (1080×1920 MP4) from a cards.json + brand.json, the storyboard way:
// one page with every scene stacked, every CSS animation seeked frame by frame, each frame screenshotted
// through the Chrome DevTools protocol and piped to ffmpeg, then a music bed mixed under it.
// Usage:
//   node render-reel.mjs <cards.json> [--brand brand.json] [--out reel.mp4] [--only id,id]
//                       [--fps 30] [--music warm|uplifting|energetic|serious|reflective|none|<file.mp3>]
//                       [--hold 1.5] [--keep-html] [--poster poster.jpg]
//                       [--tts edge|kokoro|none] [--voice <name>] [--rate <+3%|1.05>] [--captions on|off (off by default)] [--tts-python /path]
// Per card: "seconds" sets how long its scene stays (defaults by layout, see lib/scene.mjs);
// "voice" is the sentence spoken over the scene (the scene stretches to fit it); "tts" overrides the
// spoken text (phonetic spelling); "reelCta" replaces the cta text in the reel ("Read the article →").
// Voice engines run through scripts/tts.py; config.json names the Python for each (edge-tts / kokoro-onnx).
// "clip": { file, start, duration, sound } puts a cut of a video in the scene: full bleed on layout "clip"
// (or "hook"), as the top band on any other layout (clipMode: "cover" | "band" overrides). The clip's
// frames are extracted with ffmpeg once (cached in .clips/) and swapped in per frame, so the render stays
// exact; its sound (sound !== false) is laid under the scene and dips under the voice.
// Needs: Google Chrome or Chromium (CHROME=/path), ffmpeg, Node 22+ (global WebSocket and fetch).
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, renameSync, statSync, readdirSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { dirname, resolve, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { loadBrand, headCss, sceneHtml, FIT_SCRIPT, findChrome, DEFAULT_SECONDS } from './lib/scene.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    brand: { type: 'string' }, out: { type: 'string' }, only: { type: 'string' }, fps: { type: 'string', default: '30' },
    music: { type: 'string', default: 'warm' }, hold: { type: 'string', default: '1.5' }, poster: { type: 'string' },
    'keep-html': { type: 'boolean', default: false },
    tts: { type: 'string' }, voice: { type: 'string' }, rate: { type: 'string' }, captions: { type: 'string', default: 'off' }, 'tts-python': { type: 'string' },
  },
});
if (!positionals[0]) { console.error('usage: render-reel.mjs <cards.json> [options]'); process.exit(1); }
const W = 1080, H = 1920, FPS = Number(opt.fps), HOLD = Number(opt.hold);

const cardsPath = resolve(positionals[0]);
const cardsDir = dirname(cardsPath);
const out = resolve(opt.out ?? join(cardsDir, 'reel.mp4'));
mkdirSync(dirname(out), { recursive: true });
const b = loadBrand(resolve(opt.brand ?? join(cardsDir, 'brand.json')));
let cards = JSON.parse(readFileSync(cardsPath, 'utf8'));
if (Array.isArray(cards.cards)) cards = cards.cards;
if (opt.only) { const ids = opt.only.split(','); cards = cards.filter((c) => ids.includes(c.id)); }
const css = readFileSync(join(HERE, '..', 'templates', 'card.css'), 'utf8');
const reelCss = readFileSync(join(HERE, '..', 'templates', 'reel.css'), 'utf8');

// ---- voice: one audio file per card that has "voice", cached by text in .voice/ beside the output ----
const VOICE_LEAD = 0.4, VOICE_TAIL = 0.7; // silence before and after the spoken line inside its scene
const config = existsSync(join(HERE, '..', 'config.json')) ? JSON.parse(readFileSync(join(HERE, '..', 'config.json'), 'utf8')) : {};
const engine = opt.tts ?? (cards.some((c) => c.voice) ? (config.tts?.default ?? 'edge') : 'none');
const ttsCfg = config.tts?.[engine] ?? {};
const ttsPython = opt['tts-python'] ?? process.env.TTS_PYTHON ?? ttsCfg.python ?? 'python3';
const ttsVoice = opt.voice ?? ttsCfg.voice, ttsRate = opt.rate ?? ttsCfg.rate;
const voiceDir = join(dirname(out), '.voice');
function speak(card) {
  const text = card.tts ?? card.voice;
  const key = createHash('sha1').update([engine, ttsVoice, ttsRate, text].join('|')).digest('hex').slice(0, 12);
  const audio = join(voiceDir, `${key}.${engine === 'kokoro' ? 'wav' : 'mp3'}`), meta = join(voiceDir, `${key}.json`);
  if (!existsSync(audio) || !existsSync(meta)) {
    mkdirSync(voiceDir, { recursive: true });
    const args = [join(HERE, 'tts.py'), '--engine', engine, '--text', text, '--out', audio];
    if (ttsVoice) args.push('--voice', ttsVoice); if (ttsRate) args.push('--rate', ttsRate);
    const r = spawnSync(ttsPython, args, { encoding: 'utf8' });
    if (r.status !== 0) { console.error(`tts failed on ${card.id} (${engine} via ${ttsPython})\n${r.stderr.slice(-800)}`); process.exit(1); }
    writeFileSync(meta, r.stdout.trim());
    console.log(`  voice ${card.id}: ${JSON.parse(r.stdout).duration.toFixed(1)}s`);
  }
  return { audio, ...JSON.parse(readFileSync(meta, 'utf8')) };
}
const voices = new Map();
if (engine !== 'none') for (const c of cards) if (c.voice) voices.set(c.id, speak(c));

// ---- clips: a cut of a video as JPEG frames at the reel frame rate, cached in .clips/ beside the output ----
const BAND_H = Math.round(H * 0.60); // .mode-reel .band height (60cqw)
const clipDir = join(dirname(out), '.clips');
function extractClip(card) {
  const c = card.clip; const file = resolve(cardsDir, c.file);
  const mode = c.mode ?? card.clipMode ?? (card.layout === 'clip' || card.layout === 'hook' ? 'cover' : 'band');
  const [cw, ch] = mode === 'cover' ? [W, H] : [W, BAND_H];
  const key = createHash('sha1').update([file, statSync(file).mtimeMs, c.start, c.duration, FPS, cw, ch].join('|')).digest('hex').slice(0, 12);
  const dir = join(clipDir, key);
  if (!existsSync(join(dir, '0001.jpg'))) {
    mkdirSync(dir, { recursive: true });
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(c.start ?? 0), '-t', String(c.duration), '-i', file,
      '-vf', `fps=${FPS},scale=${cw}:${ch}:force_original_aspect_ratio=increase,crop=${cw}:${ch}`, '-q:v', '3', join(dir, '%04d.jpg')], { encoding: 'utf8' });
    if (r.status !== 0) { console.error(`ffmpeg clip extract failed on ${card.id}\n${r.stderr}`); process.exit(1); }
    console.log(`  clip ${card.id}: ${c.duration}s from ${basename(file)} @${c.start ?? 0}s (${mode})`);
  }
  const frames = readdirSync(dir).filter((f) => f.endsWith('.jpg')).length;
  return { base: pathToFileURL(dir).href + '/', frames, mode, file, start: c.start ?? 0, duration: c.duration, sound: c.sound !== false };
}
const clips = new Map();
for (const c of cards) if (c.clip) clips.set(c.id, extractClip(c));

// ---- the stage page -------------------------------------------------------------------------
let t = 0;
const scenes = cards.map((s) => {
  const start = t; const v = voices.get(s.id); const c = clips.get(s.id);
  let want = Number(s.seconds ?? (c && s.layout === 'clip' ? c.duration : DEFAULT_SECONDS[s.layout]) ?? 4);
  if (c) want = Math.max(want, c.duration);
  t += v ? Math.max(want, VOICE_LEAD + v.duration + VOICE_TAIL) : want;
  return { s, start, end: t, voice: v, clip: c };
});
const total = t + HOLD;
// Captions: the spoken words in lines of up to 5, each word with its time inside the scene.
const captions = ({ voice }) => {
  if (!voice || opt.captions === 'off') return '';
  const words = voice.words.map((w, i) => ({ ...w, s: w.s + VOICE_LEAD, e: w.e + VOICE_LEAD, line: Math.floor(i / 5) }));
  return `<p class="cap" data-caps='${JSON.stringify(words).replace(/'/g, '&#39;')}'></p>`;
};
const SEEK_SCRIPT = `
const stage=document.getElementById('stage');const total=${total * 1000};
const frames=[...stage.querySelectorAll('.frame')];const segs=[...stage.querySelectorAll('.seg i')];
const bounds=frames.map(f=>[+f.dataset.start*1000,+f.dataset.end*1000]);
const ease=x=>1-Math.pow(1-x,3);
function countUp(frame,local){const el=frame.querySelector('.stat');if(!el)return;const target=el.dataset.stat||'';
 const num=Number(target.replace(/[^0-9.]/g,''));if(!/^[$€£]?[0-9][0-9,.]*/.test(target)||Number.isNaN(num))return;
 const p=ease(Math.min(1,Math.max(0,(local-250)/1200)));const dec=(target.split('.')[1]||'').length;
 el.textContent=p>=1?target:target.replace(/[0-9][0-9,.]*/,(num*p).toFixed(dec));}
const caps=frames.map(f=>{const el=f.querySelector('.cap');return el?{el,words:JSON.parse(el.dataset.caps)}:null;});
function caption(c,sec){const ws=c.words;let cur=-1;for(let i=0;i<ws.length;i++)if(ws[i].s<=sec)cur=i;
 const last=ws[ws.length-1];const show=cur>=0&&sec<last.e+0.4;const key=show?ws[cur].line+':'+cur:'';if(c.el.dataset.key===key)return;c.el.dataset.key=key;
 c.el.replaceChildren();if(!show)return;ws.filter(w=>w.line===ws[cur].line).forEach((w,j,arr)=>{const sp=document.createElement('span');sp.className='cw'+(w.s<=sec?' on':'');sp.textContent=w.w;c.el.append(sp);if(j<arr.length-1)c.el.append(' ');});}
const FPS=${FPS};
function clipFrame(frame,local){const img=frame.querySelector('.clip-frame');if(!img)return;const n=Math.min(+img.dataset.frames,Math.max(1,Math.floor(local/1000*FPS)+1));
 const src=img.dataset.base+String(n).padStart(4,'0')+'.jpg';if(img.getAttribute('src')===src)return;img.setAttribute('src',src);return img.decode().catch(()=>{});}
window.__seek=function(ms){const t=Math.min(ms,total-1);let active=bounds.findIndex(([s,e])=>t>=s&&t<e);if(active<0)active=frames.length-1;let wait;
 frames.forEach((frame,i)=>{const on=i===active;if(frame.classList.contains('on')!==on)frame.classList.toggle('on',on);if(!on)return;
  const local=t-bounds[i][0];for(const a of frame.getAnimations({subtree:true})){a.pause();a.currentTime=local;}countUp(frame,local);if(caps[i])caption(caps[i],local/1000);wait=clipFrame(frame,local);});
 return wait;
 segs.forEach((seg,i)=>{const [s,e]=bounds[i];seg.style.width=t>=e?'100%':t<s?'0%':((t-s)/(e-s)*100)+'%';});};
window.__ready=(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.complete?null:new Promise(r=>{img.onload=img.onerror=()=>r();})));
 ${FIT_SCRIPT.replace('document.fonts.ready.then(function(){', '(function(){').replace(/\}\);$/, '})();')}})();
window.__seek(0);
if(location.hash!=='#render'){const t0=performance.now();const tick=()=>{window.__seek((performance.now()-t0)%total);requestAnimationFrame(tick);};requestAnimationFrame(tick);}`;

const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
${headCss(b, css)}
${reelCss}
*{box-sizing:border-box}html,body{margin:0;width:${W}px;height:${H}px;overflow:hidden;background:#000}
</style></head><body>
<div class="stage" id="stage">
  <div class="progress" aria-hidden="true">${scenes.map(() => '<span class="seg"><i></i></span>').join('')}</div>
  ${scenes.map((sc) => { const cap = captions(sc); const html = sceneHtml(sc.s, b, cardsDir, 'reel', { clip: sc.clip }); const scene = cap ? html.replace(/<\/div>\s*$/, `${cap}</div>`).replace('class="scene ', 'class="scene has-cap ') : html;
    return `<div class="frame" data-start="${sc.start}" data-end="${sc.end}" style="--dur:${sc.end - sc.start}s">${scene}</div>`; }).join('\n')}
</div>
<script>${SEEK_SCRIPT}</script></body></html>`;
const htmlFile = out.replace(/\.mp4$/, '.reel.html');
writeFileSync(htmlFile, page);

// ---- Chrome over the DevTools protocol ----------------------------------------------------------
const chrome = findChrome();
const profile = join(tmpdir(), `social-reel-${process.pid}`);
const proc = spawn(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  '--remote-debugging-port=0', '--remote-allow-origins=*', `--user-data-dir=${profile}`, `--window-size=${W},${H + 100}`, '--force-device-scale-factor=1', 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'] });
const wsUrl = await new Promise((res, rej) => {
  let buf = ''; proc.stderr.on('data', (d) => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); });
  proc.on('exit', (c) => rej(new Error(`chrome exited ${c}\n${buf}`))); setTimeout(() => rej(new Error(`chrome did not start\n${buf}`)), 15000);
});
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let nextId = 1; const pending = new Map(); const listeners = [];
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); } else if (m.method) listeners.forEach((l) => l(m)); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const id = nextId++; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params, sessionId })); });
const once = (method, sessionId) => new Promise((res) => listeners.push(function l(m) { if (m.method === method && m.sessionId === sessionId) { listeners.splice(listeners.indexOf(l), 1); res(m.params); } }));

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }, sessionId);
const loaded = once('Page.loadEventFired', sessionId);
await send('Page.navigate', { url: pathToFileURL(htmlFile).href + '#render' }, sessionId);
await loaded;
const evaluate = (expression) => send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId).then((r) => r.result?.value);
await evaluate('window.__ready');

// ---- frames → ffmpeg --------------------------------------------------------------------------
const silent = out.replace(/\.mp4$/, '.silent.mp4');
const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const encDone = new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exit ${c}`)))));
const frames = Math.round(total * FPS);
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await evaluate(`window.__seek(${(f * 1000) / FPS})`);
  const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } }, sessionId);
  const buf = Buffer.from(data, 'base64');
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once('drain', r));
  if (opt.poster && f === Math.round(FPS * 0.8)) writeFileSync(resolve(opt.poster), buf);
  if (f % FPS === 0) process.stdout.write(`\r  ${Math.round((f / frames) * 100)}%  ${f}/${frames} frames`);
}
enc.stdin.end();
await encDone;
process.stdout.write('\r');
ws.close();
await new Promise((r) => { proc.once('exit', r); proc.kill(); setTimeout(r, 5000); });
rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
if (!opt['keep-html']) rmSync(htmlFile, { force: true });

// ---- music bed ----------------------------------------------------------------------------------
// Mixkit tracks ("Mixkit Stock Music Free License": commercial use in videos, no attribution; the files
// are not redistributed, so they are downloaded to the skill's music/ folder on first use).
const TRACKS = {
  uplifting: 'https://assets.mixkit.co/music/31/31.mp3', warm: 'https://assets.mixkit.co/music/839/839.mp3',
  energetic: 'https://assets.mixkit.co/music/51/51.mp3', serious: 'https://assets.mixkit.co/music/720/720.mp3',
  reflective: 'https://assets.mixkit.co/music/22/22.mp3',
};
async function trackFile(mood) {
  if (!(mood in TRACKS)) return resolve(mood); // a file path
  const dir = join(HERE, '..', 'music'); const file = join(dir, `${mood}.mp3`);
  if (existsSync(file)) return file;
  mkdirSync(dir, { recursive: true });
  const res = await fetch(TRACKS[mood], { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`music download HTTP ${res.status}: ${TRACKS[mood]}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}
const voiceParts = scenes.filter((sc) => sc.voice).map((sc) => ({ at: sc.start + VOICE_LEAD, dur: sc.voice.duration, file: sc.voice.audio }));
const clipParts = scenes.filter((sc) => sc.clip?.sound).map((sc) => ({ at: sc.start, ...sc.clip }));
const r0 = 0.4;
const duckExpr = (parts) => parts.map((p) => `clip(min(t-${p.at.toFixed(2)}+${r0},${(p.at + (p.dur ?? p.duration)).toFixed(2)}+${r0}-t)/${r0},0,1)`).reduce((a, b) => `max(${a},${b})`);
if (opt.music !== 'none' || voiceParts.length || clipParts.length) {
  // Layers: silence as long as the video (so the mix is exactly as long), the voice lines at their
  // offsets, and the music bed, which dips while a voice line plays (0.4 s ramps), as in the storyboard mix.
  const T = total.toFixed(3);
  const inputs = ['-i', silent, '-f', 'lavfi', '-t', T, '-i', 'anullsrc=r=48000:cl=stereo'];
  const chains = [], labels = [];
  for (const [i, p] of voiceParts.entries()) {
    const n = inputs.filter((x) => x === '-i').length; inputs.push('-i', p.file);
    const ms = Math.round(p.at * 1000);
    chains.push(`[${n}:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-16:TP=-1.5,aresample=48000,adelay=${ms}|${ms}[v${i}]`); labels.push(`[v${i}]`);
  }
  for (const [i, p] of clipParts.entries()) {
    // The clip's own sound, levelled, faded at both ends, and dipped while a voice line plays.
    const n = inputs.filter((x) => x === '-i').length; inputs.push('-ss', String(p.start), '-t', String(p.duration), '-i', p.file);
    const ms = Math.round(p.at * 1000);
    const duck = voiceParts.length ? `*(1-0.8*${duckExpr(voiceParts)})` : '';
    chains.push(`[${n}:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-18:TP=-1.5,aresample=48000,afade=t=in:d=0.2,afade=t=out:st=${Math.max(0, p.duration - 0.4).toFixed(2)}:d=0.4,adelay=${ms}|${ms},volume='1${duck}':eval=frame[c${i}]`); labels.push(`[c${i}]`);
  }
  if (opt.music !== 'none') {
    const music = await trackFile(opt.music);
    const n = inputs.filter((x) => x === '-i').length; inputs.push('-stream_loop', '-1', '-i', music);
    const level = voiceParts.length || clipParts.length ? 0.35 : 0.5;
    const speech = [...voiceParts, ...clipParts];
    const duck = speech.length ? duckExpr(speech) : '0';
    chains.push(`[${n}:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-24:TP=-2,aresample=48000,atrim=0:${T},asetpts=N/SR/TB,volume='${level}*(1-0.8*${duck})':eval=frame,afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, total - 1.5).toFixed(2)}:d=1.5[m]`); labels.push('[m]');
  }
  chains.push(`[1:a]${labels.join('')}amix=inputs=${labels.length + 1}:duration=first:normalize=0[aout]`);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', chains.join(';'),
    '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', out], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(`ffmpeg audio mix failed\n${r.stderr}`); process.exit(1); }
  rmSync(silent, { force: true });
} else {
  renameSync(silent, out);
}
console.log(`✓ ${basename(out)}  ${scenes.length} scenes, ${total.toFixed(1)}s, ${frames} frames, ${(statSync(out).size / 1e6).toFixed(1)} MB, ${((Date.now() - t0) / 1000).toFixed(0)}s render, music: ${opt.music}, voice: ${engine}${voices.size ? ` (${voices.size} lines)` : ''}${clips.size ? `, clips: ${clips.size}` : ''}`);
