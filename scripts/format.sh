#!/usr/bin/env bash

set -e

cd packages/helpers.js; ./scripts/format.sh; cd ../..
cd packages/cli.js; ./scripts/format.sh; cd ../..
cd packages/sexp.js; ./scripts/format.sh; cd ../..
cd packages/ppml.js; ./scripts/format.sh; cd ../..
