#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm

./meta-lisp.js test-xvm
./scripts/test-cli.sh > scripts/test-cli.sh.out

./meta-lisp.js build-x86
