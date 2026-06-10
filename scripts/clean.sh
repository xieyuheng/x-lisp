#!/usr/bin/env bash

set -e

cd packages/helpers.js; ./scripts/clean.sh; cd ../..
cd packages/cli.js; ./scripts/clean.sh; cd ../..
cd packages/bin.js; ./scripts/clean.sh; cd ../..
cd packages/sexp.js; ./scripts/clean.sh; cd ../..
cd packages/ppml.js; ./scripts/clean.sh; cd ../..

cd packages/helpers.c; ./scripts/clean.sh; cd ../..
cd packages/cli.c; ./scripts/clean.sh; cd ../..
cd packages/xvm.c; ./scripts/clean.sh; cd ../..

cd packages/meta-builtin.meta; ./scripts/clean.sh; cd ../..
cd packages/meta-math.meta; ./scripts/clean.sh; cd ../..
cd packages/meta-example.meta; ./scripts/clean.sh; cd ../..
cd packages/meta-error.meta; ./scripts/clean.sh; cd ../..
cd packages/meta-lisp.meta; ./scripts/clean.sh; cd ../..
cd packages/meta-pass-dump.meta; ./scripts/clean.sh; cd ../..
