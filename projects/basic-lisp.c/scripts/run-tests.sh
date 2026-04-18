#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/basic-lisp.exe run main"
flags=""

find lib/tests -name "*.test.basic" | $parallel $bin {} $flags
find lib/tests -name "*.snapshot.basic" | $parallel $bin {} $flags ">" {}.out
find lib/tests -name "*.error.basic" | $parallel $bin {} $flags ">" {}.err "||" true
