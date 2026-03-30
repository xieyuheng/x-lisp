#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./src/main.ts module:check"

find lib/syntax-errors -name "*.syntax-error.meta" | $parallel $bin {} ">" {}.out "||" true
