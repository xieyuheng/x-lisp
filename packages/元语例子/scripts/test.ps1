#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true
. (Join-Path $PSScriptRoot '../../../builders/scripts/init-utf8.ps1')
$xvm = Join-Path $PSScriptRoot '../../../bin/xvm.ps1'
& $xvm test 'build/bundle.xvm.exe'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$output = & (Join-Path $PSScriptRoot 'test-cli.ps1')
$text = if ($null -eq $output) { '' } else { ($output | ForEach-Object { $_.ToString() }) -join "`n" }
if ($text.Length -gt 0) { $text += "`n" }
$out = Join-Path $PSScriptRoot 'test-cli.sh.out'
[System.IO.File]::WriteAllText($out, $text, (New-Object System.Text.UTF8Encoding($false)))
