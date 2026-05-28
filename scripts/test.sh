#!/usr/bin/env bash

set -e

make --directory packages/helpers.c test -j
make --directory packages/cli.c test -j
make --directory packages/xvm.c test -j

pnpm run -r --parallel test

cd packages/meta-builtin.meta; bash scripts/test.sh; cd ../..
cd packages/meta-example.meta; bash scripts/test.sh; cd ../..
cd packages/meta-error.meta; bash scripts/test.sh; cd ../..
cd packages/meta-lisp.meta; bash scripts/test.sh; cd ../..
