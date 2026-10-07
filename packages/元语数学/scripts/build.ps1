#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$metaLisp = Join-Path $PSScriptRoot '../../../bin/meta-lisp.ps1'
Remove-Item -Recurse -Force (Join-Path $packageRoot 'build') -ErrorAction SilentlyContinue
& $metaLisp build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
