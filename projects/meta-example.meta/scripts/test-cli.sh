#!/usr/bin/env bash

set -e

XVM=../xvm.c/src/xvm.exe
XEXE=build/bundle.xexe
ENTRY=calculator/main
SNAPSHOT=test-cli.sh.out

output() {
  echo "=== hello ==="
  $XVM run $XEXE --entry $ENTRY -- hello

  echo "=== add 1 2 ==="
  $XVM run $XEXE --entry $ENTRY -- add 1 2

  echo "=== mul --x 3 --y 4 ==="
  $XVM run $XEXE --entry $ENTRY -- mul --x 3 --y 4

  echo "=== bye ==="
  $XVM run $XEXE --entry $ENTRY -- bye

  echo "=== passthrough -- foo bar baz ==="
  $XVM run $XEXE --entry $ENTRY -- passthrough -- foo bar baz

  echo "=== no command ==="
  $XVM run $XEXE --entry $ENTRY

  echo "=== unknown command ==="
  $XVM run $XEXE --entry $ENTRY -- badcmd
}

if [ "$1" = "--snapshot" ]; then
  output > "$SNAPSHOT"
  echo "[test-cli] snapshot saved to $SNAPSHOT"
else
  output | diff - "$SNAPSHOT"
  echo "[test-cli] ok"
fi
