#!/usr/bin/env bash

set -e

cd packages/std.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/cli.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xrt.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xvm.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xvm2.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/x86.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
