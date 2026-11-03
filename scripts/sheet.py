"""Tile labelled screenshots into one contact sheet. Usage: python scripts/sheet.py out.png cols w h a.png b.png ..."""

import os
import sys

import cv2
import numpy as np

out, cols, w, h, *files = sys.argv[1:]
cols, w, h = int(cols), int(w), int(h)
tiles = []
for f in files:
    img = cv2.resize(cv2.imdecode(np.fromfile(f, np.uint8), cv2.IMREAD_COLOR), (w, h), interpolation=cv2.INTER_AREA)
    cv2.putText(img, os.path.splitext(os.path.basename(f))[0], (10, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    tiles.append(img)
while len(tiles) % cols:
    tiles.append(np.full_like(tiles[0], 255))
rows = [np.hstack(tiles[i : i + cols]) for i in range(0, len(tiles), cols)]
# imencode + open: cv2.imwrite silently fails on some Windows paths (spaces).
open(out, "wb").write(cv2.imencode(os.path.splitext(out)[1], np.vstack(rows))[1].tobytes())
