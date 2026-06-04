---
title: float-sum
---

# Type

```scheme
(-> (list-t float-t) float-t)
```

# Description

Sum of a list of floats. The sum of an empty list is 0.0.

# Examples

```scheme
(float-sum [1.0 2.0 3.0])  ;; => 6.0
(float-sum [])             ;; => 0.0
(float-sum [-1.0 0.0 1.0]) ;; => 0.0
```
