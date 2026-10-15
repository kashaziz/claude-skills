// Shared by render-cards.mjs (stills) and render-reel.mjs (video): brand loading, the scene markup
// for one card, and the Chrome launcher. The look lives in templates/card.css.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const fileUrl = (p, base) => (p ? pathToFileURL(resolve(base, p)).href : '');
const isNum = (v) => v.length <= 9 && /^[$€£]?[0-9]/.test(v);
// Words as spans so the reel can reveal them one by one (--w is the word index).
const words = (text) => String(text ?? '').split(/\s+/).filter(Boolean).map((w, i) => `<span class="w" style="--w:${i}">${esc(w)}</span>`).join(' ');

/** Seconds a reel scene stays on screen when the card does not say. */
export const DEFAULT_SECONDS = { hook: 3.5, photo: 3.5, clip: 5, cta: 3.5, quote: 4.5, 'big-stat': 4.5, 'fact-table': 5, summary: 5, takeaway: 5, checklist: 5.5, 'chip-grid': 5.5, steps: 6 };

export function loadBrand(brandPath) {
  const brand = JSON.parse(readFileSync(brandPath, 'utf8'));
  const base = dirname(brandPath);
  const c = brand.colors ?? {};
  const colors = {
    ink: c.ink ?? '#15171C', raised: c.raised ?? '#1F2229', accent: c.accent ?? '#B5481A',
    accentFg: c.accentFg ?? c.paper ?? '#F5F3EE', accentOnInk: c.accentOnInk ?? c.accent ?? '#B5481A',
    paper: c.paper ?? '#F5F3EE', muted: c.muted ?? '#9A9DA4', line: c.line ?? '#D6D2C8',
  };
  const fonts = brand.fonts ?? {};
  const font = (role, fallback) => {
    const f = fonts[role];
    if (!f) return { face: '', family: fallback };
    const face = f.file ? `@font-face{font-family:"${f.family}";src:url("${fileUrl(f.file, base)}") format("woff2");font-weight:${f.weight ?? '400 700'};font-display:block;}` : '';
    return { face, family: `"${f.family}", ${fallback}` };
  };
  return {
    brand, colors,
    display: font('display', 'Georgia, serif'), body: font('body', 'system-ui, sans-serif'), mono: font('mono', 'ui-monospace, monospace'),
    logo: brand.logo ? fileUrl(brand.logo, base) : '',
  };
}

/** The <style> head shared by every page: font faces, brand tokens, the card stylesheet. */
export function headCss(b, css) {
  return `${b.display.face}${b.body.face}${b.mono.face}
:root{--p-ink:${b.colors.ink};--p-raised:${b.colors.raised};--p-accent:${b.colors.accent};--p-accent-fg:${b.colors.accentFg};--p-accent-on-ink:${b.colors.accentOnInk};--p-paper:${b.colors.paper};--p-muted:${b.colors.muted};--p-line:${b.colors.line};
--font-display:${b.display.family};--font-body:${b.body.family};--font-mono:${b.mono.family};}
${css}`;
}

