#!/usr/bin/env bash
set -euo pipefail
version_dir="$(cd -- "$(dirname -- "$0")/.." && pwd)"
# Preserve the approved montage; hold its brand frame instead of returning to the opening.
ffmpeg -hide_banner -loglevel error -y \
  -i "$version_dir/../v5-astra/assets/foyer-loop.mp4" \
  -vf 'trim=end_frame=612,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.5' \
  -frames:v 624 -an -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p \
  -movflags +faststart \
  -metadata 'title=VERBA Heart — Внутри обычного дня' \
  -metadata 'comment=Approved V5 montage with held VERBA / MILLER ending. No additional generation.' \
  "$version_dir/assets/foyer-film.mp4"
