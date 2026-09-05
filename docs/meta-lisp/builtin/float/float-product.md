---
title: float-product
---

# Type

```meta-lisp
(-> (list-t float-t) float-t)
```

# Description

Product of a list of floats. The product of an empty list is 1.0.

# Examples

```meta-lisp
(float-product (@list 1.0 2.0 3.0))  ;; => 6.0
(float-product (@list))             ;; => 1.0
(float-product (@list 2.0 0.0 3.0)) ;; => 0.0
```
