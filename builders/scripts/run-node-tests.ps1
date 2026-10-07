#!/usr/bin/env pwsh
#Requires -Version 7.3

[CmdletBinding()]
param(
  [Parameter(Mandatory)]
  [string]$Root
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$src = Join-Path $Root 'src'
$tests = @(Get-ChildItem -Recurse -File -Path $src -Filter '*.test.ts' | ForEach-Object { $_.FullName })
if ($tests.Count -eq 0) {
  exit 0
}

& node --test @tests
exit $LASTEXITCODE
