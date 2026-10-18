#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

# stage1 -- js/ts bootstrap compiler

# ts format

./scripts/run-in.ps1 std.ts format
./scripts/run-in.ps1 cli.ts format
./scripts/run-in.ps1 sexp.ts format
./scripts/run-in.ps1 ppml.ts format
./scripts/run-in.ps1 basic-lisp.ts format
./scripts/run-in.ps1 xvm-lisp.ts format
./scripts/run-in.ps1 x86-lisp.ts format
./scripts/run-in.ps1 meta-lisp.ts format

# ts check

./scripts/run-in.ps1 std.ts check
./scripts/run-in.ps1 cli.ts check
./scripts/run-in.ps1 sexp.ts check
./scripts/run-in.ps1 ppml.ts check
./scripts/run-in.ps1 basic-lisp.ts check
./scripts/run-in.ps1 xvm-lisp.ts check
./scripts/run-in.ps1 x86-lisp.ts check
./scripts/run-in.ps1 meta-lisp.ts check

# ts test

./scripts/run-in.ps1 std.ts clean test
./scripts/run-in.ps1 cli.ts clean test
./scripts/run-in.ps1 sexp.ts clean test
./scripts/run-in.ps1 ppml.ts clean test
./scripts/run-in.ps1 basic-lisp.ts clean test
./scripts/run-in.ps1 xvm-lisp.ts clean test
./scripts/run-in.ps1 x86-lisp.ts clean test
./scripts/run-in.ps1 meta-lisp.ts clean test

# bootstrap compiler type check error snapshot

./scripts/run-in.ps1 meta-error.meta test
./scripts/run-in.ps1 元语错误.meta test
