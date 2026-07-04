---
title: path-absolute?
---

# Type

```scheme
(-> string-t bool-t)
```

# Description

Check if a path is absolute.

# Examples

```scheme
(path-absolute? "/tmp/foo")  ;; => true
(path-absolute? "foo/bar")   ;; => false
```
