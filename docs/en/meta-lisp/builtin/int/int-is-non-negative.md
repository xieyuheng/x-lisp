---
title: int-is-non-negative
---

# Type

```meta-lisp
(-> int-t bool-t)
```

# Description

Check if an integer is non-negative (greater than or equal to 0).

# Examples

```meta-lisp
(int-is-non-negative 0)   ;; => true
(int-is-non-negative 1)   ;; => true
(int-is-non-negative -1)  ;; => false
```
