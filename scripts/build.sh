#!/usr/bin/env bash

set -e

cd packages/std.js; ./scripts/check.sh; cd ../..
cd packages/cli.js; ./scripts/check.sh; cd ../..
cd packages/bin.js; ./scripts/check.sh; cd ../..
cd packages/sexp.js; ./scripts/check.sh; cd ../..
cd packages/ppml.js; ./scripts/check.sh; cd ../..

cd packages/std.c; ./scripts/build.sh; cd ../..
cd packages/cli.c; ./scripts/build.sh; cd ../..
cd packages/meta-runtime.c; ./scripts/build.sh; cd ../..
