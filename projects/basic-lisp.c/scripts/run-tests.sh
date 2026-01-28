#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/basic-lisp run"
flags=""

find basic/tests -name "*.test.basic" | $parallel $bin {} $flags
find basic/tests -name "*.snapshot.basic" | $parallel $bin {} $flags ">" {}.out
find basic/tests -name "*.error.basic" | $parallel $bin {} $flags ">" {}.err "||" true
