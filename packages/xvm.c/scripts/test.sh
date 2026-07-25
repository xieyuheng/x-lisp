#!/usr/bin/env bash

set -e

make test

./scripts/test-xvm.sh
