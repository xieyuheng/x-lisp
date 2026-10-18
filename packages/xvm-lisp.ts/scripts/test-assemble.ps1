#!/usr/bin/env pwsh
#Requires -Version 7.3

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$packageRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$root = (Resolve-Path (Join-Path $PSScriptRoot '../../..')).Path
$helper = Join-Path $root 'builders/scripts/run-native-to-file.ps1'
$xvmLisp = Join-Path $root 'bin/xvm-lisp.ps1'

$files = Get-ChildItem -Recurse -File -Path (Join-Path $packageRoot 'lib') -Filter '*.xvm.asm'
foreach ($file in $files) {
  $format = "$($file.FullName).format"
  & $helper -FilePath $xvmLisp -ArgumentList @('format', $file.FullName) -OutputPath $format

  $exe = $file.FullName -replace '\.asm$', '.exe'
  & $xvmLisp assemble $file.FullName $exe
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  $disasm = "$exe.disasm"
  & $helper -FilePath $xvmLisp -ArgumentList @('disassemble', $exe) -OutputPath $disasm

  $info = "$exe.info"
  & $helper -FilePath $xvmLisp -ArgumentList @('info', $exe) -OutputPath $info
}
