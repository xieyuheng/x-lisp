#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true"

find examples -name "*.test.lisp" | parallel -v --halt now,fail=1 ${bin} {} &&
find examples -name "*.snapshot.lisp" | parallel -v --halt now,fail=1 ${bin} {} ">" {}.out &&
find examples -name "*.error.lisp" | parallel -v --halt now,fail=1 ${bin} {} ">" {}.err "||" true
