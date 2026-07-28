---
title: path-is-relative
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a path is relative.

# Examples

```meta-lisp
(path-is-relative "/tmp/foo")  ;; => false
(path-is-relative "foo/bar")   ;; => true
```
