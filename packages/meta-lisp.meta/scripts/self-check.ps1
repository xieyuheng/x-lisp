#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$metaLispMeta = Join-Path $PSScriptRoot '../../../bin/meta-lisp.meta.ps1'
& $metaLispMeta check
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
