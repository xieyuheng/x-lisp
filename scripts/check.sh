#!/usr/bin/env bash

set -e

cd packages/std.js; ./scripts/check.sh; cd ../..
cd packages/cli.js; ./scripts/check.sh; cd ../..
cd packages/sexp.js; ./scripts/check.sh; cd ../..
cd packages/ppml.js; ./scripts/check.sh; cd ../..
cd packages/meta-lisp.js; ./scripts/check.sh; cd ../..
