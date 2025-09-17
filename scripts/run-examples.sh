#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true"
parallel="parallel -v --halt now,fail=1"

true &&
    find examples -name "*.test.lisp" | $parallel $bin {} &&
    find examples -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out &&
    find examples -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
