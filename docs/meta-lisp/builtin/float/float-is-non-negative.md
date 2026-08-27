---
title: float-is-non-negative
---

# Type

```meta-lisp
(-> float-t bool-t)
```

# Description

Check if a float is non-negative (greater than or equal to 0.0).

# Examples

```meta-lisp
(float-is-non-negative 0.0)    ;; => true
(float-is-non-negative 1.0)    ;; => true
(float-is-non-negative -1.0)   ;; => false
```
