#!/usr/bin/env sh

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js run --debug=true"

true &&
    find examples -name "*.test.lisp" | $parallel $bin {} &&
    find examples -name "*.snapshot.lisp" | $parallel $bin {} ">" {}.out &&
    find examples -name "*.error.lisp" | $parallel $bin {} ">" {}.err "||" true
