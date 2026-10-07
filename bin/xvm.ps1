#!/usr/bin/env pwsh
#Requires -Version 7.3
param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $Rest)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../builders/scripts/init-utf8.ps1')
$PSNativeCommandUseErrorActionPreference = $true
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$exe = Join-Path $root 'build/windows/bin/xvm.exe'
if (-not (Test-Path $exe)) {
  throw "xvm.exe not found: $exe; run ./scripts/stage0.ps1 first"
}

$forward = @($Rest)
if ($Rest.Count -ge 2 -and $Rest[0] -eq 'run' -and ($Rest.Count -lt 3 -or $Rest[2] -ne '--')) {
  $forward = @($Rest[0], $Rest[1], '--')
  if ($Rest.Count -gt 2) {
    $forward += @($Rest[2..($Rest.Count - 1)])
  }
}

& $exe @forward
exit $LASTEXITCODE
