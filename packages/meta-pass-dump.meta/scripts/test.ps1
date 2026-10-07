#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$oldPreference = $PSNativeCommandUseErrorActionPreference
$PSNativeCommandUseErrorActionPreference = $false

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$buildDump = Join-Path $packageRoot 'build/dump'
$selfBuildDump = Join-Path $packageRoot 'self-build/dump'

$result = 0
if (Test-Path $buildDump) {
  $files = Get-ChildItem -Recurse -File -Path $buildDump -Filter '*.dump'
  foreach ($file in $files) {
    $relative = $file.FullName.Substring($buildDump.Length + 1)
    $counterpart = Join-Path $selfBuildDump $relative
    if (Test-Path $counterpart) {
      git -c core.autocrlf=false --no-pager diff --no-index -- $file.FullName $counterpart
      if ($LASTEXITCODE -ne 0) { $result = 1 }
    }
  }
}

$PSNativeCommandUseErrorActionPreference = $oldPreference
exit $result
