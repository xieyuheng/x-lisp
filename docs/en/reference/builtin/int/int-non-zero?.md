---
title: int-non-zero?
---

# Type

```scheme
(-> int-t bool-t)
```

# Description

Check if an integer is non-zero.

# Examples

```scheme
(int-non-zero? 1)   ;; => true
(int-non-zero? -1)  ;; => true
(int-non-zero? 0)   ;; => false
```
