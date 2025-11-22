#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run"
flags="--debug --no-prelude"

find lisp/prelude -name "*.test.lisp" | $parallel $bin {} $flags
find lisp/prelude -name "*.snapshot.lisp" | $parallel $bin {} $flags ">" {}.out
find lisp/prelude -name "*.error.lisp" | $parallel $bin {} $flags ">" {}.err "||" true
