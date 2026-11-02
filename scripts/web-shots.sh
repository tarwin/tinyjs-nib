#!/bin/sh
# The guide's screenshots, from scripts/screenshots.sh's PNGs: 1600px WebPs
# in guide/public/shots/. Commit those.
#
#   sh scripts/web-shots.sh [screenshots dir]
set -e
cd "$(dirname "$0")/.."
IN=${1:-screenshots}
command -v cwebp >/dev/null || { echo "Needs cwebp (brew install webp)." >&2; exit 1; }
mkdir -p guide/public/shots
for png in "$IN"/*.png; do
  cwebp -quiet -q 82 -resize 1600 0 "$png" -o "guide/public/shots/$(basename "$png" .png).webp" 2>/dev/null
done
echo "Wrote $(ls guide/public/shots/*.webp | wc -l | tr -d ' ') WebPs to guide/public/shots/."
