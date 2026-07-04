---
title: int-non-negative?
---

# Type

```meta-lisp
(-> int-t bool-t)
```

# Description

Check if an integer is non-negative (greater than or equal to 0).

# Examples

```meta-lisp
(int-non-negative? 0)   ;; => true
(int-non-negative? 1)   ;; => true
(int-non-negative? -1)  ;; => false
```