function bodyFor(s) {
  const h = s.headline ? `<h2 class="h a-2">${esc(s.headline)}</h2>` : '';
  const eyebrow = s.eyebrow ? `<p class="eyebrow a-2">${esc(s.eyebrow)}</p>` : '';
  const lede = s.body ? `<p class="lede a-3">${esc(s.body)}</p>` : '';
  const rows = (r) => (r ? `<dl class="rows a-4">${r.map((x) => `<div class="row"><dt>${esc(x.label)}</dt><dd class="${isNum(x.value) ? 'num' : ''}">${esc(x.value)}${x.was ? `<span class="was">was ${esc(x.was)}</span>` : ''}</dd></div>`).join('')}</dl>` : '');
  switch (s.layout) {
    case 'hook':
      return `${eyebrow}<h2 class="hook a-2">${words(s.headline)}</h2>${lede}`;
    case 'summary': case 'takeaway':
      return `${eyebrow}${h}${lede}${s.bullets ? `<ul class="bullets a-4">${s.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}`;
    case 'big-stat': {
      const v = s.stat.value; const len = v.length <= 3 ? 's' : v.length <= 6 ? 'm' : 'l';
      return `${eyebrow}<div class="stat a-2" data-stat="${esc(v)}" data-len="${len}">${esc(v)}</div><p class="stat-label a-3">${esc(s.stat.label)}</p>${h.replace('a-2', 'a-3')}${lede}${rows(s.rows)}`;
    }
    case 'fact-table':
      return `${eyebrow}${h}${lede}${rows(s.rows)}`;
    case 'chip-grid':
      return `${eyebrow}${h}${lede}<ul class="chips a-4">${s.chips.items.map((it, i) => {
        const [t, sub] = Array.isArray(it) ? it : [it, null];
        return `<li class="chip${s.chips.highlight === i ? ' hi' : ''}">${esc(t)}${sub ? `<small>${esc(sub)}</small>` : ''}</li>`;
      }).join('')}</ul>`;
    case 'quote':
      return `${eyebrow}<span class="qmark a-2" aria-hidden="true">“</span><blockquote class="quote a-2">${words(s.quote.text)}</blockquote><p class="speaker a-3">${esc(s.quote.speaker ?? '')}</p>${s.quote.context ? `<p class="context a-3">${esc(s.quote.context)}</p>` : ''}`;
    case 'steps':
      return `${eyebrow}${h}${lede}<ol class="steps a-4">${s.steps.map((st, i) => `<li class="step"><span class="n">${esc(st.n ?? String(i + 1).padStart(2, '0'))}</span><div><div class="st">${esc(st.title)}</div>${st.text ? `<p class="sb">${esc(st.text)}</p>` : ''}</div></li>`).join('')}</ol>`;
    case 'checklist':
      return `${eyebrow}${h}${lede}<ul class="checks a-4">${s.checks.map((k) => {
        const known = k.known !== false;
        return `<li class="check ${known ? 'known' : 'unknown'}"><span class="mark">${known ? '✓' : '?'}</span><span class="check-text">${esc(k.text ?? k)}</span></li>`;
      }).join('')}</ul>`;
    case 'photo': case 'clip':
      return `${eyebrow}${h}${lede}`;
    case 'cta':
      return `${eyebrow}${h}${lede}<span class="cta-btn a-4">${esc(s.button ?? 'Read the full article →')}</span>`;
    default:
      throw new Error(`unknown layout "${s.layout}" on card ${s.id}`);
  }
}

/** One card as a .scene element. mode: 'card' (4:5 still) or 'reel' (9:16 video scene). */
/** One card as a .scene element. mode: 'card' (4:5 still) or 'reel' (9:16 video scene).
 *  extra.clip = { base, frames, mode: 'cover' | 'band' } when the reel renderer extracted a clip for this card. */
export function sceneHtml(s, b, cardsDir, mode, extra = {}) {
  const theme = s.theme ?? 'dark';
  const clip = extra.clip;
  const clipImg = clip ? `<img class="clip-frame" data-base="${clip.base}" data-frames="${clip.frames}" src="${clip.base}0001.jpg" alt="">` : '';
  const imageMode = clip ? null : s.image ? (s.imageMode ?? (s.layout === 'photo' || s.layout === 'hook' ? 'cover' : 'band')) : null;
  const photo = imageMode === 'cover' ? `<div class="photo-bg"><img src="${fileUrl(s.image, cardsDir)}" alt=""></div>` : clip?.mode === 'cover' ? `<div class="clip-bg">${clipImg}</div>` : '';
  const band = imageMode === 'band' ? `<div class="band" style="${s.imageFocus ? `--band-focus:${s.imageFocus};` : ''}${s.bandHeight ? `--band-h:${s.bandHeight};` : ''}"><img src="${fileUrl(s.image, cardsDir)}" alt=""></div>`
    : clip?.mode === 'band' ? `<div class="band band-clip">${clipImg}</div>` : '';
  const cta = mode === 'reel' && s.reelCta !== undefined ? s.reelCta : s.cta; // a reel viewer does not swipe
  return `<div class="scene theme-${theme} layout-${s.layout} mode-${mode}${band ? ' has-band' : ''}${clip ? ' has-clip' : ''}" data-id="${esc(s.id)}">
  ${photo}${band}
  <div class="scene-top a-1">
    <span class="pill"><span class="dot"></span>${esc(s.label ?? b.brand.name ?? '')}</span>
    <span class="brand">${b.logo ? `<img src="${b.logo}" alt="">` : ''}<span class="brand-name">${esc(b.brand.name ?? '')}</span></span>
  </div>
  <div class="scene-main"><div class="scene-body">${bodyFor(s)}</div></div>
  <div class="scene-foot a-4">
    <span class="sources">${esc(s.source ?? b.brand.site ?? '')}</span>
    ${cta ? `<span class="next">${esc(cta)}</span>` : ''}
  </div>
</div>`;
}

/** Shrinks a scene body that is taller than its space. Runs after the fonts load. */
export const FIT_SCRIPT = `document.fonts.ready.then(function(){document.querySelectorAll('.scene').forEach(function(sc){
var m=sc.querySelector('.scene-main'),b=sc.querySelector('.scene-body'),cs=getComputedStyle(m);
var room=m.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);
if(b.scrollHeight>room){b.style.setProperty('--fit',Math.max(.6,room/b.scrollHeight-0.01).toFixed(3));}});});`;

export function findChrome() {
  const chrome = process.env.CHROME ?? ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'].find((b) => spawnSync('which', [b]).status === 0);
  if (!chrome) { console.error('No Chrome/Chromium found. Set CHROME=/path/to/chrome'); process.exit(1); }
  return chrome;
}
