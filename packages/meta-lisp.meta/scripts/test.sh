#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm
./meta-lisp.js test-xvm
