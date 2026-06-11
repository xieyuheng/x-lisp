#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xasm" | $parallel ./src/xvm.exe assemble {}
