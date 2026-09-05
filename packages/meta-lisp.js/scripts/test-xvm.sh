#!/usr/bin/env bash
set -e

XVM2_DIR="lib/xvm"
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

find "$XVM2_DIR" -name "*.xvm.asm" | sort | while read -r file; do
  echo "=== $(basename "$file") ==="
  first=$(./meta-lisp.js format-xvm "$file")
  printf '%s' "$first" > "$TEMP_DIR/round1.xvm"
  second=$(./meta-lisp.js format-xvm "$TEMP_DIR/round1.xvm")
  if [ "$first" != "$second" ]; then
    echo "FAIL: round-trip mismatch"
    diff <(printf '%s' "$first") <(printf '%s' "$second")
    exit 1
  fi

  exe_file="${file%.xvm.asm}.xvm.exe"
  ./meta-lisp.js assemble-xvm "$file" "$exe_file"
  ./meta-lisp.js disassemble-xvm "$exe_file" "$TEMP_DIR/out.xvm"
  snapshot="${file%.xvm.asm}.xvm.exe.disasm"
  if [ ! -f "$snapshot" ]; then
    echo "FAIL: missing disasm snapshot $snapshot"
    exit 1
  fi
  diff -u "$snapshot" "$TEMP_DIR/out.xvm"

  ./meta-lisp.js info-xvm "$exe_file" > "$TEMP_DIR/out.info"
  info_snapshot="${file%.xvm.asm}.xvm.exe.info"
  if [ ! -f "$info_snapshot" ]; then
    echo "FAIL: missing info snapshot $info_snapshot"
    exit 1
  fi
  diff -u "$info_snapshot" "$TEMP_DIR/out.info"
  echo "OK"
done