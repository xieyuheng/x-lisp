#!/usr/bin/env bash

# create a new worktree based on master branch
#     - scripts/new-worktree.sh
#     - worktrees/<name>

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <branch-name>"
  exit 1
fi

NAME="$1"
TS=$(date +%Y-%m-%d-%H-%M)
SUFFIXED="${NAME}--${TS}"

HERE="$(cd "$(dirname "$0")" && pwd -P)"
REPO_ROOT="$(cd "$HERE/.." && pwd -P)"

(cd "$REPO_ROOT" && git branch "$SUFFIXED")
(cd "$REPO_ROOT" && git worktree add "worktrees/$SUFFIXED" "$SUFFIXED")

cd "$REPO_ROOT/worktrees/$SUFFIXED"

[ -f scripts/prepare.sh ] && ./scripts/prepare.sh

exec "$SHELL"
