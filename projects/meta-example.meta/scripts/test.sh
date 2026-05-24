#!/usr/bin/env bash

set -e

./meta-lisp.js check
./meta-lisp.js build
./meta-lisp.js test --profile

bash scripts/test-cli.sh > scripts/test-cli.sh.out
