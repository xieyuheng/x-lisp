#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$root = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$node = (Get-Command node).Source
$main = Join-Path $root 'packages/meta-lisp.js/src/main.ts'
$report = Join-Path $packageRoot 'type-check-error-report.txt'
$helper = Join-Path $root 'builders/scripts/run-native-to-file-ignore-exit.ps1'
& $helper -FilePath $node -ArgumentList @('--stack-size=65536', $main, 'check') -OutputPath $report
