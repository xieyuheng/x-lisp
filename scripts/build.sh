#!/usr/bin/env bash

set -e

cd packages/helpers.js; ./scripts/check.sh; cd ../..
cd packages/cli.js; ./scripts/check.sh; cd ../..
cd packages/bin.js; ./scripts/check.sh; cd ../..
cd packages/sexp.js; ./scripts/check.sh; cd ../..
cd packages/ppml.js; ./scripts/check.sh; cd ../..

cd packages/helpers.c; ./scripts/build.sh; cd ../..
cd packages/cli.c; ./scripts/build.sh; cd ../..
cd packages/xvm.c; ./scripts/build.sh; cd ../..
