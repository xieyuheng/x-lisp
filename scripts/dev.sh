#!/usr/bin/env bash

set -e

make --directory projects/helpers.c dev -j
make --directory projects/cmd.c dev -j
make --directory projects/x-forth.c dev -j
