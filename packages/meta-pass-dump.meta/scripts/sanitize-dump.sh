#!/usr/bin/env bash

set -e

cd "$(dirname "$0")/.."

PACKAGE_DIR="$(pwd)"

find expected/dump/ -name '*.dump' -print0 | xargs -0 sed -i "s|$PACKAGE_DIR/||g"
