#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run --debug=true --no-prelude=true"

find prelude -name "*.test.lisp" | $parallel $bin {}
find prelude -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
find prelude -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
