---
title: list-some
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (list-t A) bool-t))
```

# Description

Check if some element satisfies the predicate. Returns `false` for an empty list.

# Examples

```meta-lisp
(list-some int-is-non-negative [-1 0 1])  ;; => true
(list-some int-is-non-negative [-1 -2])   ;; => false
```
