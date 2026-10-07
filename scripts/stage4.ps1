#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

# stage4 -- meta-lisp compiler

# self compiler by bootstrap compiler

./scripts/run-in.ps1 meta-lisp.meta build
./scripts/run-in.ps1 meta-lisp.meta test

# pass dump test

./scripts/run-in.ps1 meta-pass-dump.meta build
./scripts/run-in.ps1 meta-pass-dump.meta test

# self compiler by self compiler

./scripts/run-in.ps1 meta-lisp.meta self-build
