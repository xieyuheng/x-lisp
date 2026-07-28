---
title: int-is-positive
---

# Type

```meta-lisp
(-> int-t bool-t)
```

# Description

Check if an integer is positive (greater than 0).

# Examples

```meta-lisp
(int-is-positive 1)   ;; => true
(int-is-positive 0)   ;; => false
(int-is-positive -1)  ;; => false
```
