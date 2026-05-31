#!/usr/bin/env bash

set -e

PACKAGE_DIR="$(pwd)"
DUMP_DIR="$1/dump"

find "$DUMP_DIR" -name '*.dump' -print0 | xargs -0 sed -i "s|$PACKAGE_DIR/||g"
