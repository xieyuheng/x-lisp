#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/stack-lisp run"
flags=""

find lisp/tests -name "*.test.basic" | $parallel $bin {} $flags
find lisp/tests -name "*.snapshot.basic" | $parallel $bin {} $flags ">" {}.out
find lisp/tests -name "*.error.basic" | $parallel $bin {} $flags ">" {}.err "||" true
