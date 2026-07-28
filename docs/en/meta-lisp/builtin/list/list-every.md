---
title: list-every
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# Description

Check if all elements satisfy the predicate. Returns `true` for an empty list.

# Examples

```meta-lisp
(list-every int-is-non-negative [0 1 2 3])  ;; => true
(list-every int-is-non-negative [0 1 -1])   ;; => false
```
