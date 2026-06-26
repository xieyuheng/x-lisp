#!/usr/bin/env bash
set -e

BASIC2_DIR="lib/basic2"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

find "$BASIC2_DIR" -name "*.basic2" | sort | while read -r file; do
  echo "=== $(basename "$file") ==="
  first=$(./meta-lisp.js format-basic2 "$file")
  printf '%s' "$first" > "$TEMP_DIR/round1.basic2"
  second=$(./meta-lisp.js format-basic2 "$TEMP_DIR/round1.basic2")
  if [ "$first" != "$second" ]; then
    echo "FAIL: round-trip mismatch"
    diff <(printf '%s' "$first") <(printf '%s' "$second")
    exit 1
  fi
  echo "OK"
done
