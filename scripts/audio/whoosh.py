"""Make the slow-motion whooshes (PLAN 12.7) from a CC0 Freesound recording.

Usage: python scripts/audio/whoosh.py   (needs reference/audio/742946_5287430.mp3, see fetch.sh)
The "down" whoosh is the recording played through a tape-stop: playback speed glides from 1 to
0.45, so the pitch sinks like a film slowing down. The "up" whoosh is the same clip reversed.
Both are loudness-normalised and written as one sprite: public/audio/whoosh.{webm,mp3} and
src/audio/whoosh.json (offsets in seconds).
"""

import json
import subprocess
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).parent))
from analyse import RATE, decode  # noqa: E402

SOURCE = "reference/audio/742946_5287430.mp3"
END_RATE = 0.45
GAP = 0.1
LENGTH = 0.95

x = decode(SOURCE)
x = x[np.argmax(np.abs(x) > 0.01) :]
# Integrate a falling playback rate: output sample i reads the input at position sum(rate[:i]).
n = int(len(x) / ((1 + END_RATE) / 2))
rate = 1 + (END_RATE - 1) * np.linspace(0, 1, n) ** 0.7
pos = np.cumsum(rate)
pos = pos[pos < len(x) - 1]
down = np.interp(pos, np.arange(len(x)), x).astype(np.float32)
# Cut the quiet tail so the reversed clip peaks soon after the pointer leaves, not a second later.
down = down[: int(LENGTH * RATE)]
fade = int(0.25 * RATE)
down[-fade:] *= np.linspace(1, 0, fade) ** 2
down[: int(0.005 * RATE)] *= np.linspace(0, 1, int(0.005 * RATE))
up = down[::-1].copy()

gap = np.zeros(int(GAP * RATE), dtype=np.float32)
sprite = np.concatenate([down, gap, up, gap])
duration = round(len(down) / RATE, 4)
Path("public/audio").mkdir(parents=True, exist_ok=True)
# Loudness-matched to sit under the clacks (peak-normalised to -1 dBFS): -24 LUFS, -6 dBTP.
norm = ["-af", "loudnorm=I=-24:TP=-6:LRA=11"]
for out, codec in [
    ("public/audio/whoosh.webm", ["-c:a", "libopus", "-b:a", "64k"]),
    ("public/audio/whoosh.mp3", ["-c:a", "libmp3lame", "-q:a", "4"]),
]:
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(RATE), "-ac", "1", "-i", "-", *norm, "-ar", "48000", *codec, out],
        input=sprite.tobytes(),
        check=True,
    )
clips = {"down": {"start": 0, "duration": duration}, "up": {"start": round(duration + GAP, 4), "duration": duration}}
Path("src/audio/whoosh.json").write_text(json.dumps({"source": "freesound.org/s/742946 (CC0)", **clips}, indent=1))
print("whoosh", duration, "s")
