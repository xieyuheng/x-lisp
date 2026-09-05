#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm
./meta-lisp.js build-xvm2
./meta-lisp.js test-xvm --profile --builtin

./meta-lisp.js test-xvm2
./meta-lisp.js build-x86
