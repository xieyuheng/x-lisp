#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true --no-std-prelude=true"
parallel="parallel -v --halt now,fail=1"

true &&
    find std -name "*.test.lisp" | $parallel $bin {} &&
    find std -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out &&
    find std -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
