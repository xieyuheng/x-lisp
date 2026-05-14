---
title: int-product
---

# Type

```scheme
(-> (list-t int-t) int-t)
```

# Description

Product of a list of integers. The product of an empty list is 1. Derived function.

# Examples

```scheme
(int-product [1 2 3])    ;; => 6
(int-product [])         ;; => 1
(int-product [2 0 3])    ;; => 0
```
