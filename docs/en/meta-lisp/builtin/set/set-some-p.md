---
title: set-some?
---

# Type

```scheme
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# Description

Check if some element satisfies the predicate.

# Examples

```scheme
(set-some? int-non-negative? #{-1 0 1})  ;; => true
(set-some? int-non-negative? #{-1 -2})   ;; => false
```
