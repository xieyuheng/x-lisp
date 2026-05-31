#!/usr/bin/env bash

# delete local branches not associated with any worktree
#
# - git worktree prune   -- clean stale worktree references
# - grep -v '^[*+]'      -- exclude current (*) and worktree (+) branches
# - xargs git branch -d  -- delete each branch
#
# note: unmerged changes cause deletion to fail; use -D to force.

git worktree prune && git branch | grep -v '^[*+]' | xargs -r git branch -d
