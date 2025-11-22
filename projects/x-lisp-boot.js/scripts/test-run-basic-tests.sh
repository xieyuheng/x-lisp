#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js basic:run"

find lisp/basic-tests -name "*.test.basic" | $parallel $bin {}
find lisp/basic-tests -name "*.snapshot.basic" | $parallel $bin {} ">" {}.out
find lisp/basic-tests -name "*.error.basic" | $parallel $bin {} ">" {}.err "||" true
