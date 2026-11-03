"""Make a white-balanced, mostly desaturated copy of an HDRI so chrome reflects a neutral gallery.

Usage: python scripts/hdri_neutral.py public/hdri/sculpture_exhibition.hdr public/hdri/gallery_neutral.hdr [saturation]
Galleries are lit with neutral white; the source panorama was shot under warm tungsten, which turns
chrome into brass. Grey-world white balance, then saturation scaled toward luminance.
"""

import sys

import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
saturation = float(sys.argv[3]) if len(sys.argv) > 3 else 0.15

img = cv2.imread(src, cv2.IMREAD_ANYDEPTH | cv2.IMREAD_COLOR).astype(np.float32)  # BGR, linear
# Grey world on the non-emissive part of the room (ignore lamps, which dominate the mean).
lum = img @ np.array([0.0722, 0.7152, 0.2126], dtype=np.float32)
mask = lum < np.percentile(lum, 95)
gains = img[mask].mean(axis=0)
img *= gains.mean() / gains
lum = img @ np.array([0.0722, 0.7152, 0.2126], dtype=np.float32)
img = lum[..., None] + (img - lum[..., None]) * saturation
cv2.imwrite(dst, np.maximum(img, 0))
print("gains", gains / gains.mean(), "mean lum", float(lum.mean()))
