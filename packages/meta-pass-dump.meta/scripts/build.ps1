#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$metaLisp = Join-Path $PSScriptRoot '../../../bin/meta-lisp.ps1'
$metaLispMeta = Join-Path $PSScriptRoot '../../../bin/meta-lisp.meta.ps1'
$sanitize = Join-Path $PSScriptRoot 'sanitize-dump.ps1'

Remove-Item -Recurse -Force (Join-Path $packageRoot 'build') -ErrorAction SilentlyContinue
& $metaLisp build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $sanitize (Join-Path $packageRoot 'build')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Remove-Item -Recurse -Force (Join-Path $packageRoot 'self-build') -ErrorAction SilentlyContinue
& $metaLispMeta build --config self-meta-package.json
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
& $sanitize (Join-Path $packageRoot 'self-build')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
