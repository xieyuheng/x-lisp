#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Remove-Item -Recurse -Force (Join-Path $packageRoot 'self-build') -ErrorAction SilentlyContinue
