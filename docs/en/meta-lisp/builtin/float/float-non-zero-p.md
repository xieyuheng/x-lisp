---
title: float-non-zero?
---

# Type

```meta-lisp
(-> float-t bool-t)
```

# Description

Check if a float is non-zero.

# Examples

```meta-lisp
(float-non-zero? 1.0)    ;; => true
(float-non-zero? -1.0)   ;; => true
(float-non-zero? 0.0)    ;; => false
```
