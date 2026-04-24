#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/stack-lisp.exe test"

find lib/tests -name "*.stack" | $parallel $bin {}
