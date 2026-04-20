#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/li.exe run"

find lib/tests -name "*.li" | $parallel $bin {}
