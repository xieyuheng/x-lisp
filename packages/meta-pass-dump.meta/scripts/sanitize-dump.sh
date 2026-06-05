#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
  echo "usage: sanitize-dump.sh <output-directory>"
  exit 1
fi

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
PACKAGE_DIR="$(dirname "$SCRIPT_DIR")"
DUMP_DIR="$1/dump"

if [ ! -d "$DUMP_DIR" ]; then
  echo "[sanitize-dump.sh] dump directory does not exist: $DUMP_DIR"
  exit 0
fi

find "$DUMP_DIR" -name '*.dump' | xargs -r sed -i "s|$PACKAGE_DIR/||g"
