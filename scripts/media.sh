#!/usr/bin/env bash
# Copy and optimise the project media used by the site from Lucas's previous portfolio repo
# (github.com/VuMadeIt/updated-portfolioi, cloned outside this project).
# Usage: bash scripts/media.sh <path to the cloned repo>
# Videos: H.264, 1280 px wide max, no audio, faststart, CRF 26, plus a WebP poster of the first frame.
# Images are copied as is; next/image serves AVIF/WebP at request time.
set -euo pipefail
SRC="$1/public"
OUT="public/media"
mkdir -p "$OUT"/{shufflr,ripple,maple-leaf,work,about}

video() { # src dest
  ffmpeg -v error -y -i "$SRC/$1" -an -vf "scale='min(1280,iw)':-2,fps=30" -c:v libx264 -preset slow -crf 26 \
    -pix_fmt yuv420p -movflags +faststart "$OUT/$2.mp4"
  ffmpeg -v error -y -ss "${3:-0}" -i "$OUT/$2.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/$2.webp"
}

video videos/shufflr.mp4 shufflr/hero
video videos/shufflr/shuffle.mp4 shufflr/shuffle
video videos/shufflr/community.mp4 shufflr/community
video videos/ripple.mp4 ripple/hero
video videos/ripple/home.mp4 ripple/home
video videos/ripple/answer.mp4 ripple/answer
video videos/maple-leaf.mp4 maple-leaf/hero 2
video videos/parrot.mp4 work/parrot
video videos/creators-collective.mp4 work/creators-collective
video videos/design-philosophy/hummingbird.mp4 about/hummingbird

cp "$SRC"/images/shufflr/{discover,profile-memories}.png "$OUT/shufflr/"
cp "$SRC"/images/ripple/{ideation,research,comparison,system-diagram,discover,profile-history}.png "$OUT/ripple/"
cp "$SRC"/images/maple-leaf/{service-penalty-app,maple-leaf-market,project-tracking-app}.png "$OUT/maple-leaf/"
cp "$SRC"/images/search-a-song.jpg "$OUT/work/"
du -sh "$OUT"/*
