#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/xvm.exe test"

find lib/tests -name "*.stack" | $parallel $bin {}
