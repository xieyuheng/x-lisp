---
title: list-select
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# Description

Filter elements that satisfy the predicate. Derived function.

# Examples

```scheme
(list-select int? ['a 1 'b 2])       ;; => [1 2]
(list-select int-non-negative? [0 1 -1 2])  ;; => [0 1 2]
```
