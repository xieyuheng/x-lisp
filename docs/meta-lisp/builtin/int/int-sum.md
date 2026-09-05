---
title: int-sum
---

# Type

```meta-lisp
(-> (list-t int-t) int-t)
```

# Description

Sum of a list of integers. The sum of an empty list is 0.

# Examples

```meta-lisp
(int-sum (@list 1 2 3))   ;; => 6
(int-sum (@list))        ;; => 0
(int-sum (@list -1 0 1))  ;; => 0
```
