#!/usr/bin/env bash

set -e

xvm=../xvm.c/src/xvm.exe
xvm_exe=build/bundle.xvm.exe
entry=self/计算器/主

echo "=== hello ==="
$xvm run $xvm_exe --entry $entry -- hello

echo "=== add 1 2 ==="
$xvm run $xvm_exe --entry $entry -- add 1 2

echo "=== mul --x 3 --y 4 ==="
$xvm run $xvm_exe --entry $entry -- mul --x 3 --y 4

echo "=== bye ==="
$xvm run $xvm_exe --entry $entry -- bye

echo "=== passthrough -- foo bar baz ==="
$xvm run $xvm_exe --entry $entry -- passthrough -- foo bar baz

echo "=== no command ==="
$xvm run $xvm_exe --entry $entry

echo "=== unknown command ==="
$xvm run $xvm_exe --entry $entry -- badcmd
