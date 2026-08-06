---
title: path-ensure-directory
---

# Type

```meta-lisp
(-> text-t void-t)
```

# Description

Ensure a directory exists. Creates the directory (including parents) if it doesn't exist.

# Examples

```meta-lisp
(path-ensure-directory "/tmp/foo/bar")
```
