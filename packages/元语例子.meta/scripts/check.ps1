#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$metaLisp = Join-Path $PSScriptRoot '../../../bin/meta-lisp.ps1'
& $metaLisp check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
