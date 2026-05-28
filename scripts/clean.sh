#!/usr/bin/env bash

set -e

cd packages/helpers.js; ./scripts/clean.sh; cd ../..
cd packages/cli.js; ./scripts/clean.sh; cd ../..
cd packages/sexp.js; ./scripts/clean.sh; cd ../..
cd packages/ppml.js; ./scripts/clean.sh; cd ../..

cd packages/helpers.c; ./scripts/clean.sh; cd ../..
cd packages/cli.c; ./scripts/clean.sh; cd ../..
cd packages/xvm.c; ./scripts/clean.sh; cd ../..
