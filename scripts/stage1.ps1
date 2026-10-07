#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

# stage1 -- js/ts bootstrap compiler

# ts format

./scripts/run-in.ps1 std.js format
./scripts/run-in.ps1 cli.js format
./scripts/run-in.ps1 sexp.js format
./scripts/run-in.ps1 ppml.js format
./scripts/run-in.ps1 basic-lisp.js format
./scripts/run-in.ps1 xvm-lisp.js format
./scripts/run-in.ps1 x86-lisp.js format
./scripts/run-in.ps1 meta-lisp.js format

# ts check

./scripts/run-in.ps1 std.js check
./scripts/run-in.ps1 cli.js check
./scripts/run-in.ps1 sexp.js check
./scripts/run-in.ps1 ppml.js check
./scripts/run-in.ps1 basic-lisp.js check
./scripts/run-in.ps1 xvm-lisp.js check
./scripts/run-in.ps1 x86-lisp.js check
./scripts/run-in.ps1 meta-lisp.js check

# ts test

./scripts/run-in.ps1 std.js clean test
./scripts/run-in.ps1 cli.js clean test
./scripts/run-in.ps1 sexp.js clean test
./scripts/run-in.ps1 ppml.js clean test
./scripts/run-in.ps1 basic-lisp.js clean test
./scripts/run-in.ps1 xvm-lisp.js clean test
./scripts/run-in.ps1 x86-lisp.js clean test
./scripts/run-in.ps1 meta-lisp.js clean test

# bootstrap compiler type check error snapshot

./scripts/run-in.ps1 meta-error.meta test
./scripts/run-in.ps1 元语错误 test
