#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run-via-basic"

find lisp/lang-tests -name "*.test.lisp" | $parallel $bin {}
find lisp/lang-tests -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/lang-tests -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
