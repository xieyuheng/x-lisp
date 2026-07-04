---
title: int-sum
---

# Type

```scheme
(-> (list-t int-t) int-t)
```

# Description

Sum of a list of integers. The sum of an empty list is 0.

# Examples

```scheme
(int-sum [1 2 3])   ;; => 6
(int-sum [])        ;; => 0
(int-sum [-1 0 1])  ;; => 0
```
