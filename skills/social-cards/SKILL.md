---
name: social-cards
description: Make Instagram-style cards (4:5, 1080×1350) and short card reels (9:16 MP4) for LinkedIn or Instagram from a project's blog posts, services or case studies. Fixed HTML layouts (big-stat, checklist, chip-grid, quote, steps, summary, hook, photo, cta) on three themes, in the project's own brand fonts and colours, rendered with headless Chrome and ffmpeg. Use when the user says "social cards", "LinkedIn cards", "Instagram cards", "carousel", "card reel", or wants a post image for an article or service.
---

# Social cards

Turn an article, a service or a case study into one or more branded cards. The look follows the
storyboard project (`~/work/gannett/storyboard`): one idea per card, big type, a label pill at the top,
the brand mark top right, a source line and a call to action at the bottom.

The AI writes the words. The look is fixed in `templates/card.css`. Never hand-build HTML per card.

## Files

```
scripts/render-cards.mjs   cards.json + brand.json → PNG per card, PDF carousel, slideshow MP4
scripts/render-reel.mjs    cards.json + brand.json → animated 9:16 reel with music (the storyboard way)
scripts/lib/scene.mjs      shared: brand loading, scene markup, Chrome lookup
templates/card.css         the card system (layouts, themes, type scale)
templates/reel.css         reel motion: staggered entrances, word reveals, count-ups, Ken Burns
music/                     music beds by mood, downloaded on first use (Mixkit free licence)
examples/lucidreactor*/    working brand.json + cards.json (single cards, and a 3-card carousel)
```

Needs: Node 22+, Google Chrome or Chromium on PATH (or `CHROME=/path`), ffmpeg. No npm packages.

## Workflow

1. **Find the brand.** Read the project's `global.css` or design tokens and its fonts folder. Write
   `brand.json` next to the cards (paths are relative to that file):

   ```json
   {
     "name": "LucidReactor Labs", "site": "lucidreactor.com", "logo": "../logo.svg",
     "fonts": {
       "display": { "family": "Fraunces", "file": "../../fonts/fraunces-latin.woff2", "weight": "400 600" },
       "body":    { "family": "Inter",    "file": "../../fonts/inter-latin.woff2",    "weight": "400 600" },
       "mono":    { "family": "JetBrains Mono", "file": "../../fonts/jetbrains-mono-latin.woff2", "weight": "400 500" }
     },
     "colors": { "ink": "#15171C", "raised": "#1F2229", "accent": "#B5481A", "accentFg": "#F5F3EE",
                 "accentOnInk": "#D9683A", "paper": "#F5F3EE", "muted": "#9A9DA4", "line": "#D6D2C8" }
   }
   ```
   `accentOnInk` is the accent used as a highlight on the dark theme. If the brand accent is dark
   (like rust), pick a lighter tint so it reads on ink (aim for 4.5:1). `accentFg` is the text colour on
   the accent theme. Fonts without a `file` fall back to system fonts. Keep `logo` square.

2. **Pick the content.** Read the article or page. One card = one idea the reader can use. Prefer a
   number, a list, a quote or a set of named options over a sentence. Every fact must be in the source.
   Keep the project's own wording and tone (check its CLAUDE.md for writing rules).

3. **Write `cards.json`.** An array of cards. Shared fields: `id` (file name), `layout`, `theme`
   (`dark` | `paper` | `accent`), `label` (pill text, e.g. the article category), `headline`, `body`
   (one or two sentences, optional), `eyebrow` (optional; use "1 / 3" on carousel cards), `source`
   (short: the site or section, it is one line), `cta` ("Read the article →"), `image` (path relative
   to cards.json), `imageMode` (`band` = the whole picture at the top with the text below, the default;
   `cover` = full bleed behind the text, the default for `hook` and `photo`), `imageFocus`
   ("50% 30%", object-position for the band), `bandHeight` (default `52.5cqw`, which fits a 1200×630 hero).

   | Layout | Extra fields | Use for |
   | --- | --- | --- |
   | `big-stat` | `stat: {value, label}`, `rows: [{label, value, was?}]` | one number that carries the story |
   | `checklist` | `checks: [{text, known?}]` | a list of rules or steps (✓), open questions (`known: false` → ?) |
   | `chip-grid` | `chips: {items: [[title, sub]…], highlight}` | 4 named options or verdicts |
   | `quote` | `quote: {text, speaker, context}` | one strong sentence from the piece |
   | `steps` | `steps: [{n?, title, text}]` | a numbered process (3–4 steps) |
   | `summary` / `takeaway` | `bullets: []` | headline + 2–3 bullets |
   | `hook` | – | big opening line (first card of a carousel) |
   | `photo` | `image` | headline over a full-bleed photo |
   | `cta` | `button` | last card of a carousel |

