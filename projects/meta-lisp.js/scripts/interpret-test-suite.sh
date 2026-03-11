#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./src/main.ts module:interpret"

find lisp -name "*.test.lisp" | $parallel $bin {}
find lisp -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.interpret.out "||" true
