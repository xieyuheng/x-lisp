#!/usr/bin/env bash

set -e

make --directory projects/helpers.c dev
make --directory projects/cmd.c dev
make --directory projects/x-forth.c dev
make --directory projects/basic-lisp.c dev
