#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/stack-lisp run"
flags=""

find lisp/tests -name "*.test.stack" | $parallel $bin {} $flags
find lisp/tests -name "*.snapshot.stack" | $parallel $bin {} $flags ">" {}.out
find lisp/tests -name "*.error.stack" | $parallel $bin {} $flags ">" {}.err "||" true
