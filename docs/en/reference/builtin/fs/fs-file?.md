---
title: fs-file?
---

# Type

```scheme
(-> string-t bool-t)
```

# Description

Check if a path is a file.

# Examples

```scheme
(fs-file? "/tmp/foo.txt")  ;; => true or false
```