4. **Render.**

   ```bash
   node ~/.claude/skills/social-cards/scripts/render-cards.mjs path/to/cards.json --out path/to/out
   # options: --brand brand.json  --size card|reel|square  --only id,id  --keep-html
   #          --pdf carousel.pdf                          (one page per card: a LinkedIn document post)
   #          --video out.mp4 --seconds 3.5 --fade 0.6   (slideshow of the cards, 1080×1920)
   ```
   Then **look at every PNG** (Read tool). Check: nothing clipped, contrast fine, no orphan words in the
   headline, footer on one line. The body auto-shrinks when it is too tall; if a card shrank a lot, cut
   words instead.

5. **Carousel (multi-card post).** Put the cards of one story in their own `cards.json` (3–5 cards:
   `hook` with a cover image → 1–3 content cards → `cta`). Render with `--pdf`. On LinkedIn, upload the
   PDF as a document post: that is the swipeable carousel. Uploading 3 PNGs gives a grid, not a swipe.
   On Instagram, upload the PNGs in order.

6. **Hand over.** List the PNG paths and the suggested post order. Do not post or deploy anything.

## Rules of the look (from the storyboard project)

- Use the project's own pictures (article hero images, product screenshots). At least half of the cards
  in a set should carry one. A wide hero goes in a `band`; a `hook` uses `cover`.
- Alternate themes between cards so a swipe feels like a new scene: dark → paper → accent → dark.
- A card has one headline and one visual block. No second idea.
- Headline: 4–9 words. Body: at most two short sentences. List items: one line each.
- Numbers go in `big-stat` or `rows`, never in a paragraph.
- A carousel (multi-card post) starts with a `hook` (or a `big-stat`) and ends with a `cta`.
- A single-image post needs a self-contained card: headline + one visual + source + cta.
- Sensitive topics stay calm: no exclamation marks, no bold claims.

## Video: the animated reel

```bash
node ~/.claude/skills/social-cards/scripts/render-reel.mjs path/to/cards.json --out path/to/reel.mp4 \
  --music warm --poster path/to/poster.jpg
# --music warm|uplifting|energetic|serious|reflective|none|<file.mp3>   --fps 30   --hold 1.5
# --only id,id   --keep-html (leaves reel.html next to the MP4: open it in a browser to preview the motion)
```

The same cards.json gives the reel, so the video matches the cards. How it works, as in the storyboard
project: one HTML page holds every scene stacked; every CSS animation is seeked to the frame's instant
(no timers, so a frame is identical whenever it is rendered); Chrome, driven over the DevTools protocol,
screenshots each frame; ffmpeg encodes them; then a music bed is mixed under (loudness-normalised, fade
in and out). About 60 s of render per 15 s of video. Output: 1080×1920 H.264 + AAC.

- `seconds` on a card sets its scene length. Defaults by layout are in `lib/scene.mjs` (hook 3.5 s,
  lists 5–6 s). The last scene holds `--hold` seconds longer.
- Motion by layout: `hook` and `quote` reveal word by word; `big-stat` counts up; lists tick in one row
  at a time; pictures drift (Ken Burns); the `cta` button pulses.
