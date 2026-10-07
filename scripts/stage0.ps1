#!/usr/bin/env pwsh
#Requires -Version 7.3

[CmdletBinding()]
param(
  [string]$BuildDirectory = 'build/windows',

  [ValidateSet('Debug', 'Release', 'RelWithDebInfo', 'MinSizeRel')]
  [string]$Configuration = 'Release'
)

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

$buildPath = Join-Path (Get-Location) $BuildDirectory

cmake -S . -B $buildPath -G "Visual Studio 17 2022" -A x64
cmake --build $buildPath --config $Configuration --parallel
ctest --test-dir $buildPath -C $Configuration --output-on-failure --timeout 120
