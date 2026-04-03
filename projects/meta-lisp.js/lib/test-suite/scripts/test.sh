#!/usr/bin/env bash

set -e

./meta-lisp.js project:check
./meta-lisp.js project:dump
# ./meta-lisp.js project:build
./meta-lisp.js project:test
