"""Extract each identity image's palette with k-means (OpenCV) into src/scene/identities/palettes.json.

Usage: python scripts/palette.py
Near-black background pixels are ignored (they become depth inside the sphere, never colour).
Colours are sorted by luminance, as sRGB hex, with their share of the non-background pixels.
"""

import json
from pathlib import Path

import cv2
import numpy as np

IMAGES = {
    "people": "people-eye.jpg",
    "ideas": "idea-orb.jpg",
    "experiments": "experiment-atom.png",
    "products": "product-flower.jpg",
}
K = 8

def cluster(px: np.ndarray, k: int):
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 50, 0.5)
    _, labels, centres = cv2.kmeans(px, k, None, criteria, 4, cv2.KMEANS_PP_CENTERS)
    share = np.bincount(labels.ravel(), minlength=k) / len(labels)
    order = np.argsort(centres @ np.array([0.0722, 0.7152, 0.2126]))
    return [
        {"hex": "#%02x%02x%02x" % tuple(int(c) for c in centres[i][::-1]), "share": round(float(share[i]), 3)}
        for i in order
    ]


out = {}
for slug, name in IMAGES.items():
    img = cv2.imread(f"reference/identities/{name}")
    px = img.reshape(-1, 3).astype(np.float32)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV).reshape(-1, 3)
    # The overall palette, and the vivid accents that averaging would wash out.
    vivid = px[(hsv[:, 1] > 110) & (hsv[:, 2] > 120)]
    out[slug] = {
        "all": cluster(px[px.max(axis=1) > 40], K),
        "vivid": cluster(vivid, 6) if len(vivid) > 500 else [],
    }

Path("src/scene/identities").mkdir(parents=True, exist_ok=True)
Path("src/scene/identities/palettes.json").write_text(json.dumps(out, indent=1))
for slug, p in out.items():
    print(slug, " ".join(c["hex"] for c in p["all"]), "| vivid", " ".join(c["hex"] for c in p["vivid"]))
