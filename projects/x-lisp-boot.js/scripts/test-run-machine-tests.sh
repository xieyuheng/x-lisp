#!/usr/bin/env bash

set -e

# parallel="parallel -v --halt now,fail=1"
# bin="node ./lib/main.js machine:transpile-to-x86-assembly"

# find lisp/machine-tests -name "*.machine" | $parallel $bin {} ">" {}.x86.s

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js machine:assemble-x86"

find lisp/machine-tests -name "*.machine" | $parallel $bin {}
