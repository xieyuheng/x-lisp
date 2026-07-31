#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "usage: sanitize-dump.sh <output-directory>"
  exit 1
fi

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
DUMP_DIR="$1/dump"
BUILD_DIR="$(realpath "$1")"

SANITIZER="$SCRIPT_DIR/sanitize-dump.mjs"

if [ -d "$DUMP_DIR" ]; then
  find "$DUMP_DIR" -name '*.dump' -print0 | xargs -0 node "$SANITIZER"
else
  echo "[sanitize-dump.sh] dump directory does not exist: $DUMP_DIR"
fi

BUNDLES=(bundle.xvm.basic bundle.x86.basic)
for bundle in "${BUNDLES[@]}"; do
  if [ -f "$BUILD_DIR/$bundle" ]; then
    node "$SANITIZER" "$BUILD_DIR/$bundle"
  fi
done
