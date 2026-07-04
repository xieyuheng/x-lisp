---
title: path-normalize
---

# Type

```meta-lisp
(-> string-t string-t)
```

# Description

Normalize a path (resolve `..` and `.` etc.).

# Examples

```meta-lisp
(path-normalize "/tmp/foo/../bar")  ;; => "/tmp/bar"
```
