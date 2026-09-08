#!/usr/bin/env bash

set -euo pipefail
root="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
exec node --stack-size=65536 "$root/packages/x86-lisp.js/src/main.ts" "$@"
