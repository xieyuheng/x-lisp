$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

function Get-XLispRepoRoot {
  return (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
}

function Get-XLispBuildDir {
  $repoRoot = Get-XLispRepoRoot
  if ($env:X_LISP_BUILD_DIR) {
    return $env:X_LISP_BUILD_DIR
  }
  return (Join-Path $repoRoot 'build/windows')
}

function Get-XLispConfig {
  if ($env:X_LISP_CONFIG) {
    return $env:X_LISP_CONFIG
  }
  return 'Release'
}

function Initialize-XLispCMake {
  $repoRoot = Get-XLispRepoRoot
  $buildDir = Get-XLispBuildDir

  if (-not (Test-Path (Join-Path $buildDir 'CMakeCache.txt'))) {
    cmake -S $repoRoot -B $buildDir -G 'Visual Studio 17 2022' -A x64
  }
}

function Invoke-XLispCMakeBuild {
  Initialize-XLispCMake
  $buildDir = Get-XLispBuildDir
  $config = Get-XLispConfig
  cmake --build $buildDir --config $config --parallel
}

function Invoke-XLispCMakeTest {
  param(
    [Parameter(Mandatory)]
    [string]$Package
  )

  Initialize-XLispCMake
  $buildDir = Get-XLispBuildDir
  $config = Get-XLispConfig
  $packageTarget = 'x_' + ($Package -replace '\.', '_')
  ctest --test-dir $buildDir -C $config -R "^${packageTarget}\." --output-on-failure --timeout 120
}
