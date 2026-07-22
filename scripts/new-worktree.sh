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

HERE="$(cd "$(dirname "$0")" && pwd -P)"
REPO_ROOT="$(cd "$HERE/.." && pwd -P)"

(cd "$REPO_ROOT" && git branch "$NAME")
(cd "$REPO_ROOT" && git worktree add "worktrees/$NAME" "$NAME")

cd "$REPO_ROOT/worktrees/$NAME"

[ -f scripts/prepare.sh ] && ./scripts/prepare.sh

exec "$SHELL"
