#!/usr/bin/env bash

set -e

cd packages/std.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/cli.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/bin.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/sexp.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/ppml.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..

cd packages/std.c; ./scripts/test.sh; cd ../..
cd packages/cli.c; ./scripts/test.sh; cd ../..
cd packages/xrt.c; ./scripts/test.sh; cd ../..
cd packages/xvm.c; ./scripts/test.sh; cd ../..
cd packages/xexe.c; ./scripts/test.sh; cd ../..

cd packages/meta-lisp.js; ./scripts/clean.sh; ./scripts/test.sh; cd ../..

cd packages/meta-builtin.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/meta-math.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/cli.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/命令行; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/元语数学; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/元语例子; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/meta-example.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/meta-error.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/meta-lisp.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..
cd packages/meta-pass-dump.meta; ./scripts/clean.sh; ./scripts/test.sh; cd ../..

cd packages/meta-lisp.meta; ./scripts/self-test.sh; cd ../..
