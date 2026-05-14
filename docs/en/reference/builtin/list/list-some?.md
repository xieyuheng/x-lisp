---
title: list-some?
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# Description

Check if some element satisfies the predicate. Returns `false` for an empty list. Derived function.

# Examples

```scheme
(list-some? int-non-negative? [-1 0 1])  ;; => true
(list-some? int-non-negative? [-1 -2])   ;; => false
```
