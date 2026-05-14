---
title: list-map-zip
---

# Type

```scheme
(polymorphic (A B C) (-> (-> A B C) (list-t A) (list-t B) (list-t C)))
```

# Description

Combine two lists element-wise using a function. Derived function.

# Examples

```scheme
(list-map-zip iadd [1 2 3] [10 20 30])  ;; => [11 22 33]
```
