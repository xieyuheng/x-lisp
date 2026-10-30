#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# C runtime
./scripts/run-in.sh std.c build.sh
./scripts/run-in.sh cli.c build.sh
./scripts/run-in.sh xvm.c build.sh
