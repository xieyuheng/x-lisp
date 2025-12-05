#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test
make --directory projects/runtime.c test
make --directory projects/x-forth.c test
