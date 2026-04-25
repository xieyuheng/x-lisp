#!/usr/bin/env bash

set -e

# ./meta-lisp.js check --verbose
# ./meta-lisp.js build --dump --basic
./meta-lisp.js test --verbose --profile --builtin
