#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$xvm = Join-Path $PSScriptRoot '../../../bin/xvm.ps1'
& $xvm test (Join-Path $packageRoot 'build/bundle.xvm.exe')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$helper = Join-Path $PSScriptRoot '../../../builders/scripts/run-native-to-file.ps1'
$pwsh = (Get-Command pwsh).Source
$out = Join-Path $PSScriptRoot 'test-cli.sh.out'
& $helper -FilePath $pwsh -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $PSScriptRoot 'test-cli.ps1')) -OutputPath $out
