#!/usr/bin/env bash

set -e

./bin/meta-lisp.js check > type-check-error-report.txt || true
