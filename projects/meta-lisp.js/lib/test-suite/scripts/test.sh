#!/usr/bin/env bash

set -e

./meta-lisp.js check
./meta-lisp.js dump
./meta-lisp.js build
./meta-lisp.js test
