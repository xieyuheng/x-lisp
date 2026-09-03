#!/usr/bin/env bash
set -e

XVM2_DIR="lib/xvm2"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

find "$XVM2_DIR" -name "*.xvm2.asm" | sort | while read -r file; do
  echo "=== $(basename "$file") ==="
  first=$(./meta-lisp.js format-xvm2 "$file")
  printf '%s' "$first" > "$TEMP_DIR/round1.xvm2"
  second=$(./meta-lisp.js format-xvm2 "$TEMP_DIR/round1.xvm2")
  if [ "$first" != "$second" ]; then
    echo "FAIL: round-trip mismatch"
    diff <(printf '%s' "$first") <(printf '%s' "$second")
    exit 1
  fi

  exe_file="${file%.xvm2.asm}.xvm2.exe"
  ./meta-lisp.js assemble-xvm2 "$file" "$exe_file"
  ./meta-lisp.js disassemble-xvm2 "$exe_file" "$TEMP_DIR/out.xvm2"
  snapshot="${file%.xvm2.asm}.xvm2.exe.disasm"
  if [ ! -f "$snapshot" ]; then
    echo "FAIL: missing disasm snapshot $snapshot"
    exit 1
  fi
  diff -u "$snapshot" "$TEMP_DIR/out.xvm2"

  ./meta-lisp.js info-xvm2 "$exe_file" > "$TEMP_DIR/out.info"
  info_snapshot="${file%.xvm2.asm}.xvm2.exe.info"
  if [ ! -f "$info_snapshot" ]; then
    echo "FAIL: missing info snapshot $info_snapshot"
    exit 1
  fi
  diff -u "$info_snapshot" "$TEMP_DIR/out.info"
  echo "OK"
done