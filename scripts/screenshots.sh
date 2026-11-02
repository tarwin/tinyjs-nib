#!/bin/sh
# Screenshots of Nib for the guide (macOS):
#
#   sh scripts/screenshots.sh [out-dir]      # default: screenshots/
#
# Copies the demo docs project (scripts/tour/demo) to a temp folder and starts
# `tinyjs dev` with NIB_TOUR set, so the app steps through its screens
# (src/backend/tour.ts). For each one it writes shot.json there; this
# captures the window as <out>/<name>.png and answers with done-<seq>.
#
# Your own Nib data (settings, recents, actions) is moved aside for the run
# and put back after, so the shots start fresh and your setup is untouched.
# Quit Nib first. Needs Screen Recording permission for the terminal.
# Then: sh scripts/web-shots.sh (WebPs for the guide).
set -e
cd "$(dirname "$0")/.."
OUT="${1:-screenshots}"
DATA="$HOME/Library/Application Support/art.tarwin.nib"
if pgrep -fq "Nib.app/Contents/MacOS" || pgrep -fq "tinyjs.*dev" ; then
  echo "Quit Nib (and any tinyjs dev) first." >&2; exit 1
fi
mkdir -p "$OUT"
TOUR="$(mktemp -d)"
swiftc -O scripts/tour/window-id.swift -o "$TOUR/window-id" 2>/dev/null
# the demo project, somewhere with a tidy path (it shows in the shots)
PROJ=/Users/Shared/Lantern
[ -e "$PROJ" ] && { echo "$PROJ is in the way; move it first." >&2; exit 1; }
cp -R scripts/tour/demo "$PROJ"

# your data aside, a fresh one with the demo actions in its place
[ -d "$DATA" ] && mv "$DATA" "$TOUR/your-data"
mkdir -p "$DATA"
cp scripts/tour/actions.json "$DATA/actions.json"

NIB_TOUR="$TOUR" NIB_TOUR_PROJECT="$PROJ" VITE_NIB_TOUR=1 tinyjs dev > "$TOUR/dev.log" 2>&1 &
DEV=$!
cleanup() {
  kill "$DEV" 2>/dev/null || true
  pkill -f "vite.*--port 5173" 2>/dev/null || true
  sleep 1
  mv "$DATA" "$TOUR/tour-data"
  mv "$PROJ" "$TOUR/lantern"
  [ -d "$TOUR/your-data" ] && mv "$TOUR/your-data" "$DATA"
  echo "Your Nib data is back. Tour files: $TOUR"
}
trap cleanup EXIT INT TERM

seen=0
for _ in $(seq 1 3000); do
  [ -f "$TOUR/finished" ] && break
  if [ -f "$TOUR/shot.json" ]; then
    seq=$(sed -n 's/.*"seq":\([0-9]*\).*/\1/p' "$TOUR/shot.json")
    name=$(sed -n 's/.*"name":"\([^"]*\)".*/\1/p' "$TOUR/shot.json")
    title=$(sed -n 's/.*"title":"\([^"]*\)".*/\1/p' "$TOUR/shot.json")
    if [ -n "$seq" ] && [ "$seq" != "$seen" ]; then
      id=$("$TOUR/window-id" "$title")
      if [ -z "$id" ]; then echo "  $name: no window titled \"$title\"" >&2
      else screencapture -x -o -l "$id" "$OUT/$name.png"; echo "  $name"; fi
      : > "$TOUR/done-$seq"
      seen=$seq
    fi
  fi
  sleep 0.2
done
[ -f "$TOUR/finished" ] || { echo "The tour didn't finish; see $TOUR/dev.log" >&2; exit 1; }
echo "Saved $(ls "$OUT"/*.png | wc -l | tr -d ' ') screenshots to $OUT/"
