---
title: list-concat
---

# Type

```scheme
(polymorphic (A) (-> (list-t (list-t A)) (list-t A)))
```

# Description

Flatten a list of lists by one level. Derived function.

# Examples

```scheme
(list-concat [[1 2] [3 4] [5]])  ;; => [1 2 3 4 5]
```
