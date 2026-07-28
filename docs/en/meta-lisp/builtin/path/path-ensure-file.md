---
title: path-ensure-file
---

# Type

```meta-lisp
(-> string-t void-t)
```

# Description

Ensure a file exists. Creates an empty file if it doesn't exist.

# Examples

```meta-lisp
(path-ensure-file "/tmp/foo.txt")
```
