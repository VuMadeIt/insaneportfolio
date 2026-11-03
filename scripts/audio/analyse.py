"""Detect clack onsets in Newton's cradle recordings and measure interval timing and loudness decay.

Usage: python scripts/audio/analyse.py reference/audio/*.mp3 > reference/audio/analysis.json
Prints, per file: onset times, inter-clack intervals, peak level per clack (dBFS), and a least-squares
fit of level against clack index (dB per clack), which calibrates the per-impact energy loss.
"""

import json
import subprocess
import sys

import numpy as np

RATE = 44100


def decode(path: str) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(RATE), "-f", "f32le", "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def onsets(x: np.ndarray, min_gap: float = 0.08, rel_threshold_db: float = -32.0):
    """Peak-picked transients: a 1 ms envelope must jump well above its local floor."""
    hop = RATE // 1000
    frames = len(x) // hop
    env = np.abs(x[: frames * hop]).reshape(frames, hop).max(axis=1)
    db = 20 * np.log10(env + 1e-9)
    floor = np.convolve(db, np.ones(50) / 50, mode="same")
    threshold = db.max() + rel_threshold_db
    picks = []
    i = 1
    while i < frames:
        if db[i] > threshold and db[i] - floor[max(0, i - 25)] > 12 and db[i] >= db[i - 1]:
            window = db[i : i + 15]
            peak = i + int(np.argmax(window))
            picks.append((peak / 1000.0, float(db[peak])))
            i = peak + int(min_gap * 1000)
        else:
            i += 1
    return picks


def analyse(path: str):
    x = decode(path)
    picks = onsets(x)
    times = np.array([t for t, _ in picks])
    levels = np.array([l for _, l in picks])
    intervals = np.diff(times)
    result = {
        "file": path,
        "duration": len(x) / RATE,
        "onsets": [round(t, 4) for t in times],
        "levels_db": [round(l, 2) for l in levels],
        "intervals": [round(i, 4) for i in intervals],
    }
    if len(levels) > 3:
        slope, intercept = np.polyfit(np.arange(len(levels)), levels, 1)
        result["db_per_clack"] = round(float(slope), 3)
        result["median_interval"] = round(float(np.median(intervals)), 4)
    return result


if __name__ == "__main__":
    print(json.dumps([analyse(p) for p in sys.argv[1:]], indent=1))
