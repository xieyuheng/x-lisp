#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
Set-Location (Join-Path $PSScriptRoot '..')
npx.cmd tsc --noEmit --watch
