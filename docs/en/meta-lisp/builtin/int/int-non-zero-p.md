---
title: int-non-zero?
---

# Type

```meta-lisp
(-> int-t bool-t)
```

# Description

Check if an integer is non-zero.

# Examples

```meta-lisp
(int-non-zero? 1)   ;; => true
(int-non-zero? -1)  ;; => true
(int-non-zero? 0)   ;; => false
```
