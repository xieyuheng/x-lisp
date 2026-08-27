---
title: path-is-absolute
---

# Type

```meta-lisp
(-> text-t bool-t)
```

# Description

Check if a path is absolute.

# Examples

```meta-lisp
(path-is-absolute "/tmp/foo")  ;; => true
(path-is-absolute "foo/bar")   ;; => false
```
