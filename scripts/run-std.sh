#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true --no-std-prelude=true"

find std -name "*.test.lisp" | parallel -v --halt now,fail=1 ${bin} {} &&
find std -name "*.snapshot.lisp" | parallel -v --halt now,fail=1 ${bin} {} ">" {}.out &&
find std -name "*.error.lisp" | parallel -v --halt now,fail=1 ${bin} {} ">" {}.err "||" true
