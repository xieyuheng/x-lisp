#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js interpret-basic"

find lisp/basic-tests -name "*.test.lisp" | $parallel $bin {}
find lisp/basic-tests -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/basic-tests -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
