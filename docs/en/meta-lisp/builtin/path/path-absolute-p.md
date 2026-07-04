---
title: path-absolute?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a path is absolute.

# Examples

```meta-lisp
(path-absolute? "/tmp/foo")  ;; => true
(path-absolute? "foo/bar")   ;; => false
```
