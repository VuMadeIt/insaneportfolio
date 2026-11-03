#!/usr/bin/env bash
# Download the Freesound preview recordings used for calibration into reference/audio/ (git-ignored).
# Licences (checked on each page): 676377 CC0, 131596 and 94030 CC BY 4.0, 763542 CC BY-NC 4.0.
# Only the CC0 recording is shipped (sliced by slice.py); the others are analysis-only.
set -euo pipefail
cd "$(dirname "$0")/../../reference/audio"
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
for p in 676/676377_14682229 131/131596_1554038 94/94030_1554038 763/763542_15688431; do
  curl -sfL -A "$UA" "https://cdn.freesound.org/previews/$p-hq.mp3" -o "$(basename "$p").mp3"
done
