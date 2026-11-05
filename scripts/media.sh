#!/usr/bin/env bash
# Build the project media used by the site from sources kept outside this project.
# Usage: bash scripts/media.sh <cloned VuMadeIt/updated-portfolioi> <devpost media dir>
# The devpost dir holds the Devpost gallery originals and demo videos (see `devpost` below for the
# file names; Reboot's video is from the old Framer site; the YouTube demos are fetched with yt-dlp, the SolarScore assets from its GitHub repo).
# Videos: H.264 High, up to 1920 px wide, CRF 20 (visually clean), no audio, faststart, plus a
# WebP poster. Images are copied as is; next/image serves AVIF/WebP at request time.
set -euo pipefail
SRC="$1/public"
DP="$2"
OUT="public/media"
mkdir -p "$OUT"/{shufflr,ripple,maple-leaf,warframe,work,about}

enc() { # input output [extra input args...]
  local in="$1" out="$2"
  shift 2
  ffmpeg -v error -y "$@" -i "$in" -an -vf "scale='min(1920,iw)':-2:flags=lanczos,fps=30" -c:v libx264 \
    -preset slow -crf 20 -profile:v high -pix_fmt yuv420p -movflags +faststart "$out"
}
poster() { # video [time]
  ffmpeg -v error -y -ss "${2:-0}" -i "$1" -frames:v 1 -c:v libwebp -quality 88 "${1%.mp4}.webp"
}
video() { # src dest [poster time]
  enc "$SRC/$1" "$OUT/$2.mp4"
  poster "$OUT/$2.mp4" "${3:-0}"
}
clip() { # src dest start duration
  enc "$1" "$OUT/$2.mp4" -ss "$3" -t "$4"
  poster "$OUT/$2.mp4" 0.5
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
cp "$SRC"/images/ripple/{history,answer}.png "$OUT/ripple/"
ffmpeg -v error -y -i "$SRC/images/ripple/hero-still.jpg" -c:v libwebp -quality 88 "$OUT/ripple/hero-still.webp"
# A keyframe every 4 frames, so the scroll can seek it smoothly (case-study prototype block).
ffmpeg -v error -y -i "$SRC/videos/shufflr/shuffle.mp4" -an -vf "fps=30" -c:v libx264 -preset slow -crf 20 -g 4 \
  -pix_fmt yuv420p -movflags +faststart "$OUT/shufflr/shuffle-scrub.mp4"
cp "$SRC"/images/search-a-song.jpg "$OUT/work/"
# Warframe card: the still, and the 6.5 MB glitch GIF as a muted mp4 loop played on hover.
ffmpeg -v error -y -i "$SRC/images/apple-still.jpg" -c:v libwebp -quality 88 "$OUT/warframe/still.webp"
ffmpeg -v error -y -i "$SRC/images/apple-hover.gif" -an -vf "fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 18 \
  -movflags +faststart "$OUT/warframe/glitch.mp4"

# Devpost projects: a short clip of each demo video where one exists.
clip "$DP/t1_Amtt9RSQ.mp4" work/japan 72 9   # We should go to Japan demo: the web app, picking a hotel
clip "$DP/b3DicOvtApQ.mp4" work/asper 366 9  # Asper demo: the map of every customer
clip "$DP/solar-b-roll-1.mp4" work/solarscore 0 8  # SolarScore's own landing-page video
clip "$DP/reboot-home.mp4" work/reboot 0 10.8  # Reboot: the home page, from lucasvu.framer.website/projects/reboot
# Frictionless has no public video: its four Devpost screenshots, each held about 2.2 s with a slow push in.
ffmpeg -v error -y \
  $(for k in 1 2 3 4; do printf -- '-i %s ' "$DP/fric$k.png"; done) \
  -filter_complex "$(for k in 0 1 2 3; do printf '[%d]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:-1:-1:color=0x0b0b0f,zoompan=z=%s:d=78:s=1920x1080:fps=30,format=yuv420p[v%d];' $k "'min(zoom+0.0008,1.06)'" $k; done)[v0][v1]xfade=fade:duration=0.4:offset=2.2[a];[a][v2]xfade=fade:duration=0.4:offset=4.4[b];[b][v3]xfade=fade:duration=0.4:offset=6.6[v]" \
  -map "[v]" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart "$OUT/work/frictionless.mp4"
poster "$OUT/work/frictionless.mp4" 0.5
du -sh "$OUT"/*
