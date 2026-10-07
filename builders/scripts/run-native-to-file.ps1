#!/usr/bin/env pwsh
#Requires -Version 7.3

[CmdletBinding()]
param(
  [Parameter(Mandatory)]
  [string]$FilePath,

  [Parameter()]
  [string[]]$ArgumentList = @(),

  [Parameter(Mandatory)]
  [string]$OutputPath
)

$ErrorActionPreference = 'Stop'

$exe = $FilePath
$args = @($ArgumentList)

if ($FilePath.EndsWith('.ps1', [System.StringComparison]::OrdinalIgnoreCase)) {
  $exe = (Get-Command pwsh).Source
  $args = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $FilePath) + $args
}

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory) {
  New-Item -ItemType Directory -Force $outputDirectory | Out-Null
}

$startInfo = [System.Diagnostics.ProcessStartInfo]::new()
$startInfo.FileName = $exe
$startInfo.UseShellExecute = $false
$startInfo.WorkingDirectory = (Get-Location).Path
$startInfo.RedirectStandardOutput = $true
foreach ($argument in $args) {
  $startInfo.ArgumentList.Add([string] $argument)
}

$process = [System.Diagnostics.Process]::Start($startInfo)
$output = [System.IO.File]::Create($OutputPath)
try {
  $process.StandardOutput.BaseStream.CopyTo($output)
} finally {
  $output.Dispose()
}
$process.WaitForExit()

if ($process.ExitCode -ne 0) {
  exit $process.ExitCode
}
