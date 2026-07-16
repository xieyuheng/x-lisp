#!/usr/bin/env bash

set -e

cd packages/std.js; ./scripts/test.sh; cd ../..
cd packages/cli.js; ./scripts/test.sh; cd ../..
cd packages/bin.js; ./scripts/test.sh; cd ../..
cd packages/sexp.js; ./scripts/test.sh; cd ../..
cd packages/ppml.js; ./scripts/test.sh; cd ../..

cd packages/std.c; ./scripts/test.sh; cd ../..
cd packages/cli.c; ./scripts/test.sh; cd ../..
cd packages/meta-runtime.c; ./scripts/test.sh; cd ../..

cd packages/meta-lisp.js; ./scripts/test.sh; cd ../..

cd packages/meta-builtin.meta; ./scripts/test.sh; cd ../..
cd packages/meta-math.meta; ./scripts/test.sh; cd ../..
cd packages/meta-example.meta; ./scripts/test.sh; cd ../..
cd packages/meta-error.meta; ./scripts/test.sh; cd ../..
cd packages/meta-lisp.meta; ./scripts/test.sh; cd ../..
cd packages/meta-pass-dump.meta; ./scripts/test.sh; cd ../..

cd packages/meta-lisp.meta; ./scripts/self-test.sh; cd ../..
