#!/usr/bin/env bash

set -e

rm -rf build

./bin/meta-lisp.ts build
