#!/usr/bin/env bash

set -e

xvm=../xvm.c/src/xvm.exe
xexe=build/bundle.xvm.exe
entry=self/calculator/main

echo "=== hello ==="
$xvm run-xvm $xexe --entry $entry -- hello

echo "=== add 1 2 ==="
$xvm run-xvm $xexe --entry $entry -- add 1 2

echo "=== mul --x 3 --y 4 ==="
$xvm run-xvm $xexe --entry $entry -- mul --x 3 --y 4

echo "=== bye ==="
$xvm run-xvm $xexe --entry $entry -- bye

echo "=== passthrough -- foo bar baz ==="
$xvm run-xvm $xexe --entry $entry -- passthrough -- foo bar baz

echo "=== no command ==="
$xvm run-xvm $xexe --entry $entry

echo "=== unknown command ==="
$xvm run-xvm $xexe --entry $entry -- badcmd
