#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

required_commands=(
  git
  bash
  node
  pnpm
  gcc
  ld
  make
  find
  readlink
)

optional_commands=(
  parallel
  nasm
  ndisasm
  xxd
  objcopy
  realpath
)

missing=0
for cmd in "${required_commands[@]}"; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf 'ok: %s\n' "$cmd"
  else
    printf 'missing required: %s\n' "$cmd" >&2
    missing=1
  fi
done

if [ "$missing" -ne 0 ]; then
  printf '\ninstall missing required commands first\n' >&2
  exit 1
fi

pnpm install --frozen-lockfile

printf '\noptional commands for ./scripts/all.sh:\n'
for cmd in "${optional_commands[@]}"; do
  if command -v "$cmd" >/dev/null 2>&1; then
    printf 'ok: %s\n' "$cmd"
  else
    printf 'missing optional: %s\n' "$cmd"
  fi
done
