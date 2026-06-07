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

export PACKAGE_DIR

find "$DUMP_DIR" -name '*.dump' -print0 | xargs -0 -I{} python3 -c "
import sys, os, re
pkg_dir = os.environ.get('PACKAGE_DIR', '')
with open(sys.argv[1], 'r') as f:
    content = f.read()
def relative_path(m):
    path = m.group(1)
    if path.startswith('/'):
        rel = os.path.relpath(path, pkg_dir)
        return f'\"{rel}\"'
    return m.group(0)
content = re.sub(r'\"([^\"]+)\"', relative_path, content)
with open(sys.argv[1], 'w') as f:
    f.write(content)
" '{}'
