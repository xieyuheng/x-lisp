#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$helper = Join-Path $PSScriptRoot '../../../builders/scripts/run-native-to-file.ps1'
$bin = Join-Path $PSScriptRoot '../../../bin/basic-lisp.ps1'

$files = Get-ChildItem -Recurse -File -Path (Join-Path $packageRoot 'lib') -Filter '*.basic'
foreach ($file in $files) {
  $out = "$($file.FullName).format"
  & $helper -FilePath $bin -ArgumentList @('format', $file.FullName) -OutputPath $out
}
