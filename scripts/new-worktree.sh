#!/usr/bin/env bash

# setup the following directory to use new-worktree
#
#     meta-lisp/
#     - master/
#     - new-worktree

set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <base-worktree> <branch-name>"
  exit 1
fi

BASE="${1%/}"
NAME="$2"
TS=$(date +%Y-%m-%d-%H-%M)
SUFFIXED="${NAME}--${TS}"

HERE="$(cd "$(dirname "$0")" && pwd -P)"
BASE_REAL="$(cd "$HERE/$BASE" && pwd -P)"

(cd "$BASE_REAL" && git branch "$SUFFIXED")
(cd "$BASE_REAL" && git worktree add "$HERE/$SUFFIXED" "$SUFFIXED")

cd "$HERE/$SUFFIXED"

[ -f scripts/prepare.sh ] && ./scripts/prepare.sh

exec "$SHELL"