- For a reel, write the `cta` text for a viewer, not a swiper ("Read the article →", not "Swipe →").
- Pick the mood from the piece: `reflective` or `warm` for essays, `serious` for audits and data,
  `uplifting` or `energetic` for launches. `none` for a voiceover you add later.
- Motion by layout also covers `clip`: no Ken Burns on a clip, just a fade in.
- `--video` on render-cards.mjs still makes a plain crossfade slideshow of the PNGs when motion is not
  wanted.

### Voiceover and captions

Give a card a `voice` sentence and the reel speaks it over that scene. Pass `--captions on` to also show
the words in the lower third as they are said (the current word lights up); captions are off by default. The scene stretches to fit the line
(0.4 s lead, 0.7 s tail), and the music dips while the voice plays.

```bash
node ~/.claude/skills/social-cards/scripts/render-reel.mjs cards.json --out reel.mp4 --music warm
# --tts edge|kokoro|none   --voice en-GB-RyanNeural|am_michael   --rate +3%|1.05   --captions on|off (off by default)
```

- Engines, through `scripts/tts.py`, as used in the Halal Code Check shorts (edge-tts) and the gomdecom
  explainer (Kokoro): **edge** = Microsoft Edge voices, free, online, exact word timings, many voices
  (`edge-tts --list-voices`); **kokoro** = Kokoro-82M, offline, fewer voices, word timings estimated.
  The Python for each engine, the default voice and rate are in `config.json`. If Edge returns a
  403, upgrade the package: `<python> -m pip install -U edge-tts`.
- `tts` on a card overrides the spoken text (phonetic spelling, "lucid reactor dot com"); `voice` stays
  the clean text for the captions.
- `reelCta` on a card replaces its `cta` in the reel ("Keep watching →", or "" to hide it).
- Audio files are cached in `.voice/` beside the output, keyed by engine, voice, rate and text, so a
  re-render with the same lines is instant. Delete the folder to re-speak everything.
- Write voice lines as speech: short sentences, numbers as words, no symbols. One line is 1–3
  sentences; a 3-card reel with voice runs 30–45 s.
- Mix: voice loudness-normalised to −16 LUFS, music at −24 LUFS × 0.35 and dipped 80 % under speech
  with 0.4 s ramps, both faded out over the last 1.5 s.

### Video clips

A card with a `clip` shows a cut of a video: full bleed behind the headline on layout `clip` (or
`hook`), or as the top band on any other layout (`clipMode: "cover" | "band"` overrides).

```json
{ "id": "demo", "layout": "clip", "theme": "dark", "label": "Halal Code Check",
  "clip": { "file": "../clips/scanner.mp4", "start": 9.3, "duration": 9.5, "sound": true },
  "headline": "The label is read on the phone.", "source": "halalcodecheck.com" }
```

- The frames are extracted once with ffmpeg at the reel frame rate (cached in `.clips/` beside the
  output) and swapped in per rendered frame, as the storyboard renderer does, so a frame is exact.
- The scene lasts at least the clip's duration; a longer `voice` holds the last frame.
- `sound: true` lays the clip's own audio under the scene, levelled and faded; it dips while a voice
  line plays, and the music dips under both. `sound: false` makes it silent b-roll under the voice.
- Sources: screen recordings, phone videos, earlier product videos. A 9:16 source suits `cover`; a
  band suits landscape screen captures. Top-of-frame text in the source will sit under the pill.
- Keep clips in the project (`source/clips/`), not in the skill. They are the user's footage.

## Known details

- Headless Chrome keeps some of the window height for itself (87 px in Chrome 143). The script measures
  it with a probe page, opens a taller window and crops with ffmpeg. Output is always exactly W×H.
- The fit script runs after `document.fonts.ready`; `--virtual-time-budget=3000` lets it finish.
- The renderer uses `--no-sandbox` so it also works in WSL and containers.
- render-reel.mjs sets the viewport with `Emulation.setDeviceMetricsOverride`, so it needs no crop.
- The reel page skips its own playback loop when opened with `#render`; without the hash it plays in a
  browser, which is the preview.
