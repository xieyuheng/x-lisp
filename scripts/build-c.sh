#!/usr/bin/env bash

set -e

make --directory projects/helpers.c -j
make --directory projects/runtime.c -j
