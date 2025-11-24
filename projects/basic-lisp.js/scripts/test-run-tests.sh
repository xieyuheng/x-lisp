#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run"

find lisp/tests -name "*.test.basic" | $parallel $bin {}
find lisp/tests -name "*.snapshot.basic" | $parallel $bin {} ">" {}.out
find lisp/tests -name "*.error.basic" | $parallel $bin {} ">" {}.err "||" true
