#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test -j
make --directory projects/cmd.c test -j
make --directory projects/linn.c test -j

pnpm run -r test
pnpm run -r test:cli

cd projects/meta-lisp.meta; bash scripts/test.sh; cd ../..
