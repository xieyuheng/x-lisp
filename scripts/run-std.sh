#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true --no-std-prelude=true"

find std -name "*.test.lisp" | parallel -v ${bin} {}
find std -name "*.snapshot.lisp" | parallel -v ${bin} {} ">" {}.out
find std -name "*.error.lisp" | parallel -v ${bin} {} ">" {}.err "||" true
