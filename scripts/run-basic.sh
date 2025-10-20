#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js basic:run"

find basic -name "*.lisp" | $parallel $bin {}
# find basic -name "*.test.lisp" | $parallel $bin {}
# find basic -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out
# find basic -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
