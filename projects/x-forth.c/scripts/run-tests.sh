#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/x-lisp-forth run"
flags=""

find forth/tests -name "*.test.fth" | $parallel $bin {} $flags
find forth/tests -name "*.snapshot.fth" | $parallel $bin {} $flags ">" {}.out
find forth/tests -name "*.error.fth" | $parallel $bin {} $flags ">" {}.err "||" true
