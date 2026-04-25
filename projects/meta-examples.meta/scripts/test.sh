#!/usr/bin/env bash

set -e

# ./meta-lisp.js check
# ./meta-lisp.js build --dump --basic
# ./meta-lisp.js build
./meta-lisp.js test --builtin --verbose
