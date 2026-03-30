#!/usr/bin/env bash

set -e

bash scripts/snapshot-syntax-errors.sh

cd lisp/test-suite; bash scripts/test.sh; cd ../..
