#!/usr/bin/env bash

echo "[check] started at $(date '+%Y-%m-%d %H:%M')"
if ./scripts/check.sh; then
    echo "[check] passed"
else
    echo "[check] failed"
fi
