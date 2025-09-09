#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true --no-std-prelude=true"
ext=lisp
dir=std

find $dir -name "*.test.${ext}" | parallel -v ${bin} {}
find $dir -name "*.snapshot.${ext}" | parallel -v ${bin} {} ">" {}.out
find $dir -name "*.error.${ext}" | parallel -v ${bin} {} ">" {}.err "||" true
