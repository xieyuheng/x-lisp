#!/usr/bin/env bash

set -e

./meta-lisp.js build
./meta-lisp.js test --profile

./scripts/test-cli.sh > scripts/test-cli.sh.out
