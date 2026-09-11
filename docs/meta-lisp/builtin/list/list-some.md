---
title: list-some
---

# Type

```meta-lisp
(all (A) (-> (list-t A) (-> A bool-t) bool-t))
```

# Description

Check if some element satisfies the predicate. Returns `false` for an empty list.

# Examples

```meta-lisp
(list-some (@list -1 0 1) int-is-non-negative)  ;; => true
(list-some (@list -1 -2) int-is-non-negative)   ;; => false
```
