#!/usr/bin/env pwsh
#Requires -Version 7.3
param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $Rest)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../builders/scripts/init-utf8.ps1')
$PSNativeCommandUseErrorActionPreference = $true
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$bundle = Join-Path $root 'packages/meta-lisp.meta/build/bundle.xvm.exe'
if (-not (Test-Path $bundle)) {
  throw "bundle not found: $bundle; run the meta-lisp.meta self-build first"
}
& (Join-Path $root 'bin/xvm.ps1') run $bundle @Rest
exit $LASTEXITCODE
