#!/usr/bin/env bash

set -e

find src -type f | entr -c ./scripts/check-with-date.sh
