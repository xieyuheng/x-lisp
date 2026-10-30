#!/usr/bin/env bash

set -e

# build by bootstrap compiler

rm -rf build

../../bin/meta-lisp.ts build

./scripts/sanitize-dump.sh build

# build by self compiler

rm -rf self-build

../../bin/meta-lisp.meta build --config self-meta-package.json

./scripts/sanitize-dump.sh self-build
