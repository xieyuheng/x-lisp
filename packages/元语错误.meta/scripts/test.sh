#!/usr/bin/env bash

set -e

./bin/meta-lisp.ts check > type-check-error-report.txt || true
