---
title: set-every
---

# Type

```meta-lisp
(all (A) (-> (set-t A) (-> A bool-t) bool-t))
```

# Description

Check if all elements satisfy the predicate.

# Examples

```meta-lisp
(set-every (@set 0 1 2) int-is-non-negative)  ;; => true
(set-every (@set 0 -1) int-is-non-negative)   ;; => false
```
