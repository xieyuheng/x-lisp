#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js interpret-via-basic"

find lisp/frontend-tests -name "*.test.lisp" | $parallel $bin {}
find lisp/frontend-tests -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/frontend-tests -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
