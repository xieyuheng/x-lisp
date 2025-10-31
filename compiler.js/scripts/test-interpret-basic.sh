#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js interpret-basic"

find lisp/basic -name "*.test.lisp" | $parallel $bin {}
find lisp/basic -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/basic -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
