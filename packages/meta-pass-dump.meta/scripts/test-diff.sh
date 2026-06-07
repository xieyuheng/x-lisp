#!/usr/bin/env bash

set -e

result=0
for f in $(find expected/dump -name '*.dump'); do
  counterpart="self-expected/dump/${f#expected/dump/}"
  if [ -f "$counterpart" ]; then
    git --no-pager diff --no-index "$f" "$counterpart" || result=1
  fi
done
exit $result
