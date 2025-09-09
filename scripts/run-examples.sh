#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true"

find examples -name "*.test.lisp" | parallel -v ${bin} {}
find examples -name "*.snapshot.lisp" | parallel -v ${bin} {} ">" {}.out
find examples -name "*.error.lisp" | parallel -v ${bin} {} ">" {}.err "||" true
