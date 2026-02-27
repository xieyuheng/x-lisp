#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./src/main.ts module:check"

find lisp -name "*.type-error.lisp" | $parallel $bin {} ">" {}.err "||" true
