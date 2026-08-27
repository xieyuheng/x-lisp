---
title: path-normalize
---

# Type

```meta-lisp
(-> text-t text-t)
```

# Description

Normalize a path (resolve `..` and `.` etc.).

# Examples

```meta-lisp
(path-normalize "/tmp/foo/../bar")  ;; => "/tmp/bar"
```
