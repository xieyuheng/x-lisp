#!/usr/bin/env bash

set -e

./meta-lisp.js build-xvm
./scripts/sanitize-dump.sh expected
