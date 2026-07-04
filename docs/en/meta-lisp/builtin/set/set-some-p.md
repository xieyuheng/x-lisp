---
title: set-some?
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# Description

Check if some element satisfies the predicate.

# Examples

```meta-lisp
(set-some? int-non-negative? #{-1 0 1})  ;; => true
(set-some? int-non-negative? #{-1 -2})   ;; => false
```
