---
title: set-some
---

# Type

```meta-lisp
(polymorphic (A) (-> (-> A bool-t) (set-t A) bool-t))
```

# Description

Check if some element satisfies the predicate.

# Examples

```meta-lisp
(set-some int-is-non-negative (@set -1 0 1))  ;; => true
(set-some int-is-non-negative (@set -1 -2))   ;; => false
```
