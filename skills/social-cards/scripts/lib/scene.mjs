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
export const DEFAULT_SECONDS = { hook: 3.5, photo: 3.5, clip: 5, cta: 3.5, quote: 4.5, 'big-stat': 4.5, 'fact-table': 5, summary: 5, takeaway: 5, checklist: 5.5, 'chip-grid': 5.5, steps: 6, quiz: 6, spec: 5.5 };

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

// Line icons for spec rows (stroke = currentColor). Kept simple on purpose: one idea per icon.
const ICONS = {
  pressure: '<circle cx="12" cy="13" r="8"/><path d="M12 13l4-4M8 5.5 12 4l4 1.5"/>',
  heat: '<path d="M12 3c2.5 3 4 5.2 4 8a4 4 0 1 1-8 0c0-1.6.6-2.8 1.6-4 .2 1.6 1 2.4 2 2.4 0-2.4-.3-4.4.4-6.4z"/>',
  grinder: '<path d="M7 4h10l-2 6H9L7 4z"/><rect x="8" y="10" width="8" height="8" rx="1.5"/><path d="M10 21h4"/>',
  portafilter: '<circle cx="9" cy="12" r="5"/><path d="M14 12h7"/>',
  milk: '<path d="M8 3h8l-1 4 2 3v11H7V10l2-3-1-4z"/><path d="M7 13h10"/>',
  tank: '<path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"/>',
  size: '<path d="M3 12h18M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  gauge: '<circle cx="12" cy="12" r="9"/><path d="M12 12l5-3"/><circle cx="12" cy="12" r="1.2"/>',
  power: '<path d="M13 2 5 14h6l-1 8 8-12h-6l1-8z"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
};
const icon = (name) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;

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
    // A quiz post: the question and four answers A-D, and a line that asks for a comment.
    case 'quiz':
      return `${eyebrow}${h}${lede}<ol class="quiz a-4">${(s.options || []).map((o, i) => `<li class="opt"><span class="letter">${'ABCD'[i] ?? i + 1}</span><span class="opt-text">${esc(o)}</span></li>`).join('')}</ol>${s.ask ? `<p class="ask a-4">${esc(s.ask)}</p>` : ''}`;
    // A spec card: the machine's name and label, and 4-5 spec rows with line icons.
    case 'spec':
      return `${eyebrow}${h}${lede}<ul class="specs a-4">${(s.specs || []).map((x) => `<li class="spec-row">${icon(x.icon)}<span class="sl">${esc(x.label)}</span><span class="sv">${esc(x.value)}</span></li>`).join('')}</ul>`;
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
