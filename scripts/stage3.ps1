#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

# stage3 -- meta-lisp code test

./scripts/run-in.ps1 meta-builtin.meta test
./scripts/run-in.ps1 meta-math.meta test
./scripts/run-in.ps1 cli.meta test
./scripts/run-in.ps1 meta-example.meta test
./scripts/run-in.ps1 元语数学 test
./scripts/run-in.ps1 命令行 test
./scripts/run-in.ps1 元语例子 test
