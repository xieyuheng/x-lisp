#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js interpret --debug=true"

find tests -name "*.test.lisp" | $parallel $bin {}
find tests -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find tests -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
