---
title: path-normalize
---

# Type

```scheme
(-> string-t string-t)
```

# Description

Normalize a path (resolve `..` and `.` etc.).

# Examples

```scheme
(path-normalize "/tmp/foo/../bar")  ;; => "/tmp/bar"
```
