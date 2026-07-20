#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm
./meta-lisp.js build-x86

./scripts/sanitize-dump.sh build
