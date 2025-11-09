#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js compile-to-pass-log"

find lisp/tests -name "*.lisp" | $parallel $bin {} ">" {}.passes
