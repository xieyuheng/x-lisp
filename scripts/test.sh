#!/usr/bin/env bash

set -e

make --directory packages/helpers.c test -j
make --directory packages/cli.c test -j
make --directory packages/xvm.c test -j

pnpm run -r --parallel test

cd packages/meta-builtin.meta; ./scripts/test.sh; cd ../..
cd packages/meta-example.meta; ./scripts/test.sh; cd ../..
cd packages/meta-error.meta; ./scripts/test.sh; cd ../..
cd packages/meta-lisp.meta; ./scripts/test.sh; cd ../..
