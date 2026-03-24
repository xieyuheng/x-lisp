#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test -j
make --directory projects/cmd.c test -j
make --directory projects/basic-lisp.c test -j

pnpm run -r test
pnpm run -r test:cli

cd projects/meta-test-suite; bash scripts/test.sh; cd ../..
cd projects/meta-lisp; bash scripts/test.sh; cd ../..
