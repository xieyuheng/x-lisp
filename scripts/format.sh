#!/usr/bin/env bash

set -e

cd packages/std.js; ./scripts/format.sh; cd ../..
cd packages/cli.js; ./scripts/format.sh; cd ../..
cd packages/sexp.js; ./scripts/format.sh; cd ../..
cd packages/ppml.js; ./scripts/format.sh; cd ../..
cd packages/meta-lisp.js; ./scripts/format.sh; cd ../..
