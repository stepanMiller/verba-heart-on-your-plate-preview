#!/usr/bin/env bash
set -euo pipefail
version_dir="$(cd -- "$(dirname -- "$0")/.." && pwd)"
if [[ "$#" -ne 2 ]]; then
  echo "Usage: $0 /path/to/approved/s14-salad-motion.mp4 /path/to/approved/foyer-film.mp4" >&2
  exit 2
fi
python3 "$version_dir/tools/render-finished-film.py" "$1" "$2"
