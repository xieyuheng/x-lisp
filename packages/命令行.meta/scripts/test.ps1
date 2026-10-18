#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$xvm = Join-Path $PSScriptRoot '../../../bin/xvm.ps1'
& $xvm test (Join-Path $packageRoot 'build/bundle.xvm.exe')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
