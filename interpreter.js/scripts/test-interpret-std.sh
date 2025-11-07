#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js interpret --debug=true"

find lisp/std -name "*.test.lisp" | $parallel $bin {}
find lisp/std -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find lisp/std -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
