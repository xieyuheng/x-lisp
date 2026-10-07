#!/usr/bin/env pwsh
#Requires -Version 7.3

[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)]
  [string]$OutputDirectory
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$buildDir = (Resolve-Path $OutputDirectory).Path
$dumpDir = Join-Path $buildDir 'dump'
$sanitizer = Join-Path $PSScriptRoot 'sanitize-dump.mjs'

if (Test-Path $dumpDir) {
  $dumpFiles = Get-ChildItem -Recurse -File -Path $dumpDir -Filter '*.dump'
  foreach ($file in $dumpFiles) {
    & node $sanitizer $file.FullName
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
} else {
  Write-Host "[sanitize-dump.ps1] dump directory does not exist: $dumpDir"
}

$bundles = @('bundle.xvm.basic')
foreach ($bundle in $bundles) {
  $path = Join-Path $buildDir $bundle
  if (Test-Path $path) {
    & node $sanitizer $path
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  }
}
