#!/usr/bin/env pwsh
#Requires -Version 7.3
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../../../builders/cmake/tasks.ps1')
Invoke-XLispCMakeBuild
