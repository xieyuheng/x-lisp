#!/usr/bin/env bash

set -e

./meta-lisp.js build
./scripts/sanitize-dump.sh expected
