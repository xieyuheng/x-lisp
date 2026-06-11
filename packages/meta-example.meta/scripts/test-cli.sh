#!/usr/bin/env bash

set -e

meta=../meta-runtime.c/src/meta.exe
xexe=build/bundle.xvm.exe
entry=self/calculator/main

echo "=== hello ==="
$meta run-xvm $xexe --entry $entry -- hello

echo "=== add 1 2 ==="
$meta run-xvm $xexe --entry $entry -- add 1 2

echo "=== mul --x 3 --y 4 ==="
$meta run-xvm $xexe --entry $entry -- mul --x 3 --y 4

echo "=== bye ==="
$meta run-xvm $xexe --entry $entry -- bye

echo "=== passthrough -- foo bar baz ==="
$meta run-xvm $xexe --entry $entry -- passthrough -- foo bar baz

echo "=== no command ==="
$meta run-xvm $xexe --entry $entry

echo "=== unknown command ==="
$meta run-xvm $xexe --entry $entry -- badcmd
