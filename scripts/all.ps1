#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

Set-Location (Join-Path $PSScriptRoot '..')

./scripts/stage0.ps1
./scripts/stage1.ps1
./scripts/stage2.ps1
./scripts/stage3.ps1
./scripts/stage4.ps1
