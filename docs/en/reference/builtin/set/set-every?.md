---
title: set-every?
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# Description

Check if all elements satisfy the predicate. Derived function.

# Examples

```scheme
(set-every? int-non-negative? #{0 1 2})  ;; => true
(set-every? int-non-negative? #{0 -1})   ;; => false
```
