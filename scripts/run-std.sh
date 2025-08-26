#!/usr/bin/env sh

bin="node ./lib/main.js run --debug=true --no-std-prelude=true"
ext=lisp
dir=std

for file in $(find $dir -name "*.test.${ext}"); do
    echo "[test] $file"
    ${bin} $file
done

for file in $(find $dir -name "*.snapshot.${ext}"); do
    echo "[snapshot] $file"
    ${bin} $file > $file.out
done

for file in $(find $dir -name "*.error.${ext}"); do
    echo "[error] $file"
    ${bin} $file > $file.err || true
done
