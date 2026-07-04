---
title: path-relative?
---

# Type

```meta-lisp
(-> string-t bool-t)
```

# Description

Check if a path is relative.

# Examples

```meta-lisp
(path-relative? "/tmp/foo")  ;; => false
(path-relative? "foo/bar")   ;; => true
```
