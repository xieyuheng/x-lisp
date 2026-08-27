#!/usr/bin/env bash
set -e

XVM2_DIR="lib/xvm2"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

find "$XVM2_DIR" -name "*.xvm2" | sort | while read -r file; do
  echo "=== $(basename "$file") ==="
  first=$(./meta-lisp.js format-xvm2 "$file")
  printf '%s' "$first" > "$TEMP_DIR/round1.xvm2"
  second=$(./meta-lisp.js format-xvm2 "$TEMP_DIR/round1.xvm2")
  if [ "$first" != "$second" ]; then
    echo "FAIL: round-trip mismatch"
    diff <(printf '%s' "$first") <(printf '%s' "$second")
    exit 1
  fi
  echo "OK"
done