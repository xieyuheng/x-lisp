---
title: list-range
---

# Type

```scheme
(-> int-t (list-t int-t))
```

# Description

Generate a list of integers from 0 to n - 1.

# Examples

```scheme
(list-range 0)  ;; => []
(list-range 3)  ;; => [0 1 2]
(list-range 5)  ;; => [0 1 2 3 4]
```
