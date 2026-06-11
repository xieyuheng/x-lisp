#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xvm.exe" | $parallel ./src/meta.exe test-xvm {}
