#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test -j
make --directory projects/cmd.c test -j
make --directory projects/stack-lisp.c test -j

pnpm run -r --parallel test

cd projects/meta-examples.meta; bash scripts/test.sh; cd ../..
cd projects/meta-lisp.meta; bash scripts/test.sh; cd ../..
