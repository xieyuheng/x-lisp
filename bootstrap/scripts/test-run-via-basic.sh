#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run-via-basic"

find lisp/tests -name "*.test.lisp" | $parallel $bin {}
find lisp/tests -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/tests -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
