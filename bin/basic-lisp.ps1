#!/usr/bin/env pwsh
#Requires -Version 7.3
param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $Rest)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../builders/scripts/init-utf8.ps1')
$PSNativeCommandUseErrorActionPreference = $true
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
& node --stack-size=65536 (Join-Path $root 'packages/basic-lisp.js/src/main.ts') @Rest
exit $LASTEXITCODE
