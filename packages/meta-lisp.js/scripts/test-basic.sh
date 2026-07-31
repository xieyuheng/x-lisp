#!/usr/bin/env bash
set -e

BASIC_DIR="lib/basic"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

find "$BASIC_DIR" -name "*.basic" | sort | while read -r file; do
  echo "=== $(basename "$file") ==="
  first=$(./meta-lisp.js format-basic "$file")
  printf '%s' "$first" > "$TEMP_DIR/round1.basic"
  second=$(./meta-lisp.js format-basic "$TEMP_DIR/round1.basic")
  if [ "$first" != "$second" ]; then
    echo "FAIL: round-trip mismatch"
    diff <(printf '%s' "$first") <(printf '%s' "$second")
    exit 1
  fi
  echo "OK"
done
