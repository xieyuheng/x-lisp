#!/usr/bin/env pwsh
#Requires -Version 7.3

[CmdletBinding()]
param(
  [Parameter(Mandatory, Position = 0)]
  [string]$Package,

  [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
  [string[]]$Tasks
)

$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../builders/scripts/init-utf8.ps1')
$PSNativeCommandUseErrorActionPreference = $true

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$packageDir = Join-Path $repoRoot "packages/$Package"
if (-not $env:X_LISP_REPO_ROOT) { $env:X_LISP_REPO_ROOT = $repoRoot }
if (-not $env:X_LISP_BUILD_DIR) { $env:X_LISP_BUILD_DIR = Join-Path $repoRoot 'build/windows' }
if (-not $env:X_LISP_CONFIG) { $env:X_LISP_CONFIG = 'Release' }

Push-Location $packageDir
try {
  foreach ($task in $Tasks) {
    $name = $task -replace '\.(sh|ps1)$', ''
    & (Join-Path $packageDir "scripts/$name.ps1")
  }
} finally {
  Pop-Location
}
