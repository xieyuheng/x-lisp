#!/usr/bin/env bash

set -e

cd packages/std.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/cli.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xrt.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xvm.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/xexe.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
