#!/usr/bin/env bash

set -e

# stage1 -- js/ts bootstrap compiler

# prepare

pnpm install

# ts format

./scripts/run-in.sh std.js format.sh
./scripts/run-in.sh cli.js format.sh
./scripts/run-in.sh sexp.js format.sh
./scripts/run-in.sh ppml.js format.sh
./scripts/run-in.sh basic-lisp.js format.sh
./scripts/run-in.sh xvm-lisp.js format.sh
./scripts/run-in.sh x86-lisp.js format.sh
./scripts/run-in.sh meta-lisp.js format.sh

# ts check

./scripts/run-in.sh std.js check.sh
./scripts/run-in.sh cli.js check.sh
./scripts/run-in.sh sexp.js check.sh
./scripts/run-in.sh ppml.js check.sh
./scripts/run-in.sh basic-lisp.js check.sh
./scripts/run-in.sh xvm-lisp.js check.sh
./scripts/run-in.sh x86-lisp.js check.sh
./scripts/run-in.sh meta-lisp.js check.sh

# ts test

./scripts/run-in.sh std.js clean.sh test.sh
./scripts/run-in.sh cli.js clean.sh test.sh
./scripts/run-in.sh sexp.js clean.sh test.sh
./scripts/run-in.sh ppml.js clean.sh test.sh
./scripts/run-in.sh basic-lisp.js clean.sh test.sh
./scripts/run-in.sh xvm-lisp.js clean.sh test.sh
./scripts/run-in.sh x86-lisp.js clean.sh test.sh
./scripts/run-in.sh meta-lisp.js clean.sh test.sh

# bootstrap compiler type check error snapshot

./scripts/run-in.sh meta-error.meta test.sh
