#!/usr/bin/env bash

set -e

./meta-lisp.js check
./meta-lisp.js build

./scripts/self-check.sh
