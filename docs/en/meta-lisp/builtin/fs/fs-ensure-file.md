---
title: fs-ensure-file
---

# Type

```meta-lisp
(-> string-t void-t)
```

# Description

Ensure a file exists. Creates an empty file if it doesn't exist.

# Examples

```meta-lisp
(fs-ensure-file "/tmp/foo.txt")
```
