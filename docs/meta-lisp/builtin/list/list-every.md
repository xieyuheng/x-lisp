---
title: list-every
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (-> A bool-t) bool-t))
```

# Description

Check if all elements satisfy the predicate. Returns `true` for an empty list.

# Examples

```meta-lisp
(list-every (@list 0 1 2 3) int-is-non-negative)  ;; => true
(list-every (@list 0 1 -1) int-is-non-negative)   ;; => false
```
