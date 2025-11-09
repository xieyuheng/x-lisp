#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run"
flags="--debug"

find lisp/tests -name "*.test.lisp" | $parallel $bin {} $flags
find lisp/tests -name "*.snapshot.lisp" | $parallel $bin {} $flags ">" {}.out
find lisp/tests -name "*.error.lisp" | $parallel $bin {} $flags ">" {}.err "||" true
