---
title: path-relative?
---

# Type

```scheme
(-> string-t bool-t)
```

# Description

Check if a path is relative.

# Examples

```scheme
(path-relative? "/tmp/foo")  ;; => false
(path-relative? "foo/bar")   ;; => true
```
