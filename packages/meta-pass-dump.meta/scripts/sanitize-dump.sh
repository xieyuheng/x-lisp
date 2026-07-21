#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "usage: sanitize-dump.sh <output-directory>"
  exit 1
fi

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
DUMP_DIR="$1/dump"
BUILD_DIR="$(realpath "$1")"

SANITIZER="$SCRIPT_DIR/sanitize-dump.py"

if [ -d "$DUMP_DIR" ]; then
  find "$DUMP_DIR" -name '*.dump' -print0 | xargs -0 python3 "$SANITIZER"
else
  echo "[sanitize-dump.sh] dump directory does not exist: $DUMP_DIR"
fi

BUNDLES=(bundle.basic bundle.basic2)
for bundle in "${BUNDLES[@]}"; do
  if [ -f "$BUILD_DIR/$bundle" ]; then
    python3 "$SANITIZER" "$BUILD_DIR/$bundle"
  fi
done
