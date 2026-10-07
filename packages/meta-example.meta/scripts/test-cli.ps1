#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
. (Join-Path $PSScriptRoot '../../../builders/scripts/init-utf8.ps1')
$root = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$xvm = Join-Path $root 'bin/xvm.ps1'
$exe = 'build/bundle.xvm.exe'

Write-Output '=== hello ==='
& $xvm run $exe -- hello

Write-Output '=== add 1 2 ==='
& $xvm run $exe -- add 1 2

Write-Output '=== mul --x 3 --y 4 ==='
& $xvm run $exe -- mul --x 3 --y 4

Write-Output '=== bye ==='
& $xvm run $exe -- bye

Write-Output '=== passthrough -- foo bar baz ==='
& $xvm run $exe -- passthrough -- foo bar baz

Write-Output '=== no command ==='
& $xvm run $exe

Write-Output '=== unknown command ==='
& $xvm run $exe -- badcmd
