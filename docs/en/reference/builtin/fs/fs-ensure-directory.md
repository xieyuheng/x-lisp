---
title: fs-ensure-directory
---

# Type

```scheme
(-> string-t void-t)
```

# Description

Ensure a directory exists. Creates the directory (including parents) if it doesn't exist.

# Examples

```scheme
(fs-ensure-directory "/tmp/foo/bar")
```
