---
title: float-non-negative?
---

# Type

```meta-lisp
(-> float-t bool-t)
```

# Description

Check if a float is non-negative (greater than or equal to 0.0).

# Examples

```meta-lisp
(float-non-negative? 0.0)    ;; => true
(float-non-negative? 1.0)    ;; => true
(float-non-negative? -1.0)   ;; => false
```
