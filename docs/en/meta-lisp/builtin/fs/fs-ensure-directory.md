---
title: fs-ensure-directory
---

# Type

```meta-lisp
(-> string-t void-t)
```

# Description

Ensure a directory exists. Creates the directory (including parents) if it doesn't exist.

# Examples

```meta-lisp
(fs-ensure-directory "/tmp/foo/bar")
```
