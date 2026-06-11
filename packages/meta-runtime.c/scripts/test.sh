#!/usr/bin/env bash

set -e

make test

./scripts/test-xvm-asm.sh
./scripts/test-xvm-exe.sh
./scripts/test-x86.sh
