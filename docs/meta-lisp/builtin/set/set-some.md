---
title: set-some
---

# Type

```meta-lisp
(all (A) (-> (set-t A) (-> A bool-t) bool-t))
```

# Description

Check if some element satisfies the predicate.

# Examples

```meta-lisp
(set-some (@set -1 0 1) int-is-non-negative)  ;; => true
(set-some (@set -1 -2) int-is-non-negative)   ;; => false
```
