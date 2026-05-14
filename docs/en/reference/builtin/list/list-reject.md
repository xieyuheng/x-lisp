---
title: list-reject
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) (list-t A)))
```

# Description

Remove elements that satisfy the predicate. Derived function.

# Examples

```scheme
(list-reject int? ['a 1 'b 2])       ;; => ['a 'b]
(list-reject int-non-negative? [0 1 -1 2])  ;; => [-1]
```
