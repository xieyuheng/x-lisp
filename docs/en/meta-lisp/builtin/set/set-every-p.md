---
title: set-every?
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# Description

Check if all elements satisfy the predicate.

# Examples

```meta-lisp
(set-every? int-non-negative? #{0 1 2})  ;; => true
(set-every? int-non-negative? #{0 -1})   ;; => false
```
