#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

# stage2 -- meta-lisp code build

$packages = @(
  'meta-builtin.meta',
  'meta-math.meta',
  'cli.meta',
  'meta-example.meta',
  '元语数学',
  '命令行',
  '元语例子'
)

foreach ($package in $packages) {
  ./scripts/run-in.ps1 $package build
}
