#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$root = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$xvm = Join-Path $root 'bin/xvm.ps1'
$xvmLisp = Join-Path $root 'bin/xvm-lisp.ps1'

$files = Get-ChildItem -Recurse -File -Path (Join-Path $packageRoot 'lib') -Filter '*.xvm.asm' | Sort-Object FullName
foreach ($file in $files) {
  $exe = $file.FullName -replace '\.xvm\.asm$', '.xvm.exe'
  & $xvmLisp assemble $file.FullName $exe
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  & $xvm test $exe
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}
