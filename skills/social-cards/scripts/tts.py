#!/usr/bin/env python3
"""Text to speech for the reel renderer. Writes an audio file and prints JSON with the duration and
word timings: {"duration": 4.2, "words": [{"w": "Hello", "s": 0.1, "e": 0.4}, ...]}.

  tts.py --engine edge   --voice en-US-EmmaNeural --rate +5% --text "..." --out voice.mp3
  tts.py --engine kokoro --voice am_michael       --rate 1.05 --text "..." --out voice.wav

edge   = Microsoft Edge voices via the edge-tts package (free, online, exact word timings).
kokoro = Kokoro-82M via kokoro-onnx (offline; word timings estimated from word length).
         Model files from KOKORO_MODEL / KOKORO_VOICES, else searched in the usual caches.
Run with a Python that has the package: TTS_PYTHON=/path/python (the renderer passes it on).
"""
import argparse, asyncio, glob, json, os, re, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument('--engine', default='edge'); ap.add_argument('--voice'); ap.add_argument('--rate')
ap.add_argument('--text', required=True); ap.add_argument('--out', required=True)
a = ap.parse_args()

def duration(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path], capture_output=True, text=True)
    return float(r.stdout.strip() or 0)

def estimate(text, total):
    words = text.split(); weight = [len(re.sub(r'[^\w]', '', w)) + 1 for w in words]; tot = sum(weight)
    out, t = [], 0.0
    for w, k in zip(words, weight):
        d = total * k / tot; out.append({'w': w, 's': round(t, 3), 'e': round(t + d, 3)}); t += d
    return out

if a.engine == 'edge':
    import edge_tts
    async def run():
        com = edge_tts.Communicate(a.text, a.voice or 'en-US-EmmaNeural', rate=a.rate or '+0%')
        words = []
        with open(a.out, 'wb') as f:
            async for chunk in com.stream():
                if chunk['type'] == 'audio': f.write(chunk['data'])
                elif chunk['type'] == 'WordBoundary':
                    s = chunk['offset'] / 1e7; words.append({'w': chunk['text'], 's': round(s, 3), 'e': round(s + chunk['duration'] / 1e7, 3)})
        return words
    words = asyncio.run(run())
    dur = duration(a.out)
    if not words: words = estimate(a.text, dur)
elif a.engine == 'kokoro':
    from kokoro_onnx import Kokoro
    import soundfile as sf
    def find(name):
        env = os.environ.get(name)
        if env: return env
        pat = 'kokoro*.onnx' if name == 'KOKORO_MODEL' else 'voices*.bin'
        for d in ['~/.hyperframes/cache', '~/.cache/kokoro', '~/.cache/hyperframes', '~/.venvs/kokoro', '.']:
            hits = sorted(glob.glob(os.path.expanduser(f'{d}/**/{pat}'), recursive=True))
            if hits: return hits[-1]
        sys.exit(f'{name} not found: set {name}=/path or download from https://github.com/thewh1teagle/kokoro-onnx/releases')
    k = Kokoro(find('KOKORO_MODEL'), find('KOKORO_VOICES'))
    samples, sr = k.create(a.text, voice=a.voice or 'am_michael', speed=float(a.rate or 1.0), lang='en-us')
    sf.write(a.out, samples, sr)
    dur = duration(a.out); words = estimate(a.text, dur)
else:
    sys.exit(f'unknown engine {a.engine}')
print(json.dumps({'duration': dur, 'words': words}))
