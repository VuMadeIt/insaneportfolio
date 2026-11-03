"""Slice single clacks from the CC0 recording into a small audio sprite for the site.

Usage: python scripts/audio/slice.py   (needs reference/audio/676377_14682229.mp3, see fetch.sh)
Writes public/audio/clacks.webm (Opus), public/audio/clacks.mp3 and src/audio/clacks.json
(offsets in seconds). Picks clean, isolated, unclipped clacks, trims each to its decay, applies a
short fade, and peak-normalises to -1 dBFS (loudness is applied at runtime from impact speed).
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from analyse import RATE, decode, onsets  # noqa: E402

SOURCE = "reference/audio/676377_14682229.mp3"
PRE = 0.003
LENGTH = 0.16
GAP = 0.05
COUNT = 12

x = decode(SOURCE)
picks = onsets(x)
times = [t for t, _ in picks]
candidates = []
for k, (t, level) in enumerate(picks):
    isolated = (k == 0 or t - times[k - 1] > 0.2) and (k == len(picks) - 1 or times[k + 1] - t > LENGTH + 0.05)
    if isolated and -12 < level < -1.0:
        candidates.append((t, level))
# Prefer the loudest clean ones, spread across the recording.
candidates.sort(key=lambda c: -c[1])
chosen = sorted(candidates[:COUNT])
if len(chosen) < 6:
    sys.exit(f"only {len(chosen)} clean clacks found")

fade = int(0.04 * RATE)
pieces = []
offsets = []
cursor = 0.0
for t, _ in chosen:
    a = int((t - PRE) * RATE)
    clip = x[a : a + int(LENGTH * RATE)].copy()
    clip[-fade:] *= np.linspace(1, 0, fade) ** 2
    clip[: int(0.001 * RATE)] *= np.linspace(0, 1, int(0.001 * RATE))
    clip *= 10 ** (-1 / 20) / np.abs(clip).max()
    offsets.append({"start": round(cursor, 4), "duration": LENGTH})
    pieces += [clip, np.zeros(int(GAP * RATE), dtype=np.float32)]
    cursor += LENGTH + GAP

sprite = np.concatenate(pieces).astype(np.float32)
Path("public/audio").mkdir(parents=True, exist_ok=True)
raw = sprite.tobytes()
for out, codec in [("public/audio/clacks.webm", ["-c:a", "libopus", "-b:a", "64k"]), ("public/audio/clacks.mp3", ["-c:a", "libmp3lame", "-q:a", "4"])]:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(RATE), "-ac", "1", "-i", "-", *codec, out], input=raw, check=True)
Path("src/audio/clacks.json").write_text(json.dumps({"source": "freesound.org/s/676377 (CC0)", "clips": offsets}, indent=1))
print(f"{len(chosen)} clacks:", [round(t, 3) for t, _ in chosen])
