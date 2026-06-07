#!/usr/bin/env bash

set -e

./scripts/build.sh
./scripts/self-build.sh

result=0
for f in $(find expected/dump -name '*.dump'); do
  counterpart="self-expected/dump/${f#expected/dump/}"
  if [ -f "$counterpart" ]; then
    git diff --no-index "$f" "$counterpart" || result=1
  fi
done
exit $result
