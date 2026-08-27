---
title: float-is-non-zero
---

# Type

```meta-lisp
(-> float-t bool-t)
```

# Description

Check if a float is non-zero.

# Examples

```meta-lisp
(float-is-non-zero 1.0)    ;; => true
(float-is-non-zero -1.0)   ;; => true
(float-is-non-zero 0.0)    ;; => false
```
