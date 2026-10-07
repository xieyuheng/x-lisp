#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../../../builders/cmake/tasks.ps1')
Invoke-XLispCMakeTest -Package 'xvm.c'
& (Join-Path $PSScriptRoot 'test-xvm.ps1')
