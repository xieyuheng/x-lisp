#!/usr/bin/env bash

set -euo pipefail
root="$(cd "$(dirname "$(readlink -f "$0")")/.." && pwd)"
exec node --stack-size=65536 "$root/packages/basic-lisp.js/src/main.ts" "$@"
