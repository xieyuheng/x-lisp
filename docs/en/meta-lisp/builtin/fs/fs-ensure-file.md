---
title: fs-ensure-file
---

# Type

```scheme
(-> string-t void-t)
```

# Description

Ensure a file exists. Creates an empty file if it doesn't exist.

# Examples

```scheme
(fs-ensure-file "/tmp/foo.txt")
```
