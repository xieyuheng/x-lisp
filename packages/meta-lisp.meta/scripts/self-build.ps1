#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$metaLispMeta = Join-Path $PSScriptRoot '../../../bin/meta-lisp.meta.ps1'
Remove-Item -Recurse -Force (Join-Path $packageRoot 'self-build') -ErrorAction SilentlyContinue
& $metaLispMeta build --config self-meta-package.json
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
