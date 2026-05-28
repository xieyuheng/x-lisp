#!/usr/bin/env bash

set -e

./meta-lisp.js check
./meta-lisp.js build

sh scripts/self-check.sh
