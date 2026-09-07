#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
BASIC_DIR="lib/basic"

find "$BASIC_DIR" -name "*.basic" | $parallel ./bin/meta-lisp.js basic:format {} ">" {}.format