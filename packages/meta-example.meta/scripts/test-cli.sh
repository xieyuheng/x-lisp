#!/usr/bin/env bash

set -e

xvm=../xvm2.c/src/xvm.exe
xvm_exe=build/bundle.xvm2.exe

echo "=== hello ==="
$xvm run $xvm_exe -- hello

echo "=== add 1 2 ==="
$xvm run $xvm_exe -- add 1 2

echo "=== mul --x 3 --y 4 ==="
$xvm run $xvm_exe -- mul --x 3 --y 4

echo "=== bye ==="
$xvm run $xvm_exe -- bye

echo "=== passthrough -- foo bar baz ==="
$xvm run $xvm_exe -- passthrough -- foo bar baz

echo "=== no command ==="
$xvm run $xvm_exe

echo "=== unknown command ==="
$xvm run $xvm_exe -- badcmd
