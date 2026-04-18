#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/linn.exe run"

find lib/tests -name "*.linn" | $parallel $bin {}
