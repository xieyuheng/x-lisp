---
title: int-positive?
---

# Type

```scheme
(-> int-t bool-t)
```

# Description

Check if an integer is positive (greater than 0).

# Examples

```scheme
(int-positive? 1)   ;; => true
(int-positive? 0)   ;; => false
(int-positive? -1)  ;; => false
```
