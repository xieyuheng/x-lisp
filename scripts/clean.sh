#!/usr/bin/env bash

set -e

make --directory projects/helpers.c clean
make --directory projects/cmd.c clean
make --directory projects/li.c clean

pnpm run -r clean
