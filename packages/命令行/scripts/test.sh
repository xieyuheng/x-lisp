#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm

./meta-lisp.js test-xvm
./meta-lisp.js build-x86
