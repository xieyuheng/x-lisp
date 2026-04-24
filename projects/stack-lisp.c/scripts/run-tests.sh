#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/stack-lisp.exe call main"

find lib/tests -name "*.stack" | $parallel $bin {}
