---
title: list-every?
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# Description

Check if all elements satisfy the predicate. Returns `true` for an empty list. Derived function.

# Examples

```scheme
(list-every? int-non-negative? [0 1 2 3])  ;; => true
(list-every? int-non-negative? [0 1 -1])   ;; => false
```
