#!/usr/bin/env bash

set -e

# stage1 -- js/ts bootstrap compiler

# ts format

./scripts/run-in.sh std.ts format.sh
./scripts/run-in.sh cli.ts format.sh
./scripts/run-in.sh sexp.ts format.sh
./scripts/run-in.sh ppml.ts format.sh
./scripts/run-in.sh basic-lisp.ts format.sh
./scripts/run-in.sh xvm-lisp.ts format.sh
./scripts/run-in.sh x86-lisp.ts format.sh
./scripts/run-in.sh meta-lisp.ts format.sh

# ts check

./scripts/run-in.sh std.ts check.sh
./scripts/run-in.sh cli.ts check.sh
./scripts/run-in.sh sexp.ts check.sh
./scripts/run-in.sh ppml.ts check.sh
./scripts/run-in.sh basic-lisp.ts check.sh
./scripts/run-in.sh xvm-lisp.ts check.sh
./scripts/run-in.sh x86-lisp.ts check.sh
./scripts/run-in.sh meta-lisp.ts check.sh

# ts test

./scripts/run-in.sh std.ts clean.sh test.sh
./scripts/run-in.sh cli.ts clean.sh test.sh
./scripts/run-in.sh sexp.ts clean.sh test.sh
./scripts/run-in.sh ppml.ts clean.sh test.sh
./scripts/run-in.sh basic-lisp.ts clean.sh test.sh
./scripts/run-in.sh xvm-lisp.ts clean.sh test.sh
./scripts/run-in.sh x86-lisp.ts clean.sh test.sh
./scripts/run-in.sh meta-lisp.ts clean.sh test.sh

# bootstrap compiler type check error snapshot

./scripts/run-in.sh meta-error.meta test.sh
./scripts/run-in.sh 元语错误.meta test.sh
