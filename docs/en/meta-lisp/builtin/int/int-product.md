---
title: int-product
---

# Type

```meta-lisp
(-> (list-t int-t) int-t)
```

# Description

Product of a list of integers. The product of an empty list is 1.

# Examples

```meta-lisp
(int-product [1 2 3])    ;; => 6
(int-product [])         ;; => 1
(int-product [2 0 3])    ;; => 0
```
